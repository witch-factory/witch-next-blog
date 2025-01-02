---
title: C - 1.2. Second Example
date: "2021-07-02T00:00:00Z"
description: "C Language 1.2 Second Example"
tags: ["language"]
---

# 1. Second Program

K&R does not teach the syntax of the C language immediately. Instead, it uses a method where one gets a feel for the C language by writing simple programs. Therefore, before diving into the detailed syntax of C, we will write a few uncomplicated programs that help grasp the language.

In this article, following that approach, we will write a simple second program that prints the Celsius equivalent of Fahrenheit temperatures.

The code is as follows:

```c
#include <stdio.h>

/* Prints a Fahrenheit-Celsius table for 
	Fahrenheit 0, 20, ... , 300 degrees */

main() {
	int fahr, celsius;
	int lower, upper, step;

	lower = 0;
	upper = 300;
	step = 20;
	fahr = lower;

	while (fahr <= upper) {
		celsius = 5 * (fahr - 32) / 9;
		printf("%d\t%d\n", fahr, celsius);
		fahr = fahr + step;
	}
}
```

# 2. Explanation of the Second Program

Let us explain each element of the code.

`#include <stdio.h>`

This was covered in the previous article, so we will skip it. It includes the library that handles input and output functions.

`/* Prints a Fahrenheit-Celsius table for 
Fahrenheit 0, 20, ... , 300 degrees */`

The section wrapped in `/* */` is a comment. This portion is ignored during the code compilation. Such comments can be used to facilitate the understanding of the program. Comments can occur at any place that allows whitespace, tabs, or newlines, meaning they can be employed in nearly any part of the code.

One method of writing comments is to comment out entire blocks of code that are not currently being used but may be needed later. This allows the code to be uncommented for future use whenever necessary.

`int fahr, celsius;
int lower, upper, step;`

The next line defines variables. In C, variables must be defined before they are used. A variable can simply be thought of as a space for storing some values used in the program.

Before using a variable, we need to specify what kind of values it will store, how much memory to allocate, and what to name it. The definition of a variable consists of the type of variable (data type) and variable names that contain this information.

The type of a variable instructs the compiler on what kind of values will be stored in the variable and how much memory is needed for that. The name of the variable is literally the name of the space where values will be stored.

Here, we will briefly note that `int` represents an integer type, while there are other types such as `char` for characters, `float` for floating-point numbers, and `double`.

---
<div>
<strong>NOTE</strong>
<p></p>
As will be noted later, the variable type also determines the size of the memory allocated for the variable. However, the standard only defines the relative sizes of memory for different variable types without specifying exact sizes. Currently, most widely used compilers define `int` as 4 bytes. However, at the time when Kernighan and Ritchie wrote "The C Programming Language," this was not the case. Therefore, K&R C explains that 16-bit (i.e., 2-byte) integers were also common...
<p>&nbsp;</p>
</div>

---

Additionally, there are arrays, structures, unions, as well as related pointers and functions composed of these types. We will learn about each of these as this series progresses. 

Thus, the above code can be explained as defining five variables of type `int` named `fahr`, `celsius`, etc.

`lower = 0;
upper = 300;
step = 20;
fahr = lower;`

This section of code assigns values to the variables. Values such as 0, 300, and 20 are assigned to several variables, and `fahr = lower` demonstrates variable assignment between variables.

Since we need to convert many temperature values at once, we will use a loop. For now, think of a loop as simply allowing a similar operation to be performed multiple times.

```c
while (fahr <= upper) {
    ...
}
```

`while` is the syntax used for repetition. It tests whether the statement in the parentheses following `while` (in this case, `fahr <= upper`) is true; if it is, it executes the statements in the braces. After executing the code inside the braces, it tests whether the statement in the parentheses is still true. This process continues until the statement in the parentheses becomes false, at which point the loop terminates.

Here is an example to illustrate this. The following code prints `1 2 3 4 5`.

```c
#include <stdio.h>

main() {
    int i;
    i = 1;
    while (i <= 5) {
        printf("%d ", i);
        i = i + 1;
    }
}
```

In this case, we have indented all the code within the braces following the `while`. This aims to make it clear at a glance where the code belongs within the `while` loop. Such indentation does not affect the operation of the code but greatly enhances readability, so most editors do it automatically.

If not, pay attention to indentation as it has a significant impact on readability. Writing code in a readable manner helps when collaborating with others or even when reading your own code later on.

There are many debates about styles of indentation, but it suffices to choose a suitable style. Such readability enhancements are often managed automatically by most editors, so it is enough to be aware of them.

`celsius = 5 * (fahr - 32) / 9;
printf("%d\t%d\n", fahr, celsius);
fahr = fahr + step;`

This part applies the appropriate conversion formula to the Fahrenheit temperature and assigns it to the Celsius temperature variable. It then prints both the Fahrenheit temperature and the corresponding Celsius temperature.

Note that instead of multiplying `(fahr - 32)` by $ 5/9 $, we first multiply by 5 and then divide by 9. This is because in C, the result of integer division will always be an integer, and any fractional component is discarded, thus making `5/9` equal to 0. Hence, to obtain a meaningful value, one must do it as illustrated above.

The statement containing `printf` shows how `printf` operates. The first argument of `printf` is the string to be printed. If the string includes a format specifier with `%`, it gets replaced with the values of other arguments. This will be discussed in more detail later.

However, `printf` is not part of the C language itself. C lacks built-in input-output; it merely defines functions in its standard library, and the internal implementation may vary slightly between implementations. Nevertheless, the operation of `printf` is consistent across all compilers as it is defined in the standard.

Such input-output related issues are largely unrelated to the core syntax of the C language, so we will address them in detail at the end.

# 3. Some Improvements

## 3.1 Output Format

A problem with the current code is that the output is not right-aligned, making it look unattractive. This can be easily resolved by appropriately adjusting the output format. By adding a number in front of the format letter, such as `%6d`, you specify the width of the output. The output will then be right-aligned within that width.

Thus, we can modify the output as follows:

`printf("%3d %6d\n", fahr, celsius);`

This will make the first number right-aligned within a width of 3, and the second number right-aligned within a width of 6. Let’s run it in each of our environments.

However, if you set a width smaller than the length of the number being printed, for example, `%2d`, the set width is ignored, and the number is printed as is.

## 3.2 Floating-point Values

Currently, all output consists of integers. This is because the fractional part of the converted temperature values has been discarded. However, you may wish to calculate more accurate Celsius-Fahrenheit conversion values.

To do this, we should not discard the fraction in the division of the conversion formula. We will rewrite the code using floating-point types.

```c
#include <stdio.h>

/* Prints a Fahrenheit-Celsius table for 
	Fahrenheit 0, 20, ... , 300 degrees - floating-point version */

main() {
	float fahr, celsius;
	int lower, upper, step;

	lower = 0;
	upper = 300;
	step = 20;
	fahr = lower;

	while (fahr <= upper) {
		celsius = (5.0 / 9.0) * (fahr - 32.0);
		printf("%3.0f %6.2f\n", fahr, celsius);
		fahr = fahr + step;
	}
}
```

The Fahrenheit and Celsius temperature variables have become floating-point types (float), and the conversion formula has changed slightly. Unlike integer division, which discards the fractional part, division between floating-point numbers retains the precision of the results, allowing for more accurate outputs.

The expression `(5.0 / 9.0)` falls under the same context. While we could not multiply `5/9` directly due to integer division discarding the decimal, `(5.0 / 9.0)` represents floating-point division, allowing the accurate result to be obtained. (Due to the binary storage of floating-point numbers, perfection is not guaranteed, but these results are far more accurate than integer division.)

It is important to note that in binary operations like addition or division, if both operands share the same type, they will be calculated as is. However, if one is an integer and the other a floating-point number, the integer will be implicitly converted to a floating-point number before computation. Generally, floating-point constants usually have a decimal point for readability.

This behavior is also observed in assignment operations, such as `fahr = lower;`, where the integer type `lower` is implicitly converted to a floating-point type before being assigned. We will explore this in more detail later.

Additionally, like formatting widths, there are also formats for specifying how many decimal places to print. For example, `%.2f` means to output floating-point numbers rounded to two decimal places.

As seen in the code above, it is also possible to combine width formatting with this. `%6.2f` indicates that the floating-point number will be printed within a width of 6 and to two decimal places.
