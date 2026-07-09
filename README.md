# 42 Exam Forge

42 C Piscine sınav egzersizleri için tarayıcıda çalışan çalışma stüdyosu.

- C kodunu tarayıcı içinde Wasmer `clang` ile derler.
- Terminal çıktısını ve test sonucunu gösterir.
- Gemini veya Claude API key ile hata analizi alır.
- Pratik, rastgele soru ve sınav simülasyonu modları içerir.
- Kod, not, API key ve ilerleme sadece cihazdaki `localStorage` içinde kalır.

## Geliştirme

```bash
npm install
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
```

## Vercel

Vercel proje kökü olarak bu klasörü seç. `vercel.json`, Wasmer için gereken
`Cross-Origin-Opener-Policy` ve `Cross-Origin-Embedder-Policy` headerlarını ekler.
