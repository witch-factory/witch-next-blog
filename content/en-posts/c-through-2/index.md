---
title: C-through - 2. Unknown parameter
date: "2022-01-10T00:00:00Z"
description: "Regarding leaving parameter positions empty when declaring/defining functions in C"
tags: ["language"]
---

# 1. Declaring Functions Without Arguments

```c
#include <stdio.h>

void f();

int main() {
    f();
    return 0;
}

void f(){
    printf("Hello, I'm Witch\n");
}
```

Most individuals who have learned C will be able to interpret this code. Is there an error in this code? 

When executed, no errors occur and it runs correctly. I have also written C code this way for the most part. However, I have been told that leaving the arguments empty in a C function declaration means providing no information about the function parameters, and in order to explicitly declare that the function does not take any parameters, it is better to include `void` as the argument. The following is considered preferable.

```c
#include <stdio.h>

void f(void);

int main() {
    f();
    return 0;
}

void f(){
    printf("Hello, I'm Witch\n");
}
```

It is accepted that expressing everything as explicitly as possible leads to better code. However, I began to wonder why C has such functionality. In C++, not providing any arguments in the function declaration explicitly means that the function takes no arguments. Why does C include what appears to be a redundant feature? Where is it used to not provide arguments in the function declaration?

Upon investigation, it was found that B, the precursor to C, was a typeless language, and when transitioning from B, there was no function prototype specifying the number and types of function parameters. This was prior to the C89 standard. At that time, a different method of function declarations and definitions was used. Not providing arguments during function declarations was the practice of that era. The C standard continues to support declarations without parameters to maintain backward compatibility with codes that were written in that style.

Here, I summarize the knowledge gained during the study succinctly.

# 2. Identifier List Function Declaration

It was explained that not providing function parameters during a function declaration means providing no information regarding the number or types of parameters. Thus, any arguments can be passed during the function definition. The following code works correctly, even though the parameter is not specified in the declaration of `f`. The decision that no information about the parameters of `f` can be ascertained from the declaration means that anything is allowed (C leaves many decisions to the programmer).

```c
#include <stdio.h>

int f();

int main(void){
    /* The output will correctly be 3 */
    printf("%d\n", f(1,2));
    return 0;
}

int f(int x, int y){
    return x+y;
}
```

On the other hand, the following code will produce an error after indicating `void` in the parameters of `f`, which signifies that `f` does not take any arguments. This is because the declaration clearly states that `f` does not accept parameters, while arguments are being defined for `f`.

```c
#include <stdio.h>

int f(void);
/* This code will result in an error */
int main(void){
    printf("%d\n", f(1,2));
    return 0;
}

int f(int x, int y){
    return x+y;
}
```

However, there exists a method for declaring functions solely using the style that does not pass any arguments. This is known as the Identifier List function declaration method in C's legacy syntax. Let’s see an example in code.

```c
#include <stdio.h>

int f();

int main(void){
    /* The result will be 3 */
    printf("%d\n", f(1,2));
    return 0;
}

int f(x,y)
int x; int y;
{
    return x+y;
}
```

The function declaration and definition method shown above is referred to as the identifier list method. In the function declaration, no parameters are supplied, and in the function definition, only the names of the function parameters are provided, while their types are specified below. The parameters can then be used within the curly braces for operations.

This was a method used before function prototype declarations were introduced in C. It was utilized during a transitional period when it came from a language without types like B.

# 3. Risks and Legacy of Identifier List Method

This method does not allow the compiler to check whether appropriate types and numbers of parameters are passed to the function; this is entirely up to the programmer. In the above code, appropriate types and numbers of parameters are provided, but calling `f(1,2,3)` or `f(1.5,2.0)` will compile successfully as well.

However, when the actual parameters passed to the function differ from those defined in the function, the standard guarantees nothing.

```c
#include <stdio.h>

int f();

int main(void){
    /* The types of parameters used in the function call are different, thus it outputs meaningless garbage value */
    printf("%d\n", f(1.5,2.0));
    return 0;
}

int f(x,y)
int x; int y;
{
    return x+y;
}
```

If a function prototype were declared specifying the types and number of parameters, then an implicit type conversion would occur, which might result in some loss of value, yet an output within a reasonable range would still be produced. However, using the older C method of function declaration, bizarre results may appear.

Nonetheless, this method was certainly used before function prototypes were introduced in C, and the standard documentation describes it as follows:

```
6.7.5.3 Function declarators(including prototypes)
An identifier list in a function declarator that is not part of a definition of that function shall be empty.
```

When using the identifier list to define a function, the parameter list in the declaration should remain empty as per the standard. Of course, declaring a function with a prototype like `int f(int x, int y);` would work too, but this is only because it is compatible with the identifier list.

We now understand why the style of leaving parameter positions empty in function declarations exists! It is a remnant of the function declaration style used before C89.

One may wonder why such a method existed. Summarizing several answers from Stack Overflow reveals that the focus at that time was to offer methods that allowed programmers to work more swiftly. Therefore, there was no need to incorporate methods to catch errors at compile time using prototypes.

Additionally, during that era, memory limitations on computers were much tighter than they are today. Declaring and defining functions using the identifier list method was viewed as more efficient from a memory management standpoint. Nowadays, ensuring more compile-time error detection is considered far more important.

# 4. Leaving Argument Places Empty in Function Definitions

However, what happens if the parameter positions are left empty in function definitions? In this case, it explicitly indicates that the function does not take parameters.

```
C99 standard 6.7.5.3
An empty list in a function declarator that is part of a definition of that function specifies that the function has no parameters.
```

An empty parameter list in the definition explicitly signifies that the function takes no parameters. However, delivering parameters during function calls does not necessarily result in errors. For example, the following code compiles with gcc without errors, but gives an error with clang.

```c
#include <stdio.h>

int f(){
    printf("Hello\n");
    return 0;
}

int main(void){
    /* Compiling with gcc works, but the behavior is not guaranteed by the standard */
    f(1,2,3);
    return 0;
}
```

If the function `f` had also defined a prototype, the scenario would change. In C, when a called function has a prototype, the number of arguments passed during the function call (commonly referred to as arguments) must match the number in the function prototype (referred to as prototypes); the standard mandates this. However, when the called function does not have a prototype, the standard does not define the situation where the count does not match (it is referred to as undefined behavior).

Thus, in the above code, whether a compile-time error occurs may depend on the environment. However, even if it compiles, the behavior of such code cannot be defined by the standard, so it is advisable not to use it.

In the following code, where it has been declared beforehand that the function takes no parameters in the prototype, it becomes apparent that an error is raised during compilation due to the excessive number of arguments being passed during the function call.

```c
#include <stdio.h>

int f(void);
/* The function declaration clearly indicates no parameters */
int main(void){
    f(1,2,3);
    return 0;
}

int f(){
    printf("Hello\n");
    return 0;
}
```

# 5. Conclusion

Leaving parameter places empty in function declarations is a legacy of previous C syntax. In the era when there were no prototypes in the C language, it was necessary to leave the parameter positions empty to declare functions.

Today, when declaring functions without parameters, it is recommended to explicitly indicate this by using `void` in the parameter position. It is not necessary to include `void` in the function definition to imply that it has no parameters.

# 6. References

https://stackoverflow.com/questions/693788/is-it-better-to-use-c-void-arguments-void-foovoid-or-not-void-foo

https://stackoverflow.com/questions/5481579/why-does-an-empty-declaration-work-for-definitions-with-int-arguments-but-not-fo

https://stackoverflow.com/questions/12643202/why-does-gcc-allow-arguments-to-be-passed-to-a-function-defined-to-be-with-no-ar

https://en.wikipedia.org/wiki/B_%28programming_language%29

https://stackoverflow.com/questions/4664100/does-printfx-1-invoke-undefined-behavior

(Content from the C standard document)

https://stackoverflow.com/questions/18820751/identifier-list-vs-parameter-type-list-in-c

https://stackoverflow.com/questions/41803937/func-vs-funcvoid-in-c99 (Well-explained part regarding the C standard)

http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.369.3559&rep=rep1&type=pdf

Some excerpts from the actual C standard document.