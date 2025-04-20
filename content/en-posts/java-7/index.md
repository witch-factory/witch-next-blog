---
title: Midterm Exam Preparation - Summary of Java Chapter 7
date: "2022-10-19T00:00:00Z"
description: "Summary of JAVA content for midterm exam preparation, Chapter 7"
tags: ["language"]
---

Summary of inheritance concepts in Java Chapter 7 for self-study.

# 1. Inheritance

Inheritance allows the reuse of existing classes to create new ones. When declaring a child class, the `extends` keyword is used to define which parent class is being inherited. For example, a `Student` class can inherit from a `Person` class as follows:

```java
class Student extends Person {
    // ...
}
```

Key characteristics of inheritance to note are as follows:

- Multiple inheritance from parent classes is not allowed.
- Fields and methods with private access modifiers in the parent class are excluded from inheritance. If the parent and child classes are in different packages, fields and methods with default access modifiers are also excluded.

## 1.1 Parent Constructor Call

Assuming we create a class `B` that inherits from class `A`. The constructor of class `B` will call the constructor of class `A`, as a child object cannot be created without a parent object.

This is done using the `super` keyword. The `super` keyword is used to call the parent class's constructor and can only be used in the first statement of the constructor. If `super` is not used, the compiler automatically adds `super()`.

`super()` calls the default constructor of the parent class. If the parent class does not have a default constructor, a compile-time error will occur.

In other words, the constructor of the child class must explicitly or implicitly call the parent class's constructor.

```java
class Parent {
  String name;

  // The Parent class does not have a default constructor, so calling super() in the child class will cause an error.
  Parent(String name) {
    this.name = name;
  }
}

class Child extends Parent {
  Child() {
    super("Kim Seong-hyun");
  }
}
```

## 1.2 Method Overriding

Method overriding refers to redefining a method defined in the parent class within the child class. This modifies inherited methods for use in the child class.

When overriding a method, the following points must be observed:

- It must have the same signature as the parent class's method, meaning the method name, parameters, and return type must match.
- Access modifiers cannot be made stricter (e.g., if the parent's method is public, the overriding method in the child cannot be private).
- New exceptions cannot be thrown.

When a method is overridden, invoking that method on a child object calls the method defined in the child class instead of the parent class.

If the `@Override` annotation is added above the method declaration, the compiler will verify that the overriding is done correctly.

If you want to use the parent class's method in the child class without overriding it, you can use the `super` keyword:

```java
super.methodName(parameters); // This calls the parent class's method.
```

## 1.3 Final Class

The `final` keyword can be used when defining a class, such as `public final class className`. A final class cannot be inherited. For instance, the `String` class is a final class.

```java
// An error occurs because String is a final class and cannot be inherited.
class MyString extends String {}
```

If `final` is attached to a method declaration, it indicates that the method is final and cannot be overridden in child classes.

## 1.4 Protected Access Modifier

The protected access modifier allows access within the class itself, the same package, and child classes in different packages. Therefore, it can be freely accessed within the class and the same package, and only accessible by child classes if they belong to a different package.

# 2. Type Casting and Polymorphism

Polymorphism is a concept in object-oriented programming that allows the same method to yield different results based on the object used. To implement this, method overriding and type casting are necessary.

## 2.1 Class Type Casting

Type casting also occurs between classes. Class type casting appears among classes in an inheritance relationship, where a child class can be automatically upcast to a parent type. This occurs when a child type object is assigned to a parent type variable.

If the `Cat` class inherits from the `Animal` class, the code `Animal a = new Cat()` demonstrates that the Cat object is cast to the Animal type.

Moreover, automatic type casting can occur even if the upper class is not the immediate parent, as long as it is higher in the inheritance hierarchy.

It is important to note that once automatically type-cast to the parent type, only members declared in the parent class can be used. Members declared in the child class cannot be accessed. However, methods overridden in the child class can be called even after casting to the parent class type, and the overridden child's method will be invoked. This behavior relates to polymorphism.

```java
package study;

class Animal {
  public void eat() {
      System.out.println("Animal is eating");
  }
}

class Cat extends Animal {
  public void eat() {
      System.out.println("Cat is eating");
  }

  public void meow() {
      System.out.println("Cat is meowing");
  }
}

public class Hello {
  public static void main(String[] args) {
    Cat c = new Cat();
    Animal a = c; // c is cast to Animal type
    a.eat(); // Since eat() is overridden in the child class, Cat's eat() method is called
    c.eat(); // Naturally Cat's eat() method is called
    c.meow(); // Cat's meow() method is called. a.meow() cannot be called because it does not exist in the Animal class
  }
}
```

This automatic type casting is designed for polymorphism. When field types are declared as parent class types, various child class instances can be stored in that variable. Thus, invoking the same method on that field can yield different results depending on which child class instance is stored.

## 2.2 Parameter Polymorphism

Automatic type conversion occurs not only during field assignment but also frequently during method calls. If a method's parameter is of class A, an instance of class B (subclass of A) can be passed as a parameter. The instance of class B will automatically be converted to type A and passed as a method parameter. This means that not only instances of the class itself but also child instances can be used as parameters. This automatic type conversion is referred to as parameter polymorphism.

The following code demonstrates that calling the `drive` method with the same `driver` object yields different results.

```java
package study;

class Vehicle {
  public void run() {
    System.out.println("Vehicle is running");
  }
}

class Driver {
  public void drive(Vehicle v) {
    v.run();
  }
}

class Bus extends Vehicle {
  @Override
  public void run() {
    System.out.println("Bus is running");
  }
}

class Taxi extends Vehicle {
  @Override
  public void run() {
    System.out.println("Taxi is running");
  }
}

public class Hello {
  public static void main(String[] args) {
    Driver d = new Driver();
    Bus b = new Bus();
    Taxi t = new Taxi();
    d.drive(b); // Bus is running
    d.drive(t); // Taxi is running
  }
}
```

Forced type conversion is also possible, converting a parent type to a child type. However, not all parent type instances can be converted to child types. Forced type conversion can be applied once a child type instance has been automatically type cast to a parent type.

If all parent type instances could be converted to child types, it would lead to the issue of not being able to use methods specific to child type instances.

```java
Parent p = new Child();
Child c = (Child)p;
```

When a child type has been automatically cast to a parent type, only the fields and methods of the parent type can be used. When fields or methods declared in the child are required, forced type conversion to the child type can occur.

Forced type conversion can only happen when the child type is in a state of being converted to the parent type. Therefore, it is crucial to check whether a forced type conversion to the child type can be performed using the `instanceof` operator before executing it. For example:

```java
if (p instanceof Child) {
  Child c = (Child)p;
}
```

# 3. Abstract Classes

Classes from which objects cannot be instantiated directly are called concrete classes, while those that declare common characteristics are referred to as abstract classes. Concrete classes are created by inheriting from abstract classes. For example, an `Animal` class can be created to declare common fields and methods for the `Bird`, `Tiger`, and `Fish` classes, with each of these classes inheriting from `Animal`.

The reasons for declaring such abstract classes include:

- Ensuring consistency by standardizing common field and method names.
- Saving time when writing concrete classes.

To declare an abstract class, the keyword `abstract` must be added to the class declaration. Classes with this keyword cannot be instantiated using `new`, but can only be extended to create child classes.

An abstract class can contain fields, methods, and constructors. Thus, when instantiating the child class, the parent class's constructor should be called using `super(parameters)`.

An abstract class defines fields and methods that concrete classes should commonly have. Therefore, if all child classes have the same method content, it is advisable to define the method in the abstract class.

However, if the method declaration is common while the content must vary across children, abstract methods can be declared within the abstract class. An abstract method is declared without a body. When an abstract method is declared, the child class must provide an implementation for that method; failing to override an abstract method results in a compile-time error.

```java
[Access Modifier] abstract [Return Type] [Method Name](Parameters)
```