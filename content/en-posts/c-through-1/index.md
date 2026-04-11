---
title: C-through - 1. Implicit int rule
date: "2022-01-09T00:00:00Z"
description: "Regarding the implicit int rule in the C language"
tags: ["language"]
---

# 1. C-through

This is a series describing insights gained while reviewing C. It does not cover the basics of C, such as what variables and constants are. The purpose is to organize additional information acquired from various books and Google searches. While I will try to avoid overly long articles (and will split them into two if they become too lengthy), the amount of information contained in each article may vary, resulting in inconsistent length.

# 2. "Implicit int" rule

One of the bibles of the C language, "The C Programming Language" by Kernighan and Ritchie, includes the following example code very early on:

```c
#include <stdio.h>

main()
{
    printf("hello, world\n");
}
```

Anyone with some knowledge of C would find the above code unusual due to the absence of a return type for the main function. Moreover, there is no return value for the main function either!

However, this code runs without issues under the C89 standard. At that time, the standard stipulated that if a function's return type was not explicitly specified, it would be implicitly assumed to be int. Furthermore, not only function return types could be omitted, but type specifiers could also be entirely bypassed in declarations.

This was referred to as the implicit int rule or default to int rule. The reason for such syntax was that the ancestor language of C, B, did not have types, and during the early days of C, most code handled only integers. Thus, it was implicitly understood among programmers that everything was int without specifying types, making the omission of type specifiers convenient.

However, this syntax was abolished starting with the C99 standard. The committee judged that the risks posed by this implicit int rule outweighed its convenience. Therefore, it can be understood that this rule existed during the transition of C from a type-less language to a strongly typed language. Some compilers, such as gcc, still support this syntax, and the above program continues to run. However, when writing new C code, it is essential to explicitly specify the return type of functions.

# 3. References

https://stackoverflow.com/questions/8220463/c-function-calls-understanding-the-implicit-int-rule

http://www.open-std.org/jtc1/sc22/wg14/www/docs/text/n661.txt