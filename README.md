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
derleyip çalıştırır. En hızlı yapı için Vercel Container Registry'de `cc/gcc`
hazır bir Sandbox image kullanıp project env'e şu değeri ekle:

```bash
VERCEL_SANDBOX_IMAGE=<image-adı>
```

Bu env yoksa runner Sandbox içinde `gcc` kurmayı dener; ilk çalışma daha yavaş
olabilir. AI API key'leri backend'e gönderilmez, kullanıcı tarayıcısındaki
`localStorage` içinde kalır.
