# 42 Exam Forge

42 C Piscine sınav egzersizleri için çalışma stüdyosu.

- C kodunu önce backend runner ile derler; backend yoksa tarayıcı içi Wasmer runner'a düşer.
- Terminal çıktısını ve test sonucunu gösterir.
- Gemini veya Claude API key ile hata analizi alır.
- Pratik, rastgele soru ve sınav simülasyonu modları içerir.
- Kod, not, API key ve ilerleme sadece cihazdaki `localStorage` içinde kalır.

## Geliştirme

```bash
npm install
npm run dev
```

`npm run dev` sadece Vite frontend'i açar; `/api/run` olmadığı için tarayıcı Wasmer
fallback'i kullanılır. Native backend runner'ı lokal test etmek için Vercel dev kullan:

```bash
npx vercel dev
```

## Build

```bash
npm run typecheck
npm run build
```

## Vercel

Vercel proje kökü olarak bu klasörü seç. `vercel.json`, Wasmer için gereken
`Cross-Origin-Opener-Policy` ve `Cross-Origin-Embedder-Policy` headerlarını ekler.

Production'da `/api/run`, Vercel Sandbox içinde öğrenci kodunu izole şekilde
derleyip çalıştırır. Vercel Sandbox SDK production'da Vercel OIDC ile otomatik
kimlik doğrular; lokalde Sandbox yolunu test edeceksen proje linklenmiş olmalı:

```bash
npx vercel link
npx vercel env pull
```

Varsayılan production yolu, `gcc` kurulu kalacak persistent bir compiler base
sandbox hazırlar ve her test için bu base snapshot'tan izole fork açar. Base adı
gerektiğinde şu env ile değiştirilebilir:

```bash
VERCEL_SANDBOX_BASE_NAME=42-exam-c-compiler-v1
```

En hızlı ve en stabil yapı için Vercel Container Registry'de `cc/gcc` hazır bir
Sandbox image kullanıp project env'e şu değeri ekle:

```bash
VERCEL_SANDBOX_IMAGE=<image-adı>
```

Bu env yoksa runner compiler base içinde `gcc` kurmayı dener; ilk çalışma daha
yavaş olabilir, sonraki çalışmalar snapshot/fork ile daha hızlıdır. AI API
key'leri backend'e gönderilmez, kullanıcı tarayıcısındaki `localStorage` içinde
kalır.
