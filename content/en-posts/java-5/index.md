---
title: Preparation for Midterm Exam - Java Chapter 5 Summary
date: "2022-10-17T02:00:00Z"
description: "Summary of JAVA content for Midterm Exam - Chapter 5"
tags: ["language"]
---

This document summarizes Chapter 5, which covers reference types in Java.

# 1. Reference Types

Java's primitive types include byte, char, short, int, long, float, double, and boolean. However, variables of these types are not the only types available. As previously discussed, String is also not a primitive type. Such types are referred to as reference types.

The main difference from primitive types is the value stored. Variables of primitive types store actual values, while reference type variables store memory addresses. For instance, in the case of String, the string object is stored in the heap area, and the address of that object is stored in the String type variable.

## 1.1 Comparison of Reference Variables

Reference type variables store address values. Therefore, comparing reference variables involves comparing these address values, essentially checking whether they refer to the same object. Consequently, the comparison of reference variables cannot be performed using the `==` operator, which is solely used for comparing primitive type variables.

For comparing reference type variables, either a separate method must be implemented, or pre-existing methods like the `equals()` method for strings should be used.

## 1.2 null

Reference type variables can hold a null value, indicating that they do not refer to any object in the heap area. The value of a reference variable initialized to null is stored in the stack area. Hence, comparisons can be made with `==` and `!=`.

Using a reference type variable that holds a null value will result in a NullPointerException, which occurs because the reference variable does not point to any object.

## 1.3 String Reference Variables

Strings are reference types, with the following characteristics:

- If string literals are the same, they refer to the same string object.
- A new object can be created using `new`. In this case, even if the contents are the same, it will refer to a different object, which requires the use of the `equals()` method for comparison.
- Being a reference type, null can be assigned to it. If null is assigned, the object that loses its reference will be removed by the garbage collector.

# 2. Arrays

Arrays are data structures that store elements of the same type in contiguous memory.

## 2.1 Array Declaration

Array variable declarations can be written in the following two ways:

```java
type[] variableName;
type variableName[];
```

For example, `int[] arr;` and `int arr[];` are both valid.

Since arrays are also reference type variables, they can be initialized to null. Arrays can be created through a list of values as follows:

`int arr[] = {1, 2, 3};`

Alternatively, they can be created using new:

`int arr[] = new int[3];`

In this case, each element of the array is initialized with default values: for primitive types, this is 0 (boolean defaults to false), and for reference types, it is null. For example, `new int[3]` will initialize to 0, 0, 0.

## 2.2 Array Length

The length of the array can be determined using the `length` field.

```java
int arr[] = {1, 2, 3, 4, 5};
System.out.println(arr.length);
```

Note that the length field is read-only and cannot be modified.

# 3. Enum Types

Enums are types that store one of a limited set of enumeration constants. For example, to create a type for days of the week, one could define it as follows:

```java
public enum Weekday {MON, TUE, WED, THU, FRI, SAT, SUN};
```

Enum type variables can be declared and initialized as shown in the following example:

```java
Weekday today = Weekday.MON;
```

Additionally, since enum types are reference types, they can also be initialized to null and refer to an object.

It is important to note that enum types, being reference types, will have variables storing the same enum constant refer to the same object. Therefore, the following code will output `true`:

```java
public enum Weekday {MON, TUE, WED, THU, FRI, SAT, SUN};
public static void main(String[] args){
    Weekday today = Weekday.MON;
    System.out.println(today == Weekday.MON);
}
```