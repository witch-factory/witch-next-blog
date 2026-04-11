---
title: Midterm Exam Preparation Java Chapter 2 Summary
date: "2022-10-16T00:00:00Z"
description: "Summary of JAVA content for midterm exam preparation, Chapter 2"
tags: ["language"]
---

This document contains information about variables from Chapter 2 of Java.

# 1. Variables

Programs can store and retrieve values at specific memory addresses through variables. We can declare variables, store values in them, and read those values for use. The specific memory management is handled by the JVM.

## 1.1 Variable Declaration and Initialization

To use a variable, it must be declared. The declaration informs the program of the type of value being stored and the variable name.

```java
[type] [variable name]
int age;
```

In Java, local variables cannot be used without initialization. In contrast, class member variables and static variables may receive default values based on their types without explicit initialization. For now, we will only use local variables declared within methods, which cannot be used without initialization.

```java
package study;

public class Hello {
  public static void main(String[] args){
    int x;
    // The local variable x has not been initialized, hence the following line will cause an error.
    // "The local variable x may not have been initialized" error occurs
    System.out.println(x);
  }
}
```

Only after assigning a value to initialize it can the variable be used.

```java
package study;

public class Hello {
  public static void main(String[] args){
    int x;
    // Initialize the value of x
    x=1;
    System.out.println(x);
  }
}
```

# 1.2 Variable Scope

All variables in Java are declared and used within braces. Variables declared within method blocks are referred to as local variables. Local variables can only be used within the block where they are declared. Once the block is exited, the variable ceases to exist.

This is the same for other variables as well; Java variables can only be used within the block in which they were declared. For instance, the following code will cause an error because x can only be accessed within the block where it is declared.

```java
package study;

public class Hello {
  public static void main(String[] args){
    {int x;}
    // Cannot access x outside the braces, hence an error occurs
    x=1;
    System.out.println(x);
  }
}
```

# 2. Primitive Types

Java provides the following primitive types. Entering values beyond the representable range results in a compile error.

- Integer Types
  - byte: 1 byte, -128 to 127
  - char: 2 bytes, 0 to 65535
  - short: 2 bytes, -32768 to 32767
  - int: 4 bytes, -2147483648 to 2147483647
  - long: 8 bytes, -9223372036854775808 to 9223372036854775807
- Floating Point Types
  - float: 4 bytes, 1.4E-45 to 3.4028235E38
  - double: 8 bytes, 4.9E-324 to 1.7976931348623157E308
- Boolean Type
  - boolean

## 2.1 Literals

### 2.1.1 Integer Literals

Values directly entered by the programmer are referred to as literals. Integer literals can be input in various forms.

Binary literals start with 0b or 0B. For instance, `0b1010` means 10 in decimal. If a binary literal includes digits other than 0 or 1, it results in a compile error.

Octal literals start with 0. For example, `010` means 8 in decimal. If an octal literal includes digits other than 0 to 7, it results in a compile error.

Hexadecimal literals start with 0x or 0X. For example, `0x10` means 16 in decimal. If a hexadecimal literal contains digits other than 0 to 9, a to f, or A to F, it results in a compile error.

Decimal literals can simply be entered as numbers. Naturally, `10` means 10 in decimal.

Literals can also include underscores (_) for improved readability. For example, `1_000_000` means one million.

It is important to note that the compiler recognizes integer literals as being of type int by default. Hence, if a literal exceeds the int range, an error occurs even if the variable is of type long. To input a literal of type long, you must append L or l to the number, for instance, `10000000000L` signifies ten billion.

### 2.1.2 Character Literals

Character literals are expressed within single quotes (‘ ). For example, `'A'` signifies the character A. Character literals are stored as 2-byte Unicode characters, hence their range is 0 to 65535 (0 to 2^16-1).

Since Unicode is an integer, char also represents an integer type, allowing integer literals to be assigned. For instance, 65 represents `'A'`, and 44032 represents `'가'`.

Character literals are converted to Unicode, allowing them to be stored in other integer types. Of course, the output will differ based on the variable type.

```java
package study;

public class Hello {
  public static void main(String[] args){
    int x='가';
    char y='가';
    // Initialize the value of x
    System.out.println(x); // Outputs 44032
    System.out.println(y); // Outputs 가
  }
}
```

## 2.2 String Type

The char type cannot represent a complete word, as it can only store a single character. In these cases, the String type is introduced. While not a primitive type, it is frequently used, and its various functionalities will be discussed later. Here, we will only introduce the type.

String is a type used to store strings. String literals are expressed in double quotes (“”). For example, “Hello” signifies the string Hello. Single quotes are used for character literals, so be careful not to confuse them.

```java
package study;

public class Hello {
  public static void main(String[] args){
    String word="저는 마녀입니다.";
    System.out.println(word);
  }
}
```

## 2.3 Floating Point Types

Java provides two floating point types: float and double. Float is 4 bytes, while double is 8 bytes. Float can represent up to 7 decimal places, while double can represent up to 15 decimal places. In memory, they are stored according to the IEEE 754 standard, which is covered in courses like Computer Systems.

Moreover, floating point literals are recognized as double type by default. Therefore, floating point literals should be stored as double type. If you want to use float type literals, append f at the end. For example, 3.14 represents a double type floating point literal while 3.14f represents a float type floating point literal.

Additionally, decimal floating point values can be represented in the exponent format, such as `5e2`, which means 5 * 10^2 = 500.

## 2.4 Boolean Type

The boolean type, representing true or false values, is also provided as a primitive type in Java. It occupies 1 byte of memory and can hold only two values: true and false. Boolean type variables are primarily used as conditions in if statements, while loops, and for loops.

# 3. Type Conversion

In Java, type conversion is necessary when storing values of different types. For instance, when storing an int type value in a long type variable, the int value must be converted to long type. This type conversion can happen automatically or explicitly.

## 3.1 Automatic Type Conversion

Automatic type conversion occurs when storing a smaller type into a larger type. For example, when storing an int type value in a long type variable, the int value is automatically converted to long type. There is no issue since all possible int values can fit into a long variable.

Automatic type conversion follows these rules:

- byte, short, char are converted to int.
- int is converted to long.
- long is converted to float.
- float is converted to double.

Notably, when an integer type is stored into a floating point type, automatic type conversion occurs. Additionally, byte, which has a smaller range than char, cannot be automatically converted to char, as char is an integer type that does not include negative values (byte ranges from -128 to 127).

## 3.2 Forced Type Conversion

When storing a larger type into a smaller type, forced type conversion is required. Forced type conversion is written in the following format:

```java
[smaller type variable]=([smaller type]) [larger type variable]
byte b=(byte)a;
```

When converting floating point types to integer types, the fractional value is truncated. For instance, when storing a double type value in an int variable, the fractional part is discarded.

## 3.3 Automatic Type Conversion in Operations

When integer type variables are used as operands in arithmetic operations, byte and short types, which have a smaller range than int, are automatically converted to int. Therefore, the following code will result in an error.

```java
package study;

public class Hello {
  public static void main(String[] args){
    byte a=10, b=20;
    // Since a+b is automatically converted to int for calculation, trying to assign it to a byte will cause an error
    byte c=a+b;
    System.out.println(c);
  }
}
```

However, not all operations between integer variables are automatically converted to int. The conversion occurs based on which operand has the larger range. For example, if a long type is used as an operand, both operands are converted to long for the calculation.

This is analogous to automatic type conversion. The same applies for operations between floating point types, as well as between floating and integer types. If one operand is float and the other is double, both operands are automatically converted to double.

## 3.4 Forced Type Conversion in Operations

You may wish to have a division result as a floating point value. For example, dividing 1 by 2 results in 0, which is incorrect.

```java
package study;

public class Hello {
  public static void main(String[] args){
    int a=1, b=2;
    System.out.println(a/b);
  }
}
```

To solve this, forced type conversion can be used. If at least one operand is converted to double, the result will also be double.

```java
package study;

public class Hello {
  public static void main(String[] args){
    int a=1, b=2;
    System.out.println((double)a/b);
  }
}
```

## 3.5 String Automatic Type Conversion

When a string is concatenated with another type using the + operator, it is converted to a string. This is known as string automatic type conversion.

```java
package study;

public class Hello {
  public static void main(String[] args){
    int a=123;
    String word="witch";
    System.out.println(a+word); // Outputs 123witch
  }
}
```

It is important to note that this automatic type conversion only applies to the two operands in question, making the order of operations crucial. Java performs addition from left to right. Thus, in the expression `123+456+"witch"`, `123+456` is computed first, yielding `579witch`. Conversely, `"witch"+123+456` produces `witch123456`. If you want to compute a specific part first, use parentheses.

## 3.6 Converting Strings to Primitive Types

Converting a string to a primitive type is known as parsing. The method for converting a string to a primitive type involves using the parseXXX() method corresponding to each primitive type. For example, to convert an integer string to int, use the Integer.parseInt() method.

- Byte.parseByte(): converts an integer string to byte
- Short.parseShort(): converts an integer string to short
- Integer.parseInt(): converts an integer string to int
- Long.parseLong(): converts an integer string to long
- Float.parseFloat(): converts a floating point string to float
- Double.parseDouble(): converts a floating point string to double
- Boolean.parseBoolean(): converts boolean strings ("true", "false") to boolean

If a string cannot be converted to a primitive type (for example, "abc" cannot be converted, nor can hexadecimal strings like "0xabc"), a NumberFormatException will occur.

Conversely, to change a primitive type value to a String, use the String.valueOf() method.

# Reference

For information on variable initialization: https://stackoverflow.com/questions/19131336/default-values-and-initialization-in-java