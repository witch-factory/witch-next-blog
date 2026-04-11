---
title: C - 1.6. Program Using Character Input/Output 1
date: "2021-08-15T00:00:00Z"
description: "C Language 1.6. Program Using Character Input/Output 1"
tags: ["language"]
---
# 1. Counting the Number of Input Characters

The next program to be created using character input and output is one that counts the number of characters.

```c
#include <stdio.h>

/* Counts how many characters are in the input */
main() {
    int count;

    count = 0;
    while (getchar() != EOF) {
        ++count;
    }
    printf("%d\n", count);
}
```

The basic principle is the same as discussed in Section 1.5. It counts how many characters have been input until EOF appears.

Here, we have encountered another operator that we have not seen: the prefix increment operator `++count`. `++count` increments the value of `count` by 1 before using the variable's value. This performs the same function as `count = count + 1`. However, `++count` is often preferred for its brevity and speed when incrementing by 1.

Similarly, there is the decrement operator `--count`, which decreases the value by 1, and the postfix increment `count++` and decrement `count--`, which operate slightly differently. These operators will be discussed in more detail later when we cover operators.

---
<div>
<strong>NOTE</strong>
<p></p>
The question of whether to use the prefix operator `++i` or the postfix operator `i++` has been a long-standing topic. To conclude, compilers optimize most aspects, and modern computer speeds have progressed to the extent that the difference is often negligible. Timing tests show fluctuations depending on the computing environment. Therefore, in general cases, one can use their preference.

Theoretically, however, the prefix operator `++i` is superior. In the case of the postfix operator `i++`, the variable's value is used first, then it is incremented. For example, with code like `arr[i++] = 3`, the compiler processes `arr[i] = 3` first and then increments `i`. In contrast, with `arr[++i]`, it increments `i` and then processes `arr[i]`.

Thus, the postfix operator requires temporary storage for the value of `i`, which theoretically makes it slower than the prefix operator.

Reference: https://stackoverflow.com/questions/24901/is-there-a-performance-difference-between-i-and-i-in-c
</div>

---

# 2. Trying a Different Approach

The range of `int` is generally up to 2^31 - 1, approximately 2.1 billion, so it is unlikely to be insufficient for counting characters. However, if there is an exceptionally large input that exceeds this range, using a `double` type can represent a much larger range at the cost of some precision.

Let’s create such code using the `for` loop, a different type of iteration.

```c
#include <stdio.h>

/* Code to count the number of input characters using a for loop and double type */
main() {
    double count;

    for (count = 0; getchar() != EOF; ++count);
    /* All necessary actions are performed in the initialization/test/increment, so the body of the for loop can be empty. */
    printf("%.0f\n", count);
}
```

The `double` type can represent values up to approximately 10^300, so overflow of the `count` variable in the code above is unlikely to be a concern. Note that the `printf` output format for a `double` is also `%f`.

Also, remember that a `for` loop can operate correctly even without a body enclosed in braces.

However, what happens if this program receives no input at all? If it directly receives EOF without any characters, the program will still output 0. This is because the part incrementing `count` is never executed.

Thus, if the condition of a `for` or `while` loop is not satisfied, the body of the loop (inside the braces) is not executed at all, ensuring that cases such as receiving no input are vital for creating robust programs.

# 3. Counting Lines

The next program will count the number of newline characters in the input. It operates on the straightforward logic of counting whenever a newline is encountered while reading input until EOF.

```c
#include <stdio.h>

/* Count the number of lines in the input */
main() {
    int c, line_num;

    line_num = 0;
    while ((c = getchar()) != EOF) {
        if (c == '\n') {
            line_num++;
        }
    }
    printf("%d\n", line_num);
}
```

Note that the escape character `\n`, which represents a newline, is compared with the `int` variable `c`. Characters represented in single quotes correspond to specific numeric values in the character set used by the compiler. This is referred to as a character constant and is typically represented in ASCII code. For example, the uppercase letter `A` corresponds to the ASCII code 65.