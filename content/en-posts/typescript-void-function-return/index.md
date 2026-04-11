---
title: Exploring TS - Regarding Return from Void Functions
date: "2023-09-22T00:00:00Z"
description: "TS does not prevent returning a value from void return type functions. Why?"
tags: ["typescript"]
---

> TypeScript's type system models the runtime behavior of JavaScript through its type system.
>
> The blog post by Pozafly available at https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/

I summarise it simply as understood from [Pozafly's article on why TypeScript can return any value using void](https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/).

# 1. Introduction

There are several peculiar behaviors in TypeScript, and here we will explore the behavior of the void return type.

An example is provided in [Jo Hyun-young's book "TypeScript Textbook"](https://search.shopping.naver.com/book/catalog/41736307631?cat_id=50010881&frm=PBOKMOD&query=%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8+%EA%B5%90%EA%B3%BC%EC%84%9C&NaPm=ct%3Dlmuda1cg%7Cci%3Dadc8d2352090d77aaa594ba99a7f726152a4dc12%7Ctr%3Dboknx%7Csn%3D95694%7Chk%3D73d6a40144625374c787e06c0d9d7bdfd7647e8d).

An error occurs when the return type of a function is defined as void but a value is returned from that function.

```ts
const foo = ():void=>3; // Error: Type 'number' is not assignable to type 'void'
```

However, if a function is defined as a void return type function, returning a value from it does not result in an error.

```ts
const foo:()=>void = ()=>3;
```

Why does this behavior occur? These two behaviors illustrate that TS aims to model JS's runtime behavior using types. Let's look into this in detail.

# 2. What is void?

> Void represents the absence of a return value for a function. This type is inferred when a function has no return statement or does not explicitly return a value.
> 
> [TypeScript Official Documentation](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#void)

For example, the return types of the following functions are inferred as void.

```ts
function foo(){
  return;
}

function foo2(){
  console.log('foo2');
}
```

Of course, these functions actually return undefined in JS syntax. However, according to the TS official documentation, the types of these functions are inferred as `()=>void`.

This does not mean that `()=>void` is the same as `()=>undefined`.

In JS, functions without an explicit return always return undefined; therefore, the `()=>void` typed function is allowed to return undefined.

```ts
// Inferred as ()=>undefined
function foo(){
  return undefined;
}

function bar():void{
    return undefined;
}
```

```
If the strictNullChecks option in tsconfig.json is set to false, both undefined and null are allowed as return values for void return type functions.
```

# 3. Allowing Return in Void Return Types

As seen above, a function typed as `()=>void` can also return other values without resulting in errors. We have already seen that no error occurs in the following code.

```ts
const foo:()=>void = ()=>3;
```

In fact, the void return type does not enforce a function to explicitly not return a value!

> Contextual typing with a `void` return type does not force the function to return nothing. Another way to explain this is that when a contextual function type (`type vf = () => void`) with a `void` return type is implemented, any value can be returned but is ignored.
>
> [TS Official Documentation - Function Assignability](https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#%ED%95%A8%EC%88%98%EC%9D%98-%ED%95%A0%EB%8B%B9%EA%B0%80%EB%8A%A5%EC%84%B1)

Thus, any value can be returned but it is ignored. For instance, in the following code, the return value of the `test` function is inferred as void and thus ignored, rendering it effectively unusable. While type assertion can resolve this, it is not recommended.

```ts
type VoidReturnFunc=()=>void;

const test:VoidReturnFunc=()=>3;
const n=test()+1; // Operator '+' cannot be applied to types 'void' and 'number'

// This can be done through type assertion but is not advised.
const n=(test() as unknown as number)+1; 
```

The same applies to methods. When `void` is explicitly set as the return type, a method cannot return any value other than undefined; however, when inferred as a `void` return type, explicit returns are allowed.

```ts
type Person={
  greeting:()=>void;
}

const person:Person={
  // A function that returns void type can return a value.
  greeting(){
      return "Hi";
  }
}

const person2={
  // Type 'string' is not assignable to type 'void'.
  greeting():void{
      return "Hi";
  }
}
```

[To summarize:](https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/#void%EC%9D%98-2%EA%B0%80%EC%A7%80-%ED%98%95%ED%83%9C)

1. A value tied to the function itself as a return type (like `:void`) cannot exist if there is a return value.
2. A value tied to the function type as a return (`()=>void`) can exist when the declaration and assignment are separated. However, it is ignored.

In other words, a function of type `()=>void` can return any value, while a function with a return type of void cannot explicitly return anything other than undefined. So why does void exhibit this behavior?

# 4. Reason for This Behavior

As previously mentioned, TS allows this behavior to model the runtime behavior of JS.

In JS, some methods take callback functions as arguments, such as `Array.prototype.forEach`.

```ts
const arr=[1,2,3];

arr.forEach((v,i)=>{
  console.log(i,v);
});
```

These methods do not use the return value of the callback function at all. Even though console.log returns undefined, if another value is returned, it is not used at all. Therefore, such methods should define the return type of the callback function as void, and it is indeed defined as such.

```ts
Array<T>.forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void
```

But what if a function type that returns void prohibited returning values? Consider the following code.

```ts
const arr:Array<number>=[1,2,3];
const res:Array<number>=[];

// res.push returns the length of the array which is a number, but it is unused
arr.forEach(elem=>res.push(elem));
```

The above code is not an anti-pattern and appears often as it is more concise than using `elem=>{ res.push(elem) }`. 

However, if a function type that returns void prohibited explicit returns (other than undefined), this code would yield an error since `res.push` returns a number.

For this reason, TS permits return values in functions of type void.

# References

Why can TypeScript return any value using void? https://pozafly.github.io/typescript/why-can-typescript-return-any-value-using-void/

TypeScript Official Documentation, void https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#void

TypeScript Official Documentation, Function Assignability
https://www.typescriptlang.org/ko/docs/handbook/2/functions.html#%ED%95%A8%EC%88%98%EC%9D%98-%ED%95%A0%EB%8B%B9%EA%B0%80%EB%8A%A5%EC%84%B1

What is Covariance https://seob.dev/posts/%EA%B3%B5%EB%B3%80%EC%84%B1%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%B8%EA%B0%80

An Accidental Twitter Thread on Covariance https://twitter.com/_a6g_/status/1678987111893200896