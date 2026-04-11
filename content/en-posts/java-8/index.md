---
title: Preparation for Midterm - Summary of Java Chapter 8
date: "2022-10-19T01:00:00Z"
description: "Summary of JAVA content in preparation for the midterm exam, Chapter 7"
tags: ["language"]
---

Self-Study Summary of Java Chapter 8: Interfaces

# 1. Interface

An interface serves as a communication point between the developer's code and objects. When the developer's code calls a method of the interface, the interface, in turn, calls the method of the object. Thus, the developer's code only needs to reference the methods defined in the interface.

The reason for using interfaces is to enable the change of objects without modifying the developer's code. Since the developer only needs to call methods defined in the interface, there is no need to change the developer's code when the object is altered.

## 1.1 Declaring an Interface

An interface has the same physical form as a class but uses the `interface` keyword instead of `class`.

```java
public interface [InterfaceName]{}
```

Interfaces do not instantiate objects; they define the rules for object usage. Therefore, interfaces do not have constructors and cannot contain implementations for fields and methods. Furthermore, since there are no interface objects, `this` and `super` cannot be used. They only consist of constant fields and abstract methods.

- Declaring Constant Fields

An interface cannot declare instance or static fields; it can only declare constant fields, which must be accompanied by `public static final`, as noted previously. Even if omitted, these modifiers are automatically applied during compilation. Additionally, constants must be initialized at the time of declaration.

- Declaring Abstract Methods

Methods called through an interface are ultimately executed by the object. Therefore, interface methods are declared as abstract methods without an execution block. Abstract methods in the interface should be declared with `public abstract`. If omitted, these modifiers are also automatically applied during compilation, since the interface only facilitates the connection between method calls in the developer's code and method calls in the object.

## 1.2 Implementing an Interface

When the developer's code calls an interface method, the interface subsequently calls the object's method. Thus, an object that implements an interface must implement all its methods. To achieve this, a class implementing the interface uses the `implements` keyword. A class that implements the contents of an interface is referred to as the implementing class.

```java
public class MyClass implements MyInterface {
    // Must implement the concrete methods defined in MyInterface.
    @Override
    public void method1() {
        System.out.println("MyClass-method1() executed");
    }

    @Override
    public void method2() {
        System.out.println("MyClass-method2() executed");
    }
}
```

To utilize the implementing object as an interface, an interface variable must be declared and the implementing object assigned to it. As a result, the interface variable will store the address of the implementing object.

```java
MyInterface myInterface = new MyClass();
```

## 1.3 Multiple Interface Implementation

An object can be used as multiple interface types.

```java
public class MyClass implements InterfaceA, InterfaceB {}
```

In this case, MyClass must implement all methods of interfaces A and B. Concrete methods must be written for all abstract methods in both interfaces.

This allows a MyClass object to be assigned to both InterfaceA and InterfaceB variables.

## 1.4 Usage of Interfaces

When declaring a class, an interface can be declared as fields, constructors, method parameters, or local variables in constructors or methods. Sections declared as interface types can hold the implementing object of the interface. Depending on which implementing object is used, the method called from the interface will connect to methods from different classes.

# 2. Type Conversion and Polymorphism

When methods are called via interfaces during program development, switching the implementing object can change which methods are invoked. This allows for easy adjustment of the program's execution results, which is called polymorphism. Moreover, implementing objects can automatically convert to interface types. However, when calling methods from an interface type variable, the methods of the assigned implementing class will be called.

## 2.1 Parameter Polymorphism

Automatic type conversion is more common when parameters are passed during method calls than when assigning values to fields. In the case of polymorphism through interfaces, parameters are declared as interface types, and implementing objects are assigned at the time of calling.

When invoking a method, the implementing object of the interface can be passed as a parameter. The behavior of the method may vary based on which class the implementing object belongs to. The execution result of the method will differ depending on which implementing object is provided during the method call.

## 2.2 Forced Type Conversion of Interfaces

Automatically converting an implementing object to an interface type allows only the methods declared in the interface to be called. If three methods are declared in the interface and the method parameter is declared as the interface type, only the three methods declared in the interface can be called, regardless of how many methods are defined in the implementing object.

However, forcing the type conversion from interface type to implementing object type allows the methods declared in the implementing object to be called. This is referred to as downcasting of the interface type.

Forced type conversion is only possible when the implementing object has already been automatically converted to the interface type. Attempting forced type conversion without knowing the type of the implementing object will result in a compile-time error. In such cases, the `instanceof` operator should be used to check if the implementing object has been automatically converted to the interface type before performing forced type conversion, similar to inheritance.

```java
if(vehicle instanceof Bus) {
    Bus bus = (Bus) vehicle;
}
```

# 3. Interface Inheritance

Interfaces can also inherit from other interfaces. Similar to class inheritance, the `extends` keyword is used. Unlike class inheritance, multiple inheritance is permitted.

When a child interface is implemented by a class, the class must provide implementations for all abstract methods from both the child and parent (superior) interfaces. As a result, an object instantiated from the implementing class can be typecast to either the child or parent interface type.

One important point to note is that when typecast to the super interface, only the methods declared in the super interface are accessible. Methods declared in the sub-interface cannot be used.