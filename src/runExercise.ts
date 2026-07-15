import type { Exercise } from "./exerciseCatalog";
import type { RunResult, TerminalLine } from "./runTypes";
import { prewarmRunner, runExercise as runBrowserExercise } from "./wasmRunner";

export { prewarmRunner };

function emit(onLine: ((entry: TerminalLine) => void) | undefined, stream: TerminalLine["stream"], text: string) {
  onLine?.({ stream, text });
}

function isRunResult(value: unknown): value is RunResult {
  const result = value as Partial<RunResult>;
  return Boolean(result && typeof result.ok === "boolean" && Array.isArray(result.terminal) && Array.isArray(result.outcomes));
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(data: unknown, status: number): string {
  if (typeof data === "string") {
    const compact = data.replace(/\s+/g, " ").trim();
    return compact ? `Backend runner HTTP ${status}: ${compact.slice(0, 500)}` : `Backend runner HTTP ${status}`;
  }

  const payload = data as { error?: unknown; message?: unknown };
  if (typeof payload?.error === "string") return payload.error;
  if (payload?.error && typeof payload.error === "object") {
    const nested = payload.error as { message?: unknown; code?: unknown };
    if (typeof nested.message === "string") {
      return typeof nested.code === "string" ? `${nested.message} (${nested.code})` : nested.message;
    }
  }
  if (typeof payload?.message === "string") return payload.message;
  return `Backend runner HTTP ${status}`;
}

export async function runExercise(
  exercise: Exercise,
  code: string,
  onLine?: (entry: TerminalLine) => void,
): Promise<RunResult> {
  emit(onLine, "system", "Backend runner deneniyor...");
  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exerciseId: exercise.id, code }),
    });
    const data = await readResponseBody(response);
    if (!response.ok) {
      throw new Error(extractErrorMessage(data, response.status));
    }
    if (!isRunResult(data)) throw new Error("Backend runner gecersiz yanit dondu.");
    for (const entry of data.terminal) onLine?.(entry);
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    emit(onLine, "system", `Backend runner kullanilamadi (${message}); tarayici Wasmer runner'a geciliyor.`);
    return runBrowserExercise(exercise, code, onLine);
  }
}
