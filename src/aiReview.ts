import type { Exercise } from "./exerciseCatalog";
import type { RunResult } from "./runTypes";
import type { Provider } from "./storage";

// Aktif olarak kullanilabilen, maliyeti dusuk / yaygin kullanilan modeller.
// API anahtari verildiginde saglayici uzerinden guncel liste cekilir; asagidaki
// liste anahtar yokken veya istek basarisiz olursa yedek (fallback) olarak kullanilir.
export const fallbackModels: Record<Provider, string[]> = {
  gemini: [
    "gemini-3-1-flash-lite",
    "gemini-3-5-flash",
    "gemini-3-1-flash",
    "gemini-3-5-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
  ],
  claude: [
    "claude-haiku-4-5",
    "claude-sonnet-5",
    "claude-3-5-haiku-latest",
    "claude-3-5-sonnet-latest",
    "claude-3-7-sonnet-latest",
    "claude-sonnet-4-5",
    "claude-opus-4-1",
    "claude-3-haiku-20240307",
  ],
};

function sortModels(models: string[]): string[] {
  return Array.from(new Set(models)).sort((a, b) => {
    const preferredA = fallbackModels.gemini.includes(a) || fallbackModels.claude.includes(a);
    const preferredB = fallbackModels.gemini.includes(b) || fallbackModels.claude.includes(b);
    if (preferredA !== preferredB) return preferredA ? -1 : 1;
    return a.localeCompare(b);
  });
}

async function fetchGeminiModels(apiKey: string): Promise<string[]> {
  const models: string[] = [];
  let pageToken = "";
  do {
    const params = new URLSearchParams({ pageSize: "1000" });
    if (pageToken) params.set("pageToken", pageToken);
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?${params.toString()}`, {
      headers: { "x-goog-api-key": apiKey },
    });
    const data = (await response.json()) as {
      models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
      nextPageToken?: string;
      error?: { message?: string };
    };
    if (!response.ok) throw new Error(data.error?.message ?? "Gemini model listesi alinamadi.");
    models.push(
      ...(data.models ?? [])
        .filter((model) => model.supportedGenerationMethods?.includes("generateContent"))
        .map((model) => (model.name ?? "").replace(/^models\//, ""))
        .filter(Boolean),
    );
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);
  return sortModels(models);
}

async function fetchClaudeModels(apiKey: string): Promise<string[]> {
  const models: string[] = [];
  let afterId = "";
  let hasMore = false;
  do {
    const params = new URLSearchParams({ limit: "1000" });
    if (afterId) params.set("after_id", afterId);
    const response = await fetch(`https://api.anthropic.com/v1/models?${params.toString()}`, {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
    });
    const data = (await response.json()) as {
      data?: Array<{ id?: string }>;
      has_more?: boolean;
      error?: { message?: string };
    };
    if (!response.ok) throw new Error(data.error?.message ?? "Claude model listesi alinamadi.");
    const page = (data.data ?? []).map((model) => model.id ?? "").filter(Boolean);
    models.push(...page);
    afterId = page.at(-1) ?? "";
    hasMore = Boolean(data.has_more && afterId);
  } while (hasMore);
  return sortModels(models);
}

/**
 * Saglayicidan guncel model listesini ceker. API anahtari yoksa veya istek
 * basarisiz olursa fallbackModels dondurur (bu yuzden hic hata firlatmaz).
 */
export async function fetchModels(provider: Provider, apiKey: string): Promise<string[]> {
  if (!apiKey.trim()) return fallbackModels[provider];
  try {
    const remote = provider === "gemini" ? await fetchGeminiModels(apiKey) : await fetchClaudeModels(apiKey);
    return remote.length ? sortModels([...remote, ...fallbackModels[provider]]) : fallbackModels[provider];
  } catch {
    return fallbackModels[provider];
  }
}

type ReviewInput = {
  provider: Provider;
  apiKey: string;
  model: string;
  exercise: Exercise;
  code: string;
  runResult?: RunResult;
  notes?: string;
};

const systemPrompt = `Sen 42 Piscine C sinavina hazirlanan ogrenciye mentorluk yapan sert ama adil bir C egitmenisin.
Turkce yanit ver. Subject, allowed functions ve terminal/test ciktisini esas al.
Cozumu bastan yazma; once hatanin nedenini, sonra en kucuk dogru degisikligi anlat.
42 tarzinda dusun: gereksiz kutuphane, main/fonksiyon ayrimi, argv sayisi, newline, bellek, edge case, -Wall -Wextra -Werror.
Dogruysa kisa bir OK ver, hangi fikirlerin iyi oldugunu ve bir sonraki soruda neye dikkat edecegini soyle.`;

function buildUserPrompt({ exercise, code, runResult, notes }: ReviewInput) {
  const terminal = runResult?.terminal.map((entry) => `[${entry.stream}] ${entry.text}`).join("\n") ?? "Henuz derleme/test calistirilmadi.";
  const outcomes = runResult?.outcomes.map((outcome) => (
    `${outcome.passed ? "OK" : "KO"} ${outcome.name}\nexpected: ${JSON.stringify(outcome.expected)}\nstdout: ${JSON.stringify(outcome.stdout)}\nstderr: ${JSON.stringify(outcome.stderr)}`
  )).join("\n\n") ?? "";

  return `Egzersiz: ${exercise.name}
Seviye: ${exercise.level}
Expected files: ${exercise.expectedFiles}
Allowed functions: ${exercise.allowedFunctions}

Subject:
${exercise.subject}

Kod:
\`\`\`c
${code}
\`\`\`

Terminal:
${terminal}

Test ozeti:
${outcomes || "Otomatik test yok."}

Ogrenci notu:
${notes || "-"}

Yanitta su sirayi kullan:
1. Durum: OK / KO / derleme sorunu.
2. Hatanin asil nedeni.
3. Degistirilecek en kucuk yerler.
4. Bu sorudan ogrenilecek algoritma/pattern.`;
}

function textFromGemini(data: unknown): string {
  const response = data as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return response.candidates?.flatMap((candidate) => candidate.content?.parts ?? []).map((part) => part.text ?? "").join("").trim() ?? "";
}

function textFromClaude(data: unknown): string {
  const response = data as { content?: Array<{ type?: string; text?: string }> };
  return response.content?.filter((part) => part.type === "text").map((part) => part.text ?? "").join("").trim() ?? "";
}

export async function requestAiReview(input: ReviewInput): Promise<string> {
  if (!input.apiKey.trim()) {
    throw new Error("API key girilmeden AI analizi calismaz.");
  }

  const prompt = buildUserPrompt(input);

  if (input.provider === "gemini") {
    const model = input.model.replace(/^models\//, "");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": input.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1800 },
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error((data as { error?: { message?: string } }).error?.message ?? "Gemini istegi basarisiz.");
    return textFromGemini(data) || "Gemini bos yanit dondu.";
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": input.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: input.model,
      max_tokens: 1800,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error((data as { error?: { message?: string } }).error?.message ?? "Claude istegi basarisiz.");
  return textFromClaude(data) || "Claude bos yanit dondu.";
}
