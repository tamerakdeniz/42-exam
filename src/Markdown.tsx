import { Fragment, type ReactNode } from "react";

// Bagimliliksiz, dangerouslySetInnerHTML kullanmayan (yani XSS'e kapali) kucuk
// markdown isleyici. AI ciktisindaki basliklar, kalin/italik, kod, liste ve
// link gibi yaygin bicimleri React elemanlarina cevirir.

type InlinePattern = {
  re: RegExp;
  render: (match: RegExpExecArray, key: string) => ReactNode;
};

const INLINE_PATTERNS: InlinePattern[] = [
  { re: /`([^`]+)`/, render: (m, key) => <code key={key}>{m[1]}</code> },
  { re: /\*\*([^*]+)\*\*/, render: (m, key) => <strong key={key}>{parseInline(m[1], key)}</strong> },
  { re: /__([^_]+)__/, render: (m, key) => <strong key={key}>{parseInline(m[1], key)}</strong> },
  { re: /(?<![A-Za-z0-9])\*([^*\s][^*]*?)\*(?![A-Za-z0-9])/, render: (m, key) => <em key={key}>{parseInline(m[1], key)}</em> },
  { re: /(?<![A-Za-z0-9])_([^_\s][^_]*?)_(?![A-Za-z0-9])/, render: (m, key) => <em key={key}>{parseInline(m[1], key)}</em> },
  {
    re: /\[([^\]]+)\]\(([^)]+)\)/,
    render: (m, key) => (
      <a href={m[2]} target="_blank" rel="noreferrer" key={key}>
        {m[1]}
      </a>
    ),
  },
];

function parseInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let counter = 0;

  while (rest.length > 0) {
    let bestIndex = Infinity;
    let bestPattern: InlinePattern | null = null;
    let bestMatch: RegExpExecArray | null = null;

    for (const pattern of INLINE_PATTERNS) {
      const match = new RegExp(pattern.re).exec(rest);
      if (match && match.index < bestIndex) {
        bestIndex = match.index;
        bestPattern = pattern;
        bestMatch = match;
      }
    }

    if (!bestPattern || !bestMatch) {
      nodes.push(rest);
      break;
    }

    if (bestIndex > 0) nodes.push(rest.slice(0, bestIndex));
    nodes.push(bestPattern.render(bestMatch, `${keyPrefix}-i${counter++}`));
    rest = rest.slice(bestIndex + bestMatch[0].length);
  }

  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={`p${key++}`}>{parseInline(paragraph.join(" "), `p${key}`)}</p>);
      paragraph = [];
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      flushParagraph();
      const lang = trimmed.slice(3).trim();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      blocks.push(
        <pre className="md-code" data-lang={lang || undefined} key={`c${key++}`}>
          <code>{code.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      const Tag = `h${Math.min(level + 2, 6)}` as "h3" | "h4" | "h5" | "h6";
      blocks.push(<Tag key={`h${key++}`}>{parseInline(heading[2], `h${key}`)}</Tag>);
      continue;
    }

    const unordered = trimmed.match(/^[-*+]\s+(.*)$/);
    const ordered = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (unordered || ordered) {
      flushParagraph();
      const items: { text: string; num?: number }[] = [];
      const isOrdered = Boolean(ordered);
      while (i < lines.length) {
        const itemLine = lines[i].trim();
        const u = itemLine.match(/^[-*+]\s+(.*)$/);
        const o = itemLine.match(/^(\d+)[.)]\s+(.*)$/);
        if (isOrdered && o) {
          items.push({ text: o[2], num: Number(o[1]) });
          i += 1;
        } else if (!isOrdered && u) {
          items.push({ text: u[1] });
          i += 1;
        } else {
          break;
        }
      }
      i -= 1;
      const listItems = items.map((item, index) => (
        <li value={item.num} key={`li${key}-${index}`}>
          {parseInline(item.text, `li${key}-${index}`)}
        </li>
      ));
      blocks.push(
        isOrdered ? (
          <ol start={items[0]?.num} key={`ol${key++}`}>
            {listItems}
          </ol>
        ) : (
          <ul key={`ul${key++}`}>{listItems}</ul>
        ),
      );
      continue;
    }

    if (trimmed === "") {
      flushParagraph();
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  return <Fragment>{blocks}</Fragment>;
}
