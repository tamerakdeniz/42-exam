import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ChevronsLeft,
  Clock3,
  Code2,
  FileText,
  FlaskConical,
  History,
  KeyRound,
  PanelLeft,
  Play,
  RotateCcw,
  Shuffle,
  Terminal,
  Timer,
  Trash2,
  XCircle,
} from "lucide-react";
import { fallbackModels, fetchModels, requestAiReview } from "./aiReview";
import { CodeEditor } from "./CodeEditor";
import { Markdown } from "./Markdown";
import { exercises, levelLabels, sourceReferences, type Exercise } from "./exerciseCatalog";
import { getStarterCode, getTestPlan } from "./testPlans";
import {
  loadState,
  saveState,
  updateProgress,
  type AiReviewEntry,
  type AppState,
  type ExamSession,
  type ProgressStatus,
  type Provider,
  type RunRecord,
  type StudyMode,
} from "./storage";
import { prewarmRunner, runExercise, type RunResult, type TerminalLine } from "./wasmRunner";

const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));
const modeLabels: Record<StudyMode, string> = {
  practice: "Pratik",
  random: "Rastgele",
  exam: "Sınav",
};

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function statusLabel(status?: ProgressStatus) {
  if (status === "passed") return "OK";
  if (status === "attempted") return "Denenmiş";
  return "Yeni";
}

function formatRemaining(session?: ExamSession) {
  if (!session) return "--:--";
  const elapsed = Date.now() - new Date(session.startedAt).getTime();
  const remaining = Math.max(0, session.durationMinutes * 60_000 - elapsed);
  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function createExamSession(): ExamSession {
  const exerciseIds = [0, 1, 2, 3, 4, 5].flatMap((level) => {
    const levelExercises = exercises.filter((exercise) => exercise.level === level);
    return levelExercises.length ? [pickRandom(levelExercises).id] : [];
  });

  return {
    startedAt: new Date().toISOString(),
    durationMinutes: 120,
    exerciseIds,
    currentIndex: 0,
    completedIds: [],
  };
}

function StatCard({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "warn" }) {
  return (
    <div className={`stat-card stat-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ModeButton({
  id,
  active,
  icon: Icon,
  label,
  onClick,
}: {
  id: StudyMode;
  active: StudyMode;
  icon: typeof BookOpen;
  label: string;
  onClick: (mode: StudyMode) => void;
}) {
  return (
    <button className={active === id ? "mode-button mode-button--active" : "mode-button"} onClick={() => onClick(id)}>
      <Icon size={16} />
      {label}
    </button>
  );
}

function ExerciseRow({
  exercise,
  active,
  status,
  onSelect,
}: {
  exercise: Exercise;
  active: boolean;
  status?: ProgressStatus;
  onSelect: (exercise: Exercise) => void;
}) {
  return (
    <button className={active ? "exercise-row exercise-row--active" : "exercise-row"} onClick={() => onSelect(exercise)}>
      <span className="exercise-row__level">L{exercise.level}</span>
      <span>
        <b>{exercise.name}</b>
        <small>{exercise.expectedFiles}</small>
      </span>
      <i className={`status-dot status-dot--${status ?? "new"}`}>{statusLabel(status)}</i>
    </button>
  );
}

function TerminalView({
  record,
  running,
  live,
  stale,
}: {
  record?: RunRecord;
  running: boolean;
  live: TerminalLine[];
  stale: boolean;
}) {
  const viewRef = useRef<HTMLDivElement>(null);
  const result = record?.result;
  const lines = running && live.length ? live : result?.terminal ?? [];

  useEffect(() => {
    const node = viewRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines.length, running]);

  if (!running && !result) {
    return (
      <div className="terminal-view terminal-view--empty">
        <Terminal size={18} />
        <span>Derle & test et düğmesine bastığında clang çıktısı burada görünecek.</span>
      </div>
    );
  }

  return (
    <div className="terminal-view" ref={viewRef}>
      {stale && (
        <p className="terminal-line terminal-line--system">
          Bu terminal çıktısı kodun önceki haline ait. Güncel kod için tekrar derle.
        </p>
      )}
      {lines.map((entry, index) => (
        <pre className={`terminal-line terminal-line--${entry.stream}`} key={`${entry.stream}-${index}`}>{entry.text}</pre>
      ))}
      {running && <p className="terminal-line terminal-line--system">Derleme ve test calisiyor...</p>}
    </div>
  );
}

function OutcomeList({ result }: { result?: RunResult }) {
  if (!result?.outcomes.length) {
    return <p className="muted-copy">Bu egzersizde otomatik çıktı testi yoksa derleme sonucu ve AI analiziyle devam et.</p>;
  }

  return (
    <div className="outcome-list">
      {result.outcomes.map((outcome) => (
        <article className={outcome.passed ? "outcome outcome--ok" : "outcome outcome--bad"} key={outcome.name}>
          <header>
            {outcome.passed ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
            <b>{outcome.name}</b>
            <span>exit {outcome.exitCode}</span>
          </header>
          {!outcome.passed && (
            <dl>
              <div><dt>Beklenen</dt><dd>{JSON.stringify(outcome.expected)}</dd></div>
              <div><dt>Gelen</dt><dd>{JSON.stringify(outcome.stdout)}</dd></div>
            </dl>
          )}
        </article>
      ))}
    </div>
  );
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState(exercises[0]));
  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | "all">("all");
  const [liveTerminal, setLiveTerminal] = useState<TerminalLine[]>([]);
  const [runningExerciseId, setRunningExerciseId] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [aiError, setAiError] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<Record<Provider, string[]>>(fallbackModels);
  const [tick, setTick] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("sidebar-collapsed") === "1");
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = Number(localStorage.getItem("sidebar-width"));
    return stored >= 240 && stored <= 520 ? stored : 330;
  });

  const activeExercise = exerciseById.get(state.activeExerciseId) ?? exercises[0];
  const code = state.codeByExercise[activeExercise.id] ?? getStarterCode(activeExercise);
  const notes = state.notesByExercise[activeExercise.id] ?? "";
  const activeProgress = state.progressByExercise[activeExercise.id];
  const testPlan = getTestPlan(activeExercise);
  const aiHistory = state.aiHistoryByExercise[activeExercise.id] ?? [];
  const selectedReview = aiHistory.find((entry) => entry.id === selectedReviewId) ?? aiHistory[0];
  const runRecord = state.runRecordsByExercise[activeExercise.id];
  const runResult = runRecord?.result;
  const running = runningExerciseId !== null;
  const activeExerciseRunning = runningExerciseId === activeExercise.id;
  const runResultStale = Boolean(runRecord && runRecord.codeSnapshot !== code);

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    prewarmRunner();
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem("sidebar-width", String(sidebarWidth));
  }, [sidebarWidth]);

  const startSidebarResize = (event: ReactMouseEvent) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = sidebarWidth;
    const onMove = (moveEvent: MouseEvent) => {
      const next = startWidth + moveEvent.clientX - startX;
      setSidebarWidth(Math.min(520, Math.max(240, next)));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.userSelect = "none";
  };

  const provider = state.provider;
  const providerKey = state.apiKeys[provider];

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(() => {
      fetchModels(provider, providerKey).then((list) => {
        if (!cancelled) setAvailableModels((current) => ({ ...current, [provider]: list }));
      });
    }, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [provider, providerKey]);

  const filteredExercises = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return exercises.filter((exercise) => {
      const levelMatches = levelFilter === "all" || exercise.level === levelFilter;
      const queryMatches = !normalized
        || exercise.name.toLowerCase().includes(normalized)
        || exercise.subject.toLowerCase().includes(normalized)
        || exercise.tags.some((tag) => tag.includes(normalized));
      return levelMatches && queryMatches;
    });
  }, [levelFilter, query]);

  const stats = useMemo(() => {
    const progress = Object.values(state.progressByExercise);
    return {
      passed: progress.filter((item) => item.status === "passed").length,
      attempted: progress.filter((item) => item.status === "attempted").length,
      total: exercises.length,
    };
  }, [state.progressByExercise]);

  const updateState = (updater: (current: AppState) => AppState) => setState((current) => updater(current));

  const selectExercise = (exercise: Exercise) => {
    updateState((current) => ({ ...current, activeExerciseId: exercise.id }));
    if (runningExerciseId !== exercise.id) setLiveTerminal([]);
    setAiError("");
    setSelectedReviewId(null);
  };

  const setCode = (nextCode: string) => {
    updateState((current) => ({
      ...current,
      codeByExercise: { ...current.codeByExercise, [activeExercise.id]: nextCode },
    }));
  };

  const setNotes = (nextNotes: string) => {
    updateState((current) => ({
      ...current,
      notesByExercise: { ...current.notesByExercise, [activeExercise.id]: nextNotes },
    }));
  };

  const setProvider = (provider: Provider) => updateState((current) => ({ ...current, provider }));

  const setApiKey = (provider: Provider, apiKey: string) => {
    updateState((current) => ({
      ...current,
      apiKeys: { ...current.apiKeys, [provider]: apiKey },
    }));
  };

  const setModel = (provider: Provider, model: string) => {
    updateState((current) => ({
      ...current,
      models: { ...current.models, [provider]: model },
    }));
  };

  const chooseRandom = () => {
    const pool = filteredExercises.length ? filteredExercises : exercises;
    const unanswered = pool.filter((exercise) => state.progressByExercise[exercise.id]?.status !== "passed");
    selectExercise(pickRandom(unanswered.length ? unanswered : pool));
    updateState((current) => ({ ...current, mode: "random" }));
  };

  const startExam = () => {
    const session = createExamSession();
    updateState((current) => ({
      ...current,
      mode: "exam",
      examSession: session,
      activeExerciseId: session.exerciseIds[0] ?? current.activeExerciseId,
    }));
    if (runningExerciseId !== session.exerciseIds[0]) setLiveTerminal([]);
    setAiError("");
    setSelectedReviewId(null);
  };

  const advanceExam = () => {
    if (!state.examSession) return;
    const nextIndex = Math.min(state.examSession.currentIndex + 1, state.examSession.exerciseIds.length - 1);
    const nextId = state.examSession.exerciseIds[nextIndex];
    updateState((current) => ({
      ...current,
      activeExerciseId: nextId,
      examSession: current.examSession && {
        ...current.examSession,
        currentIndex: nextIndex,
        completedIds: Array.from(new Set([...current.examSession.completedIds, activeExercise.id])),
      },
    }));
    if (runningExerciseId !== nextId) setLiveTerminal([]);
    setAiError("");
    setSelectedReviewId(null);
  };

  const runTests = async () => {
    const exercise = activeExercise;
    const source = code;
    setRunningExerciseId(exercise.id);
    setLiveTerminal([]);
    try {
      const result = await runExercise(exercise, source, (entry) =>
        setLiveTerminal((current) => [...current, entry]),
      );
      const totalTests = result.outcomes.length || 1;
      const passedTests = result.outcomes.length ? result.outcomes.filter((outcome) => outcome.passed).length : Number(result.ok);
      updateState((current) => ({
        ...current,
        runRecordsByExercise: {
          ...current.runRecordsByExercise,
          [exercise.id]: {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            codeSnapshot: source,
            result,
          },
        },
        progressByExercise: {
          ...current.progressByExercise,
          [exercise.id]: updateProgress(current.progressByExercise[exercise.id], passedTests, totalTests),
        },
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const result: RunResult = {
        ok: false,
        compileStdout: "",
        compileStderr: message,
        mode: "compile-only",
        outcomes: [],
        terminal: [{ stream: "error", text: message }],
      };
      updateState((current) => ({
        ...current,
        runRecordsByExercise: {
          ...current.runRecordsByExercise,
          [exercise.id]: {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            codeSnapshot: source,
            result,
          },
        },
        progressByExercise: {
          ...current.progressByExercise,
          [exercise.id]: updateProgress(current.progressByExercise[exercise.id], 0, 1),
        },
      }));
    } finally {
      setRunningExerciseId((current) => (current === exercise.id ? null : current));
    }
  };

  const askAi = async () => {
    setReviewing(true);
    setAiError("");
    try {
      const review = await requestAiReview({
        provider: state.provider,
        apiKey: state.apiKeys[state.provider],
        model: state.models[state.provider],
        exercise: activeExercise,
        code,
        runResult,
        notes,
      });
      const entry: AiReviewEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        provider: state.provider,
        model: state.models[state.provider],
        review,
        status: activeProgress?.status,
        exerciseName: activeExercise.name,
        codeSnapshot: code,
        notesSnapshot: notes,
        runSummary: runResult
          ? `${runResult.ok ? "OK" : "KO"} · ${runResult.outcomes.filter((outcome) => outcome.passed).length}/${runResult.outcomes.length || 1}`
          : "Derleme/test calistirilmadi",
      };
      updateState((current) => ({
        ...current,
        aiHistoryByExercise: {
          ...current.aiHistoryByExercise,
          [activeExercise.id]: [entry, ...(current.aiHistoryByExercise[activeExercise.id] ?? [])],
        },
      }));
      setSelectedReviewId(entry.id);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : String(error));
    } finally {
      setReviewing(false);
    }
  };

  const deleteReview = (id: string) => {
    updateState((current) => ({
      ...current,
      aiHistoryByExercise: {
        ...current.aiHistoryByExercise,
        [activeExercise.id]: (current.aiHistoryByExercise[activeExercise.id] ?? []).filter((entry) => entry.id !== id),
      },
    }));
    setSelectedReviewId((current) => (current === id ? null : current));
  };

  const restoreReviewCode = (entry: AiReviewEntry) => {
    if (!entry.codeSnapshot) return;
    const shouldRestore = window.confirm("Bu analiz alınırkenki kod mevcut editöre geri yüklensin mi?");
    if (shouldRestore) setCode(entry.codeSnapshot);
  };

  const resetExercise = () => {
    setCode(getStarterCode(activeExercise));
    setAiError("");
  };

  const mode = state.mode;
  const exam = state.examSession;
  const remaining = tick >= 0 ? formatRemaining(exam) : "--:--";

  return (
    <div
      className={sidebarCollapsed ? "studio-shell studio-shell--collapsed" : "studio-shell"}
      style={{ ["--sidebar-width" as string]: sidebarCollapsed ? "0px" : `${sidebarWidth}px` }}
    >
      {sidebarCollapsed && (
        <button className="sidebar-expand" onClick={() => setSidebarCollapsed(false)} title="Paneli genişlet" aria-label="Paneli genişlet">
          <PanelLeft size={18} />
        </button>
      )}
      <aside className="left-panel">
        <div className="brand-block">
          <div className="brand-mark">42</div>
          <div>
            <span>Exam Forge</span>
            <strong>C Piscine Studio</strong>
          </div>
          <button className="sidebar-collapse" onClick={() => setSidebarCollapsed(true)} title="Paneli daralt" aria-label="Paneli daralt">
            <ChevronsLeft size={18} />
          </button>
        </div>

        <div className="mode-switcher">
          <ModeButton id="practice" active={mode} icon={BookOpen} label={modeLabels.practice} onClick={(nextMode) => updateState((current) => ({ ...current, mode: nextMode }))} />
          <ModeButton id="random" active={mode} icon={Shuffle} label={modeLabels.random} onClick={() => chooseRandom()} />
          <ModeButton id="exam" active={mode} icon={Timer} label={modeLabels.exam} onClick={(nextMode) => updateState((current) => ({ ...current, mode: nextMode }))} />
        </div>

        <div className="stats-grid">
          <StatCard label="Tamamlanan" value={`${stats.passed}`} tone="good" />
          <StatCard label="Denenen" value={`${stats.attempted}`} tone="warn" />
          <StatCard label="Havuz" value={`${stats.total}`} />
        </div>

        <div className="search-block">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Soru, tag veya subject ara" />
          <div className="level-tabs" aria-label="Seviye filtresi">
            <button className={levelFilter === "all" ? "active" : ""} onClick={() => setLevelFilter("all")}>Hepsi</button>
            {[0, 1, 2, 3, 4, 5].map((level) => (
              <button className={levelFilter === level ? "active" : ""} onClick={() => setLevelFilter(level)} key={level}>L{level}</button>
            ))}
          </div>
        </div>

        <div className="exercise-list" aria-label="Egzersiz listesi">
          {filteredExercises.map((exercise) => (
            <ExerciseRow
              exercise={exercise}
              active={exercise.id === activeExercise.id}
              status={state.progressByExercise[exercise.id]?.status}
              onSelect={selectExercise}
              key={exercise.id}
            />
          ))}
        </div>
        <div className="panel-resizer" onMouseDown={startSidebarResize} role="separator" aria-orientation="vertical" title="Sürükleyerek genişlik ayarla" />
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Level {activeExercise.level} / {levelLabels[activeExercise.level]}</span>
            <h1>{activeExercise.name}</h1>
          </div>
          <div className="topbar-actions">
            <button onClick={chooseRandom}><Shuffle size={16} /> Rastgele</button>
            <button onClick={startExam}><Timer size={16} /> Sınav başlat</button>
          </div>
        </header>

        {mode === "exam" && (
          <section className="exam-strip">
            <span><Clock3 size={16} /> Kalan {remaining}</span>
            <b>{exam ? `${exam.currentIndex + 1}/${exam.exerciseIds.length}` : "Sınav bekliyor"}</b>
            <button onClick={startExam}><RotateCcw size={15} /> Yeniden başlat</button>
            <button onClick={advanceExam} disabled={!exam || exam.currentIndex >= exam.exerciseIds.length - 1}>Sonraki soru <ChevronRight size={15} /></button>
          </section>
        )}

        <section className="exercise-hero">
          <div>
            <span className="eyebrow">Subject</span>
            <pre>{activeExercise.subject}</pre>
          </div>
          <aside>
            <div><FileText size={16} /><span>Expected</span><b>{activeExercise.expectedFiles}</b></div>
            <div><Code2 size={16} /><span>Allowed</span><b>{activeExercise.allowedFunctions}</b></div>
            <div><FlaskConical size={16} /><span>Test</span><b>{testPlan.mode === "compile-only" ? "compile only" : `${testPlan.mode} / ${testPlan.mode === "program" ? testPlan.cases?.length ?? 0 : 1}`}</b></div>
            <a href={activeExercise.sourceUrl} target="_blank" rel="noreferrer">Kaynak subject</a>
          </aside>
        </section>

        <section className="work-grid">
          <div className="editor-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">student.c</span>
                <h2>Kod</h2>
              </div>
              <div className="action-row">
                <button onClick={resetExercise}><RotateCcw size={15} /> Sıfırla</button>
                <button className="primary" onClick={runTests} disabled={running}><Play size={15} /> Derle & test et</button>
              </div>
            </div>
            <CodeEditor value={code} onChange={setCode} />
          </div>

          <div className="result-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">Terminal</span>
                <h2>Çıktı</h2>
              </div>
              <span className={`result-pill result-pill--${runResult?.ok ? "ok" : activeProgress?.status ?? "new"}`}>{statusLabel(activeProgress?.status)}</span>
            </div>
            <TerminalView record={runRecord} running={activeExerciseRunning} live={liveTerminal} stale={runResultStale} />
            <OutcomeList result={runResult} />
          </div>
        </section>

        <section className="coach-grid">
          <div className="ai-panel">
            <div className="panel-header">
              <div>
                <span className="eyebrow">AI Mentor</span>
                <h2>Hata analizi</h2>
              </div>
              <button className="primary" onClick={askAi} disabled={reviewing}><Brain size={15} /> Analiz et</button>
            </div>
            <div className="provider-grid">
              <label>
                Sağlayıcı
                <select value={state.provider} onChange={(event) => setProvider(event.target.value as Provider)}>
                  <option value="gemini">Gemini</option>
                  <option value="claude">Claude</option>
                </select>
              </label>
              <label>
                Model
                <select value={state.models[state.provider]} onChange={(event) => setModel(state.provider, event.target.value)}>
                  {Array.from(new Set([state.models[state.provider], ...(availableModels[state.provider] ?? [])])).map((model) => (
                    <option value={model} key={model}>{model}</option>
                  ))}
                </select>
              </label>
              <label className="span-2">
                <KeyRound size={14} /> API key
                <input
                  type="password"
                  value={state.apiKeys[state.provider]}
                  onChange={(event) => setApiKey(state.provider, event.target.value)}
                  placeholder={`${state.provider} API key`}
                />
              </label>
            </div>
            <p className="hint">Anahtar localStorage içinde bu cihazda saklanır ve istek doğrudan sağlayıcı API’sine gider.</p>
            <textarea className="notes-box" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Takıldığın noktayı veya kendi varsayımını yaz..." />
            {selectedReview && !reviewing && !aiError && (
              <div className="review-meta">
                <span>{new Date(selectedReview.createdAt).toLocaleString("tr-TR")}</span>
                <span>{selectedReview.provider} · {selectedReview.model}</span>
                {selectedReview.runSummary && <span>{selectedReview.runSummary}</span>}
                {selectedReview.codeSnapshot && (
                  <button type="button" onClick={() => restoreReviewCode(selectedReview)}>
                    Kodu geri yükle
                  </button>
                )}
              </div>
            )}
            <div className="review-output">
              {reviewing ? (
                "AI analiz ediyor..."
              ) : aiError ? (
                aiError
              ) : selectedReview?.review ? (
                <Markdown text={selectedReview.review} />
              ) : (
                "Derleme/testten sonra analiz alırsan neden KO aldığını ve nasıl düzelteceğini burada göreceksin."
              )}
            </div>
          </div>

          <div className="coach-side">
            <div className="history-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow"><History size={12} /> Hata analizi geçmişi</span>
                  <h2>{aiHistory.length} kayıt</h2>
                </div>
              </div>
              {aiHistory.length === 0 ? (
                <p className="history-empty">Bu egzersiz için henüz analiz yok. "Analiz et" ile ilk kaydı oluştur.</p>
              ) : (
                <div className="history-list">
                  {aiHistory.map((entry) => (
                    <div
                      className={entry.id === selectedReview?.id ? "history-item history-item--active" : "history-item"}
                      key={entry.id}
                    >
                      <button className="history-item__main" onClick={() => setSelectedReviewId(entry.id)}>
                        <span className="history-item__time">{new Date(entry.createdAt).toLocaleString("tr-TR")}</span>
                        <span className="history-item__meta">{entry.provider} · {entry.model}</span>
                        <span className="history-item__preview">{entry.review.slice(0, 90)}</span>
                      </button>
                      <button className="icon-button" onClick={() => deleteReview(entry.id)} title="Kaydı sil">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="sources-panel">
              <div className="panel-header">
                <div>
                  <span className="eyebrow">Kaynak havuzu</span>
                  <h2>69 sınav egzersizi</h2>
                </div>
              </div>
              <p>Çözümler kesin doğru kabul edilmez; subject ve test sonucu önceliklidir. İlerleme, kod ve notlar sadece bu tarayıcıda kalır.</p>
              <div className="source-links">
                {sourceReferences.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.label}<ChevronRight size={14} /></a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
