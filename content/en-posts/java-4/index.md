---
title: Midterm Exam Review for Java Chapters 3 and 4
date: "2022-10-17T01:00:00Z"
description: "Midterm exam preparation summary for JAVA Chapter 3"
tags: ["language"]
---

This document summarizes the content of operators in Chapter 3 and conditional statements and loops in Chapter 4 of Java. Since these topics are also familiar from C and other languages, only key points have been concisely outlined.

- There is a unary operator for sign that automatically converts to int type. Therefore, the following code will result in an error:

```java
byte a = 1;
byte b = -a; // The result of -a is int, causing an error
```

- Using Math.random(), values can be generated in the range of 0.0 <= x < 1.0, where 1.0 is excluded.

Using this, an expression to obtain one of n integers starting from 'start' can be constructed as follows: `(int)(Math.random() * n) + start`.

- The switch statement in Java can also be applied to strings. More specifically, the condition in a switch statement must be of type int, char, String, or enum.

```java
package study;

import java.util.Scanner;

public class Hello {
  public static void main(String[] args){
    // Create a Scanner object and store it in sc
    Scanner sc = new Scanner(System.in);
    // Read the name and store it in name
    String name = sc.nextLine();
    switch (name){
      case "김성현":
        System.out.println("Hello, 김성현!");
        break;
      default:
        System.out.println("Hello!");
    }
  }
}
```

- It is not advisable to use floating-point variables as loop counters.

Since floating-point numbers cannot be precisely represented in computers, incorrect counting may occur.

```java
package study;

public class Hello {
  public static void main(String[] args){
    for(double i = 0.1; i <= 1.0; i += 0.1){
      System.out.println(i);
      // There are instances where it does not increase exactly by 0.1 intermittently, which may lead to unintended execution
    }
  }
}
```

- Labels can be used to exit nested loops in a single operation.

By attaching a suitably named label before the loop you wish to exit, you can use `break Label;`. The label can be appropriately renamed based on the specified label name.

```java
package study;

public class Hello {
  public static void main(String[] args){
    Label: for(int i = 0; i < 5; i++){
      for(int j = 0; j < i; j++){
        for(int k = 0; k < j; k++){
          System.out.printf("%d %d %d\n", i, j, k);
          if(k == 1){ break Label; }
        }
      }
    }
  }
}
```