import type { Exercise } from "./exerciseCatalog";
import type { RunResult } from "./wasmRunner";

export type StudyMode = "practice" | "random" | "exam";
export type Provider = "gemini" | "claude";
export type ProgressStatus = "new" | "attempted" | "passed";

export type ExerciseProgress = {
  status: ProgressStatus;
  attempts: number;
  passedTests: number;
  totalTests: number;
  lastRunAt?: string;
};

export type ExamSession = {
  startedAt: string;
  durationMinutes: number;
  exerciseIds: string[];
  currentIndex: number;
  completedIds: string[];
};

export type AiReviewEntry = {
  id: string;
  createdAt: string;
  provider: Provider;
  model: string;
  review: string;
  status?: ProgressStatus;
  exerciseName?: string;
  codeSnapshot?: string;
  notesSnapshot?: string;
  runSummary?: string;
};

export type RunRecord = {
  id: string;
  createdAt: string;
  codeSnapshot: string;
  result: RunResult;
};

export type AppState = {
  activeExerciseId: string;
  mode: StudyMode;
  provider: Provider;
  apiKeys: Record<Provider, string>;
  models: Record<Provider, string>;
  codeByExercise: Record<string, string>;
  notesByExercise: Record<string, string>;
  progressByExercise: Record<string, ExerciseProgress>;
  aiHistoryByExercise: Record<string, AiReviewEntry[]>;
  runRecordsByExercise: Record<string, RunRecord>;
  examSession?: ExamSession;
};

const storageKey = "42-c-exam-studio/v1";

export const defaultState = (firstExercise: Exercise): AppState => ({
  activeExerciseId: firstExercise.id,
  mode: "practice",
  provider: "gemini",
  apiKeys: {
    gemini: "",
    claude: "",
  },
  models: {
    gemini: "gemini-3-1-flash-lite",
    claude: "claude-haiku-4-5",
  },
  codeByExercise: {},
  notesByExercise: {},
  progressByExercise: {},
  aiHistoryByExercise: {},
  runRecordsByExercise: {},
});

export function loadState(firstExercise: Exercise): AppState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return defaultState(firstExercise);
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...defaultState(firstExercise),
      ...parsed,
      apiKeys: { ...defaultState(firstExercise).apiKeys, ...parsed.apiKeys },
      models: { ...defaultState(firstExercise).models, ...parsed.models },
      codeByExercise: parsed.codeByExercise ?? {},
      notesByExercise: parsed.notesByExercise ?? {},
      progressByExercise: parsed.progressByExercise ?? {},
      aiHistoryByExercise: parsed.aiHistoryByExercise ?? {},
      runRecordsByExercise: parsed.runRecordsByExercise ?? {},
    };
  } catch {
    return defaultState(firstExercise);
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // localStorage quota/private-mode errors should not break the editor loop.
  }
}

export function updateProgress(
  current: ExerciseProgress | undefined,
  passedTests: number,
  totalTests: number,
): ExerciseProgress {
  return {
    status: totalTests > 0 && passedTests === totalTests ? "passed" : "attempted",
    attempts: (current?.attempts ?? 0) + 1,
    passedTests,
    totalTests,
    lastRunAt: new Date().toISOString(),
  };
}
