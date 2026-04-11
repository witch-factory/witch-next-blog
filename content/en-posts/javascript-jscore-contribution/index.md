---
title: Contributing to the Javascript Engine of Safari, JavascriptCore
date: "2024-04-04T00:00:00Z"
description: "An overview of my minor contribution to the Safari engine."
tags: ["javascript"]
---

While researching to write this article, I made a small contribution to the comments in the source code of WebKit's JavascriptCore engine. Although it may not seem significant, the fact that I contributed to the Javascript ecosystem turned out to be a more meaningful and gratifying experience than I had anticipated, so I will briefly summarize the process here.

# 1. Identifying the Issue and Preparation

While writing the article [JS Exploration - How JS Engines Store Values: Tagged Pointer and NaN Boxing](https://witch.work/posts/javascript-trip-of-js-value-tagged-pointer-nan-boxing) and its follow-up, I was investigating how Javascript engines store values.

## 1.1. Identifying the Issue

While reviewing the code of WebKit's JavascriptCore engine (used in Safari), I noticed an anomaly. This is part of the code from `Webkit/Source/JavaScriptCore/runtime/JSCJSValue.h`.

The comment describes a method of storing values using bit representations that are unused in the IEEE 754 representation of NaN. This is referred to as NaN boxing, and the concept can be found in the previously mentioned [JS Exploration - How JS Engines Store Values: Tagged Pointer and NaN Boxing](https://witch.work/posts/javascript-trip-of-js-value-tagged-pointer-nan-boxing).

```cpp
/*
* (omitted)
* The top 15-bits denote the type of the encoded JSValue:
*
*     Pointer {  0000:PPPP:PPPP:PPPP
*              / 0002:****:****:****
*     Double  {         ...
*              \ FFFC:****:****:****
*     Integer {  FFFE:0000:IIII:IIII
*
* The scheme we have implemented encodes double precision values by performing a
* 64-bit integer addition of the value 2^49 to the number. After this manipulation
* no encoded double-precision value will begin with the pattern 0x0000 or 0xFFFE.
* Values must be decoded by reversing this operation before subsequent floating point
* operations may be performed.
*
* 32-bit signed integers are marked with the 16-bit tag 0xFFFE.
*
* The tag 0x0000 denotes a pointer, or another form of tagged immediate. Boolean,
* null and undefined values are represented by specific, invalid pointer values:
*
*     False:     0x06
*     True:      0x07
*     Undefined: 0x0a
*     Null:      0x02
*
* These values have the following properties:
* - Bit 1 (OtherTag) is set for all four values, allowing real pointers to be
*   quickly distinguished from all immediate values, including these invalid pointers.
* - With bit 3 masked out (UndefinedTag), Undefined and Null share the
*   same value, allowing null & undefined to be quickly detected.
*
* (omitted)
*/
// ... omitted ...

// All non-numeric (bool, null, undefined) immediates have bit 2 set.
static constexpr int32_t OtherTag       = 0x2;
static constexpr int32_t BoolTag        = 0x4;
static constexpr int32_t UndefinedTag   = 0x8;
```

Upon closer examination, it appears that the OtherTag, which is used to represent special values such as bool, null, and undefined, sets the second least significant bit. However, other comments and code seem to indicate that bit indexing starts from the lowest bit, suggesting this comment contains an error. It should be corrected as follows:

```cpp
// All non-numeric (bool, null, undefined) immediates have bit 1 set.
```

Even in the commit when this comment was originally added, the `TagBitTypeOther`, which served the role of `OtherTag`, used the second bit, and there are several comments indicating bits are counted starting from bit 0. Therefore, this indeed appears to be an error.

```c
// The second bit set indicates an immediate other than a number (bool, null, undefined).
#define TagBitTypeOther 0x2ll
```

Thus, I decided to fix this error and create a pull request (PR).

## 1.2. Preparation

I followed the guidelines on [Contributing Code](https://webkit.org/contributing-code/) provided on the WebKit official website.

First, I cloned the git repository.

```bash
git clone git@github.com:WebKit/WebKit.git WebKit
```

Then, I created a bug report. A bug report can be made at [WebKit Bugzilla](https://bugs.webkit.org/). The report I created is as follows.

![Bug Report](./jscore-bug-report.png)

WebKit already has various automation scripts available for contributors in `Tools/Scripts/`. I tried one, for example, the script for checking code style can be executed as follows.

```bash
Tools/Scripts/check-webkit-style
```

These automation scripts are extensively used during the PR submission process, so I made a note of them.

# 2. Modification and PR

The task of modifying the comment was straightforward. I simply opened the file `Webkit/Source/JavaScriptCore/runtime/JSCJSValue.h` and corrected the comment, so there's no need to restate the changes.

## 2.1. Submitting the PR

The automation scripts are well implemented. Thus, by using commands like git status and git diff to check the changes, I followed the prompts after running the next script. It prompted for name, email, related bug report, and generated a commit message automatically.

```bash
Tools/Scripts/git-webkit setup
```

After committing with `git commit -a`, I ran the next script, which literally creates the PR.

```bash
Tools/Scripts/git-webkit pull-request
``` 

## 2.2. Review and Modification

JavascriptCore is actively maintained, with multiple updates daily (even just two hours prior, updates were made). It is managed by Apple as well. Since my modifications were not complicated, the review came back quickly.

The reviewer noted that starting the bit index from 0 is correct, and suggested clarifying that the bit index starts from 0 rather than simply modifying the bit index. I proposed that we could adjust it to align with other comments.

![PR Review and Response](jscore-pr-review.png)

The reviewer reacted positively with an emoji, so I made the changes to the PR accordingly. Then, I received a request to squash the commits. After merging the commits, I resubmitted the PR. I received some assistance from our friend GPT during this process.

![Modifying PR with GPT](./git-with-gpt.png)

Once this was done, I requested confirmation from the reviewer. There was a prompt review (`r=me`), and the PR was merged. It wasn't merged immediately; the reviewer indicated that it moved into a merge queue, and a bot would process it automatically.

![PR Placed in Merge Queue](./pr-review-done.png)

About a day later, the PR was merged, and my modest contribution was incorporated into WebKit.

![Merged PR](./me-in-webkit.png)

Although it was a minor fix made while reading the code for research purposes, the fact that I contributed in some way felt surprisingly rewarding. In particular, WebKit has excellent documentation and automation, making the process of submitting a PR and modifying code straightforward given the project's size. I plan to continue contributing within my capacity whenever I identify issues.