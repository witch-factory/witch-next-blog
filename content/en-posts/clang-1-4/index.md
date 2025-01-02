---
title: C - 1.4. Conclusion of the Second Example
date: "2021-08-05T00:00:00Z"
description: "C Language 1.4. Conclusion of the Second Example"
tags: ["language"]
---

# 1. Macro Constants

In section 1.3, it was mentioned that variable names also indicate the purpose of numbers. However, since the number of variables was reduced in the code using the for loop from 1.3, it became difficult to easily identify the purpose of some numbers.

Of course, since the code seen in 1.3 is quite short, a knowledgeable person might easily infer, "In this code, 300 is an upper limit, and 20 is the increment for each step!" However, if the code were longer and more complex, understanding the intent behind these constants would not be as straightforward.

Numbers that are used in the code without specific names are referred to as "magic numbers," and it is a habit that should actually be avoided.

So, how can we indicate the purpose of these magic numbers? By using macros with `#define`. For example, if we write `#define UPPER 300`, it means defining a macro that automatically substitutes the term `UPPER` with 300. In other words, we make the compiler understand that `UPPER` refers to 300.

The specific format is as follows:

```c
#define name replacement text
```

With this, every time `name` appears, the compiler will interpret it as `replacement text`.

---

<strong>NOTE</strong>

This relates specifically to how the compiler operates. In brief, when we write code and pass it to the compiler, it first preprocesses the code before creating an executable file. This preprocessing includes copying header file contents, handling conditional compilation, and macro processing.

In other words, the code that the compiler actually reads and compiles is already processed by the defined `#define` macros. Therefore, the constants defined in this way do not occupy memory. The same goes for macros defined for functions, as they merely perform text substitution without actually influencing the behavior of the code.

---

`name` follows the same naming rules as variables. It must be a combination of letters and numbers, starting with a letter. The `replacement text` can be any string; it does not necessarily have to be a number. This will be shown in the code later in this document.

# 2. Code Using Macros

Now, let's use these macros to assign meaningful names to the constants.

```c
#include <stdio.h>

#define LOWER 0
#define UPPER 300
#define STEP 20

/* Prints the Fahrenheit-Celsius table */
main() {
    int fahr;

    for (fahr = LOWER; fahr <= UPPER; fahr = fahr + STEP) {
        printf("%3d %6.1f\n", fahr, (5.0 / 9.0) * (fahr - 32.0));
    }
}
```

By doing this, `LOWER`, `UPPER`, and `STEP` correspond to specific numbers, and thus, the meaning in the actual code remains the same. However, having names assigned to these numbers makes it much easier for humans to understand.

When using macros, one should consider that the macro name (`name`) is typically written in uppercase letters to distinguish it from regular variable names, and that macros do not have a semicolon (`;`) at the end.

Additionally, the name in `replacement text` does not have to be singular. If the number 300 is used with a different meaning elsewhere in the program, it is perfectly acceptable to define another macro such as `#define STUDENT_ID 300`. However, it is not allowed to reuse the same name.

# 3. Applications of Macros

At first glance, it may not be easy to see the difference between using macros and variables. While it can save memory used for variable allocation, this is often insignificant today as we generally have sufficient memory.

Therefore, let’s look at a macro used in a manner distinct from variables.

We can replace the Fahrenheit-Celsius conversion formula used in the code above with a macro.

```c
#include <stdio.h>

#define LOWER 0
#define UPPER 300
#define STEP 20
#define FAHR_TO_CELSIUS(x) (5.0/9.0)*(x-32.0)

/* Prints the Fahrenheit-Celsius table */
main() {
    int fahr;

    for (fahr = LOWER; fahr <= UPPER; fahr = fahr + STEP) {
        printf("%3d %6.1f\n", fahr, FAHR_TO_CELSIUS(fahr));
    }
}
```

We can pass the variable `fahr` to the macro defined for `x`, and it works correctly. The key point is that the code runs properly and that we can create macros that function similarly to a function. This is something we cannot achieve with regular variables learned so far.

In fact, Fahrenheit is not commonly used in South Korea, and the conversion formula \( \frac{5}{9} \times (F - 32) \) may not be very familiar. However, by assigning a name to such a conversion formula, using it becomes much easier to recognize its purpose for converting Fahrenheit to Celsius.