import type { Exercise } from "./exerciseCatalog";
import { getTestPlan, type ProgramCase } from "./testPlans";

export type TerminalLine = {
  stream: "system" | "stdout" | "stderr" | "ok" | "error";
  text: string;
};

export type TestOutcome = {
  name: string;
  passed: boolean;
  expected?: string;
  stdout: string;
  stderr: string;
  exitCode: number;
};

export type RunResult = {
  ok: boolean;
  compileStdout: string;
  compileStderr: string;
  outcomes: TestOutcome[];
  terminal: TerminalLine[];
  mode: "program" | "function" | "compile-only";
};

type WasmerSdk = typeof import("@wasmer/sdk");
type WasmerRuntime = InstanceType<WasmerSdk["Runtime"]>;
type SdkBundle = { sdk: WasmerSdk; runtime: WasmerRuntime };
type WasmerApp = Awaited<ReturnType<WasmerSdk["Wasmer"]["fromFile"]>>;
type WasmerCommand = NonNullable<WasmerApp["entrypoint"]>;

const COMPILE_TIMEOUT_MS = 90_000;
const EXECUTE_TIMEOUT_MS = 15_000;

let sdkPromise: Promise<SdkBundle> | undefined;
let clangPromise: Promise<unknown> | undefined;

function line(stream: TerminalLine["stream"], text: string): TerminalLine {
  return { stream, text };
}

// SDK ve runtime yalnizca bir kez baslatilir; ayni runtime (dolayisiyla ayni
// threadpool/cache) hem clang hem de calistirilan programlar arasinda paylasilir.
async function getSdk(onLine: (entry: TerminalLine) => void): Promise<SdkBundle> {
  if (!sdkPromise) {
    sdkPromise = (async () => {
      onLine(line("system", "Wasmer SDK yukleniyor..."));
      const [sdk, wasmModule] = await Promise.all([
        import("@wasmer/sdk"),
        import("@wasmer/sdk/wasm?url"),
      ]);
      await sdk.init({ module: wasmModule.default });
      return { sdk, runtime: new sdk.Runtime() };
    })();
  }
  return sdkPromise;
}

async function getClang(bundle: SdkBundle, onLine: (entry: TerminalLine) => void) {
  if (!clangPromise) {
    clangPromise = (async () => {
      onLine(line("system", "clang/clang paketi hazirlaniyor; ilk kullanimda indirme uzun surebilir."));
      return bundle.sdk.Wasmer.fromRegistry("clang/clang", bundle.runtime);
    })();
  }
  return clangPromise as Promise<Awaited<ReturnType<WasmerSdk["Wasmer"]["fromRegistry"]>>>;
}

/**
 * SDK + clang paketini arka planda onceden yukler. Uygulama acilir acilmaz
 * cagirildiginda, kullanici "Derle & test et"e bastiginda agir indirme/baslatma
 * islemi çoktan tamamlanmis olur.
 */
export function prewarmRunner() {
  const noop = () => {};
  getSdk(noop)
    .then((bundle) => getClang(bundle, noop))
    .catch(() => {
      // Prewarm best-effort; hata olursa gercek calistirmada tekrar denenir.
    });
}

async function waitWithTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer = 0;
  const timeout = new Promise<never>((_, reject) => {
    timer = window.setTimeout(() => reject(new Error(`${label} zaman asimina ugradi (${ms / 1000}s).`)), ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    window.clearTimeout(timer);
  }
}

async function compile(
  clang: Awaited<ReturnType<WasmerSdk["Wasmer"]["fromRegistry"]>>,
  project: InstanceType<WasmerSdk["Directory"]>,
  inputFile: string,
  outputFile: string,
) {
  const entrypoint = clang.entrypoint;
  if (!entrypoint) throw new Error("clang paketi entrypoint icermiyor.");
  const instance = await entrypoint.run({
    args: [
      "-Wall",
      "-Wextra",
      "-Werror",
      "-Wno-unused-command-line-argument",
      `/project/${inputFile}`,
      "-o",
      `/project/${outputFile}`,
    ],
    mount: { "/project": project },
  });
  return waitWithTimeout(instance.wait(), COMPILE_TIMEOUT_MS, "Derleme");
}

// Derlenen wasm bir kez pakete cevrilir (fromFile) ve entrypoint tum testlerde
// yeniden kullanilir. Onceden fromFile her test icin cagriliyordu; bu hem
// dosyayi tekrar tekrar parse ediyor hem de her seferinde yeni bir runtime/
// threadpool aciyordu -- cok testli egzersizlerdeki timeout'larin ana sebebi.
async function runCase(entry: WasmerCommand, testCase: ProgramCase) {
  const instance = await entry.run({
    args: testCase.args ?? [],
    stdin: testCase.stdin,
  });
  return waitWithTimeout(instance.wait(), EXECUTE_TIMEOUT_MS, `Program testi "${testCase.name}"`);
}

function recordOutput(emit: (entry: TerminalLine) => void, prefix: string, stdout: string, stderr: string) {
  if (stdout) emit(line("stdout", `${prefix} stdout:\n${stdout}`));
  if (stderr) emit(line("stderr", `${prefix} stderr:\n${stderr}`));
}

export async function runExercise(
  exercise: Exercise,
  code: string,
  onLine?: (entry: TerminalLine) => void,
): Promise<RunResult> {
  const terminal: TerminalLine[] = [];
  const emit = (entry: TerminalLine) => {
    terminal.push(entry);
    onLine?.(entry);
  };
  const bundle = await getSdk(emit);
  const clang = await getClang(bundle, emit);
  const project = new bundle.sdk.Directory();
  const plan = getTestPlan(exercise);

  await project.writeFile("student.c", code);
  for (const [path, content] of Object.entries(plan.supportFiles ?? {})) {
    await project.writeFile(path, content);
  }

  const inputFile = plan.mode === "function" ? "test_runner.c" : "student.c";
  if (plan.harness) await project.writeFile("test_runner.c", plan.harness);

  emit(line("system", `cc -Wall -Wextra -Werror ${inputFile} -o exercise.wasm`));
  const compileOutput = await compile(clang, project, inputFile, "exercise.wasm");
  recordOutput(emit, "compile", compileOutput.stdout, compileOutput.stderr);

  if (!compileOutput.ok) {
    emit(line("error", `Derleme basarisiz. Exit code: ${compileOutput.code}`));
    return {
      ok: false,
      compileStdout: compileOutput.stdout,
      compileStderr: compileOutput.stderr,
      outcomes: [],
      terminal,
      mode: plan.mode,
    };
  }

  emit(line("ok", "Derleme basarili."));
  if (plan.mode === "compile-only") {
    return {
      ok: true,
      compileStdout: compileOutput.stdout,
      compileStderr: compileOutput.stderr,
      outcomes: [],
      terminal,
      mode: plan.mode,
    };
  }

  const cases = plan.mode === "function"
    ? [{ name: "fonksiyon test harness", expectedStdout: plan.expectedStdout ?? "" }]
    : plan.cases ?? [];

  // Derlenen wasm'i bir kez paket olarak yukle ve entrypoint'i tum testlerde
  // yeniden kullan (paylasilan runtime uzerinde).
  const wasmBytes = await project.readFile("exercise.wasm");
  const app = await bundle.sdk.Wasmer.fromFile(wasmBytes, bundle.runtime);
  const appEntry = app.entrypoint;
  if (!appEntry) throw new Error("Derlenen wasm calistirilabilir entrypoint icermiyor.");

  const outcomes: TestOutcome[] = [];
  for (const testCase of cases) {
    emit(line("system", `./exercise ${testCase.args?.map((arg) => JSON.stringify(arg)).join(" ") ?? ""}`.trim()));
    try {
      const output = await runCase(appEntry, testCase);
      recordOutput(emit, testCase.name, output.stdout, output.stderr);
      const passed = output.ok && output.stdout === testCase.expectedStdout;
      outcomes.push({
        name: testCase.name,
        passed,
        expected: testCase.expectedStdout,
        stdout: output.stdout,
        stderr: output.stderr,
        exitCode: output.code,
      });
      emit(line(passed ? "ok" : "error", passed ? `${testCase.name}: OK` : `${testCase.name}: KO`));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const timedOut = message.includes("zaman asimina ugradi");
      outcomes.push({
        name: testCase.name,
        passed: false,
        expected: testCase.expectedStdout,
        stdout: "",
        stderr: message,
        exitCode: -1,
      });
      emit(line("error", `${testCase.name}: ${message}`));
      if (timedOut) {
        emit(line("system", "Timeout sonrasi kalan case'ler atlandi; ayni Wasmer instance'i guvenli sekilde durdurulamiyor."));
        break;
      }
    }
  }

  const ok = outcomes.length > 0 ? outcomes.every((outcome) => outcome.passed) : compileOutput.ok;
  return {
    ok,
    compileStdout: compileOutput.stdout,
    compileStderr: compileOutput.stderr,
    outcomes,
    terminal,
    mode: plan.mode,
  };
}
