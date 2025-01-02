---
title: Summary of Chapter 9 in Java Self-Study
date: "2022-11-11T01:00:00Z"
description: "Nested Classes and Nested Interfaces"
tags: ["language"]
---

The Java midterm exam is over. Following that, I am learning about application programming. However, since there are still contents left from the book 'Java Self-Study,' I am organizing them. This time, I will summarize Chapter 9 on nested classes and nested interfaces.

In object-oriented programming, classes interact with each other. Certain classes may have relationships only with specific other classes, in which case it is possible to declare a class within another class.

# 1. Nested Classes

A nested class is a class declared within another class. This allows for the encapsulation of unnecessary relationship classes from the outside.

```java
class Outer {
    class Inner {
        // Inner class
    }
}
```

A nested class declared as a member of another class is called a member class, while a nested class declared within a constructor or method is called a local class. A local class is used only during the execution of the method and becomes unavailable after the method ends.

// To-do on static access

A nested class generates a bytecode file (.class) upon compilation as well.

## 1.1 Instance Member Class

An instance member class is a nested class declared without the static keyword. This class cannot declare static fields or methods.

```java
class A{
  // B class is an instance member class
  class B{
    B(){
      System.out.println("B");
    }
    int a;
    void print(){
      System.out.println("in classB");
    }
    static int c; // Error. Static fields cannot be declared in an instance member class
  }
}
```

To use class B from outside class A, an instance of class A must be created.

```java
A a = new A();
A.B b = a.new B();
```

Inside class A, an object of class B can be created without an instance of class A. However, since class B is an inner class of class A, it is common to restrict its use to within class A.

If there is an attempt to declare a static field in an instance member class, the error message 'The field [variable name] cannot be declared static in a non-static inner type, unless initialized with a constant expression' will be displayed.

The reason static members cannot be declared in an instance member class is due to potential ambiguity and lack of necessity.

The primary purpose of static members in a class is to define data that belongs to the class itself without creating an instance. However, because an instance member class inherently has a parent instance, there is no reason to define data that belongs to the member class itself.

Moreover, static members belong to the class itself and are shared among all instances, while an instance member class belongs to the parent instance, which may lead to ambiguity if static members are involved.

```java
class A{
  class B{
    static int BMember;
  }
}
```

Assuming that static members could exist in an instance member class, consider the code above. If two instances of class A are created and the value of BMember is changed for each.

```java
A a1 = new A();
A a2 = new A();
a1.B.BMember = 1;
a2.B.BMember = 2;
```

What should the value of BMember be? Should it be 2, considering they are both instances of the same B class? Or should it be 1 and 2, as a1 and a2 represent different instances? 

Assuming they are the same B class, it is strange because a1 and a2 are different instances but have the same instance member class. Conversely, if a1's B and a2's B are considered different classes, it is odd for BMember, a static member, to hold different values for a1.B.BMember and a2.B.BMember. 

Due to the potential for such ambiguities, static members cannot be declared in an instance member class.

## 1.2 Static Member Class

A static member class is a class declared with the static keyword. This class can declare fields and methods of all types.

```java
class A{
  A(){
    System.out.println("A");
  }
  static class C{
    C(){
      System.out.println("C");
    }
    int a;
    static int b;
    void print(){
      System.out.println("in classC");
    }
  }
}
```

Instances of static member classes can be created without creating an instance of the parent class.

```java
A.C c = new A.C();
c.print();
```

## 1.3 Local Class

A local class is a class declared within a method. A local class can only be used within the method and is removed from memory when the method ends. As a result, it cannot have access modifiers or static modifiers, as it is only used within the method. Likewise, it can only declare instance fields and methods but not static members.

```java
class A{
  // B class is an instance member class
  A(){
    System.out.println("A");
  }

  void method(){
    // Local class
    class D{
      D(){
        System.out.println("D");
      }
      int a;
      void print(){
        System.out.println("in classD");
      }
    }
    D d = new D();
    d.print();
  }
}
```

Local classes are employed within the methods of the parent class. When a method is called, the local class is utilized.

```java
A a = new A();
// Using class D within method
a.method();
```

## 1.4 Nested Class Access Limitations

### 1.4.1 Accessing Member Classes from the Outer Class

There are several limitations when accessing member classes from the outer class, which are mostly sensible.

- Instances of instance member classes can only be created from instance fields and methods of the outer class.
- Instances of static member classes can be created from any field and method of the outer class.

Since an instance member class is inherently associated with an instance of the outer class, it is only logical that it can be created within the outer class's instance fields and methods.

In contrast, a static member class belongs to the outer class itself, allowing instance creation from anywhere within the outer class.

### 1.4.2 Accessing Outer Class Members from Member Classes

- An instance member class can access all fields and methods of the outer class.
- A static member class can only access static fields and static methods of the outer class.

Since instance member classes exist per instance, they can naturally access the static members belonging to the class itself.

In contrast, static member classes have no relationship with the instance of the outer class, hence cannot access instance fields and methods of the outer class.

```java
class A{
  // B class is an instance member class
  int field1;
  static int field2;
  void method1(){
    System.out.println("A instance method1()");
  }
  static void method2(){
    System.out.println("A static method2()");
  }

  class B{
    void method(){
      field1 = 10;
      field2 = 10;
      method1();
      method2();
    }
  }

  static class C{
    void method(){
      // Only static members are accessible
      // field1 = 10; // Error
      field2 = 10; 
      // method1(); // Error
      method2();
    }
  }
}
```

### 1.4.3 Accessing Outer Class Members from Local Classes

There may be instances where local variables or method parameters are used within a local class. Since local classes only exist within the method, they typically disappear when the method terminates. However, in cases such as threads, the local class may exist even after the method finishes executing.

To prevent issues, Java compiles local variables and parameters used in local classes as final. Thus, local classes cannot modify parameters or local variables. Even if they are not declared final, they are automatically considered as such.

If an attempt is made to modify parameters or local variables inside a local class, a compilation error will occur, denoted as 'Local variable [variable name] defined in an enclosing scope must be final or effectively final.' This means that the variable must be final or behave as if it is final, thus indicating that parameters or local variables should not be changed within the local class.

### 1.4.4 Referencing the Outer Class from Nested Classes

Within a class, `this` references the object itself. However, a nested class may sometimes need to reference the outer class. For instance, to call a method of the outer class. To do this, the name of the outer class should be prefixed before `this`.

```java
class A{
  String field = "Outer field";
  void method(){
    System.out.println("Outer class");
  }

  class B{
    String field = "Inner field";
    void method(){
      System.out.println("Inner class");
    }
    void print (){
      System.out.println(this.field);
      this.method();
      System.out.println(A.this.field);
      A.this.method();
    }
  }
}
```

The following code can be executed in the main function.

```java
A a = new A();
A.B b = a.new B();
b.print();
```

The result is as follows:

```
Inner field
Inner class
Outer field
Outer class
```

# 2. Nested Interfaces

A nested interface is an interface declared as a member of a class. Both instance member interfaces and static member interfaces are possible. Access is similar to that of nested classes.

They are often used for event handling in UI programming.

# 3. Anonymous Objects

An anonymous object is an object without a name. An anonymous object must either inherit from a certain class or implement an interface. Typically, a class name is explicitly provided during declaration. However, an anonymous object declares an anonymous class that inherits from the parent class or implements the interface and simultaneously creates an instance of that class. Thus, an anonymous object does not have a class name and must implement the parent class or interface.

## 3.1 Anonymous Child Objects

When creating a child object of a specific class, it is generally done as follows: First, the parent class and its child class are declared.

```java
class Parent{
  Parent(){
    System.out.println("Parent Constructor");
  }
}

class Child extends Parent{
  Child(){
    System.out.println("Child Constructor");
  }
}
```

Then, the child object is created as follows.

```java
Parent a = new Child();
```

However, if the child class is not to be reused and is only used once in a specific location, an anonymous object can be utilized more simply. An anonymous object can be created as follows:

```java
class Parent{
  Parent(){
    System.out.println("Parent Constructor");
  }

  void method(){
    System.out.println("Parent method");
  }
}

// Declaration and use of an anonymous object
Parent a = new Parent(){
  @Override
  void method(){
    System.out.println("Child method");
  }
};
a.method();
```

Typically, methods of the parent class are overridden within anonymous objects. Moreover, constructors cannot be declared in anonymous objects; any arguments passed during the creation of the anonymous object are forwarded to the parent class constructor, triggering the parent class constructor.

These anonymous objects can be used as initial values when declaring local variables, as method arguments, and as return values from methods, among other uses.

It is important to note that since anonymous objects are assigned to parent class type variables, any newly defined fields or methods in the anonymous object cannot be accessed from outside. Normally, parent class type variables can be type-casted to child class types, but it is impossible because anonymous objects do not have names.

```java
Parent a = new Parent(){
  @Override
  void method(){
    System.out.println("Child method");
  }
  // Method not present in the parent class
  void method2(){
    System.out.println("Child method, second");
  }
};
a.method();
a.method2(); // Error. Cannot call newly defined method in an anonymous object from outside.
```

## 3.2 Anonymous Implementation Objects

When creating implementation objects of interface types, the general process involves interface declaration, implementation class declaration, and implementation object creation. However, this process can be abbreviated by creating an anonymous implementation object of the interface.

In the following example, the Person interface is declared, and we create an anonymous implementation object. The anonymous implementation object must implement all abstract methods declared in the interface.

```java
interface Person{
  public void setName(String name);
  public String getName();
}

// Declaration and use of an anonymous implementation object
Person me = new Person(){
  String name;
  @Override
  public void setName(String name){
    this.name = name;
  }
  @Override
  public String getName(){
    return name;
  }
};
me.setName("witch");
System.out.println(me.getName());
```

In this way, anonymous objects can be used in field declarations, as local variables, as method arguments, and even as return values from methods! Anonymous implementation objects can also be passed as method arguments!

## 3.3 Using Local Variables in Anonymous Objects

Anonymous objects typically cease to exist when the method execution ends. However, when using an anonymous thread object, it may persist even after the method execution is finished.

When using parameters or local variables within such an anonymous object, problems may arise. Since parameters and local variables disappear when the method execution is completed, if the anonymous object lives beyond that, they cannot be utilized.

To handle this, Java compiles parameters and local variables used within anonymous objects by copying them for later use. If parameters or local variables are modified, the values would become inconsistent with those in the anonymous object, which results in enforcing them to be declared final. If not explicitly declared as final, from Java 8 onward, they will be treated as automatically final.

The following code does not alter the values of parameters or local variables, making it work correctly.

```java
// Interface
interface Calculate{
  public int sum_args();
  public int sum_locals();
}
```

```java
class Anonymous{
  public void method(int arg1, int arg2){
    int b1 = 3;
    int b2 = 4;

    // Using an anonymous implementation object
    Calculate calc = new Calculate() {
      @Override
      public int sum_args() {
        return arg1 + arg2;
      }
      @Override
      public int sum_locals() {
        return b1 + b2;
      }
    };
    // Sum of parameters
    System.out.println(calc.sum_args());
    // Sum of local variables
    System.out.println(calc.sum_locals());
  }
}
```

However, attempting to modify local variables used within the anonymous object will result in a compilation error.

```java
class Anonymous{
  public void method(int arg1, int arg2){
    int b1 = 3;
    int b2 = 4;

    /* Any attempt to modify parameters or local variables used within the anonymous object will cause an error
    because they are automatically treated as final
    arg1 = 10;
    arg2 = 20;

    b1 = 30;
    b2 = 40;
    */

    Calculate calc = new Calculate() {
      @Override
      public int sum_args() {
        return arg1 + arg2;
      }
      @Override
      public int sum_locals() {
        return b1 + b2;
      }
    };
    // Sum of parameters
    System.out.println(calc.sum_args());
    // Sum of local variables
    System.out.println(calc.sum_locals());
  }
}
```

# References

Reason why static member variables cannot exist in instance member classes: https://stackoverflow.com/questions/1953530/why-does-java-prohibit-static-fields-in-inner-classes