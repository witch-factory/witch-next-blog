---
title: Midterm Exam Preparation Java Chapter 2.4 Summary
date: "2022-10-17T00:00:00Z"
description: "Midterm Exam Preparation JAVA Content Summary Chapter 2.4"
tags: ["language"]
---

This document covers the content related to variables and system input/output in Java Chapter 2.4.

# 1. System Input/Output

Until now, we have used functions associated with `System.in` and `System.out` for monitor input and output. This can especially be seen in `System.out.println`.

## 1.1 System Output

The `System.out.println` we have used prints a line and moves to a new line. If you do not want to add a newline after the printed content, you can use `System.out.print`.

Additionally, `System.out.printf` is provided for printing formatted strings similar to the C language. This function operates in the same manner as the `printf` function in C. An example of using a format string is as follows:

```java
package study;

public class Hello {
  public static void main(String[] args){
    System.out.printf("My name is %s and I am %d years old." , "Hong Gil-dong", 20);
  }
}
```

## 1.2 System Input

There are input functions that receive input from the user. The `System.in.read()` function reads a single character. However, this function can only read one character at a time, which means it cannot accept strings like "ab" or even Korean characters. The Enter key is processed as both a carriage return and a line feed with two keystrokes.

To address this limitation, the Scanner class is introduced. By creating a Scanner object and using the `nextLine()` function, you can accept an entire line of input.

```java
package study;

import java.util.Scanner;

public class Hello {
  public static void main(String[] args){
    // Create a Scanner object and store it in sc
    Scanner sc = new Scanner(System.in);
    // Store the read string
    String userInput = sc.nextLine();
    System.out.println(userInput);
  }
}
```