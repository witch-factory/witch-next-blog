---
title: What is JSON? And How to Validate It?
date: "2023-08-27T01:00:00Z"
description: "Let's explore the structure, usage, and validation methods of JSON."
tags: ["javascript"]
---

# 1. What is JSON?

As the internet has evolved, the exchange of increasingly large and diverse types of data over networks has become more common. However, such complex data could not be sent as simple strings. Thus, it became necessary to adopt specific formats, such as XML, JSON, and CSV.

XML, however, was too complex for data creation. [The official JSON website shows examples of JSON and the same data written in XML, which, while familiar in HTML format, is considerably more complicated than JSON.](https://json.org/example.html)

CSV, resembling a table format similar to Excel, was difficult to use for high-level data representation. Consequently, [Douglas Crockford](https://en.wikipedia.org/wiki/Douglas_Crockford) created JSON, which follows syntax resembling JavaScript object literals (its original name was also `JavaScript Object Notation`), and promoted it through the [json.org (Korean version)](https://www.json.org/json-ko.html) website.

JSON gained popularity due to being lighter than XML and more expressive than CSV. Furthermore, the syntax related to JSON was integrated into JavaScript, leading to the creation of methods such as `JSON.stringify` and `JSON.parse`.

Today, JSON is one of the most standard formats for exchanging data over networks and is commonly used for storing data in real-time databases like Firebase or local storage.

While there are many alternative formats like YAML, JSON remains widely used, to the extent that it has been somewhat integrated into JavaScript syntax.

# 2. Structure of JSON

JSON is, as its name suggests, a string that adheres to the JavaScript Object Notation format, specifically following JavaScript's object literal syntax. It can include JavaScript's basic types: strings, numbers, arrays, booleans, null, and other objects.

json.org lists the possible values that can be used in JSON as follows:

![JSON Value Formats](./json_value.png)

Here is an example from [json.org’s official example](https://json.org/example.html):

```json
{
  "menu": {
    "header": "SVG Viewer",
    "items": [
      {"id": "Open"},
      {"id": "OpenNew", "label": "Open New"},
      null,
      {"id": "ZoomIn", "label": "Zoom In"},
      {"id": "ZoomOut", "label": "Zoom Out"},
      {"id": "OriginalView", "label": "Original View"},
      null,
      {"id": "Quality"},
      {"id": "Pause"},
      {"id": "Mute"},
      null,
      {"id": "Find", "label": "Find..."},
      {"id": "FindAgain", "label": "Find Again"},
      {"id": "Copy"},
      {"id": "CopyAgain", "label": "Copy Again"},
      {"id": "CopySVG", "label": "Copy SVG"},
      {"id": "ViewSVG", "label": "View SVG"},
      {"id": "ViewSource", "label": "View Source"},
      {"id": "SaveAs", "label": "Save As"},
      null,
      {"id": "Help"},
      {"id": "About", "label": "About Adobe CVG Viewer..."}
    ]
  }
}
```

Such JSON objects can be saved in text files with the `.json` extension, which will use the MIME type `application/json`.

The key differences from JS objects are that undefined and symbol types do not exist, and only double quotes may be used for strings and property keys. Property keys must also be enclosed in double quotes. Additionally, JSON cannot include functions. [For more detailed rules, refer to MDN’s JSON documentation.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON)

# 3. Using JSON in JS

To use JSON in JavaScript, two functions are available: `JSON.stringify` and `JSON.parse`. These functions are used to convert JSON to JS objects and JS objects to JSON. Let’s examine these functions.

## 3.1. stringify, parse

The functions `JSON.stringify` and `JSON.parse` facilitate conversion between objects and JSON. `JSON.stringify` converts an object to JSON, while `JSON.parse` converts JSON to an object. These functions handle nested objects and JSON strings efficiently.

```js
let myStudy = {
  name: "Javascript",
  level: "Beginner",
  time: "2 months",
  isCompleted: true,
  members: [
    "John",
    "Peter",
    "Mary",
    "Bessy"
  ]
}

let myStudyJSON = JSON.stringify(myStudy);
/* {"name":"Javascript","level":"Beginner","time":"2 months","isCompleted":true,"members":["John","Peter","Mary","Bessy"]} */
console.log(myStudyJSON);
```

This transformed string is referred to as a JSON-encoded, serialized, stringified, or marshalled object. This string can be sent over a network or stored in storage.

Furthermore, `JSON.stringify` can convert not only objects but also arrays, strings, numbers, booleans, and null into JSON. However, functions, undefined, and symbol types cannot be converted, and properties with such types will be ignored.

```js
let myStudy = {
  name: "Javascript",
  level: "Beginner",
  time: "2 months",
  isCompleted: true,
  sayHello: function() {
    console.log("Hello");
  }
}

let myStudyJSON = JSON.stringify(myStudy);
/* The sayHello function is ignored in the result */
console.log(myStudyJSON);
```

Caution is warranted when there are circular references, as converting an object to a JSON string in such cases will fail, resulting in an `Error: Converting circular structure to JSON`.

The `JSON.parse` function can be used to convert a JSON-encoded object back into a JavaScript object.

## 3.2. Advanced stringify

The full format of JSON.stringify is as follows:

```js
JSON.stringify(value[, replacer[, space]])
```

The value is, of course, the value to be encoded. The `replacer` is an array or mapping function containing the properties to be encoded into JSON. The `space` parameter indicates the number of whitespace characters to be inserted for indentation purposes during serialization.

### 3.2.1. Replacer

When serializing an object to JSON, you may want to include only certain properties or exclude certain ones. This argument can be used for that purpose. For example, passing an array here for the following will convert only the properties excluding `members` to JSON.

```js
let myStudy = {
  name: "Javascript",
  level: "Beginner",
  time: "2 months",
  isCompleted: true,
  members: ["John", "Peter", "Mary", "Bessy"]
}

let myStudyJSON = JSON.stringify(myStudy, ["name", "level", "time", "isCompleted"]);
console.log(myStudyJSON);
```

However, for cases where an object has many properties, using a function to exclude specific properties from serialization can be more convenient.

A function passed to `replacer` accepts key and value as arguments and recursively traverses each property of the object. If the value is an object, it means it will enter that object and traverse its properties. The function should return the value to be used instead of the existing property value.

To serialize the property value as is, return the value; to omit a property, return undefined. You can also return a different value instead of value. The following implementation omits the `members` property.

```js
let myStudy = {
  name: "Javascript",
  level: "Beginner",
  time: "2 months",
  isCompleted: true,
  members: ["John", "Peter", "Mary", "Bessy"]
}

let myStudyJSON = JSON.stringify(myStudy, (key, value) => {
  if (key === "members") {
    return undefined;
  }
  return value;
});
```

Note that `this` within the replacer refers to the object containing the current property being processed. It does not necessarily point to the entire object as it could be a nested object.

Examining all key-value pairs processed in the `replacer` function will yield interesting results. Consider the following code.

```js
let myStudy = {
  name: "Javascript",
  level: "Beginner",
  time: "2 months",
  isCompleted: true,
  members: ["John", "Peter", "Mary", "Bessy"],
}

let myStudyJSON = JSON.stringify(myStudy, (key, value) => {
  console.log(key, value);
  if (key == "name") {
    return "My study";
  } else {
    return value;
  }
});
console.log(myStudyJSON);
```

The resulting output will show that when the key is `name`, the value has been changed to `My study`.

![Output Result](./stringify-iteration.png)

Since an array is essentially an object, iterating through indices and their values is expected. It’s worth noting that the top output, which shows the entire object, is because the `replacer` function is first called with the key being `""` and the value being the entire object due to the creation of a wrapper object to encompass the entire object. Thus, it is printed first as part of the initial invocation.

### 3.2.2. Space

The third argument, `space`, in `JSON.stringify` indicates the number of whitespace characters for readability during indentation. The `space` parameter is merely for readability, so if data transfer is the only concern, it is preferable not to pass it.

However, when you do pass a space argument, the stringify result will be formatted with that level of indentation.

```
- stringify result when space is passed as 2
{
  "name": "My study",
  "level": "Beginner",
  "time": "2 months",
  "isCompleted": true,
  "members": [
    "John",
    "Peter",
    "Mary",
    "Bessy"
  ]
}
```

### 3.2.3. toJSON

If the object has a `toJSON` method, `JSON.stringify` will detect it and automatically call the object's `toJSON`, reflecting its return value in the output. Therefore, if you want to modify the stringify result for a specific object, you can implement the `toJSON` method in that object.

```js
let obj = {
  test: {
    name: "Javascript test",
    time: "1 hour",
    toJSON() {
      return this.time;
    }
  }
}

// {"test":"1 hour"}
let myJSON = JSON.stringify(obj);
console.log(myJSON);
```

## 3.3. Advanced parse

The full format of `JSON.parse` is as follows:

```js
JSON.parse(text[, reviver])
```

Here, the `text` is, naturally, a string in JSON format. What role does the `reviver` play? It serves to indicate how to change specific values while notifying `JSON.parse`.

For instance, the following implementation will increment the value of the `age` property by 5 when returning the object.

```js
let obj = {
  name: "John",
  age: 30,
  city: "New York"
}

let myJSON = JSON.stringify(obj);
console.log(myJSON);

let myObj = JSON.parse(myJSON, (key, value) => {
  if (key == 'age') return value + 5;
  else return value;
});
// {name: 'John', age: 35, city: 'New York'}
console.log(myObj);
```

## 3.4. Fetch API

There are several methods to directly import JSON for use, but these can be complex and are not commonly utilized since JSON is primarily intended for data transfer.

Instead, JSON is commonly used for data transfer via servers or in client storage. When receiving data from a server, JSON is frequently the format used; therefore, various APIs or libraries for server communication often provide functionality for easy manipulation of JSON.

For example, using `fetch`, you can utilize the `json()` method to obtain a Promise that encompasses the result of parsing the Response to JSON.

```js
const requestURL =
  "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json";

async function getJSON(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    throw error;
  }
}

// The retrieved JSON object is printed to the console
getJSON(requestURL);
```

By returning `data` in `getJSON`, you can also obtain an object extracted from the JSON.

# 4. Validating JSON

JSON is widely used for data transfer. It is quite common to receive JSON when obtaining data from a server. However, can we validate whether the JSON received from the server conforms to the desired format?

First, this is not possible through TypeScript, as all types in TS vanish upon compilation. If JSON is incoming data from a server, it will arrive at runtime, making validation via TS impossible.

An API dedicated to value validation can be used. There are several well-known libraries available, such as [Zod](https://github.com/colinhacks/zod) and [Yup](https://github.com/jquense/yup).

For instance, Yup supports runtime value validation through the `validate` function and also offers type inference via `InferType`. The following code is taken from Yup's official GitHub and is intuitive enough that anyone familiar with TypeScript can get a general understanding of its meaning.

```ts
import { object, string, number, date, InferType } from 'yup';

let userSchema = object({
  name: string().required(),
  age: number().required().positive().integer(),
  email: string().email(),
  website: string().url().nullable(),
  createdOn: date().default(() => new Date()),
});

// parse and assert validity
const user = await userSchema.validate(await fetchUser());

type User = InferType<typeof userSchema>;
/* {
  name: string;
  age: number;
  email?: string | undefined,
  website?: string | null | undefined,
  createdOn: Date
}*/
```

But is there a more specialized format for validating JSON? There is JSON schema and JSON type definition for this purpose.

## 4.1. JSON Schema

A well-known format for JSON validation is [JSON Schema](https://json-schema.org/). JSON Schema is a declarative format for creating rules to express and validate the structure of JSON.

JSON Schema itself is also expressed in JSON format. You can create files in the format of `example.schema.json` and write your schema within (the `.schema` part is not mandatory).

For example, one might write as follows. It is easy to notice that the `type` indicates the property type, while `properties` lists the required properties in the object.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/product.schema.json",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    },
    "tags": {
      "description": "Tags for the product",
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    }
  },
  "required": ["productId", "productName", "price"]
}
```

The `type` can be `string`, `number`, `boolean`, `object`, `array`, or `null`.

Additional validation conditions can be specified for specific types of properties. For instance, for an `array` type, the `items` key can define the item types within the array. Similarly, for an `object` type, the `properties` key can specify the types of the object's properties.

```json
{
  "title": "Person",
  "description": "Schema for a person",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "number"
    }
  }
}
```

You can also create validation conditions using `enum` for properties that must have one of the specified values, and you can define other options like required properties, minimum item counts, and whether duplicated items are allowed.

For more details, refer to the [JSON Schema specification](https://json-schema.org/specification.html) or [MadPlay's blog post](https://madplay.github.io/post/understanding-json-schema).

## 4.2. JSON Type Definition

JSON Type Definition (which I will refer to as JTD) is a JSON format that expresses the structure of JSON documents, similar to JSON Schema.

Unlike the previously mentioned JSON Schema, it is also registered in [RFC standards](https://datatracker.ietf.org/doc/html/rfc8927).

The following eight types of schemas are available.

First, there is an empty form akin to TypeScript's `any`, allowing any value, represented as `{}`.

Then, you may use type forms similar to TypeScript primitive types, such as `string`, `int32`, `int64`, `float32`, `float64`, `bool`, and `timestamp`.

Enums can be defined using the `enum` property, with values being an array of `string`. This specifies that the only values allowed are those in the specified array, similar to a TypeScript enum.

```json
{
  "enum": ["red", "green", "blue"]
}
```

The elements form is utilized to indicate the types of elements in an array.

```json
{
  "elements": { "type": "string" }
}
```

Using the properties form, you can define the types of properties in an object. The `optionalProperties` key allows you to specify properties that are optional, and setting `"additionalProperties": true` allows for additional properties. By default, additional properties are not allowed.

```json
{
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "int32" }
  },
  "optionalProperties": {
    "address": { "type": "string" }
  }
}
```

The values form is used when the keys of an object are unknown, but you want to restrict the types of values that object properties can have, similar to TypeScript's `Record<string, T>`.

```json
{
  "values": { "type": "string" }
}
```

The discriminator form can be used to distinguish types of objects based on one of their properties, akin to a tagged union in TypeScript. You specify which property to use as the discriminator value and list the possible schema values in the `mapping`.

For example, in the schema specified below, the `Person` key can only take forms defined under `STUDENT` or `TEACHER`.

```json
{
  "discriminator": "Person",
  "mapping": {
    "STUDENT": {
      "properties": {
        "name": { "type": "string" },
        "age": { "type": "int32" },
        "school": { "type": "string" }
      }
    },
    "TEACHER": {
      "properties": {
        "name": { "type": "string" },
        "age": { "type": "int32" },
        "subject": { "type": "string" }
      }
    }
  }
}
```

Finally, the ref form allows the reuse of another schema.

```json
{
  // Let’s assume coordinates were defined in the "definitions" property.
  "properties": {
    "userLoc": { "ref": "coordinates" },
    "serverLoc": { "ref": "coordinates" }
  }
}
```

For more details, you can refer to [Learn JSON Typedef in 5 Minutes](https://jsontypedef.com/docs/jtd-in-5-minutes/) or the [RFC 8927 document](https://datatracker.ietf.org/doc/html/rfc8927), as well as the [unofficial reference provided by the ajv library](https://ajv.js.org/json-type-definition.html).

## 4.3. JSON Schema vs Type Definition

For a detailed comparison, check [ajv's JSON validation schema comparison document](https://ajv.js.org/guide/schema-language.html).

However, after reviewing their official documents, I personally found JTD to be slightly more user-friendly and concise. JSON Schema does have the advantage of supporting more complex validation forms.

Nonetheless, in many cases, the need for such complex validation in JSON doesn't often arise, and libraries like ajv support some non-standard validations that help mitigate this limitation.

However, since mainstream JSON validation and schema generation libraries such as ajv, typia, and typebox primarily use JSON Schema, considering the community aspect, it may be better to utilize JSON Schema. While I mentioned that JTD is more concise, the difference is not substantial.

# Conclusion and Outlook

We examined what JSON is, how it is structured, and how it is used in JS. Additionally, we briefly explored two formats for value validation in JSON: JSON Schema and JTD.

Next, how is validation actually performed using JSON Schema and JTD? Major libraries supporting validation via JSON Schema include ajv and typia (which was originally named typescript-json). The next article will cover these libraries. 

# References

Coding Apple - JSON (Johnston) is not JavaScript Syntax https://www.youtube.com/watch?v=1ID6pfTViXo

Working with JSON https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/JSON

What is JSON Schema? https://madplay.github.io/post/understanding-json-schema

Schema comparison in ajv official documentation https://ajv.js.org/guide/schema-language.html

Getting Started with JSON Type Definition https://jsontypedef.com/docs/jtd-in-5-minutes/

Validating Data on the Client Side https://ethansup.net/blog/client-runtime-validator