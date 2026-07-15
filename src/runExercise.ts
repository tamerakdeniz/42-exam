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
    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
      const message = (data as { error?: string } | undefined)?.error ?? `Backend runner HTTP ${response.status}`;
      throw new Error(message);
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
