import type { Exercise } from "./exerciseCatalog";
import { getTestPlan, type ProgramCase } from "./testPlans";

type TerminalLine = {
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

let sdkPromise: Promise<WasmerSdk> | undefined;
let clangPromise: Promise<unknown> | undefined;

function line(stream: TerminalLine["stream"], text: string): TerminalLine {
  return { stream, text };
}

async function getSdk(onLine: (entry: TerminalLine) => void): Promise<WasmerSdk> {
  if (!sdkPromise) {
    sdkPromise = (async () => {
      onLine(line("system", "Wasmer SDK yukleniyor..."));
      const [sdk, wasmModule] = await Promise.all([
        import("@wasmer/sdk"),
        import("@wasmer/sdk/wasm?url"),
      ]);
      await sdk.init({ module: wasmModule.default });
      return sdk;
    })();
  }
  return sdkPromise;
}

async function getClang(sdk: WasmerSdk, onLine: (entry: TerminalLine) => void) {
  if (!clangPromise) {
    clangPromise = (async () => {
      onLine(line("system", "clang/clang paketi hazirlaniyor; ilk kullanimda indirme uzun surebilir."));
      return sdk.Wasmer.fromRegistry("clang/clang");
    })();
  }
  return clangPromise as Promise<Awaited<ReturnType<typeof sdk.Wasmer.fromRegistry>>>;
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
  sdk: WasmerSdk,
  clang: Awaited<ReturnType<typeof sdk.Wasmer.fromRegistry>>,
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
  return waitWithTimeout(instance.wait(), 60_000, "Derleme");
}

async function execute(
  sdk: WasmerSdk,
  project: InstanceType<WasmerSdk["Directory"]>,
  outputFile: string,
  testCase: ProgramCase,
) {
  const wasm = await project.readFile(outputFile);
  const app = await sdk.Wasmer.fromFile(wasm);
  const entrypoint = app.entrypoint;
  if (!entrypoint) throw new Error("Derlenen wasm calistirilabilir entrypoint icermiyor.");
  const instance = await entrypoint.run({
    args: testCase.args ?? [],
    stdin: testCase.stdin,
  });
  return waitWithTimeout(instance.wait(), 20_000, testCase.name);
}

function recordOutput(terminal: TerminalLine[], prefix: string, stdout: string, stderr: string) {
  if (stdout) terminal.push(line("stdout", `${prefix} stdout:\n${stdout}`));
  if (stderr) terminal.push(line("stderr", `${prefix} stderr:\n${stderr}`));
}

export async function runExercise(exercise: Exercise, code: string): Promise<RunResult> {
  const terminal: TerminalLine[] = [];
  const onLine = (entry: TerminalLine) => terminal.push(entry);
  const sdk = await getSdk(onLine);
  const clang = await getClang(sdk, onLine);
  const project = new sdk.Directory();
  const plan = getTestPlan(exercise);

  await project.writeFile("student.c", code);
  for (const [path, content] of Object.entries(plan.supportFiles ?? {})) {
    await project.writeFile(path, content);
  }

  const inputFile = plan.mode === "function" ? "test_runner.c" : "student.c";
  if (plan.harness) await project.writeFile("test_runner.c", plan.harness);

  terminal.push(line("system", `cc -Wall -Wextra -Werror ${inputFile} -o exercise.wasm`));
  const compileOutput = await compile(sdk, clang, project, inputFile, "exercise.wasm");
  recordOutput(terminal, "compile", compileOutput.stdout, compileOutput.stderr);

  if (!compileOutput.ok) {
    terminal.push(line("error", `Derleme basarisiz. Exit code: ${compileOutput.code}`));
    return {
      ok: false,
      compileStdout: compileOutput.stdout,
      compileStderr: compileOutput.stderr,
      outcomes: [],
      terminal,
      mode: plan.mode,
    };
  }

  terminal.push(line("ok", "Derleme basarili."));
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

  const outcomes: TestOutcome[] = [];
  for (const testCase of cases) {
    terminal.push(line("system", `./exercise ${testCase.args?.map((arg) => JSON.stringify(arg)).join(" ") ?? ""}`.trim()));
    try {
      const output = await execute(sdk, project, "exercise.wasm", testCase);
      recordOutput(terminal, testCase.name, output.stdout, output.stderr);
      const passed = output.ok && output.stdout === testCase.expectedStdout;
      outcomes.push({
        name: testCase.name,
        passed,
        expected: testCase.expectedStdout,
        stdout: output.stdout,
        stderr: output.stderr,
        exitCode: output.code,
      });
      terminal.push(line(passed ? "ok" : "error", passed ? `${testCase.name}: OK` : `${testCase.name}: KO`));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      outcomes.push({
        name: testCase.name,
        passed: false,
        expected: testCase.expectedStdout,
        stdout: "",
        stderr: message,
        exitCode: -1,
      });
      terminal.push(line("error", `${testCase.name}: ${message}`));
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
