import type { Exercise } from "./exerciseCatalog";
import { sourceReferences } from "./exerciseCatalog";

export type ExerciseGuide = {
  title: string;
  difficulty: "simple" | "standard" | "advanced";
  bestPractice: string;
  solution?: string;
  sourceLinks: Array<{ label: string; url: string }>;
};

const SIMPLE_WRITE_SOLUTIONS: Record<string, string> = {
  aff_a: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;

\ti = 0;
\tif (argc == 2)
\t{
\t\twhile (argv[1][i])
\t\t{
\t\t\tif (argv[1][i] == 'a')
\t\t\t{
\t\t\t\twrite(1, "a", 1);
\t\t\t\tbreak ;
\t\t\t}
\t\t\ti++;
\t\t}
\t}
\telse
\t\twrite(1, "a", 1);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
  aff_z: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;

\ti = 0;
\tif (argc == 2)
\t{
\t\twhile (argv[1][i])
\t\t{
\t\t\tif (argv[1][i] == 'z')
\t\t\t{
\t\t\t\twrite(1, "z", 1);
\t\t\t\tbreak ;
\t\t\t}
\t\t\ti++;
\t\t}
\t}
\telse
\t\twrite(1, "z", 1);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
  only_a: `#include <unistd.h>

int\tmain(void)
{
\twrite(1, "a", 1);
\treturn (0);
}`,
  only_z: `#include <unistd.h>

int\tmain(void)
{
\twrite(1, "z", 1);
\treturn (0);
}`,
  hello: `#include <unistd.h>

int\tmain(void)
{
\twrite(1, "Hello World!\\n", 13);
\treturn (0);
}`,
  ft_countdown: `#include <unistd.h>

int\tmain(void)
{
\twrite(1, "9876543210\\n", 11);
\treturn (0);
}`,
  ft_print_numbers: `#include <unistd.h>

void\tft_print_numbers(void)
{
\twrite(1, "0123456789", 10);
}`,
  maff_alpha: `#include <unistd.h>

int\tmain(void)
{
\twrite(1, "aBcDeFgHiJkLmNoPqRsTuVwXyZ\\n", 27);
\treturn (0);
}`,
  maff_revalpha: `#include <unistd.h>

int\tmain(void)
{
\twrite(1, "zYxWvUtSrQpOnMlKjIhGfEdCbA\\n", 27);
\treturn (0);
}`,
  aff_first_param: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;

\ti = 0;
\tif (argc > 1)
\t\twhile (argv[1][i])
\t\t\twrite(1, &argv[1][i++], 1);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
  aff_last_param: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;

\ti = 0;
\tif (argc > 1)
\t\twhile (argv[argc - 1][i])
\t\t\twrite(1, &argv[argc - 1][i++], 1);
\twrite(1, "\\n", 1);
\treturn (0);
}`,
  first_word: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;

\tif (argc == 2)
\t{
\t\ti = 0;
\t\twhile (argv[1][i] == ' ' || argv[1][i] == '\\t')
\t\t\ti++;
\t\twhile (argv[1][i] && argv[1][i] != ' ' && argv[1][i] != '\\t')
\t\t\twrite(1, &argv[1][i++], 1);
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
  rev_print: `#include <unistd.h>

int\tmain(int argc, char **argv)
{
\tint\ti;

\tif (argc == 2)
\t{
\t\ti = 0;
\t\twhile (argv[1][i])
\t\t\ti++;
\t\twhile (i > 0)
\t\t\twrite(1, &argv[1][--i], 1);
\t}
\twrite(1, "\\n", 1);
\treturn (0);
}`,
};

function sourceSearchLinks(exercise: Exercise): Array<{ label: string; url: string }> {
  const query = encodeURIComponent(`42 exam ${exercise.name} solution`);
  return [
    { label: "nigal çözüm dizini", url: "http://nigal.freeshell.org/42/exam-solutions/" },
    { label: "GitHub kaynak havuzu", url: "https://github.com/joaquim-oliveira-neto/42-Piscine-C-Exam" },
    { label: "Web'de bu soruyu ara", url: `https://www.google.com/search?q=${query}` },
    ...sourceReferences.slice(3, 5),
  ];
}

function inferDifficulty(exercise: Exercise): ExerciseGuide["difficulty"] {
  if (isSimplePractice(exercise)) return "simple";
  if (exercise.level >= 4 || exercise.allowedFunctions.includes("malloc")) return "advanced";
  return "standard";
}

export function isSimplePractice(exercise: Exercise): boolean {
  return exercise.allowedFunctions.trim() === "write" && exercise.level <= 1;
}

export function getExerciseGuide(exercise: Exercise): ExerciseGuide {
  const simple = isSimplePractice(exercise);
  const solution = SIMPLE_WRITE_SOLUTIONS[exercise.name];
  const bestPractice = simple
    ? [
      "Bu soru grubu için hedef: `argc` kontrolü, `argv` üzerinde güvenli dolaşma ve stdout'a sadece `write` ile çıktı verme.",
      "42 tarzında en az riskli akış: önce argüman sayısını kontrol et, sonra indeks değişkenini 0'dan başlat, döngü koşulunda `\\0` bitişini kullan, en sonda newline gerekip gerekmediğini subject'e göre ekle.",
      solution ? "Aşağıdaki örnek çözüm kısa ve test edilebilir bir referanstır; sınavda ezberlemek yerine akışı yeniden kurmaya çalış." : "Bu soru için gömülü çözüm yok; kaynak linklerinden birden fazla çözümü karşılaştır.",
    ].join("\n\n")
    : [
      "Önce subject'teki edge case'i belirle: argüman sayısı, boş string, negatif sayı, allocation hatası veya liste sonu.",
      "Sonra allowed functions listesini kısıt olarak kabul et; yasak helper veya standart fonksiyon kullanma.",
      "Çözümü tek büyük blok yerine küçük, test edilebilir adımlarla kur. Otomatik test yoksa terminal çıktısı ve AI analizi sadece yardımcı sinyal kabul edilmeli; subject önceliklidir.",
    ].join("\n\n");

  return {
    title: solution ? "Doğru yanıt / best practice" : "Best practice ve kaynaklar",
    difficulty: inferDifficulty(exercise),
    bestPractice,
    solution,
    sourceLinks: sourceSearchLinks(exercise),
  };
}
