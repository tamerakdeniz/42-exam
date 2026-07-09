import type { Exercise } from "./exerciseCatalog";
import type { Provider } from "./storage";
import type { RunResult } from "./wasmRunner";

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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(input.model)}:generateContent?key=${encodeURIComponent(input.apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
