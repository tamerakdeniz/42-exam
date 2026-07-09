import type { Exercise } from "./exerciseCatalog";

export type ProgramCase = {
  name: string;
  args?: string[];
  stdin?: string;
  expectedStdout: string;
};

export type TestPlan = {
  mode: "program" | "function" | "compile-only";
  cases?: ProgramCase[];
  harness?: string;
  expectedStdout?: string;
  supportFiles?: Record<string, string>;
  notes: string[];
};

const listHeader = `typedef struct s_list
{
\tstruct s_list *next;
\tvoid *data;
} t_list;
`;

const sortListHeader = `typedef struct s_list
{
\tint data;
\tstruct s_list *next;
} t_list;
`;

const programCases: Record<string, ProgramCase[]> = {
  aff_a: [
    { name: "tek argumanda a var", args: ["abc"], expectedStdout: "a\n" },
    { name: "tek argumanda a yok", args: ["zz sent le poney"], expectedStdout: "\n" },
    { name: "arguman yok", args: [], expectedStdout: "a\n" },
  ],
  aff_z: [
    { name: "tek argumanda z var", args: ["abczz"], expectedStdout: "z\n" },
    { name: "tek argumanda z yok", args: ["abc"], expectedStdout: "z\n" },
    { name: "arguman yok", args: [], expectedStdout: "z\n" },
  ],
  only_a: [{ name: "sadece a", expectedStdout: "a" }],
  only_z: [{ name: "sadece z", expectedStdout: "z" }],
  hello: [{ name: "hello world", expectedStdout: "Hello World!\n" }],
  ft_countdown: [{ name: "geri sayim", expectedStdout: "9876543210\n" }],
  maff_alpha: [{ name: "alternatif alfabe", expectedStdout: "aBcDeFgHiJkLmNoPqRsTuVwXyZ\n" }],
  maff_revalpha: [{ name: "ters alternatif alfabe", expectedStdout: "zYxWvUtSrQpOnMlKjIhGfEdCbA\n" }],
  aff_first_param: [
    { name: "ilk parametre", args: ["vincent", "mit", "l'ane"], expectedStdout: "vincent\n" },
    { name: "parametre yok", args: [], expectedStdout: "\n" },
  ],
  aff_last_param: [
    { name: "son parametre", args: ["zaz", "mange", "des", "chats"], expectedStdout: "chats\n" },
    { name: "parametre yok", args: [], expectedStdout: "\n" },
  ],
  repeat_alpha: [
    { name: "abc", args: ["abc"], expectedStdout: "abbccc\n" },
    { name: "karisik", args: ["a1Z"], expectedStdout: "a1ZZZZZZZZZZZZZZZZZZZZZZZZZZ\n" },
  ],
  search_and_replace: [
    { name: "basit degisim", args: ["Papache est un sabre", "a", "o"], expectedStdout: "Popoche est un sobre\n" },
    { name: "gecersiz parametre", args: ["abc", "ab", "x"], expectedStdout: "\n" },
  ],
  ulstr: [{ name: "case ters cevir", args: ["AbC zZ!"], expectedStdout: "aBc Zz!\n" }],
  rot_13: [{ name: "rot13", args: ["My horse is Amazing."], expectedStdout: "Zl ubefr vf Nznmvat.\n" }],
  rotone: [{ name: "rotone", args: ["abc xyz"], expectedStdout: "bcd yza\n" }],
  first_word: [
    { name: "ilk kelime", args: ["  \tHello  world"], expectedStdout: "Hello\n" },
    { name: "arguman yok", args: [], expectedStdout: "\n" },
  ],
  rev_print: [
    { name: "ters yazdir", args: ["abcde"], expectedStdout: "edcba\n" },
    { name: "arguman yok", args: [], expectedStdout: "\n" },
  ],
  last_word: [{ name: "son kelime", args: ["  lorem,ipsum  dolor sit amet  "], expectedStdout: "amet\n" }],
  alpha_mirror: [{ name: "ayna alfabe", args: ["abcXYZ!"], expectedStdout: "zyxCBA!\n" }],
  inter: [{ name: "kesisim", args: ["padinton", "paqefwtdjetyiytjneytjoeyjnejeyj"], expectedStdout: "padinto\n" }],
  union: [{ name: "birlesim", args: ["zpadinton", "paqefwtdjetyiytjneytjoeyjnejeyj"], expectedStdout: "zpadintoqefwjy\n" }],
  wdmatch: [
    { name: "alt dizi var", args: ["faya", "fgvvfdxcacpolhyghbreda"], expectedStdout: "faya\n" },
    { name: "alt dizi yok", args: ["faya", "fgvvfdxcacpolhyghbred"], expectedStdout: "\n" },
  ],
  do_op: [
    { name: "toplama", args: ["21", "+", "21"], expectedStdout: "42\n" },
    { name: "carpma", args: ["6", "*", "7"], expectedStdout: "42\n" },
  ],
  add_prime_sum: [
    { name: "5'e kadar asal toplami", args: ["5"], expectedStdout: "10\n" },
    { name: "gecersiz", args: ["-3"], expectedStdout: "0\n" },
  ],
  epur_str: [{ name: "bosluklari temizle", args: ["  See?   It's \t easy   "], expectedStdout: "See? It's easy\n" }],
  expand_str: [{ name: "uc bosluk", args: ["  See?   It's \t easy   "], expectedStdout: "See?   It's   easy\n" }],
  hidenp: [
    { name: "gizli dizi var", args: ["fgex.;", "tyf34gdgf;'ektufjhgdgex.;.;rtjynur6"], expectedStdout: "1\n" },
    { name: "gizli dizi yok", args: ["abc", "acb"], expectedStdout: "0\n" },
  ],
  paramsum: [{ name: "parametre sayisi", args: ["a", "b", "c"], expectedStdout: "3\n" }],
  pgcd: [{ name: "ebob", args: ["42", "10"], expectedStdout: "2\n" }],
  print_hex: [
    { name: "10 tabanindan hex", args: ["10"], expectedStdout: "a\n" },
    { name: "255 tabanindan hex", args: ["255"], expectedStdout: "ff\n" },
  ],
  str_capitalizer: [{ name: "kelime basi buyuk", args: ["a FiRSt LiTTlE TESt"], expectedStdout: "A First Little Test\n" }],
  rstr_capitalizer: [{ name: "kelime sonu buyuk", args: ["a FiRSt LiTTlE TESt"], expectedStdout: "A firsT littlE tesT\n" }],
  tab_mult: [{
    name: "9 carpim tablosu",
    args: ["9"],
    expectedStdout: "1 x 9 = 9\n2 x 9 = 18\n3 x 9 = 27\n4 x 9 = 36\n5 x 9 = 45\n6 x 9 = 54\n7 x 9 = 63\n8 x 9 = 72\n9 x 9 = 81\n",
  }],
  fprime: [
    { name: "asal carpanlar", args: ["225225"], expectedStdout: "3*3*5*5*7*11*13\n" },
    { name: "1", args: ["1"], expectedStdout: "1\n" },
  ],
  rev_wstr: [{ name: "kelime sirasini ters cevir", args: ["You hate people! But I love gatherings."], expectedStdout: "gatherings. love I But people! hate You\n" }],
  rostring: [{ name: "ilk kelime sona", args: ["abc   def \t ghi"], expectedStdout: "def ghi abc\n" }],
  brackets: [
    { name: "dogru parantez", args: ["([]){}"], expectedStdout: "OK\n" },
    { name: "yanlis parantez", args: ["([)]"], expectedStdout: "Error\n" },
  ],
  rpn_calc: [
    { name: "ters polonya", args: ["1 2 * 3 * 4 +"], expectedStdout: "10\n" },
    { name: "gecersiz ifade", args: ["1 2"], expectedStdout: "Error\n" },
  ],
};

const functionHarness: Record<string, Omit<TestPlan, "mode" | "notes">> = {
  ft_print_numbers: {
    harness: `#include "student.c"\nint main(void) { ft_print_numbers(); return 0; }\n`,
    expectedStdout: "0123456789",
  },
  ft_putstr: {
    harness: `#include "student.c"\nint main(void) { ft_putstr("Piscine"); ft_putstr(""); ft_putstr("42"); return 0; }\n`,
    expectedStdout: "Piscine42",
  },
  ft_strlen: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { printf("%d|%d|%d\\n", ft_strlen(""), ft_strlen("42"), ft_strlen("Piscine")); return 0; }\n`,
    expectedStdout: "0|2|7\n",
  },
  ft_strcpy: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { char dst[32]; char *ret = ft_strcpy(dst, "Piscine"); printf("%s|%d\\n", dst, ret == dst); return 0; }\n`,
    expectedStdout: "Piscine|1\n",
  },
  ft_swap: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { int a = 21; int b = 42; ft_swap(&a, &b); printf("%d|%d\\n", a, b); return 0; }\n`,
    expectedStdout: "42|21\n",
  },
  ft_atoi: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { printf("%d|%d|%d|%d\\n", ft_atoi("42"), ft_atoi("   -42abc"), ft_atoi("+0"), ft_atoi("2147483647")); return 0; }\n`,
    expectedStdout: "42|-42|0|2147483647\n",
  },
  ft_strdup: {
    harness: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include "student.c"\nint main(void) { char src[] = "Piscine"; char *dup = ft_strdup(src); printf("%s|%d|%d\\n", dup, dup != src, strcmp(dup, src)); free(dup); return 0; }\n`,
    expectedStdout: "Piscine|1|0\n",
  },
  ft_strcmp: {
    harness: `#include <stdio.h>\n#include "student.c"\nstatic int s(int n) { return (n > 0) - (n < 0); }\nint main(void) { printf("%d|%d|%d\\n", s(ft_strcmp("abc", "abc")), s(ft_strcmp("abc", "abd")), s(ft_strcmp("abd", "abc"))); return 0; }\n`,
    expectedStdout: "0|-1|1\n",
  },
  ft_strrev: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { char s1[] = "Piscine"; char s2[] = ""; printf("%s|", ft_strrev(s1)); printf("%s\\n", ft_strrev(s2)); return 0; }\n`,
    expectedStdout: "enicsiP|\n",
  },
  max: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { int a[] = {-4, 0, 42, 7}; int b[] = {-8, -3}; printf("%d|%d|%d\\n", max(a, 4), max(b, 2), max(a, 0)); return 0; }\n`,
    expectedStdout: "42|-3|0\n",
  },
  reverse_bits: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { printf("%u|%u\\n", reverse_bits(2), reverse_bits(0x80)); return 0; }\n`,
    expectedStdout: "64|1\n",
  },
  swap_bits: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { printf("%u|%u\\n", swap_bits(0xAB), swap_bits(0x42)); return 0; }\n`,
    expectedStdout: "186|36\n",
  },
  print_bits: {
    harness: `#include <unistd.h>\n#include "student.c"\nint main(void) { print_bits(2); write(1, "\\n", 1); print_bits(255); write(1, "\\n", 1); return 0; }\n`,
    expectedStdout: "00000010\n11111111\n",
  },
  is_power_of_2: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { printf("%d|%d|%d|%d|%d\\n", is_power_of_2(0), is_power_of_2(1), is_power_of_2(2), is_power_of_2(3), is_power_of_2(1024)); return 0; }\n`,
    expectedStdout: "0|1|1|0|1\n",
  },
  ft_atoi_base: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { printf("%d|%d|%d\\n", ft_atoi_base("ff", 16), ft_atoi_base("-101", 2), ft_atoi_base("7fffffff", 16)); return 0; }\n`,
    expectedStdout: "255|-5|2147483647\n",
  },
  ft_range: {
    harness: `#include <stdio.h>\n#include <stdlib.h>\n#include "student.c"\nstatic void dump(int *a, int n) { for (int i = 0; i < n; i++) printf("%d%s", a[i], i + 1 == n ? "" : ","); free(a); }\nint main(void) { dump(ft_range(1, 3), 3); printf("|"); dump(ft_range(3, 1), 3); printf("\\n"); return 0; }\n`,
    expectedStdout: "1,2,3|3,2,1\n",
  },
  ft_rrange: {
    harness: `#include <stdio.h>\n#include <stdlib.h>\n#include "student.c"\nstatic void dump(int *a, int n) { for (int i = 0; i < n; i++) printf("%d%s", a[i], i + 1 == n ? "" : ","); free(a); }\nint main(void) { dump(ft_rrange(1, 3), 3); printf("|"); dump(ft_rrange(3, 1), 3); printf("\\n"); return 0; }\n`,
    expectedStdout: "3,2,1|1,2,3\n",
  },
  lcm: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { printf("%u|%u|%u\\n", lcm(21, 6), lcm(0, 42), lcm(13, 17)); return 0; }\n`,
    expectedStdout: "42|0|221\n",
  },
  ft_itoa: {
    harness: `#include <stdio.h>\n#include <stdlib.h>\n#include "student.c"\nstatic void show(int n) { char *s = ft_itoa(n); printf("%s|", s); free(s); }\nint main(void) { show(0); show(-42); show(2147483647); char *s = ft_itoa(-2147483647 - 1); printf("%s\\n", s); free(s); return 0; }\n`,
    expectedStdout: "0|-42|2147483647|-2147483648\n",
  },
  ft_itoa_base: {
    harness: `#include <stdio.h>\n#include <stdlib.h>\n#include "student.c"\nstatic void show(int n, int b) { char *s = ft_itoa_base(n, b); printf("%s|", s); free(s); }\nint main(void) { show(42, 10); show(255, 16); char *s = ft_itoa_base(-5, 2); printf("%s\\n", s); free(s); return 0; }\n`,
    expectedStdout: "42|ff|-101\n",
  },
  ft_split: {
    harness: `#include <stdio.h>\n#include <stdlib.h>\n#include "student.c"\nint main(void) { char **w = ft_split("  hello\\t42\\nexam  "); for (int i = 0; w[i]; i++) { printf("%s%s", w[i], w[i + 1] ? "|" : ""); free(w[i]); } free(w); printf("\\n"); return 0; }\n`,
    expectedStdout: "hello|42|exam\n",
  },
  sort_int_tab: {
    harness: `#include <stdio.h>\n#include "student.c"\nint main(void) { int a[] = {4, -1, 0, 4, 2}; sort_int_tab(a, 5); for (int i = 0; i < 5; i++) printf("%d%s", a[i], i == 4 ? "\\n" : "|"); return 0; }\n`,
    expectedStdout: "-1|0|2|4|4\n",
  },
  ft_list_size: {
    supportFiles: { "ft_list.h": listHeader },
    harness: `#include <stdio.h>\n#include "ft_list.h"\n#include "student.c"\nint main(void) { t_list c = {0, "c"}; t_list b = {&c, "b"}; t_list a = {&b, "a"}; printf("%d|%d\\n", ft_list_size(&a), ft_list_size(0)); return 0; }\n`,
    expectedStdout: "3|0\n",
  },
  ft_list_foreach: {
    supportFiles: { "ft_list.h": listHeader },
    harness: `#include <stdio.h>\n#include "ft_list.h"\n#include "student.c"\nstatic void show(void *p) { printf("%s", (char *)p); }\nint main(void) { t_list c = {0, "c"}; t_list b = {&c, "b"}; t_list a = {&b, "a"}; ft_list_foreach(&a, show); printf("\\n"); return 0; }\n`,
    expectedStdout: "abc\n",
  },
  ft_list_remove_if: {
    supportFiles: { "ft_list.h": listHeader },
    harness: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include "ft_list.h"\n#include "student.c"\nstatic int cmp(void *a, void *b) { return strcmp((char *)a, (char *)b); }\nstatic t_list *node(char *s) { t_list *n = malloc(sizeof(t_list)); n->data = s; n->next = 0; return n; }\nint main(void) { t_list *a = node("x"); a->next = node("keep"); a->next->next = node("x"); ft_list_remove_if(&a, "x", cmp); for (t_list *p = a; p; p = p->next) printf("%s", (char *)p->data); printf("\\n"); return 0; }\n`,
    expectedStdout: "keep\n",
  },
  sort_list: {
    supportFiles: { "list.h": sortListHeader },
    harness: `#include <stdio.h>\n#include "list.h"\n#include "student.c"\nstatic int ascending(int a, int b) { return a <= b; }\nint main(void) { t_list c = {2, 0}; t_list b = {-1, &c}; t_list a = {4, &b}; t_list *p = sort_list(&a, ascending); while (p) { printf("%d%s", p->data, p->next ? "|" : ""); p = p->next; } printf("\\n"); return 0; }\n`,
    expectedStdout: "-1|2|4\n",
  },
};

const signatures: Record<string, string> = {
  ft_print_numbers: "void\tft_print_numbers(void)",
  ft_putstr: "void\tft_putstr(char *str)",
  ft_strlen: "int\tft_strlen(char *str)",
  ft_strcpy: "char\t*ft_strcpy(char *s1, char *s2)",
  ft_swap: "void\tft_swap(int *a, int *b)",
  ft_atoi: "int\tft_atoi(const char *str)",
  ft_strdup: "char\t*ft_strdup(char *src)",
  ft_strcmp: "int\tft_strcmp(char *s1, char *s2)",
  ft_strrev: "char\t*ft_strrev(char *str)",
  max: "int\tmax(int *tab, unsigned int len)",
  reverse_bits: "unsigned char\treverse_bits(unsigned char octet)",
  swap_bits: "unsigned char\tswap_bits(unsigned char octet)",
  print_bits: "void\tprint_bits(unsigned char octet)",
  is_power_of_2: "int\tis_power_of_2(unsigned int n)",
  ft_atoi_base: "int\tft_atoi_base(const char *str, int str_base)",
  ft_range: "int\t*ft_range(int start, int end)",
  ft_rrange: "int\t*ft_rrange(int start, int end)",
  lcm: "unsigned int\tlcm(unsigned int a, unsigned int b)",
  ft_itoa: "char\t*ft_itoa(int nbr)",
  ft_itoa_base: "char\t*ft_itoa_base(int value, int base)",
  ft_split: "char\t**ft_split(char *str)",
  sort_int_tab: "void\tsort_int_tab(int *tab, unsigned int size)",
  ft_list_size: "int\tft_list_size(t_list *begin_list)",
  ft_list_foreach: "void\tft_list_foreach(t_list *begin_list, void (*f)(void *))",
  ft_list_remove_if: "void\tft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)())",
  sort_list: "t_list\t*sort_list(t_list *lst, int (*cmp)(int, int))",
  print_memory: "void\tprint_memory(const void *addr, unsigned int size)",
};

export function getTestPlan(exercise: Exercise): TestPlan {
  const program = programCases[exercise.name];
  if (program) {
    return {
      mode: "program",
      cases: program,
      notes: ["Program argv ile calistirilir ve stdout birebir karsilastirilir."],
    };
  }

  const harness = functionHarness[exercise.name];
  if (harness) {
    return {
      mode: "function",
      ...harness,
      notes: ["Fonksiyon kodun test_runner.c icine include edilir; main yazmaman beklenir."],
    };
  }

  return {
    mode: "compile-only",
    notes: ["Bu ileri varyant icin otomatik beklenen cikti tanimli degil; derleme sonucu ve AI incelemesiyle ilerle."],
  };
}

export function getStarterCode(exercise: Exercise): string {
  const signature = signatures[exercise.name];
  if (signature) {
    const include = exercise.name.includes("list") ? `#include "${exercise.name === "sort_list" ? "list.h" : "ft_list.h"}"\n\n` : "";
    const fallbackReturn = signature.startsWith("void") ? "" : "\n\treturn (0);";
    return `${include}${signature}\n{\n\t${signature.startsWith("void") ? "(void)0;" : "/* kodunu buraya yaz */"}${fallbackReturn}\n}\n`;
  }

  return `#include <unistd.h>\n\nint\tmain(int argc, char **argv)\n{\n\t(void)argc;\n\t(void)argv;\n\treturn (0);\n}\n`;
}
