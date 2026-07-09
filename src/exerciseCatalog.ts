export type ExerciseKind = "program" | "function";

export type Exercise = {
  id: string;
  level: number;
  slot: string;
  name: string;
  expectedFiles: string;
  allowedFunctions: string;
  kind: ExerciseKind;
  tags: string[];
  subject: string;
  sourceUrl: string;
  sourceLabel: string;
};

export const sourceReferences = [
  { label: "nigal 42 C Beginner Exam Review", url: "http://nigal.freeshell.org/42/exam-review.php" },
  { label: "nigal example solutions", url: "http://nigal.freeshell.org/42/exam-solutions/" },
  { label: "joaquim-oliveira-neto/42-Piscine-C-Exam", url: "https://github.com/joaquim-oliveira-neto/42-Piscine-C-Exam" },
  { label: "waltergcc/42-Piscine Exams Practice", url: "https://github.com/waltergcc/42-Piscine/tree/main/Exams%20Practice" },
  { label: "juliecarra/42-c-piscine", url: "https://github.com/juliecarra/42-c-piscine" },
  { label: "meteulken/42-piscine", url: "https://github.com/meteulken/42-piscine" },
  { label: "Ogubenn/42-Piscine", url: "https://github.com/Ogubenn/42-Piscine" },
] as const;

export const exercises = [
  {
    "id": "0-0-aff-a",
    "level": 0,
    "slot": "0",
    "name": "aff_a",
    "expectedFiles": "aff_a.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : aff_a\nExpected files   : aff_a.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string, and displays the first 'a' character it\nencounters in it, followed by a newline. If there are no 'a' characters in the\nstring, the program just writes a newline. If the number of parameters is not\n1, the program displays 'a' followed by a newline.\n\nExample:\n\n$> ./aff_a \"abc\" | cat -e\na$\n$> ./aff_a \"dubO a POIL\" | cat -e\na$\n$> ./aff_a \"zz sent le poney\" | cat -e\n$\n$> ./aff_a | cat -e\na$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-0-ft-countdown",
    "level": 0,
    "slot": "0",
    "name": "ft_countdown",
    "expectedFiles": "ft_countdown.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : ft_countdown\nExpected files   : ft_countdown.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that displays all digits in descending order, followed by a\nnewline.\n\nExample:\n$> ./ft_countdown | cat -e\n9876543210$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-0-ft-print-numbers",
    "level": 0,
    "slot": "0",
    "name": "ft_print_numbers",
    "expectedFiles": "ft_print_numbers.c",
    "allowedFunctions": "write",
    "kind": "function",
    "tags": [
      "function"
    ],
    "subject": "Assignment name  : ft_print_numbers\nExpected files   : ft_print_numbers.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a function that displays all digits in ascending order.\n\nYour function must be declared as follows:\n\nvoid\tft_print_numbers(void);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-0-hello",
    "level": 0,
    "slot": "0",
    "name": "hello",
    "expectedFiles": "hello.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : hello\nExpected files   : hello.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that displays \"Hello World!\" followed by a \\n.\n\nExample:\n\n$>./hello\nHello World!\n$>./hello | cat -e\nHello World!$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-0-maff-alpha",
    "level": 0,
    "slot": "0",
    "name": "maff_alpha",
    "expectedFiles": "maff_alpha.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : maff_alpha\nExpected files   : maff_alpha.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that displays the alphabet, with even letters in uppercase, and\nodd letters in lowercase, followed by a newline.\n\nExample:\n\n$> ./maff_alpha | cat -e\naBcDeFgHiJkLmNoPqRsTuVwXyZ$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-1-aff-first-param",
    "level": 0,
    "slot": "1",
    "name": "aff_first_param",
    "expectedFiles": "aff_first_param.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : aff_first_param\nExpected files   : aff_first_param.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes strings as arguments, and displays its first\nargument followed by a \\n.\n\nIf the number of arguments is less than 1, the program displays \\n.\n\nExample:\n\n$> ./aff_first_param vincent mit \"l'ane\" dans un pre et \"s'en\" vint | cat -e\nvincent$\n$> ./aff_first_param \"j'aime le fromage de chevre\" | cat -e\nj'aime le fromage de chevre$\n$> ./aff_first_param\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-1-aff-last-param",
    "level": 0,
    "slot": "1",
    "name": "aff_last_param",
    "expectedFiles": "aff_last_param.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : aff_last_param\nExpected files   : aff_last_param.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes strings as arguments, and displays its last\nargument followed by a newline.\n\nIf the number of arguments is less than 1, the program displays a newline.\n\nExamples:\n\n$> ./aff_last_param \"zaz\" \"mange\" \"des\" \"chats\" | cat -e\nchats$\n$> ./aff_last_param \"j'aime le savon\" | cat -e\nj'aime le savon$\n$> ./aff_last_param\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-1-maff-revalpha",
    "level": 0,
    "slot": "1",
    "name": "maff_revalpha",
    "expectedFiles": "maff_revalpha.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : maff_revalpha\nExpected files   : maff_revalpha.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that displays the alphabet in reverse, with even letters in\nuppercase, and odd letters in lowercase, followed by a newline.\n\nExample:\n\n$> ./maff_revalpha | cat -e\nzYxWvUtSrQpOnMlKjIhGfEdCbA$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-1-only-a",
    "level": 0,
    "slot": "1",
    "name": "only_a",
    "expectedFiles": "only_a.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : only_a\nExpected files   : only_a.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that displays a 'a' character on the standard output.",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-1-only-z",
    "level": 0,
    "slot": "1",
    "name": "only_z",
    "expectedFiles": "only_z.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : only_z\nExpected files   : only_z.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that displays a 'z' character on the standard output.",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "0-2-aff-z",
    "level": 0,
    "slot": "2",
    "name": "aff_z",
    "expectedFiles": "aff_z.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : aff_z\nExpected files   : aff_z.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string, and displays the first 'z'\ncharacter it encounters in it, followed by a newline. If there are no\n'z' characters in the string, the program writes 'z' followed\nby a newline. If the number of parameters is not 1, the program displays\n'z' followed by a newline.\n\nExample:\n\n$> ./aff_z \"abc\" | cat -e\nz$\n$> ./aff_z \"dubO a POIL\" | cat -e\nz$\n$> ./aff_z \"zaz sent le poney\" | cat -e\nz$\n$> ./aff_z | cat -e\nz$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-0-ft-strcpy",
    "level": 1,
    "slot": "0",
    "name": "ft_strcpy",
    "expectedFiles": "ft_strcpy.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "string",
      "function"
    ],
    "subject": "Assignment name  : ft_strcpy\nExpected files   : ft_strcpy.c\nAllowed functions: \n--------------------------------------------------------------------------------\n\nReproduce the behavior of the function strcpy (man strcpy).\n\nYour function must be declared as follows:\n\nchar    *ft_strcpy(char *s1, char *s2);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-0-ft-strlen",
    "level": 1,
    "slot": "0",
    "name": "ft_strlen",
    "expectedFiles": "ft_strlen.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "string",
      "function"
    ],
    "subject": "Assignment name  : ft_strlen\nExpected files   : ft_strlen.c\nAllowed functions: \n--------------------------------------------------------------------------------\n\nWrite a function that returns the length of a string.\n\nYour function must be declared as follows:\n\nint\tft_strlen(char *str);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-0-repeat-alpha",
    "level": 1,
    "slot": "0",
    "name": "repeat_alpha",
    "expectedFiles": "repeat_alpha.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : repeat_alpha\nExpected files   : repeat_alpha.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program called repeat_alpha that takes a string and display it\nrepeating each alphabetical character as many times as its alphabetical index,\nfollowed by a newline.\n\n'a' becomes 'a', 'b' becomes 'bb', 'e' becomes 'eeeee', etc...\n\nCase remains unchanged.\n\nIf the number of arguments is not 1, just display a newline.\n\nExamples:\n\n$>./repeat_alpha \"abc\"\nabbccc\n$>./repeat_alpha \"Alex.\" | cat -e\nAlllllllllllleeeeexxxxxxxxxxxxxxxxxxxxxxxx.$\n$>./repeat_alpha 'abacadaba 42!' | cat -e\nabbacccaddddabba 42!$\n$>./repeat_alpha | cat -e\n$\n$>\n$>./repeat_alpha \"\" | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-0-search-and-replace",
    "level": 1,
    "slot": "0",
    "name": "search_and_replace",
    "expectedFiles": "search_and_replace.c",
    "allowedFunctions": "write, exit",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : search_and_replace\nExpected files   : search_and_replace.c\nAllowed functions: write, exit\n--------------------------------------------------------------------------------\n\nWrite a program called search_and_replace that takes 3 arguments, the first \narguments is a string in which to replace a letter (2nd argument) by\nanother one (3rd argument).\n\nIf the number of arguments is not 3, just display a newline.\n\nIf the second argument is not contained in the first one (the string)\nthen the program simply rewrites the string followed by a newline.\n\nExamples:\n$>./search_and_replace \"Papache est un sabre\" \"a\" \"o\"\nPopoche est un sobre\n$>./search_and_replace \"zaz\" \"art\" \"zul\" | cat -e\n$\n$>./search_and_replace \"zaz\" \"r\" \"u\" | cat -e\nzaz$\n$>./search_and_replace \"jacob\" \"a\" \"b\" \"c\" \"e\" | cat -e\n$\n$>./search_and_replace \"ZoZ eT Dovid oiME le METol.\" \"o\" \"a\" | cat -e\nZaZ eT David aiME le METal.$\n$>./search_and_replace \"wNcOre Un ExEmPle Pas Facilw a Ecrirw \" \"w\" \"e\" | cat -e\neNcOre Un ExEmPle Pas Facile a Ecrire $",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-0-ulstr",
    "level": 1,
    "slot": "0",
    "name": "ulstr",
    "expectedFiles": "ulstr.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : ulstr\nExpected files   : ulstr.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string and reverses the case of all its letters.\nOther characters remain unchanged.\n\nYou must display the result followed by a '\\n'.\n\nIf the number of arguments is not 1, the program displays '\\n'.\n\nExamples :\n\n$>./ulstr \"L'eSPrit nE peUt plUs pRogResSer s'Il staGne et sI peRsIsTent VAnIte et auto-justification.\" | cat -e\nl'EspRIT Ne PEuT PLuS PrOGrESsER S'iL STAgNE ET Si PErSiStENT vaNiTE ET AUTO-JUSTIFICATION.$\n$>./ulstr \"S'enTOuRer dE sECreT eSt uN sIGnE De mAnQuE De coNNaiSSanCe.  \" | cat -e\ns'ENtoUrER De SecREt EsT Un SigNe dE MaNqUe dE COnnAIssANcE.  $\n$>./ulstr \"3:21 Ba  tOut  moUn ki Ka di KE m'en Ka fe fot\" | cat -e\n3:21 bA  ToUT  MOuN KI kA DI ke M'EN kA FE FOT$\n$>./ulstr | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-1-rot-13",
    "level": 1,
    "slot": "1",
    "name": "rot_13",
    "expectedFiles": "rot_13.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : rot_13\nExpected files   : rot_13.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string and displays it, replacing each of its\nletters by the letter 13 spaces ahead in alphabetical order.\n\n'z' becomes 'm' and 'Z' becomes 'M'. Case remains unaffected.\n\nThe output will be followed by a newline.\n\nIf the number of arguments is not 1, the program displays a newline.\n\nExample:\n\n$>./rot_13 \"abc\"\nnop\n$>./rot_13 \"My horse is Amazing.\" | cat -e\nZl ubefr vf Nznmvat.$\n$>./rot_13 \"AkjhZ zLKIJz , 23y \" | cat -e\nNxwuM mYXVWm , 23l $\n$>./rot_13 | cat -e\n$\n$>\n$>./rot_13 \"\" | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-2-first-word",
    "level": 1,
    "slot": "2",
    "name": "first_word",
    "expectedFiles": "first_word.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : first_word\nExpected files   : first_word.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string and displays its first word, followed by a\nnewline.\n\nA word is a section of string delimited by spaces/tabs or by the start/end of\nthe string.\n\nIf the number of parameters is not 1, or if there are no words, simply display\na newline.\n\nExamples:\n\n$> ./first_word \"FOR PONY\" | cat -e\nFOR$\n$> ./first_word \"this        ...       is sparta, then again, maybe    not\" | cat -e\nthis$\n$> ./first_word \"   \" | cat -e\n$\n$> ./first_word \"a\" \"b\" | cat -e\n$\n$> ./first_word \"  lorem,ipsum  \" | cat -e\nlorem,ipsum$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-2-ft-putstr",
    "level": 1,
    "slot": "2",
    "name": "ft_putstr",
    "expectedFiles": "ft_putstr.c",
    "allowedFunctions": "write",
    "kind": "function",
    "tags": [
      "string",
      "function"
    ],
    "subject": "Assignment name  : ft_putstr\nExpected files   : ft_putstr.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a function that displays a string on the standard output.\n\nThe pointer passed to the function contains the address of the string's first\ncharacter.\n\nYour function must be declared as follows:\n\nvoid\tft_putstr(char *str);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-2-ft-swap",
    "level": 1,
    "slot": "2",
    "name": "ft_swap",
    "expectedFiles": "ft_swap.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "function"
    ],
    "subject": "Assignment name  : ft_swap\nExpected files   : ft_swap.c\nAllowed functions: \n--------------------------------------------------------------------------------\n\nWrite a function that swaps the contents of two integers the adresses of which\nare passed as parameters.\n\nYour function must be declared as follows:\n\nvoid\tft_swap(int *a, int *b);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-3-first-word",
    "level": 1,
    "slot": "3",
    "name": "first_word",
    "expectedFiles": "first_word.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : first_word\nExpected files   : first_word.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string and displays its first word, followed by a\nnewline.\n\nA word is a section of string delimited by spaces/tabs or by the start/end of\nthe string.\n\nIf the number of parameters is not 1, or if there are no words, simply display\na newline.\n\nExamples:\n\n$> ./first_word \"FOR PONY\" | cat -e\nFOR$\n$> ./first_word \"this        ...       is sparta, then again, maybe    not\" | cat -e\nthis$\n$> ./first_word \"   \" | cat -e\n$\n$> ./first_word \"a\" \"b\" | cat -e\n$\n$> ./first_word \"  lorem,ipsum  \" | cat -e\nlorem,ipsum$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-3-rev-print",
    "level": 1,
    "slot": "3",
    "name": "rev_print",
    "expectedFiles": "rev_print.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : rev_print\nExpected files   : rev_print.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string, and displays the string in reverse\nfollowed by a newline.\n\nIf the number of parameters is not 1, the program displays a newline.\n\nExamples:\n\n$> ./rev_print \"zaz\" | cat -e\nzaz$\n$> ./rev_print \"dub0 a POIL\" | cat -e\nLIOP a 0bud$\n$> ./rev_print | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "1-4-rotone",
    "level": 1,
    "slot": "4",
    "name": "rotone",
    "expectedFiles": "rotone.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : rotone\nExpected files   : rotone.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string and displays it, replacing each of its\nletters by the next one in alphabetical order.\n\n'z' becomes 'a' and 'Z' becomes 'A'. Case remains unaffected.\n\nThe output will be followed by a \\n.\n\nIf the number of arguments is not 1, the program displays \\n.\n\nExample:\n\n$>./rotone \"abc\"\nbcd\n$>./rotone \"Les stagiaires du staff ne sentent pas toujours tres bon.\" | cat -e\nMft tubhjbjsft ev tubgg of tfoufou qbt upvkpvst usft cpo.$\n$>./rotone \"AkjhZ zLKIJz , 23y \" | cat -e\nBlkiA aMLJKa , 23z $\n$>./rotone | cat -e\n$\n$>\n$>./rotone \"\" | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-0-ft-atoi",
    "level": 2,
    "slot": "0",
    "name": "ft_atoi",
    "expectedFiles": "ft_atoi.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "string",
      "function"
    ],
    "subject": "Assignment name  : ft_atoi\nExpected files   : ft_atoi.c\nAllowed functions: None\n--------------------------------------------------------------------------------\n\nWrite a function that converts the string argument str to an integer (type int)\nand returns it.\n\nIt works much like the standard atoi(const char *str) function, see the man.\n\nYour function must be declared as follows:\n\nint\tft_atoi(const char *str);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-0-ft-strdup",
    "level": 2,
    "slot": "0",
    "name": "ft_strdup",
    "expectedFiles": "ft_strdup.c",
    "allowedFunctions": "malloc",
    "kind": "function",
    "tags": [
      "string",
      "memory",
      "function"
    ],
    "subject": "Assignment name  : ft_strdup\nExpected files   : ft_strdup.c\nAllowed functions: malloc\n--------------------------------------------------------------------------------\n\nReproduce the behavior of the function strdup (man strdup).\n\nYour function must be declared as follows:\n\nchar    *ft_strdup(char *src);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-0-inter",
    "level": 2,
    "slot": "0",
    "name": "inter",
    "expectedFiles": "inter.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : inter\nExpected files   : inter.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes two strings and displays, without doubles, the\ncharacters that appear in both strings, in the order they appear in the first\none.\n\nThe display will be followed by a \\n.\n\nIf the number of arguments is not 2, the program displays \\n.\n\nExamples:\n\n$>./inter \"padinton\" \"paqefwtdjetyiytjneytjoeyjnejeyj\" | cat -e\npadinto$\n$>./inter ddf6vewg64f gtwthgdwthdwfteewhrtag6h4ffdhsd | cat -e\ndf6ewg4$\n$>./inter \"rien\" \"cette phrase ne cache rien\" | cat -e\nrien$\n$>./inter | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-0-last-word",
    "level": 2,
    "slot": "0",
    "name": "last_word",
    "expectedFiles": "last_word.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : last_word\nExpected files   : last_word.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string and displays its last word followed by a \\n.\n\nA word is a section of string delimited by spaces/tabs or by the start/end of\nthe string.\n\nIf the number of parameters is not 1, or there are no words, display a newline.\n\nExample:\n\n$> ./last_word \"FOR PONY\" | cat -e\nPONY$\n$> ./last_word \"this        ...       is sparta, then again, maybe    not\" | cat -e\nnot$\n$> ./last_word \"   \" | cat -e\n$\n$> ./last_word \"a\" \"b\" | cat -e\n$\n$> ./last_word \"  lorem,ipsum  \" | cat -e\nlorem,ipsum$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-0-reverse-bits",
    "level": 2,
    "slot": "0",
    "name": "reverse_bits",
    "expectedFiles": "reverse_bits.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "bits",
      "function"
    ],
    "subject": "Assignment name  : reverse_bits\nExpected files   : reverse_bits.c\nAllowed functions:\n--------------------------------------------------------------------------------\n\nWrite a function that takes a byte, reverses it, bit by bit (like the\nexample) and returns the result.\n\nYour function must be declared as follows:\n\nunsigned char\treverse_bits(unsigned char octet);\n\nExample:\n\n  1 byte\n_____________\n 0010  0110\n\t ||\n\t \\/\n 0110  0100",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-0-swap-bits",
    "level": 2,
    "slot": "0",
    "name": "swap_bits",
    "expectedFiles": "swap_bits.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "bits",
      "function"
    ],
    "subject": "Assignment name  : swap_bits\nExpected files   : swap_bits.c\nAllowed functions:\n--------------------------------------------------------------------------------\n\nWrite a function that takes a byte, swaps its halves (like the example) and\nreturns the result.\n\nYour function must be declared as follows:\n\nunsigned char\tswap_bits(unsigned char octet);\n\nExample:\n\n  1 byte\n_____________\n 0100 | 0001\n     \\ /\n     / \\\n 0001 | 0100",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-0-union",
    "level": 2,
    "slot": "0",
    "name": "union",
    "expectedFiles": "union.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : union\nExpected files   : union.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes two strings and displays, without doubles, the\ncharacters that appear in either one of the strings.\n\nThe display will be in the order characters appear in the command line, and\nwill be followed by a \\n.\n\nIf the number of arguments is not 2, the program displays \\n.\n\nExample:\n\n$>./union zpadinton \"paqefwtdjetyiytjneytjoeyjnejeyj\" | cat -e\nzpadintoqefwjy$\n$>./union ddf6vewg64f gtwthgdwthdwfteewhrtag6h4ffdhsd | cat -e\ndf6vewg4thras$\n$>./union \"rien\" \"cette phrase ne cache rien\" | cat -e\nrienct phas$\n$>./union | cat -e\n$\n$>\n$>./union \"rien\" | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-1-alpha-mirror",
    "level": 2,
    "slot": "1",
    "name": "alpha_mirror",
    "expectedFiles": "alpha_mirror.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : alpha_mirror\nExpected files   : alpha_mirror.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program called alpha_mirror that takes a string and displays this string\nafter replacing each alphabetical character by the opposite alphabetical\ncharacter, followed by a newline.\n\n'a' becomes 'z', 'Z' becomes 'A'\n'd' becomes 'w', 'M' becomes 'N'\n\nand so on.\n\nCase is not changed.\n\nIf the number of arguments is not 1, display only a newline.\n\nExamples:\n\n$>./alpha_mirror \"abc\"\nzyx\n$>./alpha_mirror \"My horse is Amazing.\" | cat -e\nNb slihv rh Znzarmt.$\n$>./alpha_mirror | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-1-max",
    "level": 2,
    "slot": "1",
    "name": "max",
    "expectedFiles": "max.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "function"
    ],
    "subject": "Assignment name  : max\nExpected files   : max.c\nAllowed functions: \n--------------------------------------------------------------------------------\n\nWrite the following function:\n\nint\t\tmax(int* tab, unsigned int len);\n\nThe first parameter is an array of int, the second is the number of elements in\nthe array.\n\nThe function returns the largest number found in the array.\n\nIf the array is empty, the function returns 0.",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-3-wdmatch",
    "level": 2,
    "slot": "3",
    "name": "wdmatch",
    "expectedFiles": "wdmatch.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : wdmatch\nExpected files   : wdmatch.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes two strings and checks whether it's possible to\nwrite the first string with characters from the second string, while respecting\nthe order in which these characters appear in the second string.\n\nIf it's possible, the program displays the string, followed by a \\n, otherwise\nit simply displays a \\n.\n\nIf the number of arguments is not 2, the program displays a \\n.\n\nExamples:\n\n$>./wdmatch \"faya\" \"fgvvfdxcacpolhyghbreda\" | cat -e\nfaya$\n$>./wdmatch \"faya\" \"fgvvfdxcacpolhyghbred\" | cat -e\n$\n$>./wdmatch \"quarante deux\" \"qfqfsudf arzgsayns tsregfdgs sjytdekuoixq \" | cat -e\nquarante deux$\n$>./wdmatch \"error\" rrerrrfiiljdfxjyuifrrvcoojh | cat -e\n$\n$>./wdmatch | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-4-do-op",
    "level": 2,
    "slot": "4",
    "name": "do_op",
    "expectedFiles": "*.c, *.h",
    "allowedFunctions": "atoi, printf, write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : do_op\nExpected files   : *.c, *.h\nAllowed functions: atoi, printf, write\n--------------------------------------------------------------------------------\n\nWrite a program that takes three strings:\n- The first and the third one are representations of base-10 signed integers\n  that fit in an int.\n- The second one is an arithmetic operator chosen from: + - * / %\n\nThe program must display the result of the requested arithmetic operation,\nfollowed by a newline. If the number of parameters is not 3, the program\njust displays a newline.\n\nYou can assume the string have no mistakes or extraneous characters. Negative\nnumbers, in input or output, will have one and only one leading '-'. The\nresult of the operation fits in an int.\n\nExamples:\n\n$> ./do_op \"123\" \"*\" 456 | cat -e\n56088$\n$> ./do_op \"9828\" \"/\" 234 | cat -e\n42$\n$> ./do_op \"1\" \"+\" \"-43\" | cat -e\n-42$\n$> ./do_op | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-4-print-bits",
    "level": 2,
    "slot": "4",
    "name": "print_bits",
    "expectedFiles": "print_bits.c",
    "allowedFunctions": "write",
    "kind": "function",
    "tags": [
      "bits",
      "function"
    ],
    "subject": "Assignment name  : print_bits\nExpected files   : print_bits.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a function that takes a byte, and prints it in binary WITHOUT A NEWLINE\nAT THE END.\n\nYour function must be declared as follows:\n\nvoid\tprint_bits(unsigned char octet);\n\nExample, if you pass 2 to print_bits, it will print \"00000010\"",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-5-ft-strcmp",
    "level": 2,
    "slot": "5",
    "name": "ft_strcmp",
    "expectedFiles": "ft_strcmp.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "string",
      "function"
    ],
    "subject": "Assignment name  : ft_strcmp\nExpected files   : ft_strcmp.c\nAllowed functions: \n--------------------------------------------------------------------------------\n\nReproduce the behavior of the function strcmp (man strcmp).\n\nYour function must be declared as follows:\n\nint    ft_strcmp(char *s1, char *s2);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-5-ft-strrev",
    "level": 2,
    "slot": "5",
    "name": "ft_strrev",
    "expectedFiles": "ft_strrev.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "string",
      "function"
    ],
    "subject": "Assignment name  : ft_strrev\nExpected files   : ft_strrev.c\nAllowed functions: \n--------------------------------------------------------------------------------\n\nWrite a function that reverses (in-place) a string.\n\nIt must return its parameter.\n\nYour function must be declared as follows:\n\nchar    *ft_strrev(char *str);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "2-6-is-power-of-2",
    "level": 2,
    "slot": "6",
    "name": "is_power_of_2",
    "expectedFiles": "is_power_of_2.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "function"
    ],
    "subject": "Assignment name  : is_power_of_2\nExpected files   : is_power_of_2.c\nAllowed functions: None\n--------------------------------------------------------------------------------\n\nWrite a function that determines if a given number is a power of 2.\n\nThis function returns 1 if the given number is a power of 2, otherwise it returns 0.\n\nYour function must be declared as follows:\n\nint\t    is_power_of_2(unsigned int n);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-0-add-prime-sum",
    "level": 3,
    "slot": "0",
    "name": "add_prime_sum",
    "expectedFiles": "add_prime_sum.c",
    "allowedFunctions": "write, exit",
    "kind": "program",
    "tags": [
      "math",
      "argv"
    ],
    "subject": "Assignment name  : add_prime_sum\nExpected files   : add_prime_sum.c\nAllowed functions: write, exit\n--------------------------------------------------------------------------------\n\nWrite a program that takes a positive integer as argument and displays the sum\nof all prime numbers inferior or equal to it followed by a newline.\n\nIf the number of arguments is not 1, or the argument is not a positive number,\njust display 0 followed by a newline.\n\nYes, the examples are right.\n\nExamples:\n\n$>./add_prime_sum 5\n10\n$>./add_prime_sum 7 | cat -e\n17$\n$>./add_prime_sum | cat -e\n0$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-0-epur-str",
    "level": 3,
    "slot": "0",
    "name": "epur_str",
    "expectedFiles": "epur_str.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : epur_str\nExpected files   : epur_str.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string, and displays this string with exactly one\nspace between words, with no spaces or tabs either at the beginning or the end,\nfollowed by a \\n.\n\nA \"word\" is defined as a part of a string delimited either by spaces/tabs, or\nby the start/end of the string.\n\nIf the number of arguments is not 1, or if there are no words to display, the\nprogram displays \\n.\n\nExample:\n\n$> ./epur_str \"vous voyez c'est facile d'afficher la meme chose\" | cat -e\nvous voyez c'est facile d'afficher la meme chose$\n$> ./epur_str \" seulement          la c'est      plus dur \" | cat -e\nseulement la c'est plus dur$\n$> ./epur_str \"comme c'est cocasse\" \"vous avez entendu, Mathilde ?\" | cat -e\n$\n$> ./epur_str \"\" | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-0-ft-list-size",
    "level": 3,
    "slot": "0",
    "name": "ft_list_size",
    "expectedFiles": "ft_list_size.c, ft_list.h",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "list",
      "function"
    ],
    "subject": "Assignment name  : ft_list_size\nExpected files   : ft_list_size.c, ft_list.h\nAllowed functions: \n--------------------------------------------------------------------------------\n\nWrite a function that returns the number of elements in the linked list that's\npassed to it.\n\nIt must be declared as follows:\n\nint\tft_list_size(t_list *begin_list);\n\nYou must use the following structure, and turn it in as a file called\nft_list.h:\n\ntypedef struct    s_list\n{\n    struct s_list *next;\n    void          *data;\n}                 t_list;",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-0-ft-rrange",
    "level": 3,
    "slot": "0",
    "name": "ft_rrange",
    "expectedFiles": "ft_rrange.c",
    "allowedFunctions": "malloc",
    "kind": "function",
    "tags": [
      "memory",
      "function"
    ],
    "subject": "Assignment name  : ft_rrange\nExpected files   : ft_rrange.c\nAllowed functions: malloc\n--------------------------------------------------------------------------------\n\nWrite the following function:\n\nint     *ft_rrange(int start, int end);\n\nIt must allocate (with malloc()) an array of integers, fill it with consecutive\nvalues that begin at end and end at start (Including start and end !), then\nreturn a pointer to the first value of the array.\n\nExamples:\n\n- With (1, 3) you will return an array containing 3, 2 and 1\n- With (-1, 2) you will return an array containing 2, 1, 0 and -1.\n- With (0, 0) you will return an array containing 0.\n- With (0, -3) you will return an array containing -3, -2, -1 and 0.",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-0-hidenp",
    "level": 3,
    "slot": "0",
    "name": "hidenp",
    "expectedFiles": "hidenp.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : hidenp\nExpected files   : hidenp.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program named hidenp that takes two strings and displays 1\nfollowed by a newline if the first string is hidden in the second one,\notherwise displays 0 followed by a newline.\n\nLet s1 and s2 be strings. We say that s1 is hidden in s2 if it's possible to\nfind each character from s1 in s2, in the same order as they appear in s1.\nAlso, the empty string is hidden in any string.\n\nIf the number of parameters is not 2, the program displays a newline.\n\nExamples :\n\n$>./hidenp \"fgex.;\" \"tyf34gdgf;'ektufjhgdgex.;.;rtjynur6\" | cat -e\n1$\n$>./hidenp \"abc\" \"2altrb53c.sse\" | cat -e\n1$\n$>./hidenp \"abc\" \"btarc\" | cat -e\n0$\n$>./hidenp | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-0-pgcd",
    "level": 3,
    "slot": "0",
    "name": "pgcd",
    "expectedFiles": "pgcd.c",
    "allowedFunctions": "printf, atoi, malloc, free",
    "kind": "program",
    "tags": [
      "string",
      "memory",
      "math",
      "argv"
    ],
    "subject": "Assignment name  : pgcd\nExpected files   : pgcd.c\nAllowed functions: printf, atoi, malloc, free\n--------------------------------------------------------------------------------\n\nWrite a program that takes two strings representing two strictly positive\nintegers that fit in an int.\n\nDisplay their highest common denominator followed by a newline (It's always a\nstrictly positive integer).\n\nIf the number of parameters is not 2, display a newline.\n\nExamples:\n\n$> ./pgcd 42 10 | cat -e\n2$\n$> ./pgcd 42 12 | cat -e\n6$\n$> ./pgcd 14 77 | cat -e\n7$\n$> ./pgcd 17 3 | cat -e \n1$\n$> ./pgcd | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-0-print-hex",
    "level": 3,
    "slot": "0",
    "name": "print_hex",
    "expectedFiles": "print_hex.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : print_hex\nExpected files   : print_hex.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a positive (or zero) number expressed in base 10,\nand displays it in base 16 (lowercase letters) followed by a newline.\n\nIf the number of parameters is not 1, the program displays a newline.\n\nExamples:\n\n$> ./print_hex \"10\" | cat -e\na$\n$> ./print_hex \"255\" | cat -e\nff$\n$> ./print_hex \"5156454\" | cat -e\n4eae66$\n$> ./print_hex | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-0-rstr-capitalizer",
    "level": 3,
    "slot": "0",
    "name": "rstr_capitalizer",
    "expectedFiles": "rstr_capitalizer.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : rstr_capitalizer\nExpected files   : rstr_capitalizer.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes one or more strings and, for each argument, puts \nthe last character of each word (if it's a letter) in uppercase and the rest\nin lowercase, then displays the result followed by a \\n.\n\nA word is a section of string delimited by spaces/tabs or the start/end of the\nstring. If a word has a single letter, it must be capitalized.\n\nIf there are no parameters, display \\n.\n\nExamples:\n\n$> ./rstr_capitalizer | cat -e\n$\n$> ./rstr_capitalizer \"Premier PETIT TesT\" | cat -e\npremieR petiT tesT$\n$> ./rstr_capitalizer \"DeuxiEmE tEST uN PEU moinS  facile\" \"   attention C'EST pas dur QUAND mEmE\" \"ALLer UN DeRNier 0123456789pour LA rouTE    E \" | cat -e\ndeuxiemE tesT uN peU moinS  facilE$\n   attentioN c'esT paS duR quanD memE$\nalleR uN dernieR 0123456789pouR lA routE    E $\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-1-expand-str",
    "level": 3,
    "slot": "1",
    "name": "expand_str",
    "expectedFiles": "expand_str.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : expand_str\nExpected files   : expand_str.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string and displays it with exactly three spaces\nbetween each word, with no spaces or tabs either at the beginning or the end,\nfollowed by a newline.\n\nA word is a section of string delimited either by spaces/tabs, or by the\nstart/end of the string.\n\nIf the number of parameters is not 1, or if there are no words, simply display\na newline.\n\nExamples:\n\n$> ./expand_str \"vous   voyez   c'est   facile   d'afficher   la   meme   chose\" | cat -e\nvous   voyez   c'est   facile   d'afficher   la   meme   chose$\n$> ./expand_str \" seulement          la c'est      plus dur \" | cat -e\nseulement   la   c'est   plus   dur$\n$> ./expand_str \"comme c'est cocasse\" \"vous avez entendu, Mathilde ?\" | cat -e\n$\n$> ./expand_str \"\" | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-1-tab-mult",
    "level": 3,
    "slot": "1",
    "name": "tab_mult",
    "expectedFiles": "tab_mult.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : tab_mult\nExpected files   : tab_mult.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that displays a number's multiplication table.\n\nThe parameter will always be a strictly positive number that fits in an int,\nand said number times 9 will also fit in an int.\n\nIf there are no parameters, the program displays \\n.\n\nExamples:\n\n$>./tab_mult 9\n1 x 9 = 9\n2 x 9 = 18\n3 x 9 = 27\n4 x 9 = 36\n5 x 9 = 45\n6 x 9 = 54\n7 x 9 = 63\n8 x 9 = 72\n9 x 9 = 81\n$>./tab_mult 19\n1 x 19 = 19\n2 x 19 = 38\n3 x 19 = 57\n4 x 19 = 76\n5 x 19 = 95\n6 x 19 = 114\n7 x 19 = 133\n8 x 19 = 152\n9 x 19 = 171\n$>\n$>./tab_mult | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-2-ft-atoi-base",
    "level": 3,
    "slot": "2",
    "name": "ft_atoi_base",
    "expectedFiles": "ft_atoi_base.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "string",
      "function"
    ],
    "subject": "Assignment name  : ft_atoi_base\nExpected files   : ft_atoi_base.c\nAllowed functions: None\n--------------------------------------------------------------------------------\n\nWrite a function that converts the string argument str (base N <= 16)\nto an integer (base 10) and returns it.\n\nThe characters recognized in the input are: 0123456789abcdef\nThose are, of course, to be trimmed according to the requested base. For\nexample, base 4 recognizes \"0123\" and base 16 recognizes \"0123456789abcdef\".\n\nUppercase letters must also be recognized: \"12fdb3\" is the same as \"12FDB3\".\n\nMinus signs ('-') are interpreted only if they are the first character of the\nstring.\n\nYour function must be declared as follows:\n\nint\tft_atoi_base(const char *str, int str_base);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-3-ft-range",
    "level": 3,
    "slot": "3",
    "name": "ft_range",
    "expectedFiles": "ft_range.c",
    "allowedFunctions": "malloc",
    "kind": "function",
    "tags": [
      "memory",
      "function"
    ],
    "subject": "Assignment name  : ft_range\nExpected files   : ft_range.c\nAllowed functions: malloc\n--------------------------------------------------------------------------------\n\nWrite the following function:\n\nint     *ft_range(int start, int end);\n\nIt must allocate (with malloc()) an array of integers, fill it with consecutive\nvalues that begin at start and end at end (Including start and end !), then\nreturn a pointer to the first value of the array.\n\nExamples:\n\n- With (1, 3) you will return an array containing 1, 2 and 3.\n- With (-1, 2) you will return an array containing -1, 0, 1 and 2.\n- With (0, 0) you will return an array containing 0.\n- With (0, -3) you will return an array containing 0, -1, -2 and -3.",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-4-paramsum",
    "level": 3,
    "slot": "4",
    "name": "paramsum",
    "expectedFiles": "paramsum.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "argv"
    ],
    "subject": "Assignment name  : paramsum\nExpected files   : paramsum.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that displays the number of arguments passed to it, followed by\na newline.\n\nIf there are no arguments, just display a 0 followed by a newline.\n\nExample:\n\n$>./paramsum 1 2 3 5 7 24\n6\n$>./paramsum 6 12 24 | cat -e\n3$\n$>./paramsum | cat -e\n0$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-4-str-capitalizer",
    "level": 3,
    "slot": "4",
    "name": "str_capitalizer",
    "expectedFiles": "str_capitalizer.c",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : str_capitalizer\nExpected files   : str_capitalizer.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes one or several strings and, for each argument,\ncapitalizes the first character of each word (If it's a letter, obviously),\nputs the rest in lowercase, and displays the result on the standard output,\nfollowed by a \\n.\n\nA \"word\" is defined as a part of a string delimited either by spaces/tabs, or\nby the start/end of the string. If a word only has one letter, it must be\ncapitalized.\n\nIf there are no arguments, the progam must display \\n.\n\nExample:\n\n$> ./str_capitalizer | cat -e\n$\n$> ./str_capitalizer \"Premier PETIT TesT\" | cat -e\nPremier Petit Test$\n$> ./str_capitalizer \"DeuxiEmE tEST uN PEU moinS  facile\" \"   attention C'EST pas dur QUAND mEmE\" \"ALLer UN DeRNier 0123456789pour LA rouTE    E \" | cat -e\nDeuxieme Test Un Peu Moins  Facile$\n   Attention C'est Pas Dur Quand Meme$\nAller Un Dernier 0123456789pour La Route    E $\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "3-4-lcm",
    "level": 3,
    "slot": "4",
    "name": "lcm",
    "expectedFiles": "lcm.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "math",
      "function"
    ],
    "subject": "Assignment name  : lcm\nExpected files   : lcm.c\nAllowed functions:\n--------------------------------------------------------------------------------\n\nWrite a function who takes two unsigned int as parameters and returns the\ncomputed LCM of those parameters.\n\nLCM (Lowest Common Multiple) of two non-zero integers is the smallest postive\ninteger divisible by the both integers.\n\nA LCM can be calculated in two ways:\n\n- You can calculate every multiples of each integers until you have a common\nmultiple other than 0\n\n- You can use the HCF (Highest Common Factor) of these two integers and\ncalculate as follows:\n\n        LCM(x, y) = | x * y | / HCF(x, y)\n\n  | x * y | means \"Absolute value of the product of x by y\"\n\nIf at least one integer is null, LCM is equal to 0.\n\nYour function must be prototyped as follows:\n\n  unsigned int    lcm(unsigned int a, unsigned int b);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-0-fprime",
    "level": 4,
    "slot": "0",
    "name": "fprime",
    "expectedFiles": "fprime.c",
    "allowedFunctions": "printf, atoi",
    "kind": "program",
    "tags": [
      "math",
      "argv"
    ],
    "subject": "Assignment name  : fprime\nExpected files   : fprime.c\nAllowed functions: printf, atoi\n--------------------------------------------------------------------------------\n\nWrite a program that takes a positive int and displays its prime factors on the\nstandard output, followed by a newline.\n\nFactors must be displayed in ascending order and separated by '*', so that\nthe expression in the output gives the right result.\n\nIf the number of parameters is not 1, simply display a newline.\n\nThe input, when there's one, will be valid.\n\nExamples:\n\n$> ./fprime 225225 | cat -e\n3*3*5*5*7*11*13$\n$> ./fprime 8333325 | cat -e\n3*3*5*5*7*11*13*37$\n$> ./fprime 9539 | cat -e\n9539$\n$> ./fprime 804577 | cat -e\n804577$\n$> ./fprime 42 | cat -e\n2*3*7$\n$> ./fprime 1 | cat -e\n1$\n$> ./fprime | cat -e\n$\n$> ./fprime 42 21 | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-0-ft-list-foreach",
    "level": 4,
    "slot": "0",
    "name": "ft_list_foreach",
    "expectedFiles": "ft_list_foreach.c, ft_list.h",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "list",
      "function"
    ],
    "subject": "Assignment name  : ft_list_foreach\nExpected files   : ft_list_foreach.c, ft_list.h\nAllowed functions: \n--------------------------------------------------------------------------------\n\nWrite a function that takes a list and a function pointer, and applies this\nfunction to each element of the list.\n\nIt must be declared as follows:\n\nvoid    ft_list_foreach(t_list *begin_list, void (*f)(void *));\n\nThe function pointed to by f will be used as follows:\n\n(*f)(list_ptr->data);\n\nYou must use the following structure, and turn it in as a file called\nft_list.h:\n\ntypedef struct    s_list\n{\n    struct s_list *next;\n    void          *data;\n}                 t_list;",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-0-ft-split",
    "level": 4,
    "slot": "0",
    "name": "ft_split",
    "expectedFiles": "ft_split.c",
    "allowedFunctions": "malloc",
    "kind": "function",
    "tags": [
      "string",
      "memory",
      "function"
    ],
    "subject": "Assignment name  : ft_split\nExpected files   : ft_split.c\nAllowed functions: malloc\n--------------------------------------------------------------------------------\n\nWrite a function that takes a string, splits it into words, and returns them as\na NULL-terminated array of strings.\n\nA \"word\" is defined as a part of a string delimited either by spaces/tabs/new\nlines, or by the start/end of the string.\n\nYour function must be declared as follows:\n\nchar    **ft_split(char *str);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-1-rev-wstr",
    "level": 4,
    "slot": "1",
    "name": "rev_wstr",
    "expectedFiles": "rev_wstr.c",
    "allowedFunctions": "write, malloc, free",
    "kind": "program",
    "tags": [
      "string",
      "memory",
      "argv"
    ],
    "subject": "Assignment name  : rev_wstr\nExpected files   : rev_wstr.c\nAllowed functions: write, malloc, free\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string as a parameter, and prints its words in \nreverse order.\n\nA \"word\" is a part of the string bounded by spaces and/or tabs, or the \nbegin/end of the string.\n\nIf the number of parameters is different from 1, the program will display \n'\\n'.\n\nIn the parameters that are going to be tested, there won't be any \"additional\" \nspaces (meaning that there won't be additionnal spaces at the beginning or at \nthe end of the string, and words will always be separated by exactly one space).\n\nExamples:\n\n$> ./rev_wstr \"le temps du mepris precede celui de l'indifference\" | cat -e\nl'indifference de celui precede mepris du temps le$\n$> ./rev_wstr \"abcdefghijklm\"\nabcdefghijklm\n$> ./rev_wstr \"il contempla le mont\" | cat -e\nmont le contempla il$\n$> ./rev_wstr | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-2-ft-list-remove-if",
    "level": 4,
    "slot": "2",
    "name": "ft_list_remove_if",
    "expectedFiles": "ft_list_remove_if.c",
    "allowedFunctions": "free",
    "kind": "function",
    "tags": [
      "list",
      "function"
    ],
    "subject": "Assignment name  : ft_list_remove_if\nExpected files   : ft_list_remove_if.c\nAllowed functions: free\n--------------------------------------------------------------------------------\n\nWrite a function called ft_list_remove_if that removes from the\npassed list any element the data of which is \"equal\" to the reference data.\n\nIt will be declared as follows :\n\nvoid ft_list_remove_if(t_list **begin_list, void *data_ref, int (*cmp)());\n\ncmp takes two void* and returns 0 when both parameters are equal.\n\nYou have to use the ft_list.h file, which will contain:\n\n$>cat ft_list.h\ntypedef struct      s_list\n{\n    struct s_list   *next;\n    void            *data;\n}                   t_list;\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-3-sort-int-tab",
    "level": 4,
    "slot": "3",
    "name": "sort_int_tab",
    "expectedFiles": "sort_int_tab.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "function"
    ],
    "subject": "Assignment name  : sort_int_tab\nExpected files   : sort_int_tab.c\nAllowed functions: \n--------------------------------------------------------------------------------\n\nWrite the following function:\n\nvoid sort_int_tab(int *tab, unsigned int size);\n\nIt must sort (in-place) the 'tab' int array, that contains exactly 'size'\nmembers, in ascending order.\n\nDoubles must be preserved.\n\nInput is always coherent.",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-3-sort-list",
    "level": 4,
    "slot": "3",
    "name": "sort_list",
    "expectedFiles": "sort_list.c",
    "allowedFunctions": "None",
    "kind": "function",
    "tags": [
      "list",
      "function"
    ],
    "subject": "Assignment name  : sort_list\nExpected files   : sort_list.c\nAllowed functions: \n--------------------------------------------------------------------------------\n\nWrite the following functions:\n\nt_list\t*sort_list(t_list* lst, int (*cmp)(int, int));\n\nThis function must sort the list given as a parameter, using the function \npointer cmp to select the order to apply, and returns a pointer to the \nfirst element of the sorted list.\n\nDuplications must remain.\n\nInputs will always be consistent.\n\nYou must use the type t_list described in the file list.h \nthat is provided to you. You must include that file \n(#include \"list.h\"), but you must not turn it in. We will use our own \nto compile your assignment.\n\nFunctions passed as cmp will always return a value different from \n0 if a and b are in the right order, 0 otherwise.\n\nFor example, the following function used as cmp will sort the list \nin ascending order:\n\nint ascending(int a, int b)\n{\n\treturn (a <= b);\n}",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-4-ft-itoa",
    "level": 4,
    "slot": "4",
    "name": "ft_itoa",
    "expectedFiles": "ft_itoa.c",
    "allowedFunctions": "malloc",
    "kind": "function",
    "tags": [
      "string",
      "memory",
      "function"
    ],
    "subject": "Assignment name  : ft_itoa\nExpected files   : ft_itoa.c\nAllowed functions: malloc\n--------------------------------------------------------------------------------\n\nWrite a function that takes an int and converts it to a null-terminated string.\nThe function returns the result in a char array that you must allocate.\n\nYour function must be declared as follows:\n\nchar\t*ft_itoa(int nbr);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-5-checkmate",
    "level": 4,
    "slot": "5",
    "name": "checkmate",
    "expectedFiles": "*.c, *.h",
    "allowedFunctions": "write, malloc, free",
    "kind": "program",
    "tags": [
      "memory",
      "argv"
    ],
    "subject": "Assignment name  : checkmate \nExpected files   : *.c, *.h\nAllowed functions: write, malloc, free\n--------------------------------------------------------------------------------\n\nWrite a program who takes rows of a chessboard in argument and check if your \nKing is in a check position.\n\nChess is played on a chessboard, a squared board of 8-squares length with \nspecific pieces on it : King, Queen, Bishop, Knight, Rook and Pawns.\nFor this exercice, you will only play with Pawns, Bishops, Rooks and Queen...\nand obviously a King.\n\nEach piece have a specific method of movement, and all patterns of capture are\ndetailled in the examples.txt file.\n\nA piece can capture only the first ennemy piece it founds on its capture\npatterns.\n\nThe board have a variable size but will remains a square. There's only one King\nand all other pieces are against it. All other characters except those used for\npieces are considered as empty squares.\n\nThe King is considered as in a check position when an other enemy piece can\ncapture it. When it's the case, you will print \"Success\" on the standard output\nfollowed by a newline, otherwise you will print \"Fail\" followed by a newline.\n\nIf there is no arguments, the program will only print a newline.\n\nExamples:\n\n$> ./check_mate '..' '.K' | cat -e\nFail$\n$> ./check_mate 'R...' '.K..' '..P.' '....' | cat -e\nSuccess$\n$> ./check_mate 'R...' 'iheK' '....' 'jeiR' | cat -e\nSuccess$\n$> ./check_mate | cat -e\n$\n$>\n*************************************************\nSome subject.en.txts on the web have this example:\n$> ./chessmate 'R...' '..P.' '.K..' '....' | cat -e\nSuccess$\nWhich would indicate that checks need to be down both ways.\nMost solutions will:\nFail$\nAs they are only checking in one direction.\n*************************************************",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "4-6-rostring",
    "level": 4,
    "slot": "6",
    "name": "rostring",
    "expectedFiles": "rostring.c",
    "allowedFunctions": "write, malloc, free",
    "kind": "program",
    "tags": [
      "string",
      "memory",
      "argv"
    ],
    "subject": "Assignment name  : rostring\nExpected files   : rostring.c\nAllowed functions: write, malloc, free\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string and displays this string after rotating it\none word to the left.\n\nThus, the first word becomes the last, and others stay in the same order.\n\nA \"word\" is defined as a part of a string delimited either by spaces/tabs, or\nby the start/end of the string.\n\nWords will be separated by only one space in the output.\n\nIf there's less than one argument, the program displays \\n.\n\nExample:\n\n$>./rostring \"abc   \" | cat -e\nabc$\n$>\n$>./rostring \"Que la      lumiere soit et la lumiere fut\"\nla lumiere soit et la lumiere fut Que\n$>\n$>./rostring \"     AkjhZ zLKIJz , 23y\"\nzLKIJz , 23y AkjhZ\n$>\n$>./rostring | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "5-0-brainfuck",
    "level": 5,
    "slot": "0",
    "name": "brainfuck",
    "expectedFiles": "*.c, *.h",
    "allowedFunctions": "write, malloc, free",
    "kind": "function",
    "tags": [
      "list",
      "memory",
      "function"
    ],
    "subject": "Assignment name  : brainfuck\nExpected files   : *.c, *.h\nAllowed functions: write, malloc, free\n--------------------------------------------------------------------------------\n\nWrite a Brainfuck interpreter program.\nThe source code will be given as first parameter.\nThe code will always be valid, with no more than 4096 operations.\nBrainfuck is a minimalist language. It consists of an array of bytes\n(in our case, let's say 2048 bytes) initialized to zero,\nand a pointer to its first byte.\n\nEvery operator consists of a single character :\n- '>' increment the pointer ;\n- '<' decrement the pointer ;\n- '+' increment the pointed byte ;\n- '-' decrement the pointed byte ;\n- '.' print the pointed byte on standard output ;\n- '[' go to the matching ']' if the pointed byte is 0 (while start) ;\n- ']' go to the matching '[' if the pointed byte is not 0 (while end).\n\nAny other character is a comment.\n\nExamples:\n\n$>./brainfuck \"++++++++++[>+++++++>++++++++++>+++>+<<<<-] >++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.\" | cat -e\nHello World!$\n$>./brainfuck \"+++++[>++++[>++++H>+++++i<<-]>>>++\\n<<<<-]>>--------.>+++++.>.\" | cat -e\nHi$\n$>./brainfuck | cat -e\n$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "5-1-print-memory",
    "level": 5,
    "slot": "1",
    "name": "print_memory",
    "expectedFiles": "print_memory.c",
    "allowedFunctions": "write",
    "kind": "function",
    "tags": [
      "function"
    ],
    "subject": "Assignment name  : print_memory\nExpected files   : print_memory.c\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a function that takes (const void *addr, size_t size), and displays the\nmemory as in the example.\n\nYour function must be declared as follows:\n\nvoid\tprint_memory(const void *addr, size_t size);\n\n---------\n$> cat main.c\nvoid\tprint_memory(const void *addr, size_t size);\n\nint\tmain(void)\n{\n\tint\ttab[10] = {0, 23, 150, 255,\n\t              12, 16,  21, 42};\n\n\tprint_memory(tab, sizeof(tab));\n\treturn (0);\n}\n$> gcc -Wall -Wall -Werror main.c print_memory.c && ./a.out | cat -e\n0000 0000 1700 0000 9600 0000 ff00 0000 ................$\n0c00 0000 1000 0000 1500 0000 2a00 0000 ............*...$\n0000 0000 0000 0000                     ........$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "5-2-ft-itoa-base",
    "level": 5,
    "slot": "2",
    "name": "ft_itoa_base",
    "expectedFiles": "ft_itoa_base.c",
    "allowedFunctions": "malloc",
    "kind": "function",
    "tags": [
      "string",
      "memory",
      "function"
    ],
    "subject": "Assignment name  : ft_itoa_base\nExpected files   : ft_itoa_base.c\nAllowed functions: malloc\n--------------------------------------------------------------------------------\n\nWrite a function that converts an integer value to a null-terminated string\nusing the specified base and stores the result in a char array that you must\nallocate.\n\nThe base is expressed as an integer, from 2 to 16. The characters comprising\nthe base are the digits from 0 to 9, followed by uppercase letter from A to F.\n\nFor example, base 4 would be \"0123\" and base 16 \"0123456789ABCDEF\".\n\nIf base is 10 and value is negative, the resulting string is preceded with a\nminus sign (-). With any other base, value is always considered unsigned.\n\nYour function must be declared as follows:\n\nchar\t*ft_itoa_base(int value, int base);",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "5-3-brackets",
    "level": 5,
    "slot": "3",
    "name": "brackets",
    "expectedFiles": "*.c *.h",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "string",
      "argv"
    ],
    "subject": "Assignment name  : brackets \nExpected files   : *.c *.h\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes an undefined number of strings in arguments. For each\nargument, the program prints on the standard output \"OK\" followed by a newline \nif the expression is correctly bracketed, otherwise it prints \"Error\" followed by\na newline.\n\nSymbols considered as 'brackets' are brackets '(' and ')', square brackets '[' \nand ']'and braces '{' and '}'. Every other symbols are simply ignored.\n\nAn opening bracket must always be closed by the good closing bracket in the \ncorrect order. A string which not contains any bracket is considered as a \ncorrectly bracketed string.\n\nIf there is no arguments, the program must print only a newline.\n\nExamples :\n\n$> ./brackets '(johndoe)' | cat -e\nOK$\n$> ./brackets '([)]' | cat -e\nError$\n$> ./brackets '' '{[(0 + 0)(1 + 1)](3*(-1)){()}}' | cat -e\nOK$\nOK$\n$> ./brackets | cat -e\n$\n$>",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "5-4-rpn-calc",
    "level": 5,
    "slot": "4",
    "name": "rpn_calc",
    "expectedFiles": "*.c, *.h",
    "allowedFunctions": "atoi, printf, write, malloc, free",
    "kind": "program",
    "tags": [
      "string",
      "memory",
      "math",
      "argv"
    ],
    "subject": "Assignment name  : rpn_calc\nExpected files   : *.c, *.h \nAllowed functions: atoi, printf, write, malloc, free\n--------------------------------------------------------------------------------\n\nWrite a program that takes a string which contains an equation written in\nReverse Polish notation (RPN) as its first argument, evaluates the equation, and\nprints the result on the standard output followed by a newline. \n\nReverse Polish Notation is a mathematical notation in which every operator\nfollows all of its operands. In RPN, every operator encountered evaluates the\nprevious 2 operands, and the result of this operation then becomes the first of\nthe two operands for the subsequent operator. Operands and operators must be\nspaced by at least one space.\n\nYou must implement the following operators : \"+\", \"-\", \"*\", \"/\", and \"%\".\n\nIf the string isn't valid or there isn't exactly one argument, you must print\n\"Error\" on the standard output followed by a newline.\n\nAll the given operands must fit in a \"int\".\n\nExamples of formulas converted in RPN:\n\n3 + 4                   >>    3 4 +\n((1 * 2) * 3) - 4       >>    1 2 * 3 * 4 -  ou  3 1 2 * * 4 -\n50 * (5 - (10 / 9))     >>    5 10 9 / - 50 *\n\nHere's how to evaluate a formula in RPN:\n\n1 2 * 3 * 4 -\n2 3 * 4 -\n6 4 -\n2\n\nOr:\n\n3 1 2 * * 4 -\n3 2 * 4 -\n6 4 -\n2\n\nExamples:\n\n$> ./rpn_calc \"1 2 * 3 * 4 +\" | cat -e\n10$\n$> ./rpn_calc \"1 2 3 4 +\" | cat -e\nError$\n$> ./rpn_calc |cat -e\nError$",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  },
  {
    "id": "5-5-options",
    "level": 5,
    "slot": "5",
    "name": "options",
    "expectedFiles": "*.c *.h",
    "allowedFunctions": "write",
    "kind": "program",
    "tags": [
      "bits",
      "argv"
    ],
    "subject": "Assignment name  : options\nExpected files   : *.c *.h\nAllowed functions: write\n--------------------------------------------------------------------------------\n\nWrite a program that takes an undefined number of arguments which could be \nconsidered as options and writes on standard output a representation of those\noptions as groups of bytes followed by a newline.\n\nAn option is an argument that begins by a '-' and have multiple characters \nwhich could be : abcdefghijklmnopqrstuvwxyz\n\nAll options are stocked in a single int and each options represents a bit of that\nint, and should be stocked like this : \n\n00000000 00000000 00000000 00000000\n******zy xwvutsrq ponmlkji hgfedcba\n\nLaunch the program without arguments or with the '-h' flag activated must print\nan usage on the standard output, as shown in the following examples.\n\nA wrong option must print \"Invalid Option\" followd by a newline.\n\nExamples :\n$>./options\noptions: abcdefghijklmnopqrstuvwxyz\n$>./options -abc -ijk\n00000000 00000000 00000111 00000111\n$>./options -z\n00000010 00000000 00000000 00000000\n$>./options -abc -hijk\noptions: abcdefghijklmnopqrstuvwxyz\n$>./options -%\nInvalid Option",
    "sourceUrl": "http://nigal.freeshell.org/42/exam-review.php",
    "sourceLabel": "nigal 42 C Beginner Exam Review"
  }
] satisfies Exercise[];

export const levelLabels: Record<number, string> = {
  0: "ısınma",
  1: "temel string / pointer",
  2: "string, bit, argv",
  3: "algoritma ve bellek",
  4: "liste, split, ileri string",
  5: "ileri algoritma",
};
