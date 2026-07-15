import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Exercise } from "../src/exerciseCatalog.js";
import { exercises } from "../src/exerciseCatalog.js";
import type { RunResult, TerminalLine, TestOutcome } from "../src/runTypes.js";
import { getTestPlan, type ProgramCase } from "../src/testPlans.js";

type RequestLike = {
  method?: string;
  body?: unknown;
  on?: (event: "data" | "end" | "error", callback: (chunk?: Buffer | Error) => void) => void;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type CommandOutput = {
  ok: boolean;
  code: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
};

const COMPILE_TIMEOUT_MS = 90_000;
const EXECUTE_TIMEOUT_MS = 5_000;
const MAX_CODE_BYTES = 200_000;
const MAX_OUTPUT_CHARS = 32_000;
const SANDBOX_TIMEOUT_MS = 120_000;
const SANDBOX_BASE_NAME = "42-exam-c-compiler-v1";
const SANDBOX_BASE_SNAPSHOT_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

function line(stream: TerminalLine["stream"], text: string): TerminalLine {
  return { stream, text };
}

function trimOutput(output: string): string {
  if (output.length <= MAX_OUTPUT_CHARS) return output;
  return `${output.slice(0, MAX_OUTPUT_CHARS)}\n...[output kisaltildi]`;
}

function recordOutput(emit: (entry: TerminalLine) => void, prefix: string, stdout: string, stderr: string) {
  if (stdout) emit(line("stdout", `${prefix} stdout:\n${trimOutput(stdout)}`));
  if (stderr) emit(line("stderr", `${prefix} stderr:\n${trimOutput(stderr)}`));
}

function runnerFailureResult(
  exercise: Exercise,
  message: string,
  runner: NonNullable<RunResult["runner"]>,
): RunResult {
  const plan = getTestPlan(exercise);
  return {
    ok: false,
    compileStdout: "",
    compileStderr: message,
    outcomes: [],
    terminal: [
      line("error", "Backend runner calisamadi."),
      line("stderr", message),
      line(
        "system",
        runner === "backend-sandbox"
          ? "Vercel Sandbox/OIDC veya compiler image ayarini kontrol et. Bu hata HTTP 500 yerine terminal gecmisine kaydedildi."
          : "Native backend runner calisamadi. Local ortamda cc/gcc kurulumunu kontrol et.",
      ),
    ],
    mode: plan.mode,
    runner,
  };
}

async function parseJsonBody(req: RequestLike): Promise<unknown> {
  if (req.body !== undefined) {
    return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  }

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on?.("data", (chunk) => {
      if (Buffer.isBuffer(chunk)) chunks.push(chunk);
    });
    req.on?.("end", () => resolve());
    req.on?.("error", (error) => reject(error));
  });
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function getRequestedExercise(body: unknown): { exercise: Exercise; code: string } {
  const payload = body as { exerciseId?: unknown; code?: unknown };
  if (typeof payload.exerciseId !== "string") throw new Error("exerciseId zorunlu.");
  if (typeof payload.code !== "string") throw new Error("code zorunlu.");
  if (Buffer.byteLength(payload.code, "utf8") > MAX_CODE_BYTES) throw new Error("Kod boyutu cok buyuk.");

  const exercise = exercises.find((item) => item.id === payload.exerciseId);
  if (!exercise) throw new Error("Egzersiz bulunamadi.");
  return { exercise, code: payload.code };
}

function runLocalCommand(
  cmd: string,
  args: string[],
  options: { cwd: string; timeoutMs: number; stdin?: string },
): Promise<CommandOutput> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: options.cwd, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, options.timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout = trimOutput(stdout + chunk.toString("utf8"));
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr = trimOutput(stderr + chunk.toString("utf8"));
    });
    child.on("error", (error) => {
      stderr = trimOutput(`${stderr}${error.message}`);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        ok: !timedOut && code === 0,
        code: timedOut ? -1 : code ?? -1,
        stdout,
        stderr,
        timedOut,
      });
    });

    if (options.stdin) child.stdin.end(options.stdin);
    else child.stdin.end();
  });
}

async function writeProjectFilesLocal(dir: string, exercise: Exercise, code: string) {
  const plan = getTestPlan(exercise);
  await writeFile(join(dir, "student.c"), code);
  await Promise.all(
    Object.entries(plan.supportFiles ?? {}).map(([path, content]) => writeFile(join(dir, path), content)),
  );
  if (plan.harness) await writeFile(join(dir, "test_runner.c"), plan.harness);
  return plan;
}

async function runLocalExercise(exercise: Exercise, code: string): Promise<RunResult> {
  const terminal: TerminalLine[] = [];
  const emit = (entry: TerminalLine) => terminal.push(entry);
  const dir = await mkdtemp(join(tmpdir(), "42-exam-"));

  try {
    const plan = await writeProjectFilesLocal(dir, exercise, code);
    const inputFile = plan.mode === "function" ? "test_runner.c" : "student.c";
    emit(line("system", `native cc -Wall -Wextra -Werror ${inputFile} -o exercise`));
    const compileOutput = await runLocalCommand("cc", ["-Wall", "-Wextra", "-Werror", inputFile, "-o", "exercise"], {
      cwd: dir,
      timeoutMs: COMPILE_TIMEOUT_MS,
    });
    recordOutput(emit, "compile", compileOutput.stdout, compileOutput.stderr);

    if (!compileOutput.ok) {
      emit(line("error", compileOutput.timedOut ? "Derleme zaman asimina ugradi." : `Derleme basarisiz. Exit code: ${compileOutput.code}`));
      return { ok: false, compileStdout: compileOutput.stdout, compileStderr: compileOutput.stderr, outcomes: [], terminal, mode: plan.mode, runner: "backend-native" };
    }

    emit(line("ok", "Derleme basarili."));
    if (plan.mode === "compile-only") {
      return { ok: true, compileStdout: compileOutput.stdout, compileStderr: compileOutput.stderr, outcomes: [], terminal, mode: plan.mode, runner: "backend-native" };
    }

    const cases = plan.mode === "function"
      ? [{ name: "fonksiyon test harness", expectedStdout: plan.expectedStdout ?? "" }]
      : plan.cases ?? [];
    const outcomes = await runProgramCasesLocal(cases, dir, emit);
    return {
      ok: outcomes.length > 0 ? outcomes.every((outcome) => outcome.passed) : compileOutput.ok,
      compileStdout: compileOutput.stdout,
      compileStderr: compileOutput.stderr,
      outcomes,
      terminal,
      mode: plan.mode,
      runner: "backend-native",
    };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function runProgramCasesLocal(
  cases: ProgramCase[],
  cwd: string,
  emit: (entry: TerminalLine) => void,
): Promise<TestOutcome[]> {
  const outcomes: TestOutcome[] = [];
  for (const testCase of cases) {
    emit(line("system", `./exercise ${testCase.args?.map((arg) => JSON.stringify(arg)).join(" ") ?? ""}`.trim()));
    const output = await runLocalCommand("./exercise", testCase.args ?? [], {
      cwd,
      timeoutMs: EXECUTE_TIMEOUT_MS,
      stdin: testCase.stdin,
    });
    recordOutput(emit, testCase.name, output.stdout, output.stderr);
    const passed = output.ok && output.stdout === testCase.expectedStdout;
    outcomes.push({
      name: testCase.name,
      passed,
      expected: testCase.expectedStdout,
      stdout: output.stdout,
      stderr: output.timedOut ? `Program testi "${testCase.name}" zaman asimina ugradi (${EXECUTE_TIMEOUT_MS / 1000}s).` : output.stderr,
      exitCode: output.code,
    });
    emit(line(passed ? "ok" : "error", passed ? `${testCase.name}: OK` : `${testCase.name}: KO`));
    if (output.timedOut) break;
  }
  return outcomes;
}

async function runSandboxExercise(exercise: Exercise, code: string): Promise<RunResult> {
  const { Sandbox } = await import("@vercel/sandbox");
  const terminal: TerminalLine[] = [];
  const emit = (entry: TerminalLine) => terminal.push(entry);
  const sandbox = await createSandboxForRun(Sandbox, emit);

  try {
    const plan = getTestPlan(exercise);
    const workdir = `/vercel/sandbox/42-exam-${randomUUID()}`;
    await sandbox.fs.mkdir(workdir, { recursive: true });
    await sandbox.fs.writeFile(`${workdir}/student.c`, code);
    await Promise.all(
      Object.entries(plan.supportFiles ?? {}).map(([path, content]) => sandbox.fs.writeFile(`${workdir}/${path}`, content)),
    );
    if (plan.harness) await sandbox.fs.writeFile(`${workdir}/test_runner.c`, plan.harness);

    await ensureSandboxCompiler(sandbox, emit);
    await sandbox.updateNetworkPolicy("deny-all");

    const inputFile = plan.mode === "function" ? "test_runner.c" : "student.c";
    emit(line("system", `sandbox cc -Wall -Wextra -Werror ${inputFile} -o exercise`));
    const compileOutput = await sandbox.runCommand({
      cmd: "cc",
      args: ["-Wall", "-Wextra", "-Werror", inputFile, "-o", "exercise"],
      cwd: workdir,
      timeoutMs: COMPILE_TIMEOUT_MS,
    });
    const compileStdout = await compileOutput.stdout();
    const compileStderr = await compileOutput.stderr();
    recordOutput(emit, "compile", compileStdout, compileStderr);

    if (compileOutput.exitCode !== 0) {
      emit(line("error", `Derleme basarisiz. Exit code: ${compileOutput.exitCode}`));
      return { ok: false, compileStdout, compileStderr, outcomes: [], terminal, mode: plan.mode, runner: "backend-sandbox" };
    }

    emit(line("ok", "Derleme basarili."));
    if (plan.mode === "compile-only") {
      return { ok: true, compileStdout, compileStderr, outcomes: [], terminal, mode: plan.mode, runner: "backend-sandbox" };
    }

    const cases = plan.mode === "function"
      ? [{ name: "fonksiyon test harness", expectedStdout: plan.expectedStdout ?? "" }]
      : plan.cases ?? [];
    const outcomes = await runProgramCasesSandbox(sandbox, workdir, cases, emit);
    return {
      ok: outcomes.length > 0 ? outcomes.every((outcome) => outcome.passed) : true,
      compileStdout,
      compileStderr,
      outcomes,
      terminal,
      mode: plan.mode,
      runner: "backend-sandbox",
    };
  } finally {
    await sandbox.stop();
  }
}

async function createSandboxForRun(
  Sandbox: typeof import("@vercel/sandbox").Sandbox,
  emit: (entry: TerminalLine) => void,
) {
  const image = process.env.VERCEL_SANDBOX_IMAGE;
  const common = {
    timeout: SANDBOX_TIMEOUT_MS,
    resources: { vcpus: 1 },
  };

  if (image) {
    const sandbox = await Sandbox.create({
      image,
      persistent: false,
      ...common,
    });
    await ensureSandboxCompiler(sandbox, emit);
    return sandbox;
  }

  if (process.env.RUNNER_DISABLE_SANDBOX_BASE === "1") {
    const sandbox = await Sandbox.create({
      runtime: "node24",
      persistent: false,
      ...common,
    });
    await ensureSandboxCompiler(sandbox, emit);
    return sandbox;
  }

  const baseName = process.env.VERCEL_SANDBOX_BASE_NAME || SANDBOX_BASE_NAME;
  emit(line("system", `Sandbox compiler base hazirlaniyor: ${baseName}`));

  const base = await Sandbox.getOrCreate({
    name: baseName,
    runtime: "node24",
    persistent: true,
    snapshotExpiration: SANDBOX_BASE_SNAPSHOT_EXPIRATION_MS,
    keepLastSnapshots: {
      count: 1,
      expiration: SANDBOX_BASE_SNAPSHOT_EXPIRATION_MS,
      deleteEvicted: true,
    },
    ...common,
    onCreate: async (sandbox) => {
      await ensureSandboxCompiler(sandbox, emit);
    },
  });

  await ensureSandboxCompiler(base, emit);
  await base.stop();
  emit(line("system", "Sandbox compiler base snapshot hazir; izole test sandbox'i fork ediliyor."));

  try {
    const sandbox = await Sandbox.fork({
      sourceSandbox: baseName,
      persistent: false,
      ...common,
    });
    await ensureSandboxCompiler(sandbox, emit);
    return sandbox;
  } catch (error) {
    emit(line("stderr", `Sandbox fork basarisiz; temiz sandbox'a geciliyor: ${error instanceof Error ? error.message : String(error)}`));
    const sandbox = await Sandbox.create({
      runtime: "node24",
      persistent: false,
      ...common,
    });
    await ensureSandboxCompiler(sandbox, emit);
    return sandbox;
  }
}

async function ensureSandboxCompiler(
  sandbox: InstanceType<typeof import("@vercel/sandbox").Sandbox>,
  emit: (entry: TerminalLine) => void,
) {
  const check = await sandbox.runCommand("bash", ["-lc", "command -v cc >/dev/null 2>&1"], { timeoutMs: 5_000 });
  if (check.exitCode === 0) return;
  emit(line("system", "Sandbox icinde cc bulunamadi; gcc kuruluyor. Kalici hiz icin VERCEL_SANDBOX_IMAGE ile compiler hazir image kullan."));
  const install = await sandbox.runCommand("bash", ["-lc", "sudo dnf install -y gcc glibc-devel"], { timeoutMs: 120_000 });
  const stderr = await install.stderr();
  if (install.exitCode !== 0) throw new Error(`Sandbox compiler kurulumu basarisiz: ${stderr || install.exitCode}`);
}

async function runProgramCasesSandbox(
  sandbox: InstanceType<typeof import("@vercel/sandbox").Sandbox>,
  cwd: string,
  cases: ProgramCase[],
  emit: (entry: TerminalLine) => void,
): Promise<TestOutcome[]> {
  const outcomes: TestOutcome[] = [];
  for (const testCase of cases) {
    emit(line("system", `./exercise ${testCase.args?.map((arg) => JSON.stringify(arg)).join(" ") ?? ""}`.trim()));
    const output = await sandbox.runCommand({
      cmd: "./exercise",
      args: testCase.args ?? [],
      cwd,
      timeoutMs: EXECUTE_TIMEOUT_MS,
    });
    const stdout = await output.stdout();
    const stderr = await output.stderr();
    recordOutput(emit, testCase.name, stdout, stderr);
    const timedOut = output.exitCode === 137 || stderr.includes("timed out");
    const passed = output.exitCode === 0 && stdout === testCase.expectedStdout;
    outcomes.push({
      name: testCase.name,
      passed,
      expected: testCase.expectedStdout,
      stdout,
      stderr: timedOut ? `Program testi "${testCase.name}" zaman asimina ugradi (${EXECUTE_TIMEOUT_MS / 1000}s).` : stderr,
      exitCode: output.exitCode,
    });
    emit(line(passed ? "ok" : "error", passed ? `${testCase.name}: OK` : `${testCase.name}: KO`));
    if (timedOut) break;
  }
  return outcomes;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).json({});
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST is allowed." });
    return;
  }

  let requested: { exercise: Exercise; code: string };
  try {
    requested = getRequestedExercise(await parseJsonBody(req));
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    return;
  }

  const useSandbox = process.env.VERCEL === "1" && process.env.RUNNER_FORCE_NATIVE !== "1";
  try {
    const result = useSandbox
      ? await runSandboxExercise(requested.exercise, requested.code)
      : await runLocalExercise(requested.exercise, requested.code);
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.stack ?? error.message : String(error);
    console.error("[api/run] runner failed", message);
    res.status(200).json(runnerFailureResult(requested.exercise, message, useSandbox ? "backend-sandbox" : "backend-native"));
  }
}
