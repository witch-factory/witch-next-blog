---
title: Exploring JS - Trouble with the with Statement and the Chronicle of Symbol.unscopables
date: "2024-07-05T01:00:00Z"
description: "The with statement has indeed caused problems in the past. Let's explore the reasons and what happened afterward."
tags: ["javascript"]
---

![Thumbnail](./thumbnail.png)

# Introduction

The `with` statement is an old syntax that has been present since JavaScript 1.0. It frequently appears with the phrase "not recommended" in older JavaScript resources. In a [previous article](https://witch.work/posts/javascript-with-statement), I briefly discussed what `with` actually is and what issues it presents.

However, the [weakness of the `with` statement](https://witch.work/posts/javascript-with-statement#32-%EC%BD%94%EB%93%9C%EC%9D%98-%EC%B7%A8%EC%95%BD%EC%84%B1) actually became a problem at one point. This incident ultimately led to the emergence of `Symbol.unscopables`, one of the 'well-known symbols' introduced in ES6.

Despite the `with` statement being around since JavaScript 1.0, it has never been recommended after the very early days of JavaScript, yet it influenced the language over ten years later! This was indeed a curious occurrence. Therefore, following the previous article that provided a general understanding of `with`, I delved deeper into how the rarely mentioned `with` statement became problematic and what transpired afterward.

# 1. Trigger - Introduction of keys, values, entries Methods

During the [November 2012 meeting of TC39](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2012-11/nov-29.md#collection-apis-review), which is responsible for the JavaScript standard, discussions took place on how to apply iterator API to existing data structures representing collections like `Array`, `Map`, and `Set`. 

It was decided to add the `values`, `keys`, and `entries` methods to the prototypes of `Array`, `Map`, and `Set`, which Allen Wirfs-Brock agreed to incorporate into the specifications.

```js
.keys()
.values()
.entries()
    -> Array
    -> Map
    -> Set
```

Thus, Firefox implemented the `keys`, `values`, and `entries` methods in the nightly build of December 2012 for `Map.prototype`. On May 23, 2013, these methods were [added to `Set.prototype`](https://bugzilla.mozilla.org/show_bug.cgi?id=869996).

On the same day, there was an attempt to add these methods to [`Array.prototype`](https://bugzilla.mozilla.org/show_bug.cgi?id=875433). Although the iteration API was slightly different from the current form due to being implemented during discussions at TC39, the functionality was similar. The implemented Array methods were included in Firefox 24 nightly version.

# 2. Problem - ExtJS and Array.prototype.values()

## 2.1. Discovery of the Problem

However, problems began to arise in the distributed Firefox 24 nightly version.

On June 11, 2013, a bug report was filed stating that when logging into the bank website DCU, account lists that should be displayed were not appearing. [This was related to a bug reported in Firefox 24 nightly.](https://bugzilla.mozilla.org/show_bug.cgi?id=881782)

Following this, on June 17, 2013, a bug was reported indicating that the TYPO3 content management system's dashboard was not functioning correctly. [Only the dashboard header appeared, and the content was missing.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914).

The common thread in these bugs was that they occurred due to the `ExtJS` JavaScript framework developed by Sencha.

Research revealed that the issue stemmed from the addition of the `Array.prototype.values()` method. Commenting out the code responsible for adding this method or renaming `values` resolved the issue—[this was confirmed by Brandon Benvie.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c13)

## 2.2. Investigation of the Cause

So why did `Array.prototype.values()` cause issues in ExtJS? The culprit was the `with` statement. There was code in [ExtJS's code](https://cdn.sencha.com/ext/commercial/4.2.1/ext-all-debug.js) that created a function using the `with` statement as follows:

```js
me.definitions.push('function ' + name + '(' + me.fnArgs + ') {',
    ' try { with(values) {',
    '  ' + action,
    ' }} catch(e) {',
    '}',
    '}');
```

The function generated from this code would look like this:

```js
function functionName(arg1, arg2, ...) {
  try {
    with(values) {
      // action code
      // likely operations using values
    }
  } catch(e) {
  }
}
```

At the time of distribution, the code was minified. However, since the function was created from a string that converted to code, `with(values)`’s `values` remained unchanged. This can be confirmed in the [minified code of ExtJS.](https://cdn.sencha.com/ext/commercial/4.2.1/ext-all.js)

[Of course, it's important to note that whether a variable is being referenced or an object property is only determined at runtime,](https://witch.work/posts/javascript-with-statement#33-%EC%BD%94%EB%93%9C-%EC%95%85%EC%B6%95-%EB%B6%88%EA%B0%80) meaning that even if the code was directly written in JavaScript rather than derived from a string, `with(values)` could not have been minified.

The issue arose because the new array method `Array.prototype.values()` had been added to the specification and implemented in Firefox. Thus, the code using `values` in the `with` block would look like this:

```js
function functionName(arg1, arg2, ...) {
  try {
    with(values) {
      // example operation using values
      values.a=1;
      values.forEach(function() {
        // ...
      });
    }
  } catch(e) {
  }
}
```

If `values` were an array, using `values` within the `with` block would refer not to the intended `values`, but to `values` from the prototype chain, specifically `Array.prototype.values()` (i.e., `values.values`), leading to unintended behavior and content not displaying correctly.

[According to representatives of the framework, the `with` statement was used only in one location to handle user-defined sub-expressions in template-related classes. Since the framework is commercial software, removing `with` seemed impractical, considering the costs of patching all customers.](https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c15)

However, in that small portion, the `with` statement and variable name `values`, coinciding with the addition of the new method, triggered this bug.

# 3. Resolution - @@unscopables

[The bug was temporarily resolved by removing `Array.prototype.values()` from Firefox.](https://bugzilla.mozilla.org/show_bug.cgi?id=875433#c17) However, since `Array.prototype.values()` was a method added in the ES6 specification, it could not be permanently discarded.

Moreover, other browsers were required to implement `Array.prototype.values()`, and given that ExtJS was widely used, similar issues could arise in other browsers as well.

During the investigation, I found no records of this error occurring in other browsers. However, the active discussions on es-discuss, the item being brought up at TC39 meetings, and other TC39 participants advocating for the issue indicate it was likely a common problem.

## 3.1. Initial Discussions

> [I blame 'with'. So, ex-Borland people at Netscape. And so, ultimately, myself. - Brandan Eich](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard)

[This issue was raised on June 17, 2023, in the es-discuss mailing list,](https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard) which discusses JavaScript syntax and features.

In the thread, a hotfix code was first suggested. Since objects can be given as well as expressions in the syntactical form of `with`, changing `with(values)` to the following temporarily mitigates the problem. The issue was that accessing `values` within `with(values)` referred to `values.values`, but this adjustment makes them equivalent.

```js
with(values.values=values){
  // Code using values
}
```

However, this was not a fundamental solution. The problem was that a framework's code using the `with` statement caused sites using it to malfunction when new methods were added in browsers. Thus, even if a hotfix was applied, the same issue could recur with every new array or iterator-related method added.

Moreover, altering the standard to specify that, if given an object `values`, `with` should reference `values.values` (or apply similarly to any new methods) would be illogical.

## 3.2. TC39 Meeting

[The issue that ExtJS’s `with` statement caused problems with `Array.prototype.values` was brought up during the TC39 meeting on July 23, 2013.](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-07/july-23.md#43-arrayprototypevalues) Although ExtJS addressed the issue, they were in the process of updating clients using the framework, given that adding `Array.prototype.values()` could disrupt various large-scale sites while updates were not complete.

JavaScript would continue to see the addition of built-in object methods, and if variable names like `values`, which are likely to be common and intuitive, could not coexist as new methods due to overlaps in the `with` statement, this would be clearly disadvantageous. Moreover, `with` was deprecated!

Consequently, Brandan Eich proposed either changing new `Array.prototype` methods to be based on well-known symbols:

```js
values() -> @@values();
keys() -> @@keys();
entries() -> @@entries();
```

or suggesting that they should be invoked based on imported modules. This way, the operations would become functions rather than methods.

```js
values() -> values([]);
keys() -> keys([]);
entries() -> entries([]);
```

At this point, Alex Russell proposed that a meta property (`configurable` and such) `[[withinvisible]]` should dictate whether such properties would be exposed in the `with` statement. This idea garnered significant support. However, discussions about creating a small list of identifiers (a 'blacklist') that would not fall under the `with` statement rather than appending this meta property to all object properties also took place.

Thus, creating the well-known symbol `@@withinvisible` and including `values`, `keys`, and `entries` in it seemed to be a favorable conclusion.

However, the notion of forming a list of identifiers not captured in scope was beneficial not only concerning the `with` statement but could also apply broadly for various other functionalities, such as DOM event handlers.

Dave Herman proposed the name `@@unscopables`, which was adopted after applause (with four attendees reportedly clapping).

The idea was solidified during the [TC39 meeting on September 17, 2013](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-09/sept-17.md#53-unscopeable), where it was decided that this should actually be implemented as an object rather than an array. The "Set" referenced here likely referred to a structure that could find specific elements efficiently, rather than a concrete structure like JavaScript's Set; it was presumed to be a prototype-less object, such as `Object.create(null)`.

The decision that `@@unscopables` would be implemented as an object was finalized in the [July 29, 2014 meeting](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2014-07/jul-29.md#46-unscopables). Detailed discussions on related issues surrounding proxies and global objects can be found in the linked minutes and a related PDF document on the specific operations of unscopables, [which is available here.](https://github.com/rwaldron/tc39-notes/blob/master/meetings/2014-07/es6-unscopables.pdf)

## 3.3. Implementation of @@unscopables

On August 17, 2014, [the well-known symbol `@@unscopables` was implemented in Firefox nightly.](https://bugzilla.mozilla.org/show_bug.cgi?id=1054759) Other browsers likely adopted similar implementations around the same time.

However, at that time, `Array.prototype[@@unscopables]` was still not implemented. This resulted in a bug reported on [March 19, 2016, indicating that parts of the Airbnb site were not functioning correctly.](https://bugzilla.mozilla.org/show_bug.cgi?id=1258140#c4) `Array.prototype[@@unscopables]` had already been reflected in the ES6 specification and was in use in compatibility libraries like [es6-shim](https://www.npmjs.com/package/es6-shim), but Firefox had not caught up yet.

Thus, the lack of implementation for `Array.prototype[@@unscopables]` posed a potential risk for all sites that used compatibility-related libraries like `es6-shim`.

As a result, on March 19, 2016, the bug was immediately addressed, and [just a few hours after reporting, `Array.prototype[@@unscopables]` was implemented.](https://bugzilla.mozilla.org/show_bug.cgi?id=1258163) This version was included in Firefox 48, released on April 4, 2016.

# Conclusion

Consequently, the `with` statement, which has been present sinceJavaScript 1.0 in 1996, created issues due to the addition of the `Array.prototype.values()` method introduced in 2013, and it took about another three years until the implementation of `@@unscopables` to resolve the problem.

An old syntax that was never recommended caused complications, which were resolved through a relatively recent concept of symbols. This presents a fascinating case regarding the history of JavaScript, standardization, and the process of resolving compatibility issues.

# References

Axel Rauschmayer, translated by Han Sun-yong, "Speaking JavaScript," Hanbit Media, pp. 244-248

JavaScript’s with Statement and Why It’s Deprecated

https://2ality.com/2011/06/with-statement.html

TYPO3 Compatibility Regression in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=883914#c13

DCU Bank Fails to Display Any Accounts on "Accounts" Page, in Nightly

https://bugzilla.mozilla.org/show_bug.cgi?id=881782

`Array.prototype[@@iterator]` Should Be the Same Function Object as Array.prototype.values

https://bugzilla.mozilla.org/show_bug.cgi?id=875433#c4

Map.prototype.{keys,values,entries}

https://bugzilla.mozilla.org/show_bug.cgi?id=817368

Set.prototype.{keys, values, entries}

https://bugzilla.mozilla.org/show_bug.cgi?id=869996

Convert Array.prototype.@@iterator to Use New Iteration Protocol

https://bugzilla.mozilla.org/show_bug.cgi?id=919948

Implement ES6 Symbol.unscopables

https://bugzilla.mozilla.org/show_bug.cgi?id=1054759

Airbnb "+ More" Links Jump to Top of Page Instead of Showing More Content, in Recent Nightlies 

(With "TypeError: Array.prototype[W.unscopables] is Undefined" Appearing in Error Console)

https://bugzilla.mozilla.org/show_bug.cgi?id=1258140#c4

Implement `Array.prototype[@@unscopables]`

https://bugzilla.mozilla.org/show_bug.cgi?id=1258163

Firefox 20 for Developers

https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/20#javascript

Firefox 24 for Developers

https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/24#javascript

Firefox 48 for Developers

https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/48#javascript

Array.prototype.values() Compatibility Hazard

https://esdiscuss.org/topic/array-prototype-values-compatibility-hazard

MDN Web Docs, "with"

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with

ECMA, TC39 Meeting Notes, November 29, 2012 Meeting Notes

https://github.com/rwaldron/tc39-notes/blob/master/meetings/2012-11/nov-29.md

ECMA, TC39 Meeting Notes, July 23, 2013 Meeting Notes

https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-07/july-23.md

ECMA, TC39 Meeting Notes, September 17, 2013 Meeting Notes

https://github.com/rwaldron/tc39-notes/blob/master/meetings/2013-09/sept-17.md#53-unscopeable

ECMA, TC39 Meeting Notes, July 29, 2014 Meeting Notes

https://github.com/rwaldron/tc39-notes/blob/master/meetings/2014-07/jul-29.md#46-unscopables

[^1]: JavaScript was developed very rapidly; the first implementation (known as Mocha) was completed in just ten days. Prior to JavaScript 1.0, further adjustments were made over several months for integration into Netscape Navigator, during which the `with` statement was included. Therefore, stating that `with` has been present since JavaScript 1.0 may not accurately imply it was there from the very beginning of the language.