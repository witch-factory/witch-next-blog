---
title: C - 1.3. Improvement of the Second Example
date: "2021-07-31T00:00:00Z"
description: "Improvement of the second example in C Language 1.3"
tags: ["language"]
---

# 1. Improved Code

Code that performs the same function can be written in various ways. For example, let's write a code that performs the same action using a `for` loop.

```c
#include <stdio.h>

/* Code to print the Celsius-Fahrenheit temperature conversion table */

main() {
    int fahr;

    for (fahr = 0; fahr <= 300; fahr = fahr + 20) {
        printf("%3d %6.1f\n", fahr, (5.0 / 9.0) * (fahr - 32.0));
    }
}
```

When executed through a compiler, this code produces the same results as the code using the `while` loop written in section 1.2. However, there are several changes.

First, all variables except for the `fahr` variable representing Fahrenheit temperature have been removed. The `lower` and `upper` variables were integrated into the `for` loop, and the conversion formula is inserted directly as arguments in the `printf` statement instead of assigning it to a variable.

One fact we can ascertain here is that wherever a variable of a specific type's value can be used, any complex calculation that results in the same type can also be inserted. For instance, the third argument in the `printf` function of the code above contains a floating-point value, regardless of whether it is a single floating-point variable or a computed value from multiple variables.

Reducing the number of variables does not have significant performance implications since saving memory on that scale is rarely necessary. However, the code has become much simpler.

Of course, variable names also serve to indicate the purpose of the numbers. If `upper = 300`, it becomes clear to the reader that 300 serves as an upper limit. Considering this aspect, the code written like this may be harder to understand.

However, this issue can also be resolved by utilizing `#define`, which will be discussed later.

# 2. Explanation of the `for` Loop

The final aspect of the code to be explained pertains to the `for` loop. The `for` loop is another form of iteration. The structure of a `for` loop is as follows:

```c
for(initialization; continuation condition; increment){
    Code to be executed at each step
}
```

Looking at it step-by-step, the initialization part sets the initial condition of the loop. In this case, it initializes `fahr=0`, setting the Fahrenheit temperature to 0.

The continuation condition specifies the condition under which the loop should continue. Here, it is `fahr<=300`; when this condition evaluates to false, the code within the braces will not be executed. Conversely, the code within the braces will continue to execute as long as this condition remains true.

If nothing is properly handled in the increment section such that `fahr` remains below 300 (for example, mistakenly increasing a different variable instead of `fahr`, or reducing `fahr`), the code within the braces will execute infinitely.

The increment section determines what action to perform each time a step is executed. In this case, it is `fahr=fahr+20`, which means that during each execution of the code within the braces, the `fahr` variable is increased by 20.

Although it is called an increment, this term is an abstract translation and can represent any action performed during each step of the iteration. It could decrease `fahr`, multiply it by 2, assign a different variable's value, or anything else, provided that the code is generally written to ensure that the loop will eventually terminate.

In summary, a `for` loop initializes a variable, performs some action each time the code within the braces executes, and moves closer to meeting the exit condition.

There is no rigid principle dictating whether to use `while` or `for`; simply choose the one that makes the code clearer and easier to understand.