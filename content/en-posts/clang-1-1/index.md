---
title: C - 1.1. Introduction
date: "2021-06-25T00:00:00Z"
description: "C Language 1.1 Introduction"
tags: ["language"]
---

# 1. Introduction

This summer vacation, I decided to go back to basics and review the C language, organizing the material on my blog. However, since this content is being written while I review, it may lack consideration for complete beginners in programming.

I will use K&R, often cited as one of the bibles of C language, as my textbook, and I will also describe the knowledge I have acquired along the way. After finishing the book's content, I will write additional posts on data structures like linked lists and simple programs that can be implemented in C.

At this point, K&R teaches how to compile from the terminal, so I will run the code on an Ubuntu terminal in WSL. For my editor, I will use VSCode.

If you do not have a specific editor or IDE in use, you might consider using Visual Studio, which is commonly used when starting with C language.

# 2. Structure of C Language

Computers are fundamentally machines that execute operations in the order we instruct them. C language is one of the tools that allows us to instruct computers on the operations we desire. Regardless of the complexity of the instructions we provide in C language, they consist of functions and variables.

So, what are functions and variables? A function is an element composed of statements that inform the computer what operation and task to perform. Variables, on the other hand, store the values needed for those tasks. Although this concept may seem quite complex, let's provide an example for easier understanding.

Consider the calculation of `1+2`. Almost anyone would answer 3. However, when broken down, we executed a binary operation called addition on the values 1 and 2.

In this context, the function is the instruction to perform the operation of addition, while the values 1 and 2 are the variables. Thus, using the values stored in variables to execute tasks indicated by functions constitutes a C language program.

Now, before getting into extensive syntax explanations, let’s write our first program.

# 3. First Program

The first program we will write outputs `hello, world`. First, type the following statement in the editor and save it as `hello.c`.

```c
#include <stdio.h>

main()
{
    printf("hello, world\n");
}
```
---
<div>
<strong>NOTE</strong>
<p></p>
Anyone who has learned a bit of C might find the above code peculiar due to the lack of a return type for the main function. In fact, there is no return value for the main function. However, according to the standard when C was first introduced, the `implicit int rule` states that a function without an explicitly declared return type is implicitly treated as returning an int. This syntax was discarded from the C99 standard, but many compilers still run it successfully.
<p></p>
Also, I have yet to define what a function is and how it is written. Discussing return types at this stage seems premature, so I have written this code to reduce the initial information load.
<p></p>
In summary, if the return type of a function is not specified, the compiler accepts it as int, making the above code valid. Additionally, the absence of a return value is not an issue because functions automatically return 0 if they have no return value.
<p>&nbsp;</p>
</div>

---

Then, compile it in the terminal with `gcc hello.c` and open `./a.out`, you will see `hello, world` printed. While something appears, the underlying rules of its operation may not be obvious. Let’s analyze it line by line.

# 4. Explanation of the First Program

`#include <stdio.h>`

This line tells the compiler that we will use the standard input/output library (with "stdio" standing for standard input/output). Think of this as enabling the use of input/output functions.

`main()`

Execution of C programs always starts with the main function. Regardless of how the code is structured, execution begins with the contents of the main function. There is no instance where the code within other functions is executed before that of the main function.

This is a defined rule for functions named `main`. Thus, while function names can generally be chosen freely, `main` is an exception. Hence, you can consider this line as indicating the start of the program's execution.

The contents of the function are located within the curly braces that follow `main()`. Therefore, the contents inside the curly braces after `main()` represent the statements executed by the program. 

Now, what does the parentheses following `main` signify? 

Those are for the function's arguments. The way functions share information is through passing arguments during function calls. The `main` function, being a function itself, can also accept arguments, for example as `int main(int argc, char* argv[])`. This will be covered later.

`printf("hello, world\n");`
This calls the function `printf`, passing the argument `"hello, world\n"`. Here, `printf` is an output function defined in <stdio.h>. It outputs the format string received as an argument. We will cover this in more detail later; for now, just think of it as a function that takes an output and prints it.

It’s also crucial to note that in C language, every statement is terminated with a semicolon, similar to a period in natural language.

# 5. Escape Characters

The `\n` within `"hello, world\n"` signifies a newline. Since characters such as newlines cannot be easily represented, they are defined separately with a backslash (`\`). If you run the program without `\n`, you will see that no newline follows the printed `hello, world`. Characters defined this way with a backslash are known as escape characters.

There are no methods to denote newlines in C language without using escape characters. You must use `\n` to indicate it. If you attempt to execute the following code with the intention of including a newline literally in the string:

```c
printf("hello, world
");
```

you will immediately encounter an error code.

Of course, using the enter key to insert a newline can be more intuitive than escape characters. Thus, more modern languages offer features like Python's triple quotes or JavaScript's template literals to directly support newlines. However, classical languages like C do not provide such features; escape characters are the only method.

In addition to newlines, there are other escape characters such as tab (`\t`) and backspace (`\b`). We will discuss escape characters in depth later; for now, recognize that they exist.

# 6. Output of printf

`printf` does not automatically add a newline. It simply outputs the received string without adding anything additional. This may seem somewhat rigid.

However, this characteristic allows the possibility of using `printf` multiple times to print a single string segmented into parts. As I conclude this first post, I’ll show you how to print one string using multiple `printf` calls. Running the following code will again output `hello, world\n` correctly.

```c
#include <stdio.h>

main()
{
    printf("hello, wor");
    printf("ld\n");
}
```