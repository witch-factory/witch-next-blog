---
title: C - 1.5. Character Input and Output
date: "2021-08-06T00:00:00Z"
description: "C Language 1.5. Character Input and Output"
tags: ["language"]
---
# 1. Character Input and Output
We will now learn about programs that handle character data. The character input and output functions in C's standard library are simple. Programs process various input and output streams. These inputs or outputs can be through a console window that interacts with the user's keyboard input or through a file. The topic of where to connect input and output streams will be discussed later.

However, regardless of where the input and output streams come from or go, C’s I/O functions merely handle the input and output. The simplest of these functions are `getchar()` and `putchar(c)`. Both functions read and output a single character.

`getchar()` reads a single character from the input stream and then returns it. On the other hand, `putchar(c)` takes a character `c`, usually denoting a single character, and outputs it to the output stream. At this point, `putchar(c)` can be used together with `printf`, and as we expect, they are output in the order they are called.

Let's write a sample code:

```c
#include <stdio.h>

/* Using putchar and printf together */
main() {
    char c='t';
    putchar(c);
    printf("est\n");
}
```

When the above code is executed, it outputs `test` followed by a newline. The character `t` stored in the `char` variable `c` is output by `putchar`, followed by the subsequent characters output by `printf`. Although we used two types of output functions, we can confirm that there is no conflict between them.

# 2. Outputting as Received Input

We have only learned the functions `getchar()` and `putchar(c)`, which receive and output just one character at a time, but we can still execute quite a few examples with just these. For instance, we can create a program that outputs each character as it is received one by one.

If, for example, the input comes from a stream in a file, we can think of it as receiving inputs until the end of the file (EOF) and outputting them as is. After learning about input and output redirection later, we will actually be able to write code that performs such actions.

Moreover, as I type this blog post, it would be very inconvenient if a document program only accepted keyboard inputs and did not output what input it had received.

Of course, document programs or real-time output algorithms in actual use will have more complex code and optimizations than the examples we write. However, we can certainly consider that the basic principle is similar.

The following code inputs characters until EOF is encountered, outputting them as they are input:

```c
#include <stdio.h>

/* Outputs the received content until EOF is encountered */
main() {
    int c;

    c = getchar();
    while (c != EOF) {
        putchar(c);
        c = getchar();
    }
}
```

For reference, `!=` means "not equal". When you test this code, you will see that it outputs as it receives until EOF is entered. The question remains how to input EOF into the console window. On Windows, you can enter EOF by pressing `Ctrl+Z`, and on Linux by pressing `Ctrl+D`.

However, there is one strange point. We have certainly used functions that handle a single character, namely `getchar` and `putchar`. Doesn't the name imply that they handle characters? However, in the above code, `c` is declared as an `int`. Additionally, if we look up the specification of the `getchar()` function, we see that it returns an `int`. Why is that?

This is because we need to distinguish EOF. The EOF in the C standard is a macro constant defined in `<stdio.h>`, which must be a number that cannot be confused with any character type. It is often represented as -1. Therefore, we declare `c` as an integer `int` so that it can also handle EOF. If we had declared `c` as a `char`, it might not have been able to contain the value of EOF.

# 3. Improving the Code

We can take advantage of the fact that assignment statements like `c=getchar()` or `a=3` are also expressions with values, allowing us to shorten the above code. In this case, the assignment expression represents the value after the assignment on the left side. For example, if you have an assignment statement `a=3`, this statement evaluates to 3 after 3 is assigned to a.

By placing the assignment of `c` within the `while` statement, we can condense the code:

```c
#include <stdio.h>

/* Outputs the received content until EOF is encountered
   Simplified using the assignment statement */
main() {
    int c;

    while ((c = getchar()) != EOF) {
        putchar(c);
    }
}
```

Inside the `while` statement, a test is performed while receiving input using `getchar()`, assigning the value to `c`, and comparing `c` to EOF. If `c` is not EOF, the body of the `while` loop is executed, and if it is EOF, the loop is immediately terminated.

Such assignment-based coding can enhance readability for those experienced. However, if the simplification of the code is abused, it can indeed reduce readability, so caution is advised. Well-written code need not be overly clever; rather, it should be simple enough for anyone to easily understand its meaning, which can sometimes be more challenging to write. Let us be satisfied with the knowledge that assignment statements also represent values.

Lastly, you might notice the parentheses around `c = getchar()`. This is due to operator precedence. `!=` has higher precedence than `=`, so if you do not use parentheses, `c = getchar() != EOF` would yield the same result as `c = (getchar() != EOF)`.

This would assign to `c` either 0 or 1 (where the boolean true is typically represented as 1) based on the result of `getchar() != EOF`, leading to an undesired outcome.

## 3.1 Regarding the Value of Assignment Statements

A common mistake when first learning C is as follows:

```c
#include <stdio.h>

/* Code intended to print that a is 1 if it is 1 */
main() {
    int a = 2;

    if (a = 1) {
        printf("a is 1");
    }
}
```

When you run the above code, even though `a` was initialized to 2, the code inside the `if` statement executes. This is not the expected result! The correct way to check if `a` is equal to 1 is to use `a==1`. Anyone who has learned C to some extent should be able to catch such a mistake.

However, while this code may not yield the desired result, it executes without any bugs and produces some output. Few people can answer why this happens with complete clarity; I certainly could not.

The reason is precisely the fact discussed earlier: in C, assignment statements also have values. In this code, `a=1` assigns the value 1 to `a`, which is then evaluated in the `if` statement. Since 1 is always true, the code inside the `if` statement executes, and `a` is also correctly assigned the value 1.

The existence of a value in assignment statements can lead to such mistakes, but it can also make code like the one using `getchar()` more concise.