---
title: Modern JavaScript Tutorial Part 1.3 Code Quality - 2
date: "2022-12-31T00:00:00Z"
description: "ko.javascript.info part 1-3 second"
tags: ["javascript"]
---

# 1. Test Automation and Mocha

During development, we continuously test whether the features we developed work correctly. This allows us to improve our code and add new functionalities. Conducting these tests manually can be tedious and time-consuming.

Therefore, we must create automated tests. This involves creating numerous test cases to check whether the functions pass these tests each time they are modified.

Let's consider a situation where we need to create a function pow(x, n) that returns x raised to the power of n. Before we write the code, we must first draft a specification.

A specification consists of three components: describe, it, and assert. The functions of these components are as follows:

- describe groups the tests and provides a description of the functionality being implemented.
- it contains the description of a specific functionality, and the second argument contains the function that performs the test.
- assert is included within the function that performs the test. This function should return an error if the test fails. For example, assert.equal(pow(2, 3), 8) checks whether pow(2, 3) equals 8, and if not, it returns an error.

```javascript
describe("pow", function() {
  it("raises a given number to the power of n.", function() {
    assert.equal(pow(2, 3), 8);
  });
});
```

Mocha, a testing framework, is used to test the functions based on this specification.

## 1.1. Try It Out

Let's create an HTML page as described in the [article](https://ko.javascript.info/testing-mocha).

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Test Page</title>
    <!-- Load mocha CSS used for output. -->
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/mocha/3.2.0/mocha.css"
    />
    <!-- Load Mocha framework code. -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mocha/3.2.0/mocha.js"></script>
    <script>
      mocha.setup("bdd"); // Basic setup
    </script>
    <!-- Load chai -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chai/3.5.0/chai.js"></script>
    <script>
      // Declare assert from chai globally.
      let assert = chai.assert;
    </script>
  </head>
  <body>
    <script>
      function pow(x, n) {
        /* Write code here. Currently left as a blank space. */
      }
    </script>

    <!-- Load the script containing the tests (describe, it...) -->
    <script src="test.js"></script>

    <!-- Output test results to the element with id "mocha". -->
    <div id="mocha"></div>
    <!-- Run the tests! -->
    <script>
      mocha.run();
    </script>
  </body>
</html>
```

And thenadd the previously written specification to test.js.

```javascript
//test.js
describe("pow", function () {
  it("raises a given number to the power of n.", function () {
    assert.equal(pow(2, 3), 8);
  });
});
```

When you open the HTML file in Chrome in this state, you will see the result below. Unsurprisingly, it indicates that the test has not passed yet, as we have not written the function at all.

![test-1](./test-1.png)

## 1.2. Improving Tests

However, we have only written one test. If the pow function simply returns 8, it would pass our test. Therefore, let's add more tests.

Additional tests can be added by including more it blocks within the describe block. Of course, multiple asserts can also be included within the same it block. However, adding asserts within the existing it block has the disadvantage that if one assertion fails, we cannot know the results of the subsequent tests. Thus, let's ensure that each it block (each test) checks only one thing.

```javascript
//test.js
describe("pow", function () {
  it("2 raised to the power of 3 is 8", function () {
    assert.equal(pow(2, 3), 8);
  });

  it("3 raised to the power of 4 is 81", function () {
    assert.equal(pow(3, 4), 81);
  });
});
```

Now, let's correctly implement the pow function to test it. Modify the pow function as follows:

```javascript
function pow(x, n) {
  let r = 1;
  for (let i = 0; i < n; i++) {
    r *= x;
  }
  return r;
}
```

Then, when you reopen the test page, you will see that both tests have passed.

![success](./test-success.png)

However, writing each test individually can be cumbersome. Therefore, it is also possible to generate multiple tests using a loop. For instance, you can create a test code for the fourth power of numbers from 1 to 5 as follows:

```javascript
//test.js
describe("pow", function () {
  it("2 raised to the power of 3 is 8", function () {
    assert.equal(pow(2, 3), 8);
  });

  function makeTest(x) {
    let result = x * x * x * x;
    it(`${x} raised to the fourth power is ${result}`, function () {
      assert.equal(pow(x, 4), result);
    });
  }

  for (let i = 1; i <= 5; i++) {
    makeTest(i);
  }
});
```

## 1.3 Grouping Tests

While we tested only the fourth power above, there can naturally be various tests. We can create tests for the cube as well as for inputs that are not valid numbers. For this, we can use nested describe blocks.

First, let's create a new test group for cubic tests.

```javascript
//test.js
describe("pow", function () {
  describe("Cubic Tests", function () {
    function makeTest(x) {
      let result = x * x * x;
      it(`${x} raised to the third power is ${result}`, function () {
        assert.equal(pow(x, 3), result);
      });
    }

    for (let i = 1; i <= 5; i++) {
      makeTest(i);
    }
  });

  describe("Fourth Power Tests", function () {
    function makeTest(x) {
      let result = x * x * x * x;
      it(`${x} raised to the fourth power is ${result}`, function () {
        assert.equal(pow(x, 4), result);
      });
    }

    for (let i = 1; i <= 5; i++) {
      makeTest(i);
    }
  });
});
```

The defined test groups are displayed in an indented manner on the test results page.

![test-group](./test-group.png)

Additionally, numerous exceptions can occur in the pow function. For example, what if a string is passed as an argument? We should have tests to handle such exceptions. Here, we will write tests that check whether pow(x,n) reacts appropriately when n is negative or when n is not an integer.

In the previously mentioned exceptional cases, the return value should be NaN. Let's write the tests using `assert.isNaN`.

```javascript
describe("Fourth Power Tests", function () {
  function makeTest(x) {
    let result = x * x * x * x;
    it(`${x} raised to the fourth power is ${result}`, function () {
      assert.equal(pow(x, 4), result);
    });
  }

  for (let i = 1; i <= 5; i++) {
    makeTest(i);
  }
});

describe("Exception Handling", function () {
  it("When n is negative, the result should be NaN", function () {
    assert.isNaN(pow(2, -1));
  });

  it("When n is not an integer, the result should be NaN", function () {
    assert.isNaN(pow(2, 1.5));
  });

  it("When n is not an integer, the result should be NaN - 2", function () {
    assert.isNaN(pow(2, "Hi"));
  });
});
```

Since we have not yet implemented exception handling in the pow function, all exception handling tests will fail. Let's modify the pow function to handle these cases as follows:

```javascript
function pow(x, n) {
  if (typeof(n) != "number" || Math.round(n) != n) {
    return NaN;
  }
  if (n < 0) {
    return NaN;
  }
  let r = 1;
  for (let i = 0; i < n; i++) {
    r *= x;
  }
  return r;
}
```

After modifying the pow function this way and reloading the page, you will see that all tests have passed. Writing a test specification and then implementing code that passes those tests allows for safe improvements or modifications to the code without affecting previously implemented functionalities. Moreover, because we can easily test whether errors arise, we won't avoid making modifications and improvements.

Furthermore, writing tests before the code leads to a better-structured architecture by clearly defining specifications in advance.

Lastly, be mindful to write only one test with clear input and output in each it block.

# 2. Polyfills

JavaScript is an ever-evolving language. New proposals are constantly being made, and once they reach a certain level, they may become part of the JavaScript standard. However, features that have recently been included in the standard may not work on specific engines, as not all engines perfectly implement the standards.

## 2.1. Transpilation

In such cases, we can use Babel, a transpiler that converts modern JS code into code that adheres to older standards. Build systems like Webpack automatically transpile code every time changes are made. For instance, converting ES6 code to ES5 is a form of transpilation.

## 2.2. Polyfills

Specifications may also be updated to include new content. When new syntax is added, the transpiler should convert it into code that adheres to older standards. However, if new built-in functions are added, implementations of those functions must exist for them to be used. The scripts that either modify the behavior of existing functions to comply with the new standards or provide implementations of the newly created standards are referred to as polyfills.

For example, you can refer to [this](https://github.com/js-temporal/temporal-polyfill) for a polyfill that enables the use of the [Temporal API](https://xo.dev/js-temporal-api/).