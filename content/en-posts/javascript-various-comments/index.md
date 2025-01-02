---
title: Exploring JavaScript - Comments in JS are not limited to // and /* */
date: "2024-01-06T00:00:00Z"
description: "Types of JS comments and their stories"
tags: ["javascript"]
---

# Thumbnail

![JS Comment Image](./js-comment.webp)

# Introduction

This document summarizes the insights gained regarding comments while reviewing various materials including the JavaScript specification.

It is well known that single-line comments begin with `//` and multi-line comments are enclosed in `/* */`. However, the specification also defines other types of comments, such as Hashbang Comments that start with `#!` and HTML-like Comments that are enclosed in `<!--` and `-->`.

Additionally, I learned how comments generally behave like whitespace and the origin of `/* */` comments. I will record these findings here.

Let's begin with the basic comment syntax.

# 1. Single-Line Comments

When first learning JS, one learns that comments can be made using single-line comments that start with `//` and multi-line comments that are enclosed in `/* */`. This is correctly defined in the specification as well. Let’s first look at how these are defined in the specification.

## 1.1. Syntax

Single-line comments are straightforward. They are comments that begin with `//`. A single-line comment can contain any Unicode characters except for a LineTerminator. Due to the rules for token interpretation, a single-line comment is always composed of all characters from `//` to the end of the line. 

In this context, a LineTerminator represents the character that signifies a line break, which includes the following in the specification:

- LF: Line Feed, U+000A
- CR: Carriage Return, U+000D
- LS: Line Separator, U+2028
- PS: Paragraph Separator, U+2029

In the specification, a single-line comment is defined as `SingleLineComment`. It takes the form `//` followed by `SingleLineCommentChars`.

```
SingleLineComment ::
  // SingleLineCommentChars(option)
```

`SingleLineCommentChars` is defined as a sequence of all characters except for LineTerminator.

```
SingleLineCommentChars ::
  SingleLineCommentChar SingleLineCommentChars(option)

SingleLineCommentChar ::
  SourceCharacter but not LineTerminator
```

## 1.2. Treatment

Single-line comments generally behave like whitespace. The LineTerminator at the end of the line is not considered part of the single-line comment and is recognized separately in the syntax.

Thus, because a single-line comment does not include a LineTerminator, it does not affect automatic semicolon insertion. For more on automatic semicolon insertion, refer to [Exploring JavaScript - Automatic Semicolon Insertion](https://witch.work/posts/javascript-semicolon-insertion).

# 2. Multi-Line Comments

## 2.1. Syntax

Multi-line comments begin with `/*` and end with `*/`. They cannot be nested. According to the specification, they are defined as `MultiLineComment`, which is composed of `MultiLineCommentChars` enclosed within `/*` and `*/`.

```
MultiLineComment ::
  /* MultiLineCommentChars(option) */
```

`MultiLineCommentChars` can either start with `*`, leading to `PostAsteriskCommentChars`, or start with a character that is not `*`. `PostAsteriskCommentChars` can either start with a character that is neither `*` nor `/`, representing `MultiLineCommentChars`, or it can be itself that starts with `*`.

```
MultiLineCommentChars ::
  * PostAsteriskCommentChars(option)
  MultiLineNotAsteriskChar MultiLineCommentChars(option)

PostAsteriskCommentChars ::
  MultiLineNotForwardSlashOrAsteriskChar MultiLineCommentChars(option)
  * PostAsteriskCommentChars(option)
```

The reason `PostAsteriskCommentChars` cannot start with `/` is that the token before it must be `*`, and starting with `/` would prematurely complete the multi-line comment with `*/`.

In other words, a multi-line comment has the following structure. It consists of strings between `/*` and `*/`, where lines starting with `*` must not start with `/`, while others do not have restrictions.

```
/*
  MultiLineNotAsteriskChar MultiLineCommentChars(option)
  * MultiLineNotForwardSlashOrAsteriskChar MultiLineCommentChars(option)
*/
```

## 2.2. Treatment

If a multi-line comment is a single line, it is treated as whitespace, just like a single-line comment.

However, if a multi-line comment contains a LineTerminator, the entire comment is considered as a LineTerminator for parsing purposes.

## 2.3. Origin

The `/* */` multi-line comment format originated from the PL/1 language, which predated C. Developed by IBM in 1964, it attempted to unify many divergent programming languages into one.

In PL/1, the combination of `/* */` was rarely used outside of string literals; thus, it was adopted for comments. However, in JS, such combinations can appear in regular expressions, which can lead to issues.

Douglas Crockford's "JavaScript: The Good Parts" provides an example code that triggers a syntax error.

```js
/*
  var rm_a = /a*/.match(s);
*/
```

For this reason, it is often recommended to use `//` in JavaScript.

# 3. Hashbang Comments

The ECMA specification also defines other types of comments, including Hashbang Comments and HTML-like Comments. This section will explore Hashbang Comments.

## 3.1. Syntax

Hashbang Comments are single-line comments that start with `#!`, also known as shebang. There should be no whitespace before the `#!`.

As a single-line comment, it can include all characters except the LineTerminator. The specification states:

```
HashbangComment ::
  #! SingleLineCommentChars(option)
```

Due to their nature, these comments are valid only at the very beginning of a script or module. The specifics will be discussed in the next section.

## 3.2. Purpose of Hashbang Comments

Originally used in Unix-like operating systems, a file that begins with a `#!` on its first line will execute `#!` followed by the interpreter string specified. For example, a file starting with `#!bin/bash` will execute with the bash shell interpreter.

A similar purpose was adopted in JavaScript, where the comment format is declared at the beginning of a script or module file to specify which JavaScript interpreter to use when executing the code. It is syntactically similar to a single-line comment.

As long as the script is not run in a shell, this comment has the same meaning as a typical single-line comment.

```js
#!/usr/bin/env node

console.log("Hello world");
```

This is particularly useful in server-side JavaScript environments, as multiple JavaScript interpreters may exist on a server, allowing for specification of which interpreter to use through this comment.

Due to its usefulness, even before being standardized, this approach became a de facto standard in JavaScript environments outside of browsers, such as Node.js.

It is worth noting that this hashbang comment should not be used as a single-line comment, as it is only valid at the beginning of a script or module. Considering the purpose of the comment is to specify the interpreter, it should not be repurposed for single-line comments.

# 4. HTML-like Comments

In the ECMA-262 specification, under [B.1 Additional Syntax](https://tc39.es/ecma262/#sec-additional-syntax), the first item defined is HTML-like comments, which use the HTML comment syntax `<!--` and `-->`.

## 4.1. Syntax

`<!--` is defined as `SingleLineHTMLOpenComment`, functioning like a single-line comment, allowing it to contain all characters except for a LineTerminator.

```
SingleLineHTMLOpenComment ::
  <!-- SingleLineCommentChars(option)
```

This may be used as follows:

```js
console.log(1); <!-- single-line comment
```

`-->` is defined as `SingleLineHTMLCloseComment`. The content of the comment itself behaves similarly to a single-line comment, commenting out characters in the same line after `-->`. However, only whitespace, line breaks, or line-only comments are allowed before `-->`; other characters are not permissible.

Expanding on the structure in the specification, it looks like this:

```
SingleLineHTMLCloseComment ::
  LineTerminatorSequence WhiteSpaceSequence(option) SingleLineDelimitedCommentSequence(option) --> SingleLineCommentChars(option)
```

This is how it is used:

```js
*/ --> comment content
--> single-line comment
console.log(1); --> single-line comment // This is not valid as other characters precede -->
```

## 4.2. Purpose

JavaScript was first released in 1995, at a time when many browsers that predated it were already in existence. Consequently, during JavaScript's early days, there were many outdated browsers that did not support JavaScript.

For instance, Mosaic, released in 1993, lacked support for executing JavaScript. The first browser to introduce JavaScript was Netscape Navigator 2, released in September 1995, which, of course, could not process `<script>` tags containing JavaScript correctly.

This led to compatibility issues when JavaScript was included in HTML documents. Outdated browsers that did not support JavaScript would display the contents of `<script>` elements as plain text when encountering them.

This problem could be mitigated by wrapping the script content in HTML comments. For example:

```html
<script>
  <!-- This is an HTML comment surrounding a script body
  alert("this is a message from JavaScript"); // not visible to old browsers
  // the following line ends the HTML comment
  -->
</script>
```

Using this coding pattern, outdated browsers would recognize the entire script body as an HTML comment and not display it on the page. However, because the HTML comment delimiters `<!--` were not syntactically valid in JavaScript code, JavaScript-supporting browsers faced parsing and executing issues in script bodies.

To avoid this problem, JavaScript 1.0 was designed to recognize `<!--` as the start of a single-line comment. In that context, `-->` was not considered a comment. Using this pattern, it was sufficient to place `//` before `-->`.

Regardless, while inserting JavaScript into HTML documents, compatibility could now be preserved as follows:

```html
<script>
  <!-- This is an HTML comment in old browsers and a JS single line comment
  alert("this is a message from JavaScript"); // not visible to old browsers
  // the following line ends the HTML comment and is a JS single line comment
  // -->
</script>
```

The widespread adoption of this approach among web developers ultimately led to the standardization of the above syntax.

# 5. Conclusion

This document has explored the various comment formats available in JavaScript. Among these, Hashbang Comments and HTML-like Comments were introduced for specific purposes. Hence, it is generally best to use `//` for single-line comments and `/* */` for multi-line comments without the need to resort to other comment formats.

However, understanding why these comment formats were introduced and their purposes has provided valuable insights. Hashbang Comments specify which interpreter to use when executing JavaScript outside of browser environments, while HTML-like Comments were used for browser compatibility in JavaScript's early days, showcasing a glimpse into JavaScript's history.

# References

Douglas Crockford, translated by Myungshin Kim, "JavaScript: The Good Parts", Hanbit Media, 2008

ECMA-262 Section 12.4 Comments https://tc39.es/ecma262/#sec-comments

ECMA-262 Section B.1 Additional Syntax https://tc39.es/ecma262/#sec-additional-syntax

Hashbang Comments - The Third Way of Adding Comments in JavaScript Code https://usefulangle.com/post/273/javascript-hashbang-comments

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#hashbang_comments

JavaScript HTML-like Comments https://pakss328.medium.com/javascript-commnet-%EC%A2%85%EB%A5%98-b047be8a8696

About hashbang (#!) https://blog.outsider.ne.kr/698

JavaScript: The first 20 years https://dl.acm.org/doi/10.1145/3386327

[^1]: This paragraph was written referencing [JavaScript: The First 20 Years](https://dl.acm.org/doi/10.1145/3386327).