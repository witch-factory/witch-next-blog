---
title: JS Exploration - Where Values Come From, What They Are, and Where They Go Series
date: "2024-03-01T00:00:00Z"
description: "Where do JavaScript values come from, what are they, and where do they go?"
tags: ["javascript", "jsvalue"]
---

One day, I came across [Pacha's Tweet](https://twitter.com/finalchildmc/status/1751818395669106722). Inspired by their explanation of how the JavaScript engine stores values, I conducted further research to create this series.

![Series Image](image.png)

# Overview

All JavaScript values are stored and manipulated, eventually becoming unused and subjected to garbage collection. But how does this process occur? The answer could be simple, but in detail, it is not so straightforward.

The process that JavaScript values undergo can be divided into three main stages.

1. Values are stored.
2. Values are used.
3. Values are garbage collected.

Therefore, I will write articles addressing each of these stages. I will investigate as much as possible about how values are stored, used, and cleaned up internally in JavaScript, as well as how various engines implement these functions.

Each engine employs its own specialized techniques for the topics covered in this series. However, due to time and knowledge constraints, I will focus on general aspects that apply to nearly all engines, followed by specific details about V8 and SpiderMonkey (the two major engines). Since the Edge browser now uses V8, I can effectively cover the majority of cases.

# Value Storage

The discussion about how values are stored can be categorized into about three main topics based on my research.

First, where are the values stored? We know that program memory is typically divided into the stack and the heap. While engines like V8 split storage across various spaces for garbage collection, fundamentally, it divides between the stack and heap. Therefore, we will examine where JS values are stored.

Next, we will address the question of how values are stored. After all, whether a value or a pointer address, they are stored in memory in bit format, but techniques are employed to use less memory and allow for faster retrieval. This discussion will cover memory techniques such as tagged pointers and NaN boxing, as well as certain optimizations applied by each engine.

Furthermore, values like strings or objects are stored via pointers. If we trace these pointers, what format do the actual stored values take? In other words, what format do the values assumed to be stored at a given pointer take?

- Where is the value stored? Stack vs. Heap

[JS Exploration - Where are JS Values Stored: Stack or Heap?](https://witch.work/posts/javascript-trip-of-js-value-where-value-stored)

- How is the value stored? Tagged pointers, NaN boxing

[JS Exploration - How JS Engines Store Values: Tagged Pointers and NaN Boxing](https://witch.work/posts/javascript-trip-of-js-value-tagged-pointer-nan-boxing)

- What format do pointer-stored values take? Hidden classes

# Value Usage

The process of using values will focus on how stored values are accessed, particularly regarding caching and optimizations made during usage.

In progress...

- Inline caching