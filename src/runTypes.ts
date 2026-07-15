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
  runner?: "backend-native" | "backend-sandbox" | "browser-wasmer";
};
