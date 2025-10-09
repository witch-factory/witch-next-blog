---
title: Midterm Exam Preparation Java Unit 1 Summary
date: "2022-10-16T00:00:00Z"
description: "Summary of Java content for midterm exam preparation, Unit 1"
tags: ["language"]
---

# 1. Midterm Exam Preparation

This semester, I am taking a Java language course. While cramming the Java-related content learned in class, I am organizing my notes in this blog. I have also referred to the book "Java for Independent Study."

# 2. Features of Java

To write a Java program, you must first create a `.java` file. This file can be compiled into a `.class` file by the Java compiler using the `javac` command. The class file contains bytecode, which is translated into machine code and executed by the Java command.

This Java command executes the Java Virtual Machine (JVM). The use of the JVM allows the `.class` file containing bytecode to run independently of the operating system. This characteristic makes Java OS-independent.

The process of executing Java code is as follows:

1. Create a `.java` file
2. Compile the source file to a bytecode file (`.class`) using the `javac` command
3. Execute the bytecode file using the `java` command
4. The JVM provided by each operating system translates the bytecode into machine code and executes it

# 3. Writing and Executing Basic Code

Let’s write and execute some basic code. I ran the code by installing extensions in Vscode. [Referenced blog](https://kangdanne.tistory.com/m/3)

Create a folder with an appropriate name (I created a study folder) within the src folder, and then create a `Hello.java` file inside it. The file will automatically contain the package name matching the folder name and the class name matching the file name. Specifically, the following content is automatically generated in the file.

```java
package study;

public class Hello {

}
```

Now, let’s create a `main` method in this file to execute it. To compile the bytecode using the `javac` command and execute it with the `java` command, the class must contain a main method. This is because when the bytecode file is executed, the program first searches for and runs the main method. The following code prints `Hello, World!` within the main function using the `System.out.println` function.

```java
package study;

public class Hello {
  public static void main(String[] args){
    System.out.println("Hello, world!");
  }
}
```

You can execute the code by clicking the run button in Vscode.

# 4. Comments

There are three types of comments in Java. Since they are ignored during the compilation process, they have no effect on the execution speed or the size of the bytecode file.

```java
package study;

public class Hello {
  // This is a single-line comment. It is treated as a comment until the end of the line.

  /*
   * This is a block comment. Every line in this block is treated as a comment.
   */

   /**
    * This is a documentation comment. It is mainly used for documentation in javadoc.
    */
  public static void main(String[] args){
    System.out.println("Hello, world!");
  }
}

```