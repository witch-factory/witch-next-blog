---
title: Seeking the Sound of JS - The Birth of Javascript
date: "2024-01-20T00:00:00Z"
description: "The story of the era when Javascript was created."
tags: ["javascript", "history"]
---

# Seeking the Sound of JS Series

|Series|
|---|
|[Seeking the Sound of JS - Introduction](https://witch.work/posts/javascript-history-start)|
|[Seeking the Sound of JS - The Birth of Javascript](https://witch.work/posts/javascript-history-the-birth)|
|[Seeking the Sound of JS - Initial Mistakes and Choices in Javascript](https://witch.work/posts/javascript-history-initial-decisions)|


This article discusses the historical background during the time when Javascript was born.

# 1. The Situation Before Javascript

> Netscape quickly realized that the web needed to be more dynamic.
>
> Axel Rauschmayer, translated by Han Seon-yong, 'Speaking Javascript,' p. 97, 'How was Javascript created?'

## 1.1. The Emergence of Browsers

Between 1989 and 1991, Tim Berners-Lee developed HTML, a standard that developers might have heard of. He also created and distributed a browser called WorldWideWeb to view pages made with this HTML.

However, it did not receive much attention at the time. It started gaining recognition when the web browser Mosaic, created by Marc Andreessen and Eric Bina, was released in January 1993.

The Mosaic browser was user-friendly even for those without technical knowledge and supported Windows. It allowed multimedia, such as images, to be viewed directly within pages, unlike existing browsers that required users to click on links to view images in new windows.

With these advantages, Mosaic played a crucial role in the widespread adoption of the early web. The lead developers of Mosaic subsequently founded Netscape, which became a frequent name in the history of the internet.

Netscape launched a more sophisticated browser, Netscape Navigator 1.0, in December 1994, quickly replacing Mosaic as the mainstream choice.

## 1.2. Integrating Multimedia into Browsers

Now, web browsers could display and share documents created with HTML, marking a significant innovation. However, as a commercial enterprise, Netscape needed to find a way to monetize and enhance the value of the early web.

To do so, web content needed to be richer, which naturally required improved multimedia support. At the time, there was no tag for embedding multimedia directly into pages, forcing users to click links to view images in new windows.

This concern had already been considered by Marc Andreessen when he created Mosaic. He proposed the `<img>` tag to embed images directly within pages as part of HTML standardization. Despite the `<img>` tag not being included in the HTML standards in 1993, Mosaic was able to incorporate this functionality and spread widely due to its multimedia embedding advantage.

What needed to happen next? At that time, web pages existed only as static documents. The challenge was to make them interactive. This issue was resolved with the introduction of what we know as Javascript.

However, at that time, Netscape could not immediately tackle this problem. The web was excruciatingly slow, necessitating that the browser first focus on enhancing basic multimedia handling. Netscape Navigator 1.0 implemented optimizations such as displaying text while loading images intended for viewing.

## 1.3. Toward a Dynamic Web

By around 1995, the handling of multimedia on the web had stabilized. Netscape aimed to go beyond managing multimedia to enable interaction between web pages and users. Co-founder Marc Andreessen consistently believed the web needed to operate more dynamically.

Web pages during this period could not perform dynamic actions post-load without server interactions. Even validating user input in forms required sending data to the server for feedback!

HTML alone could not facilitate dynamic interactions or movements on pages. A language was needed to insert dynamic elements into web pages, allowing programming within HTML.

This is where the story of a new language, which we know as Javascript, begins.

# 2. The Story of Javascript Almost Not Coming to Be

> As already well-known, in May 1995, I created Javascript under the coercive command that "it must resemble Java," "it should be easy for beginners," and "it must control nearly everything within the Netscape browser" within ten days.
>
> Brendan Eich, recommendation included in 'Effective JavaScript,' translated by Kim Joon-ki.

## 2.1. Eich's Emergence

Netscape decided to implement a language that could add dynamic functionality to the Navigator browser, intending to embed programming code within HTML.

In April 1995, they hired Brendan Eich, who would later become the creator of Javascript. Eich was hired due to his experience in creating "small domain-specific languages for kernel and network tasks" at Silicon Graphics Inc. and MicroUnity.

However, Eich did not initially aim to create a new language. He intended to implement the existing language Scheme within the browser, following Netscape's guidance.

Why Scheme? Because while at Silicon Graphics Inc., a colleague named Nick Thompson recommended the Structure and Interpretation of Computer Programs (SICP) to Eich, which left a significant impression on him. Consequently, he decided to use Scheme, a dialect of Lisp. SICP is a classic in programming often referred to as the "wizard book" due to its cover illustration.

Scheme, a dialect of Lisp, was lightweight, dynamic, powerful, and adopted first-class functions in its functional paradigm.

## 2.2. Developments in the Situation

> "Netscape plus Java kills Windows."
>
> Marc Andreessen, 1995, Netscape meeting.

Eich was hired on April 3, 1995, as part of Netscape's client team. However, he was quickly moved to a server group focused on creating web servers and proxy products, working on next-generation HTTP design for about a month. Thus, he could not immediately endeavor to create the necessary scripting language for the web.

During the time Eich was unable to start developing Javascript, competition among software companies was shifting the dynamics.

Netscape had rejected a low acquisition offer from Microsoft in late 1994. Subsequently, the management of Netscape expected direct attacks from Microsoft and aimed to seize the web market first. To accomplish this, they partnered with Sun Microsystems.

On May 23, 1995, Sun Microsystems announced its renowned Java language. On the same day, Netscape declared its intention to incorporate Java into Netscape Navigator. This was a united front against Microsoft. Netscape co-founder Marc Andreessen exclaimed, "Netscape and Java together will defeat Windows."

Interestingly, as we now know, these attempts ultimately failed, except for Javascript. Netscape lost to IE, and Java Applets also failed, leaving only Javascript to lead the modern web.

Regardless, due to this shift, plans for the language to be embedded in the browser changed. Considering business plans and release timelines, embedding established languages like Scheme, Python, Perl, or Tcl in the browser became impractical.

Thus, Netscape's Marc Andreessen and Sun's Bill Joy decided to design and implement a smaller scripting language to complement Java, which would enter the browser.

## 2.3. Initial Discussions

There was heated discussion within Netscape at that time regarding the necessity of another language when Java would be incorporated into the browser. The arguments were put forth by key figures within Netscape and Sun, raising the following questions:

1. Is Java unsuitable as a scripting language for the browser?
2. Why is there a need for two languages?
3. Does Netscape possess the expertise to create a new language?

The first question was easily rebutted. Java, indeed, is an excellent language that continues to hold a dominant position even today. However, as of 2024, it is relatively not regarded as an 'easy language.' A consensus existed that a simple scripting language was needed for anyone to use within the browser, but Java was deemed too complex for most web members.

Using Java required understanding of classes and methods, types and variables, return values, and so forth. The following code, which outputs "Hello World" in Java, illustrates that even to read this simple task code, one must grasp concepts of classes, methods, packages, types, and variables.

```java
// Hello World in Java
import java.util.*;

public class Main {
    public static void main(String args[]) {
        System.out.println("Hello World!");
    }
}
```

As a result, Netscape concluded that a lighter and easier scripting language was required. The trend at the time also showed that languages like Python were considered easy due to their scripting capabilities.

The second question was resolved by referencing Microsoft's product strategy. At the time, Microsoft provided C++ for professional programmers and Visual Basic for amateurs and designers, incorporating a 'glue language' role for Visual Basic to assemble components built using C++.

The newly created scripting language was expected to serve a role similar to Visual Basic. Therefore, it was perceived as a "beginner's language" for designers or part-time programmers creating content from components like images, plugins, or Java Applets.

The management aimed to position Java and Javascript as counterparts to Microsoft's C++ (a challenging language for professional programmers) and Visual Basic (an accessible language for non-professionals). Bill Joy, co-founder of Sun, also aligned with this idea.

At this juncture, Netscape’s executives decided that the new scripting language should resemble Java's syntax, given its role as a complement to Java. This excluded options for introducing existing languages like Perl, Python, TCL, or Scheme.

Ultimately, the discussions concluded that Java and the new language for the browser had distinct purposes.

Java within the browser served those who already used C++ or Java for web component creation, whereas the new language aimed to assist non-professionals like web designers.

However, the third question remained: Did Netscape possess the expertise to create a new language? Could a new language be ready by the time Netscape Navigator 2.0 was released in September 1995?

Brendan Eich had to prove this directly through the development of what would later be known as Mocha (name given by Marc Andreessen at that time).

# 3. The Initial Development of Javascript

## 3.1. Development of a New Language

The language Eich was to develop could no longer resemble Scheme. A crucial requirement for the new language was that "it needed to be similar to Java." This was necessary to serve as a complement to Java.

However, it had to model objects differently than Java’s class-based approach. Furthermore, since it was positioned as a complement to Java, it should not be overvalued. Essentially, for promotional purposes, it needed to appear somewhat lacking when compared to Java.

The greatest problem, however, was that Eich faced a time constraint. Netscape Navigator 2.0 was scheduled for release in September 1995, and the new scripting language had to be ready for inclusion in that browser. This meant it had to be completed before September 1995.

Additionally, since this new scripting language was not a top priority within the browser's development, Eich was not granted much time. Thus, in May 1995, Eich developed a prototype of the new scripting language in just ten days. Naturally, there were numerous mistakes and hasty development involved.

Nonetheless, the demonstration that followed this ten-day prototyping period succeeded. As a result, it was included in a pre-alpha version of Netscape Navigator 2.0 as a demonstration.

## 3.2. Regarding the Name of Javascript

The initial name for Javascript was "Mocha," coined by Marc Andreessen. However, Netscape's marketing team changed the name to "LiveScript" upon identifying potential trademark conflicts. This name change also aligned with the naming convention of Netscape's other products, which started with "Live."

By September, Eich continued to refine the new language, preparing it for inclusion in Navigator 2.0. In September 1995, Netscape Navigator 2.0 was released, incorporating Eich's new language known as LiveScript.

Later, LiveScript was renamed Javascript as Java began to rise in popularity, and Sun Microsystems allowed Netscape to use the Java trademark. This renaming aimed to leverage the popularity of Java at the time. Java was a hot language in 1995, and Netscape and Sun Microsystems decided to capitalize on that fame through their alliance.

A December 1995 press release from Netscape and Sun highlighted Javascript as an "object scripting language" that "dynamically modifies the properties and behaviors of Java objects" and presented it as a "complement to Java for easy online application development," thereby emphasizing the connection to Java.

# 4. Standardization of ECMAScript

Following the emergence of Javascript, Microsoft implemented a similar language named JScript with the release of IE 3.0 in August 1996. To counter Microsoft’s move and in response to developers' demands, Netscape decided to standardize Javascript and requested standardization from ECMA International. Thus, in November 1996, the ECMA-262 specification process commenced.

Due to Sun owning the Java trademark, the official name of the standard language was temporarily set as ECMAScript. This name continues to be used but is only referred to when discussing standard versions; everyone still calls the language Javascript.

Thus, the standardization process began, and the details will be covered in the next article.

# References

[Why is JS Designed This Way? - Reference Materials](https://witch.work/posts/javascript-history-references)

Axel Rauschmayer, translated by Han Seon-yong, "Speaking Javascript"