import { useLayoutEffect, useRef, type KeyboardEvent, type ReactNode, type UIEvent } from "react";

const INDENT = "    ";
const INDENT_SIZE = INDENT.length;
const PAIRS: Record<string, string> = { "{": "}", "(": ")", "[": "]" };
const CLOSERS = new Set(Object.values(PAIRS));
const BRACKET_DEPTH_COLORS = 3;

const KEYWORDS = new Set([
  "auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else", "enum",
  "extern", "float", "for", "goto", "if", "inline", "int", "long", "register", "restrict", "return",
  "short", "signed", "sizeof", "static", "struct", "switch", "typedef", "union", "unsigned", "void",
  "volatile", "while", "size_t", "ssize_t", "NULL",
]);

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

type Edit = { value: string; selectionStart: number; selectionEnd: number };

function lineStartIndex(value: string, index: number): number {
  return value.lastIndexOf("\n", index - 1) + 1;
}

function currentIndent(value: string, caret: number): string {
  const start = lineStartIndex(value, caret);
  const match = value.slice(start).match(/^[ \t]*/);
  return match ? match[0] : "";
}

// Secili satirlarin her birine bir seviye girinti ekler / cikarir.
function indentBlock(value: string, start: number, end: number, dedent: boolean): Edit {
  const blockStart = lineStartIndex(value, start);
  const before = value.slice(0, blockStart);
  const block = value.slice(blockStart, end);
  const after = value.slice(end);
  let removedFromFirst = 0;
  let removedTotal = 0;

  const lines = block.split("\n").map((lineText, index) => {
    if (dedent) {
      const match = lineText.match(/^( {1,4}|\t)/);
      const removed = match ? match[0].length : 0;
      if (index === 0) removedFromFirst = removed;
      removedTotal += removed;
      return removed ? lineText.slice(removed) : lineText;
    }
    if (index === 0) removedFromFirst = -INDENT_SIZE;
    removedTotal += INDENT_SIZE;
    return INDENT + lineText;
  });

  const nextBlock = lines.join("\n");
  const nextValue = before + nextBlock + after;
  const selectionStart = Math.max(blockStart, start - removedFromFirst);
  const selectionEnd = end + (dedent ? -removedTotal : removedTotal);
  return { value: nextValue, selectionStart, selectionEnd };
}

// Bagimliliksiz, XSS'e kapali (React node ureten) hafif C tokenizasyonu.
// Ayrica parantez ciftlerini derinlige gore renklendirir.
function highlight(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let buffer = "";
  let key = 0;
  let depth = 0;

  const flush = () => {
    if (buffer) {
      nodes.push(buffer);
      buffer = "";
    }
  };
  const emit = (className: string, text: string) => {
    flush();
    nodes.push(
      <span className={className} key={key++}>
        {text}
      </span>,
    );
  };

  const isIdentStart = (ch: string) => /[A-Za-z_]/.test(ch);
  const isIdentPart = (ch: string) => /[A-Za-z0-9_]/.test(ch);
  const isDigit = (ch: string) => /[0-9]/.test(ch);

  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    const next = code[i + 1];

    if (ch === "/" && next === "/") {
      let end = code.indexOf("\n", i);
      if (end === -1) end = code.length;
      emit("tok-comment", code.slice(i, end));
      i = end;
      continue;
    }

    if (ch === "/" && next === "*") {
      let end = code.indexOf("*/", i + 2);
      end = end === -1 ? code.length : end + 2;
      emit("tok-comment", code.slice(i, end));
      i = end;
      continue;
    }

    if (ch === "#") {
      let end = code.indexOf("\n", i);
      if (end === -1) end = code.length;
      emit("tok-preproc", code.slice(i, end));
      i = end;
      continue;
    }

    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== ch) {
        if (code[j] === "\\") j += 1;
        j += 1;
      }
      j = Math.min(j + 1, code.length);
      emit("tok-string", code.slice(i, j));
      i = j;
      continue;
    }

    if (isDigit(ch) || (ch === "." && isDigit(next ?? ""))) {
      let j = i;
      while (j < code.length && /[0-9a-fA-FxX._]/.test(code[j])) j += 1;
      emit("tok-number", code.slice(i, j));
      i = j;
      continue;
    }

    if (isIdentStart(ch)) {
      let j = i;
      while (j < code.length && isIdentPart(code[j])) j += 1;
      const word = code.slice(i, j);
      if (KEYWORDS.has(word)) emit("tok-keyword", word);
      else buffer += word;
      i = j;
      continue;
    }

    if (ch === "{" || ch === "(" || ch === "[") {
      const color = depth % BRACKET_DEPTH_COLORS;
      depth += 1;
      emit(`tok-bracket tok-bracket--${color}`, ch);
      i += 1;
      continue;
    }

    if (ch === "}" || ch === ")" || ch === "]") {
      depth = Math.max(0, depth - 1);
      const color = depth % BRACKET_DEPTH_COLORS;
      emit(`tok-bracket tok-bracket--${color}`, ch);
      i += 1;
      continue;
    }

    buffer += ch;
    i += 1;
  }

  flush();
  return nodes;
}

export function CodeEditor({ value, onChange, className }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const pendingSelection = useRef<{ start: number; end: number } | null>(null);

  useLayoutEffect(() => {
    const selection = pendingSelection.current;
    const textarea = ref.current;
    if (selection && textarea) {
      textarea.setSelectionRange(selection.start, selection.end);
      pendingSelection.current = null;
    }
  }, [value]);

  const syncScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    const pre = highlightRef.current;
    if (!pre) return;
    pre.scrollTop = event.currentTarget.scrollTop;
    pre.scrollLeft = event.currentTarget.scrollLeft;
  };

  const apply = (edit: Edit) => {
    pendingSelection.current = { start: edit.selectionStart, end: edit.selectionEnd };
    onChange(edit.value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const { key } = event;

    if (key === "Tab") {
      event.preventDefault();
      const multiline = value.slice(start, end).includes("\n");
      if (multiline || (event.shiftKey && start === end)) {
        apply(indentBlock(value, start, end, event.shiftKey));
        return;
      }
      if (event.shiftKey) return;
      apply({
        value: value.slice(0, start) + INDENT + value.slice(end),
        selectionStart: start + INDENT_SIZE,
        selectionEnd: start + INDENT_SIZE,
      });
      return;
    }

    if (key === "Enter") {
      event.preventDefault();
      const indent = currentIndent(value, start);
      const before = value[start - 1];
      const after = value[end];
      const opensBlock = before !== undefined && before in PAIRS;

      if (opensBlock && after !== undefined && PAIRS[before] === after) {
        const insertion = `\n${indent}${INDENT}\n${indent}`;
        const caret = start + 1 + indent.length + INDENT_SIZE;
        apply({
          value: value.slice(0, start) + insertion + value.slice(end),
          selectionStart: caret,
          selectionEnd: caret,
        });
        return;
      }

      const insertion = opensBlock ? `\n${indent}${INDENT}` : `\n${indent}`;
      const caret = start + insertion.length;
      apply({
        value: value.slice(0, start) + insertion + value.slice(end),
        selectionStart: caret,
        selectionEnd: caret,
      });
      return;
    }

    if (key in PAIRS) {
      const close = PAIRS[key];
      const nextChar = value[end];
      const canAutoClose = start !== end || nextChar === undefined || /[\s)\]}]/.test(nextChar);
      if (!canAutoClose) return;
      event.preventDefault();
      apply({
        value: value.slice(0, start) + key + value.slice(start, end) + close + value.slice(end),
        selectionStart: start + 1,
        selectionEnd: end + 1,
      });
      return;
    }

    if (CLOSERS.has(key) && start === end && value[start] === key) {
      event.preventDefault();
      apply({ value, selectionStart: start + 1, selectionEnd: start + 1 });
      return;
    }

    if (key === "Backspace" && start === end && start > 0) {
      const prev = value[start - 1];
      if (prev in PAIRS && value[start] === PAIRS[prev]) {
        event.preventDefault();
        apply({
          value: value.slice(0, start - 1) + value.slice(start + 1),
          selectionStart: start - 1,
          selectionEnd: start - 1,
        });
        return;
      }
      const lineStart = lineStartIndex(value, start);
      const beforeCaret = value.slice(lineStart, start);
      if (beforeCaret.length > 0 && /^ +$/.test(beforeCaret)) {
        const remove = ((beforeCaret.length - 1) % INDENT_SIZE) + 1;
        event.preventDefault();
        apply({
          value: value.slice(0, start - remove) + value.slice(start),
          selectionStart: start - remove,
          selectionEnd: start - remove,
        });
      }
    }
  };

  return (
    <div className={className ? `code-editor ${className}` : "code-editor"}>
      <pre className="code-editor__highlight" aria-hidden="true" ref={highlightRef}>
        {highlight(value)}
        {"\n"}
      </pre>
      <textarea
        ref={ref}
        className="code-editor__input"
        spellCheck={false}
        value={value}
        onKeyDown={handleKeyDown}
        onScroll={syncScroll}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
