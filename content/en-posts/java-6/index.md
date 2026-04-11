---
title: Midterm Exam Preparation - Java Chapter 6 Summary
date: "2022-10-18T00:00:00Z"
description: "Java content summary for midterm exam - Chapter 6"
tags: ["language"]
---

Summary of Chapter 6 regarding classes from self-study in Java.

# 1. Object-Oriented Programming

## 1.1 Objects

An object consists of properties and behaviors. In this context, properties are typically referred to as fields, while behaviors are called methods. Object modeling involves distilling the behaviors of real-world objects into fields and methods of software objects. It also entails expressing phenomena in reality through interactions between objects (which occur via messages).

## 1.2 Classes

To create objects, a blueprint is necessary. In Java, this blueprint is a class. A class defines the fields and methods required to instantiate an object, and the objects created from this class are referred to as instances.

Multiple classes can be declared within a single file; upon compilation, bytecode files are generated corresponding to the number of declared classes.

It is important to note that the name of a class declared as public must match the filename. The `new` operator is utilized when creating an instance of a class.

```java
// Student.java
package study;

public class Student {
  String name;
}

// Hello.java
package study;

public class Hello {

  public static void main(String[] args){
    Student s1=new Student();
    s1.name="Kim Sung-hyun";
    System.out.println(s1.name);
  }
}
```

## 1.3 Components of a Class

The components of a class include fields, constructors, and methods. The constructor shares the same name as the class and does not have a return type. It is invoked when an object is created and is responsible for initializing the fields.

# 2. Fields

Fields represent the properties of an object and can be declared before or after the constructor and method declarations. They can have both primitive and reference types. Initial values may be provided during field declaration or omitted. If omitted, default values are assigned, with primitive types defaulting to 0 and reference types to null.

# 3. Constructors

Constructors are invoked to initialize an object when creating it from a class using the `new` operator. When a constructor executes, it initializes the object, which is created in heap memory.

If no constructor is declared by the user, a default constructor is automatically added during compilation. However, if any constructor is explicitly defined, the default constructor will not be added. This means that if a constructor is explicitly declared, it must be called to create an object.

## 3.1 Field Initialization

Class field initialization can be accomplished in two ways: by providing an initial value during field declaration or through the constructor. 

Constructors can be overloaded to accept various arguments. The constructor called depends on the form of the arguments passed during object creation using `new`. This is known as constructor overloading.

As the number of overloaded constructors increases, so can code duplication among them. To mitigate this, the `this()` method can be used, which invokes another constructor of the same class. Note that `this()` is only permitted as the first statement in a constructor.

# 4. Methods

Class methods consist of a declaration and an execution block, akin to function declarations. The method declaration part is referred to as the method signature.

The method signature consists of the method name, parameter list, and return type. It is utilized during method calls, necessitating that the method name and parameter list match. The return type is used when returning execution results.

## 4.1 Parameter Lists

In some cases, the number of parameters when declaring a method may be indeterminate. There are two solutions to this:

1. Declare the parameters as an array type.
2. Use `...` to declare parameters as variable arguments.

Using method 2 allows for greater convenience, as it obviates the need for creating an array beforehand. Therefore, variable arguments are more convenient than array type parameters when calling methods.

```java
package study;

public class Computer {
  int sum1(int[] values) {
    int sum = 0;
    for(int i = 0; i < values.length; i++) {
      sum += values[i];
    }
    return sum;
  }

  int sum2(int ...values) {
    int sum = 0;
    for(int i = 0; i < values.length; i++) {
      sum += values[i];
    }
    return sum;
  }
}
```

## 4.2 Method Overloading

Declaring multiple methods with the same name within a class is known as method overloading. For methods with the same name, at least one of the parameter types, quantities, or order must differ. It is important to note that methods differing only in return type or parameter names are treated as the same method.

# 5. Instance Members and Static Members

Field and method members of a class must belong to all instances of the class. However, there may be a need for fields or methods shared among all instances. In such cases, these should be declared as static members instead of instance members. Instance members are those that belong to each object, whereas static members are shared among all instances of the class.

To access instance members from within an object, the `this` keyword is used. In contrast, static members are accessed using the class name.

## 5.1 Static Members and `static`

Static members are fixed to a class and can be accessed without creating an instance; they include fields and methods. The `static` keyword is used to declare static fields and methods.

Since static fields and methods are fixed to the class, they are created when the class is loaded into memory. Therefore, they can be used immediately after loading is complete.

Values that should differ among instances should be declared as instance fields, while values shared across instances should be declared as static fields. Whether a method is declared as instance or static depends on whether it includes instance fields. If it includes instance fields, it should be declared as an instance method; otherwise, as a static method.

## 5.2 Using Static Members

Static members can be used as soon as the class is loaded into memory, accessed through the class name.

```java
// Calculator.java
package study;

public class Calculator {
  static double pi = 3.141592;
  static int plus(int x, int y) {
    return x + y;
  }
  static int minus(int x, int y) {
    return x - y;
  }
}
// Hello.java
package study;

public class Hello {

  public static void main(String[] args) {
    int res = Calculator.plus(10, 20);
    System.out.println(Calculator.pi);
    System.out.println(res);
  }
}
```

While static fields and methods should ideally be accessed through the class name, they can also be accessed through instances. However, it is preferable to use the class name.

It is important to note that since static members run without an object, instance fields or instance methods cannot be used within static methods. The `this` reference is also not applicable. If instance fields or methods need to be accessed within a static method, an object must first be created.

This applies to the `main` method as well. Since `main` is a static method, it cannot directly use instance fields or instance methods.

```java
package study;

public class Hello {
  int temp;
  public static void main(String[] args) {
    // Cannot access instance variable temp from static method main - Error
    temp = 1;
  }
}
```

## 5.3 Final Fields and Constants

A final field indicates that it is a definitive field, meaning that once a value is assigned, it cannot be changed. It cannot be modified during the execution of the program. Consequently, a final field must either be provided with an initial value during declaration or initialized through the constructor. If a final field remains uninitialized even after constructor execution, a compile-time error will occur.

However, since final fields can be initialized through constructors, calling them "constants" is not sufficient unless they are static final fields.

# 6. Packages and Access Modifiers

The physical form of a package is akin to a folder in the file system. However, packages serve not only as folder structures but also function as part of class management, acting as unique identifiers for classes. Classes with the same name are recognized as different if they belong to different packages, highlighting the role of packages in class identification. 

## 6.1 Importing Packages

To use classes or interfaces belonging to another package, it is necessary to import that package. The `import` statement is utilized for this purpose and should be placed between the package declaration and the class declaration. The statement should specify the class name, including the package name.

```java
import upperPackage.lowerPackage.ClassName;
```

It is crucial to note that importing an upper package does not automatically import its lower packages.

Furthermore, if there are classes with the same name in different packages and both need to be utilized, the package name must be prefixed to the class name when calling them.

## 6.2 Access Modifiers

Access modifiers restrict the visibility of classes, fields, methods, and constructors. The access modifiers are `public`, `protected`, `default`, and `private`.

- `public`: No access restrictions; accessible from anywhere.
- `protected`: Usable within the same package or by child classes.
- `private`: Usable only within the same class.
- `default`: Usable only within the same package and not accessible from outside it; all others not explicitly stated are considered default.

These access modifiers can also be applied to constructors. The automatically provided default constructor when none is declared follows the same access restriction as the class. For example, if the class has `public` access, the default constructor likewise will have `public` access.

## 6.3 Getters and Setters

In object-oriented programming, direct external access to object fields is often restricted to maintain object integrity. Allowing external modifications could compromise this integrity.

Thus, fields should be kept inaccessible from outside, while getter and setter methods serve as channels for external access. These methods can validate parameters to ensure only valid values are stored in the object fields.

Consequently, it is advisable to declare fields as `private` to restrict direct external access and to declare getter and setter methods as public to allow controlled access.