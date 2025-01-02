---
title: JS Research Life - Where Are JS Values Stored, Stack or Heap?
date: "2024-03-02T01:00:00Z"
description: "Where does JavaScript store its values?"
tags: ["javascript", "jsvalue"]
---

![Thumbnail](image-1.png)

# Series

| Title | Link |
|-------|------|
| Where Are JS Values Stored: Stack or Heap? | [https://witch.work/posts/javascript-trip-of-js-value-where-value-stored](https://witch.work/posts/javascript-trip-of-js-value-where-value-stored) |
| How JS Engines Store Values: Tagged Pointer and NaN Boxing | [https://witch.work/posts/javascript-trip-of-js-value-tagged-pointer-nan-boxing](https://witch.work/posts/javascript-trip-of-js-value-tagged-pointer-nan-boxing) |

This article was inspired by [Pacha's tweet](https://twitter.com/finalchildmc/status/1751818395669106722).

This article demonstrates that the common explanation, "In JavaScript, primitive values are stored in the stack and objects in the heap," is incorrect, and explains why all JavaScript values should ideally be stored in the heap. It also provides a brief overview of how values are stored according to the JavaScript specification and engine implementations.

# 1. Common Explanation

JavaScript values are divided into primitive values and objects. Primitive values include numbers, strings, booleans, null, undefined, and symbols, while objects encompass everything else excluding primitive values, such as functions, arrays, and Maps. So where are these values stored?

The widely accepted explanation is that primitive values are stored directly in the stack, while objects are stored in the heap. This explanation is easily found and is a basis for certain items in [33-js-concepts, which has received over 60K stars.](https://github.com/leonardomso/33-js-concepts?tab=readme-ov-file#3-value-types-and-reference-types)

**However, this explanation is incorrect.** In JavaScript, everything, including primitive values, is fundamentally stored in the heap and accessed via pointers.

Of course, each engine may employ slightly different optimization techniques, resulting in some values being stored directly in the stack. This will be addressed in future discussions. Nonetheless, such cases are optimizations that do not affect operation; all JavaScript values are primarily stored in the heap.

# 2. Issues with the Common Explanation

Assuming that objects are stored in the heap as stated, let us consider that primitive values are stored as-is in the stack. This gives rise to two significant issues.

## 2.1. Memory Allocation Issue

To store a value in the stack, one must know the size of that value in advance. However, JavaScript is a dynamically typed language, meaning the type of value assigned to a variable can change at any time, making it impossible to know the type at the time of variable creation.

Additionally, since JavaScript hoists all variable declarations to the top during the creation of the execution context and allocates memory, it becomes even more difficult to determine how much memory to allocate. Even `let` and `const` declare variables at the top but do not initialize them.

Even if a specific variable always stores primitive values of the same type, the inclusion of strings as a primitive poses a problem. The memory size occupied by a string can vary depending on its length, so one cannot know in advance how much memory to allocate for storing the string as is.

## 2.2. Closure Issue

One might argue that undefined primitive values like strings could be handled through references stored in the stack. However, this introduces a problem due to closures.

Values stored in the stack are meant to be discarded as soon as the function completes and they exit the call stack. However, due to closures in JavaScript, there are cases where variables within a function must not be removed from memory even after the function has ended.

For instance, in a common closure example, let’s assume `count`, a primitive value, is stored in the stack. Since `count` is a number, there is no memory allocation issue. However, `count` is accessible through a closure in an inner function. Therefore, even if the function completes, `count` must remain in memory.

Yet if the function `makeCounter`, which contains `count`, has already exited the call stack, where should `count` be left in the stack?

```js
function makeCounter() {
  let count = 0;
  return function() {
    return count++;
  }
}

let counter = makeCounter();
```

However, such a problem does not arise in JavaScript. This is because values are stored in the heap rather than the stack.

# 3. In the Specification

How does the ECMA-262 specification define value storage? Since all JavaScript implementations follow the ECMA-262 specification, we can glean how values are stored from it.

The ECMA-262 specification defines a type called "Reference Record" that serves to indicate where to read and write values when accessing or assigning values to variables or properties. This type does not actually exist in JavaScript syntax; it was introduced for the sake of the specification.

However, there is no field that directly points to a value, such as `[[Value]]`. The storage of values can be found in [the description of the `[[Base]]` field of the Reference Record.](https://tc39.es/ecma262/#sec-reference-record-specification-type)

| Field Name | Value | Meaning |
|------------|-------|---------|
| [[Base]]   | an ECMAScript language value, an Environment Record, or UNRESOLVABLE | The value or Environment Record which holds the binding. A [[Base]] of UNRESOLVABLE indicates that the binding could not be resolved.|

The `[[Base]]` field points to one of the following: ECMAScript language value, Environment Record, or UNRESOLVABLE. The "ECMAScript language value" corresponds to values, and the specification lists the types commonly referenced as JavaScript values, including:

- Undefined
- Null
- Boolean
- String
- Symbol
- Number
- Object

Thus, in JavaScript, a value is the "ECMAScript language value" pointed to by the `[[Base]]` field of the Reference Record. While this does not explicitly state that values are stored in the heap, it at least implies that they are not directly stored.

Given that many language specifications do not even mention stack and heap, let alone specify what is stored in each, this indirect reference to how values are accessed implies that values are indeed stored in the heap.

Now, let’s briefly examine how JavaScript engines implement this.

# 4. In Actual Implementation

This section describes the common method used to store values across almost all engines. The specific implementation details of each engine will be discussed in subsequent sections.

## 4.1. Variables and Values

First, it is crucial to distinguish between a 'variable' and 'the value it points to,' which is the actual value. In terms of optimization considerations, variables can be viewed as a type of pointer that references objects stored elsewhere.

This means that all variables only occupy the size of a single pointer and that the required memory size remains constant even when a variable references different objects over time.

For example, when iterating through an array, the variable pointing to the current value only occupies memory equivalent to that of a single pointer.

```js
let arr = [1, "Hi my name is...", true, null, Symbol("symbol")];
let elem;
for (let i = 0; i < arr.length; i++) {
  // The object referenced by arr[i] keeps changing, but elem always occupies the size of one pointer.
  elem = arr[i];
}
```

In contrast, the value referenced by the variable refers to the actual value pointed to by the pointer stored in the variable. In the statement `var a = "hello,"` for instance, `a` is the variable, and `"hello"` is the value. Naturally, the size of the value is not fixed.

All of these—variables and values—are originally intended to be stored in the heap.

## 4.2. Storage

As previously mentioned, everything is fundamentally stored in the heap in JavaScript. Therefore, both variables (containing pointers) and the values they point to can be stored in the heap without issues.

However, in practice, several optimizations come into play. This section focuses on the idea that "everything is originally stored in the heap" while addressing common exceptions seen across most JavaScript engines. It's essential to remember that the basic principle is that everything is stored in the heap.

### 4.2.1. Optimization - Local Variables

Modern JavaScript engines typically store local function variables in the stack. **This stores the variables themselves, not the values they point to.** Since variables only occupy memory equivalent to one pointer regardless of what they reference, there are no memory allocation issues, and access speed is swift.

However, if a variable must remain in memory after the function has terminated due to the use of closures or `eval`, those values cannot be stored in the stack.

Thus, engines track which variables need to persist in memory after the function's termination, and those variables are instead stored in the heap. Variables commonly used in closures fall into this category.

### 4.2.2. Optimization - Integers

While it is true that all values, whether primitive or object, should ideally be stored in the heap, there are exceptions. A common exception involves integers, which are used frequently in programs. Modern engines often store signed integers within a specific range directly in the stack.

Techniques such as V8’s tagged pointer and SpiderMonkey’s NaN-boxing apply here. These optimizations differ per engine but ultimately achieve the same outcome: allowing integers to be stored directly in the stack.

Additionally, when functions become 'hot' due to numerous calls, engines may also optimize by storing specific properties of objects in the stack. This may be addressed in future articles.

# 5. In Actual Engine - SpiderMonkey

Now, let’s explore how values are stored within a specific JavaScript engine. We will start with SpiderMonkey, one of the major engines.

The [official SpiderMonkey site](https://spidermonkey.dev/) includes a [page for browsing the SpiderMonkey code](https://searchfox.org/mozilla-central/source/js/src). Using the search function here allows one to locate code relevant to this article effectively.

## 5.1. Storage of Strings

Reflecting on the introduction, we stated that the common explanation, "primitive values are stored as-is in the stack," is false, and that nearly all values in JavaScript are stored in the heap. So how does SpiderMonkey handle the storage of strings, a representative primitive value?

Intermediate comments labeled `[SMDOC]` within SpiderMonkey provide general explanations of the engine's workings. Consulting the comments in the [`src/vm/StringType.h`](https://searchfox.org/mozilla-central/source/js/src/vm/StringType.h#80) file reveals how strings are stored. The early part of the explanation is particularly insightful.

The most common form of linear strings consists of the GC "heap" and a dynamically allocated char array. It is clear that strings are stored in the heap! Although there are also comments indicating situations where strings might be stored in the stack, generally speaking, they are stored in the heap.

```cpp
/*
 * [SMDOC] JavaScript Strings
 *
 * Conceptually, a JS string is just an array of chars and a length. This array
 * of chars may or may not be null-terminated and, if it is, the null character
 * is not included in the length.
 *
 * To improve performance of common operations, the following optimizations are
 * made which affect the engine's representation of strings:
 *
 *  - The plain vanilla representation is a "linear" string which consists of a
 *    string header in the GC heap and a malloc'd char array.
 *
 *  - To avoid copying a substring of an existing "base" string, a "dependent"
 *    string (JSDependentString) can be created which points into the base
 *    string's char array.
 *
 (Further optimizations omitted)
 */
```

This can also be confirmed to an extent through the code.

SpiderMonkey's `JSString` class, depending on the circumstances, contains an internal class called `Data` that holds the actual string data. This data is often represented using classes like `JSLinearString`.

But how are these managed? While to be revisited in a later discussion regarding garbage collection, it's worth noting that most JavaScript engines manage the heap by dividing it into several regions.

A common distinction is that between newly created objects and older objects, which SpiderMonkey manages under the terms `nursery` and `tenured.` As per their names, `nursery` holds recently created objects, while `tenured` contains older objects.

If a string is created in the `nursery`, the engine ultimately calls a function called `cx->newCell`. The prototype of this function can be found in `src/gc/Allocator-inl.h`.

In the body of the function, it calls another function named `NewString`, indicating that strings will be instantiated using this function.

```cpp
// js/src/gc/Allocator-inl.h
template <typename T, AllowGC allowGC, typename... Args>
T* CellAllocator::NewCell(JSContext* cx, Args&&... args) {
  // ...omitted...

  // "Normal" strings (all of which can be nursery allocated). Atoms and
  // external strings will fall through to the generic code below. All other
  // strings go through NewString, which will forward the arguments to the
  // appropriate string class's constructor.
  else if constexpr (std::is_base_of_v<JSString, T> &&
                     !std::is_base_of_v<JSAtom, T> &&
                     !std::is_base_of_v<JSExternalString, T>) {
    return NewString<T, allowGC>(cx, std::forward<Args>(args)...);
  }
    // ...omitted...
}
```

The `NewString` function is defined the same way in the same file, suggesting that new instances are created using `new`, indicating they will be stored in the heap.

```cpp
template <typename T, AllowGC allowGC>
/* static */
T* CellAllocator::NewString(JSContext* cx, gc::Heap heap, Args&&... args) {
  // ...omitted...
  return new (mozilla::KnownNotNull, ptr) T(std::forward<Args>(args)...);
}
```

As a string ages, it may be moved from `nursery` to `tenured`, at which point the engine calls a function called `ensureNonNursery`. This function's prototype can be found in `src/vm/StringType-inl.h`.

```cpp
template <typename CharT>
void JSString::OwnedChars<CharT>::ensureNonNursery() {
  // ...omitted...

  CharT* ptr = js_pod_arena_malloc<CharT>(js::StringBufferArena, length);
  if (!ptr) {
    oomUnsafe.crash(chars_.size(), "moving nursery buffer to heap");
  }
  mozilla::PodCopy(ptr, oldPtr, length);
  chars_ = mozilla::Span<CharT>(ptr, length);
  isMalloced_ = needsFree_ = true;
}
```

Here, it is vital to observe that the `js_pod_arena_malloc` function is invoked. This function is defined in `src/gc/Allocator.cpp`. Following this function leads to the `moz_arena_malloc` call, eventually reaching a call to `malloc`, which manages memory directly in the heap.

Ultimately, strings—whether managed through `new` or handled via the engine's internal address management—are consistently stored in the heap.

A primitive value, such as a string, is thus stored in the heap within SpiderMonkey as well!

## 5.2. Storage of Objects

While we already know objects are stored in the heap, let's briefly explore how SpiderMonkey stores objects there.

Most JavaScript objects composed of key-value pairs are stored using a class called `NativeObject`, which inherits from `JSObject`. This class is defined in `src/vm/NativeObject.h`.

In SpiderMonkey, the creation of JavaScript objects invokes the `JS_NewObject` function. If the object is not of a specific class, `js::NewPlainObject` is called.

Internally, this triggers a call to `js::PlainObject::createWithShape`, which subsequently calls the `NewCell` function seen earlier in `src/gc/Allocator-inl.h`.

Here, the `NewObject` function is also invoked, and once again, this function also utilizes `new` to generate new instances, confirming that objects are ultimately stored in the heap.

```cpp
// js/src/jsapi.cpp
JS_PUBLIC_API JSObject* JS_NewObject(JSContext* cx, const JSClass* clasp)
// js/src/vm/PlainObject.cpp
PlainObject* js::NewPlainObject(JSContext* cx, NewObjectKind newKind)
// js/src/vm/PlainObject-inl.h
js::PlainObject* js::PlainObject::createWithShape(
    JSContext* cx, JS::Handle<SharedShape*> shape, gc::AllocKind kind,
    NewObjectKind newKind)
// js/src/vm/NativeObject.h and NativeObject-inl.h
static inline NativeObject* create(JSContext* cx, gc::AllocKind kind,
                                     gc::Heap heap, Handle<SharedShape*> shape,
                                     gc::AllocSite* site = nullptr);                               
// js/src/gc/Allocator-inl.h
T* CellAllocator::NewCell(JSContext* cx, Args&&... args)
// js/src/gc/Allocator-inl.h
template <typename T, AllowGC allowGC>
/* static */
T* CellAllocator::NewObject(JSContext* cx, gc::AllocKind kind, gc::Heap heap,
                            const JSClass* clasp, gc::AllocSite* site) {

  // ...omitted...
  return new (mozilla::KnownNotNull, cell) T();
}
```

# 6. In Actual Engine - V8

Now, let’s explore how values are stored in the V8 engine and confirm once again that they are stored in the heap.

The source code for V8 can be viewed on the [V8 page on Google’s Git](https://chromium.googlesource.com/v8/v8/). This article was drafted while cloning the repository. Additionally, [Daniel Bevenius's learning V8](https://github.com/danbev/learning-v8/blob/master/notes/heap.md) has been very helpful.

## 6.1. Memory Allocation in V8

In V8, memory management for storing values occurs primarily through the files in the `src/heap` folder. This categorically indicates that values are stored in the heap. Functions for initially generating most types of values, especially primitive values, can be found defined in `heap/factory-base.cc`, where they often call the function `AllocateRawWithImmortalMap`.

```cpp
// src/heap/factory-base.cc
template <typename Impl>
Tagged<HeapObject> FactoryBase<Impl>::AllocateRawWithImmortalMap(
    int size, AllocationType allocation, Tagged<Map> map,
    AllocationAlignment alignment) {
  // TODO(delphick): Potentially you could also pass a immortal immovable Map
  // from OLD_SPACE here, like external_map or message_object_map, but currently
  // no one does so this check is sufficient.
  DCHECK(ReadOnlyHeap::Contains(map));
  Tagged<HeapObject> result = AllocateRaw(size, allocation, alignment);
  DisallowGarbageCollection no_gc;
  result->set_map_after_allocation(map, SKIP_WRITE_BARRIER);
  return result;
}
```

This function also calls `AllocateRaw`, ultimately leading to calls to the `LinearAllocationArea` methods, which manage the addresses being allocated in the heap.

```cpp
// src/heap/factory-base.cc
template <typename Impl>
Tagged<HeapObject> FactoryBase<Impl>::AllocateRaw(
    int size, AllocationType allocation, AllocationAlignment alignment) {
  return impl()->AllocateRaw(size, allocation, alignment);
}

// Intermediate process omitted
// For more information on the omitted intermediate processes, refer to https://github.com/danbev/learning-v8/blob/master/notes/heap.md#pagealloctor

// src/heap/main-allocator-inl.h
AllocationResult MainAllocator::AllocateFastUnaligned(int size_in_bytes,
                                                      AllocationOrigin origin) {
  size_in_bytes = ALIGN_TO_ALLOCATION_ALIGNMENT(size_in_bytes);
  if (!allocation_info().CanIncrementTop(size_in_bytes)) {
    return AllocationResult::Failure();
  }
  Tagged<HeapObject> obj =
      HeapObject::FromAddress(allocation_info().IncrementTop(size_in_bytes));

  MSAN_ALLOCATED_UNINITIALIZED_MEMORY(obj.address(), size_in_bytes);

  return AllocationResult::FromObject(obj);
}

// src/heap/linear-allocation-area.h
// Manage addresses directly
// A linear allocation area to allocate objects from.
//
// Invariant that must hold at all times:
//   start <= top <= limit
class LinearAllocationArea final {
 public:
  LinearAllocationArea() = default;
  LinearAllocationArea(Address top, Address limit)
      : start_(top), top_(top), limit_(limit) {
    Verify();
  }
  // ...omitted...
  V8_INLINE Address IncrementTop(size_t bytes) {
    Address old_top = top_;
    top_ += bytes;
    Verify();
    return old_top;
  }
  // ...omitted...
}
```

So, are these managed addresses from the heap? Or did some trickery enable stack address management? This can be clarified by examining how V8's memory space is initialized.

## 6.2. Memory Space Initialization in V8

At the initialization of threads within V8—specifically in the Blink engine—`Isolate` corresponds to each thread. When this `Isolate` is initialized, it calls `Isolate::Init` within `execution/isolate.cc`, which subsequently calls `Heap::SetUpSpaces` within `heap/heap.cc`.

This function creates the memory areas V8 manages for garbage collection. While the actual implementation is more complex, the core logic can be summarized simply, stating that, using `new`, memory is allocated for these spaces.

```cpp
void Heap::SetUpSpaces() {
  space_[NEW_SPACE] = new_space_ =
      new NewSpace(this, memory_allocator_->data_page_allocator(),
                   initial_semispace_size_, max_semi_space_size_);
  space_[OLD_SPACE] = old_space_ = new OldSpace(this);
  space_[CODE_SPACE] = code_space_ = new CodeSpace(this);
  space_[MAP_SPACE] = map_space_ = new MapSpace(this);
  space_[LO_SPACE] = lo_space_ = new OldLargeObjectSpace(this);
  space_[NEW_LO_SPACE] = new_lo_space_ =
      new NewLargeObjectSpace(this, new_space_->Capacity());
  space_[CODE_LO_SPACE] = code_lo_space_ = new CodeLargeObjectSpace(this);
  ...
}
```

However, where does this `new` come from? It isn’t simply the original C++ `new`; it is overloaded. In V8, all non-read-only spaces inherit from the `BaseSpace` class. In the `heap/base-space.h`, the `BaseSpace`'s inheritance from `Malloced` shows us that the `new` operator for `Malloced` spaces is defined using `malloc`.

```cpp
// heap/base-space.h
class V8_EXPORT_PRIVATE BaseSpace : public Malloced {
  // ...omitted...
}

// utils/allocation.cc
void* Malloced::operator new(size_t size) {
  void* result = AllocWithRetry(size);
  if (V8_UNLIKELY(result == nullptr)) {
    V8::FatalProcessOutOfMemory(nullptr, "Malloced operator new");
  }
  return result;
}

// Here, malloc_fn wraps the base default value of malloc, meaning it always uses malloc.
void* AllocWithRetry(size_t size, MallocFn malloc_fn) {
  void* result = nullptr;
  for (int i = 0; i < kAllocationTries; ++i) {
    result = malloc_fn(size);
    if (V8_LIKELY(result != nullptr)) break;
    OnCriticalMemoryPressure();
  }
  return result;
}
```

Thus, when a thread is initially created in JavaScript, V8 allocates memory for its managed memory spaces using `malloc`, and subsequently, V8 manages the addresses in the heap. Furthermore, functions that manage these addresses ensure that whether a primitive value or an object is stored, new values are always allocated in the “heap” memory.

# 7. Conclusion

JavaScript values should ideally all be stored in the heap and handled through references. The common assertion that primitive values are stored directly in the stack is not just incorrect but fails to reflect most use cases when considering engine optimizations.

This point is suggested by the specification and is a recurring theme in descriptions of many JavaScript engines. Actual engine implementation codes affirm this concept. This article primarily examined SpiderMonkey and V8, but other engines generally operate similarly.

Future articles will explore the techniques employed when storing pointers in the heap, as well as how the values accessed through those pointers are managed.

# References

- Links referenced in sections `1. Common Explanation` and `2. Issues with the Common Explanation`

The tweet by Pacha that initiated this article: https://twitter.com/finalchildmc/status/1751818395669106722

Relevant thread from Pacha: https://twitter.com/finalchildmc/status/1664895964115607556

The issue posted by Pacha in 33 js Concepts: https://github.com/leonardomso/33-js-concepts/issues/481

A comment written by a V8 developer on Hacker News: https://news.ycombinator.com/item?id=33006653

V8 developer's response to "How V8 handles stack-allocated variables in closures?": https://stackoverflow.com/a/74008746

How is data stored in V8 JavaScript engine memory? https://www.dashlane.com/blog/how-is-data-stored-in-v8-js-engine-memory

- Links referenced in section `3. In the Specification`

What Are JavaScript Variables Made Of: https://www.zhenghao.io/posts/javascript-variables

ECMA-262, 6.2.5 The Reference Record Specification Type: https://tc39.es/ecma262/#sec-reference-record-specification-type

- Links regarding engines from section `4.` onwards

Same references as for `1.`

JavaScript engine fundamentals: Shapes and Inline Caches (Translation)
[Original article](https://mathiasbynens.be/notes/shapes-ics) by Mathias Bynens, who has worked on V8 engine development, is trustworthy.

https://shlrur.github.io/javascripts/javascript-engine-fundamentals-shapes-and-Inline-caches/

JavaScript Variables Managed by V8: https://yceffort.kr/2022/04/how-javascript-variable-works-in-memory

Stack and Heap in V8 (JavaScript): https://stackoverflow.com/questions/6602864/stack-and-heap-in-v8-javascript

Garbage Collection with Node.js: https://stackoverflow.com/questions/5326300/garbage-collection-with-node-js/5328761#5328761

JavaScript Memory Model Demystified: https://www.zhenghao.io/posts/javascript-memory

Development Diary Using SpiderMonkey: 

http://weongyo.org/docs/SpiderMonkey/AboutSpiderMonkey.pdf

Firefox Source Docs JS::Value and JSObject:

https://firefox-source-docs.mozilla.org/js/index.html#js-value-and-jsobject

SpiderMonkey Source Code:

https://searchfox.org/mozilla-central/source/js/src 

V8 Source Code:

https://chromium.googlesource.com/v8/v8/

Daniel Bevenius' learning V8 - heap:

https://github.com/danbev/learning-v8/blob/master/notes/heap.md

V8 and Blink: https://opentutorials.org/course/3527/22807

C++ std::make_unique: https://en.cppreference.com/w/cpp/memory/unique_ptr/make_unique