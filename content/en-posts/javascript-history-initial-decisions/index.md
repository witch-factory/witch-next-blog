---
title: Exploring JavaScript - The Early Mistakes and Choices of Javascript
date: "2024-01-21T00:00:00Z"
description: "Where did the strange parts of Javascript come from?"
tags: ["javascript", "history"]
---

# Thumbnail

![Javascript is Uncontrollable](./js-weird.png)

# Series on Searching for the Voice of JS

|Series|
|---|
|[Searching for the Voice of JS - Getting Started](https://witch.work/posts/javascript-history-start)|
|[Searching for the Voice of JS - The Birth of Javascript](https://witch.work/posts/javascript-history-the-birth)|
|[Searching for the Voice of JS - The Early Mistakes and Choices of Javascript](https://witch.work/posts/javascript-history-initial-decisions)|

This article will cover the following topics, focusing more on historical facts rather than technical details.

- A brief summary of Javascript history
- Early mistakes in Javascript
- Initial choices of Javascript
- Other languages that influenced Javascript

# 1. Brief History

> As is already well-known, in May 1995, under a coercive and mandatory directive stating that it 'should resemble Java,' 'must be easy for beginners,' and 'should control almost everything within the Netscape browser,' I created Javascript in just ten days.
>
> Brendan Eich's Foreword, translated by Kim Jun-ki, in 'Effective Javascript'

Javascript was hastily created by Brendan Eich in 1995 within ten days. Initially, the intention was not to create a new language but to incorporate an existing language, particularly Scheme, into the browser.

However, that was not feasible when Netscape, which employed Eich, allied with Sun Microsystems (the creators of Java) to compete against Microsoft in the browser market. The browser had to integrate Java, the allied company’s product.

As a result, the decision was made that the browser should include Java and a simple scripting language to support it. Eich ended up creating this 'simple scripting language to support Java.'

But there was no time. The decision was made in May 1995, and Netscape was to launch the browser by September.

Pressured by time, Eich created a prototype of Javascript (then called Mocha) in just ten days. Since it was a language to support Java, it had to 'look similar to Java and be easy for beginners to use.'

Most of Javascript's mistakes originated from the interplay of the three aforementioned requirements:

- The tight time constraint of ten days
- The requirement to resemble Java
- The necessity to be user-friendly for beginners

Now, let’s take a closer look at Javascript's mistakes, the choices made during that time, and other influences in turn.

For those curious about a more detailed account of Javascript's early history, please refer to [Searching for the Voice of JS - The Birth of Javascript](https://witch.work/posts/javascript-history-the-birth).

# 2. Early Mistakes in Javascript

> "If only I had a bit more time and budget..."
>
> Dr. Nitro

Brendan Eich had neither time nor manpower. Javascript was always developed under a busy schedule, and for most of the initial development period, Eich worked almost alone.

When reading accounts of Javascript’s history, phrases like 'XX helped with this aspect' or 'XX created this part' are common, but not a single mention of collaboration can be found.

Under such circumstances, it is perhaps natural that Javascript had its flaws. The problem is that these mistakes persist and continue to trouble us. We will now examine `var` hoisting, the quirky `Date` class, and the type conversion rules of the `==` operator, all of which are concepts encountered while studying JS, and how they stemmed from early mistakes.

## 2.1. var Hoisting

> Hoisting means 'moving to the top of the scope.' Function declarations are fully hoisted, while variable declarations are partially hoisted.
>
> Axel Rauschmayer, translated by Han Seon-yong, 'Speaking Javascript,' p. 263

The phenomenon of hoisting, where `var` variable declarations and functions are moved to the top of their scope, is often mentioned as a peculiar behavior of Javascript. This article will discuss why this feature was created.

Hoisting was born purely out of technical necessity. Function hoisting allows functions to be used anywhere within the scope, enabling a top-down approach to program decomposition. It also made calls before declarations possible.

Moreover, hoisting allowed recursive functions to bind values to the scope without additional costs.

However, unlike intentional function hoisting, the hoisting of variables declared with `var` was unintended. It was an unplanned byproduct of the hurried construction of Javascript, arising from the 10-day timeline.

## 2.2. typeof

The `typeof` operator returns a string that identifies the type of its operand. However, this operator comes with many mistakes.

For example, it differentiates between string literals and string objects created by the `String` constructor:

```js
typeof "hello world" // "string"
typeof new String("hello world") // "object"
```

Additionally, applying `typeof` to null returns `object`:

```js
typeof null // "object"
```

This follows the way Java distinguishes between primitive values and objects. However, unlike Java, which has static typing allowing values to be differentiated by their types, Javascript is dynamically typed and cannot do the same.

Consequently, in an attempt to distinguish values without relying on types, we end up with such results. It can be said that this was a lack of adequate consideration during the hurried ten-day work.

Deeper exploration of `typeof null` can be found in [JS Exploration - Why is JS's typeof null 'object'?](https://witch.work/posts/javascript-why-typeof-null-is-object).

## 2.3. Date Class

Javascript 1.0's `Date` class closely mirrored Java's `java.util.Date`. However, in the rush to copy it within ten days, bugs and odd characteristics were also inherited.

For instance, representing January 1, 1970 as 0, expressing months from 0 to 11, and even the Y2K bug were transferred over (though the Y2K bug was fixed shortly thereafter).

Most of the strange experiences with the `Date` object stem from features inherited from Java's `java.util.Date`. While over time Java has moved away from `java.util.Date` with the introduction of a modern date/time management package in Java 8 (`java.time`), Javascript still relies on the `Date` object.

In essence, the quirkiness of `Date` is attributed to the rushed transfer from Java's `Date` class. The issue lies in the fact that this mistake still persists.

Notably, when `java.util.Date` was transferred over, methods like `equals`, `before`, and `after` were omitted. These were deemed unnecessary since due to Javascript's automatic type conversion, operators used for numbers could be directly applied to Date objects.

## 2.4. Automatic Type Conversion and the == Operator

```js
1 + '1' === '11' // true
```

Automatic type conversion of operands was a feature designed to lower the entry barrier for beginners, as Javascript was meant to be an easy scripting language for novices.

However, as Javascript evolved into a general-purpose language, this automatic type conversion became a source of confusion and numerous bugs.

Additionally, there was another historical reason for the creation of type conversion with the `==` operator. This automatic conversion was introduced in response to requests from alpha users within Netscape after the initial prototype (then called Mocha) was created in just ten days.

For instance, there was a requirement that comparing the string `"404"` HTTP code with the number `404` using the `==` operator should yield true. There was also a request to interpret an empty string in a numerical context as `0` to provide default values for empty fields in HTML forms.

At that time, these requests were not entirely unreasonable; they aimed for smooth integration between Javascript and HTTP/HTML. Ultimately, however, these requirements contributed to the creation of the confusing type conversion rules surrounding the `==` operator.

## 2.5. this

In many programming languages, `this` generally refers to the object that calls a method when invoked. However, in Javascript, `this` causes confusion for many programmers.

This is because the object `this` refers to can change based on the context in which it is used: when used in an object's method, a standalone function, or a constructor function. If a function is a method of an object, `this` refers to the object that called the method; if it’s a regular function, `this` points to the global object; in a constructor function, it refers to the object created by that function.

Moreover, HTML sometimes transforms Javascript code to execute like methods called on functions, which adds to the confusion. For example, consider the following code:

```html
<button name="B" onclick="alert(this.name + ' clicked')">Click me</button>
```

When this button is clicked, the `onclick` method of the button is invoked, where `this` refers to the button object. As a result, `this.name` becomes the button's `name` property.

This confusing behavior of `this` was originally borrowed from Java. However, since Java functions must inherently be methods belonging to a class, this constraint did not present a problem there. In contrast, because Javascript includes standalone functions, object methods, and constructor functions, using `this` consistently across different function types creates confusion.

This confusion can also be attributed to hasty decision-making made during the ten-day period of creation, aimed at making it resemble Java.

## 2.6. with

`with` was created to simplify access to object properties by allowing the omission of the object name. As the term 'convenience' indicates, it was originally designed to make Javascript easier for beginners.

Now rarely used, a brief description is as follows: within the block of a `with` statement, properties of the specified object can be accessed as if they were variables. For example, within the following `with` block, you can omit `obj` when accessing its properties `a` and `b`.

```js
with (obj) {
  a = b;
}
```

However, it interprets to this complex structure, which can be very confusing:

```js
if (obj.a === undefined) {
    a = (obj.b === undefined) ? b : obj.b;
} else {
    obj.a = (obj.b === undefined) ? b : obj.b;
}
```

Since both `a` and `b` could be properties of `obj`, this situation can complicate interpretation significantly. Moreover, not only is it a readability issue, but `with` also complicates lexical binding of variable names, leading to decreased processor speed and more bugs.

In summary, `with` is another mistake resulting from inadequate review of design choices during the hurried creation aimed at making it easy for beginners.

# 3. Initial Choices of Javascript

> While I'm not overly proud, I am satisfied with choosing first-class functions from Scheme and prototypes from Self as key elements of javascript. The influence of Java, particularly the Y2K bug, the distinction between primitives and objects (for instance, string vs. String), is disappointing.
>
> [Brendan Eich, Popularity](https://brendaneich.com/2008/04/popularity/)

As previously mentioned, Eich created the prototype of Javascript (then called Mocha) in May 1995 in just ten days. This was an extremely tight schedule.

Thus, Eich made the language very flexible except for what he considered important. He believed that by making Javascript flexible, other developers would revise the built-in libraries, even if they were hastily put together initially.

As a side note, this design choice allows for modification of almost all objects, including built-in objects like `Object.prototype`. This has provided a foundation for creating polyfills.

So what are the 'important things' Eich considered while creating the language? What could not be compromised during the rushed prototyping period? The two key features that he prioritized were the prototype-based object-oriented system from Self and the concept of first-class functions from Scheme.

These two features are frequently mentioned as 'well-crafted parts' of Javascript by its creator, Brendan Eich, in various interviews and presentations (though he acknowledges the mistakes made during the hasty creation process). Now, let’s discuss these two aspects.

In addition to these features, Javascript has been influenced by various languages, which will be covered in the next section.

## 3.1. Prototypes

> Objects inherit from other objects. Every object is associated with another object, which is its prototype.
>
> David Herman, translated by Kim Jun-ki, 'Effective Javascript,' p. 109

The prototype is how Javascript implements object-oriented programming. This can be quite unfamiliar for those who have used class-based languages. Subsequently, classes were added in ES6.

However, the concept of prototypes was indeed a fitting feature for Javascript at that time. As a language aimed at programming novices, class-based object-oriented programming was too complex relative to its goals.

A renowned article discusses the philosophical background behind the choice of prototypes: [Why Did Javascript Choose Prototypes](https://medium.com/@limsungmook/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%99%9C-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85%EC%9D%84-%EC%84%A0%ED%83%9D%ED%96%88%EC%9D%84%EA%B9%8C-997f985adb42).

This article discusses more about the philosophical background, while we will focus on more concrete aspects here.

### 3.1.1. The Difficulty of Class Modeling

Classes were first introduced as a method for modeling object-oriented programming in the Simula language, later adopted by languages like Smalltalk, C++, and Java.

The challenge with classes is that they are inherently difficult to use. One can hardly imagine how many people continue to struggle with class modeling today. This difficulty arises from the necessity to ask the question, 'What is the essence of this object?'

If incorrect decisions are made when modeling the class and many instances have already been created based on that model, correcting the class becomes incredibly difficult. Thus, classes need to be well-modeled from the outset, taking multiple considerations into account.

This is certainly no easy task, and incorporating such class-based object-oriented features into a language aimed at beginners would not have been prudent. Therefore, Eich opted for a prototype-based approach. The prototype model minimizes the risks inherent in modeling objects prematurely.

### 3.1.2. Introduction of Prototypes

Prototypes operate by delegating behavior not by inheriting from a superclass but by delegating to another object. Thus, if the prototype does not suit the new object, it can be modified at runtime without affecting the code in which the object was previously used.

If something goes wrong, it can be fixed promptly without having to abstractly ponder how best to model the object from the start. It can be said that prototype-based object orientation is relatively 'easier to use' than class-based approaches.

Since Javascript was developed as a language for beginners, it needed to be accessible. Therefore, a relatively easier-to-use prototype-based object model was adopted.

In terms of concrete implementation, it was influenced by the Self language, which implemented prototype-based object orientation. In Self, each object had a reference to a prototype object, enabling it to use features from that prototype object.

However, since Javascript was positioned as a language to support Java, early documentation for Javascript does not include discussions of prototype-based object orientation. Nevertheless, one can glimpse the influence of Self and prototype-based object models in the naming of properties like `prototype` on Javascript constructor functions.

### 3.1.3. Avoiding Conflicts with Java

The Java that Javascript was meant to complement already utilized a class-based structure. Therefore, if Javascript had adopted class-based object orientation, it would have had to compete with Java within the same domain.

By choosing a prototype-based approach, Javascript could fulfill its role as a complementary language to Java without competing over class implementation.

### 3.1.4. Time Constraints

As repeatedly mentioned, Eich had little time. Prototypes, however, are easier to implement than classes for a language creator.

Additionally, if built-in libraries and methods operate through prototypes, users can create and modify the methods they want. They only need to modify built-in prototypes like `Object.prototype`. This minimizes the features that the Javascript language must support.

Thus, Javascript commenced its journey with a prototype-based object model that was easy to implement while delegating various tasks to users.

## 3.2. First-Class Functions and Closures

> A closure is a procedure that records what environment it was created in.
>
> An Introduction to Scheme and its Implementation, The University of Texas at Austin


> In Javascript, functions are first-class objects with lexical scope. Furthermore, it is the first mainstream lambda language, and upon deeper inspection, it shares more traits with Lisp and Scheme than with Java. One could say that Javascript is Lisp dressed in C's clothing.
>
> Douglas Crockford, translated by Kim Myung-sin, 'JavaScript: The Definitive Guide,' p. 14

In Javascript, functions are treated just like any other object in the program. This concept, known as first-class functions, is another feature that Brendan Eich proudly considers to be well-implemented in Javascript.

Although today languages like Python, Ruby, and Kotlin also support first-class functions and closures, at the time, such concepts were not widely recognized. Why then was this concept introduced in Javascript?

### 3.2.1. First-Class Functions from Scheme

The concept of first-class functions in Javascript originated from Scheme, which was among the first languages to adopt this idea.

As mentioned earlier, Eich's original goal was to implement Scheme in the browser. Although this was not possible, he still believed that the concept of first-class functions from Scheme was valuable. Hence, he introduced first-class functions into Javascript.

### 3.2.2. Consequences

The introduction of first-class functions brought other related concepts from Scheme into Javascript. However, the syntactic influence was minimal. It was specifically related to first-class functions and a few other derived concepts, such as closures.

With the introduction of first-class functions, functions could be dealt with just like regular objects, enabling closures, passing functions as arguments, object methods, and event handlers. Function expressions also became possible thanks to first-class functions.

Closures also emerged through first-class functions. The concept allows a function to be the return value of another function, enabling the function to remember the environment it was created in.

In the following `makeCounter` function, the returned function remembers and increments the stored `count` variable.

```js
function makeCounter() {
    var count = 0;
    return function() {
        return count++;
    };
}
```

Had functions not been first-class objects, they could not have been returned from other functions like values, and closures that allow functions to remember their surrounding environment would not have occurred.

Considering how closures play important roles in modern frontend frameworks like React, this was indeed a commendable choice. A separate article will be written on this topic of closures in the future.

# 4. Other Languages that Influenced Javascript

Javascript was also influenced by various programming languages. Excluding the requirement for it to resemble Java, Eich had the authority to determine other details and, in fact, did not have time to create something truly unique for Javascript.

Consequently, Javascript drew influence from languages such as Scheme, Self, Java, HyperTalk, Perl, Awk, and Python.

## 4.1. Scheme

As previously mentioned, the concept of first-class functions from Scheme influenced Javascript. The previously discussed concepts of closures, passing functions as arguments, object methods, event handlers, and function expressions also derive from Scheme's influence.

However, the syntactic influence was minimal, limited to specific concepts like 'functions as first-class objects' and derived closures.

## 4.2. Self

During the creation of Javascript (then called Mocha), it was widely agreed that it needed to be an object-based language. However, this could not be achieved through a class model. Using classes would have required longer implementation and could have meant competing with Java, which also utilized a class model.

Thus, Eich decided to create a prototype-based object-oriented system, influenced by the Self language. Consequently, Javascript was initiated as a language that uses a single prototype and delegation through a prototype chain, similar to Self.

## 4.3. Java

When Mocha, Javascript's precursor, was created, Marc Andreessen emphasized that it should be easy enough for anyone to write a few lines in an HTML document while also looking similar to Java. Moreover, influences from BASIC-like languages were explicitly excluded.

This superficial requirement to resemble Java also resulted in incorporating Java's behavior into Javascript. For instance, the meanings of primitive types like boolean, int, double, and string are derived from Java. However, since there are no classes in Javascript, their usage differs, and only keywords were borrowed.

## 4.4. HyperTalk

The manner in which Javascript integrates into browsers was influenced by the HyperTalk language found in Apple’s HyperCard product.

HyperTalk was designed to access and control components within a product. The current implementation of HTML tags with event handler properties like `onclick` is a result of HyperTalk's influence.

## 4.5. Perl

Perl influenced how Javascript handles strings, arrays, and regular expressions. For instance, array methods like `push`, `pop`, `shift`, `unshift`, and `splice` were derived from Perl's array methods. String methods such as `match`, `replace`, and `substr` also came from Perl.

Moreover, the syntax for regular expressions and string matching is borrowed from Perl. The logical operators `&&` and `||` returning the actual values of operands rather than true or