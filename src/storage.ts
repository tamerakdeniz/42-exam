import type { Exercise } from "./exerciseCatalog";

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
    gemini: "gemini-2.5-flash",
    claude: "claude-3-5-haiku-latest",
  },
  codeByExercise: {},
  notesByExercise: {},
  progressByExercise: {},
  aiHistoryByExercise: {},
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
    };
  } catch {
    return defaultState(firstExercise);
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(storageKey, JSON.stringify(state));
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
