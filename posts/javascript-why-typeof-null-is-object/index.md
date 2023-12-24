---
title: JS의 typeof null은 왜 object일까?
date: "2023-12-23T00:00:00Z"
description: "자바스크립트의 typeof 연산자가 null을 object로 판단하는 이유"
tags: ["javascript"]
---

이 글은 `typeof null`이 왜 `"object"`일까에 대한 의문으로 시작되었다. 그래서 그 답을 찾는 과정을 정리해 기술한다.

# 선 요약

- `null`은 원래 객체의 의미를 내재하고 있는 값으로 만들어졌다.
- 또한 초기의 `typeof` 구현에서 `null` 검사 로직이 따로 없었다.
- 그래서 `typeof null`은 `"object"`로 굳어졌고 이후 고치려는 시도가 있었지만 실패했다.

# 1. 시작

Javascript에는 `typeof` 연산자가 있다. 이 연산자는 피연산자의 타입을 문자열로 반환한다. 예를 들어 `typeof 1`은 `"number"`를 반환하고 `typeof "hello"`는 `"string"`을 반환한다.

```javascript
typeof 1; // "number"
typeof "hello"; // "string"
```

그런데 `typeof null`은 `"object"`를 반환한다. 분명 뭔가 없는 값을 나타낼 때 쓰이는 값인데 타입이 `"object"`라니 이상하지 않은가?

이 사실을 내가 알게 된지는 1년은 넘은 것 같다. 하지만 예전에 이유를 찾아보았을 때 대부분의 문서에서는 역사적인 이유라는 말밖에 찾을 수 없었다. 제대로 된 설명은 [“typeof null”의 역사](https://github.com/FEDevelopers/tech.description/wiki/%E2%80%9Ctypeof-null%E2%80%9D%EC%9D%98-%EC%97%AD%EC%82%AC)와 그 원문에서 정도만 조금 찾을 수 있었다.

그런데 이후 Javascript의 역사를 조금은 더 공부했고, 그 과정에서 `typeof null`의 결과에 대해 몇 마디를 더 덧붙일 수 있게 되었다. 그래서 위의 글에 새로 알게 된 점 몇 개를 더해 이 글을 쓴다.

# 2. 역사적인 이유

`typeof null`이 왜 `"object"`인지에 대해서는 2가지 맥락으로 생각해볼 수 있다. 하나가 이 섹션에서 다룰 역사적인 의미에 따른 부분이고 나머지 하나는 기술적인 부분이다.

역사적인 의미를 찾아보면 `typeof null`이 `"object"`인 이유는, `null`이 원래 이곳에 객체 참조가 있어야 하는데 참조가 없음을 나타내는 값으로 만들어졌기 때문이다.

Javascript를 보면 "없다"는 의미를 나타내는 값이 `null`과 `undefined` 2가지가 있다. 이 둘은 비슷하게 "없다"는 의미를 나타내기 때문에 이 차이는 면접의 단골 질문 중 하나다.

물론 유명한 면접 질문인 만큼 이미 이 둘의 차이를 설명한 글도 많고 해당 주제에 대해서 탐구한 글을 나도 따로 작성하고 있다.(TODO : 이후에 해당 글 작성시 링크 추가) 그러니 여기서는 우리의 처음 질문에 대해 답하는 데에 필요한 부분만 알아보자.

> 왜 `typeof null`은 `"object"`일까?

## 2.1. null과 undefined

많은 프로그래밍 언어들에서 '값이 없음'이나 '빈 참조'를 나타내는 값은 하나이다. Java에서는 `null`이고, Python에는 `None`이 있다.(이 "없다"라는 값의 존재도 많은 문제를 일으키지만 글의 주제를 벗어나므로 넘어간다) 그런데 Javascript는 `null`과 `undefined` 2가지가 있다.

그럼 다른 언어들은 하나의 값으로 이런 "없다"는 의미를 나타내고 있었는데 Javascript는 왜 2가지로 나누었을까? 이는 Javascript의 역사와 연관되어 있다.

Javascript가 처음 나오던 시절 Javascript는 Java의 보조 언어로서 비전문가들을 위해 만들어진 언어였다. 또 Java Applet이나 C++로 만들어진 웹 컴포넌트들을 조립하는 데에 사용하는 것도 Javascript의 주요 목적 중 하나였다. 그래서 초기 Javascript는 Java와 비슷한 문법을 가지고 있어야 한다는 요구사항이 있었다. 더 자세한 Javascript의 역사에 대해서는 다른 글(현재 작성 중)을 참고할 수 있다.

그 요구사항 때문에 Javascript는 Java에서 따온 것들이 몇 개 있다. 그렇게 따온 것중에는 Java에서 원시값과 객체로 값을 구분하는 것도 있었다. 따라서 Javascript에서도 "없다"는 의미를 가지는 값도 할당된 값이 없다는 것과 객체 참조가 없다는 것을 나타내는 값으로 나누려고 했다.

그런데 문제가 있었다. Java에서는 "없다"를 나타내는 값이 `null` 하나지만 변수의 정적 타입이 있어서 변수가 객체 타입이면 있어야 할 객체 참조가 없는 것, 다른 타입이면 할당된 값이 없는 것으로 의미를 구분할 수 있었다. 하지만 Javascript에는 타입이 없었고 하나의 변수에 객체 참조도 값도 담을 수 있었다. 그래서 변수의 정적 타입을 통해 `null`이 나타내는 게 할당된 값이 없다는 건지 객체 참조가 없다는 건지 구분하는 방법을 쓸 수 없었다.

그래서 `null`은 원래 객체 참조가 들어 있어야 하는데 참조가 없음을 나타내는 값으로 하고, 그리고 그냥 할당된 값이 없다는 걸 나타내는 값으로 `undefined`를 만들었다.

즉 `null`은 객체 값이 기대되는 맥락에서 "객체가 없다"는 것을 나타내기 위해 쓰였다. 이는 Java의 `null`을 따온 것이고 Java로 구현된 객체와 Javascript의 통합을 용이하게 해주었다.

## 2.2. typeof

Javascript 1.1에서는 `delete`, `typeof`, `void`연산자가 들어왔다. 이중 `typeof` 연산자는 피연산자의 원시형 타입을 문자열로 반환하는 연산자였다.

이렇게 `typeof`가 최초로 나올 때에도 `typeof null`은 `"object"`였다. 그리고 현재의 JS에서도 마찬가지다. 이는 위에서 설명한 것처럼 `null`은 객체 참조가 없음을 나타내는 값이었기 때문이다.

따라서 `null` 스스로가 객체는 아니지만 객체의 의미를 가지고 있다고 볼 수 있고 그래서 `typeof null`은 `"object"`가 되었다.

다만 문제는 Java에는 `typeof`와 대응되는 무언가가 없었고 그냥 `null`을 초기화되지 않은 변수의 기본값으로 사용했다는 사실이다. 위에서 보았듯이 해당 `null`이 객체인지 원시값인지는 변수의 정적 타입을 기반으로 구분했다. Java에서는 딱히 `null` 자체에 객체라는 의미가 내재되어 있지는 않았던 것이다.

즉 이런 `typeof`의 구현은 나름대로 배경이 있는 것이기는 했으나 실제로 아주 합리적으로 보이는 동작은 아니었다.

Javascript 제작자 브랜든 아이크는 이 `typeof null`의 값은 Mocha(Javascript의 극초기 코드네임) 구현의 [Leaky Abstraction](http://rapapa.net/?p=3266)이었다고 회상하기도 한다. 구현 세부 사항을 알아야 하는 경우가 발생하는, 추상화의 구멍이었다는 것이다.

# 3. 기술적인 이유

`typeof null`이 `"object"`인 데에는 다른 이유도 있다. 말하자면 기술적인 버그라고 할 수 있다. 이를 위해서는 먼저 `undefined`와 `null`이 내부적으로 가지는 값이 어떤 식으로 구현되었는지를 알아야 하고 `typeof`가 값의 타입을 어떻게 판단했는지 알아야 한다.

## 3.1. undefined와 null의 구현

`null`은 앞서 보았듯이 객체 참조가 있어야 하는 자리에 "없다"는 의미를 나타내는 값이었다. 따라서 C에서 `NULL` 포인터를 0으로 정의하는 선례를 따라 `null`은 0으로 숫자 형변환되는 값으로 정의했다.

그럼 `undefined`는 원시값이 없다는 의미를 나타내야 하니까 참조도 아니고(참조라면 객체인 것이니까) 0으로 형변환되지도 않는 값이 필요했다. 따라서 `undefined`는 정수 범위를 벗어나는 값인 $-2^{30}$ 으로 정의되었다.

여담이지만 이런 이유로 지금도 Javascript에서는 `null`은 0으로, `undefined`는 NaN으로 형변환된다. `undefined`는 참조도 아니고, 0으로 변환되지도 않는 값이니까!

```js
Number(undefined); // NaN
Number(null); // 0
```

[이렇게 `null`의 형변환 결과를 0으로 하는 건 좋은 선택이었다고 한다.](https://twitter.com/rauschma/status/332953297294086144) `null`의 자동 형변환 결과가 0인 게 당시 쓰임새가 좀 있었던 듯 하다.

아무튼 이렇게 `null`은 0, `undefined`는 NaN으로 형변환되었다는 사실을 기억하고, `typeof`가 어떻게 값을 판단했는지 알아보자.

## 3.2. 극초기 typeof의 구현

Javascript 프로토타입(당시 이름은 Mocha)이 만들어지던 1995년 5월 쓰였던 엔진에서는 값을 C의 discriminated union으로 저장했다.

구조체를 만들고 그곳에 type tag를 나타내는 변수와 union으로 저장된 값을 저장한 후 tag를 통해 union 값을 어떤 방식으로 읽을지를 결정하는 것이었다.

남아 있는 코드는 없지만 몇몇 자료들을 취합해 보면 아마 당시 Javascript의 값들은 각각 이런 모습이었을 거라고 생각한다. [해당 엔진은 오픈소스가 아니었고 공개된 적이 없기 때문에 정확한 구현은 알 수 없다.](https://twitter.com/BrendanEich/status/226310723691741185)

```c
enum TypeTag {
    OBJECT,
    NUMBER,
    STRING,
    BOOLEAN,
};

struct Value {
    enum TypeTag tag;
    union {
        double number;
        char* string;
        struct Object* object;
        bool boolean;
    } value;
};
```

그리고 실제로 값을 읽을 때는 tag를 통해 어떤 방식으로 읽을지를 결정했다. 예를 들어 값을 출력하는 `printValue`라는 함수가 있었다면 다음과 같이 구현되었을 것이다.

```c
void printValue(struct Value* value) {
    switch (value->tag) {
        case NUMBER:
            printf("%f", value->value.number);
            break;
        case STRING:
            printf("%s", value->value.string);
            break;
        case OBJECT:
            printf("%p", value->value.object);
            break;
        case BOOLEAN:
            printf("%s", value->value.boolean ? "true" : "false");
            break;
    }
}
```

따라서 당연히 `typeof`는 `tag`를 읽어서 적절한 타입 문자열을 반환하는 식으로 구현되었을 거라 보인다.

그럼 특별한 값 `undefined`와 `null`은 어떻게 구현되었을까? 앞서 보았다. 당시 `undefined`는 NaN으로 형변환되었고 $-2^{30}$이라는 특수한 값을 가졌다. 그러니 해당 값이랑 비교하면 되었다. `null`은 NULL 포인터와 같은 값을 가졌다. 이는 0과 같았다.

하지만 `typeof`에는 이 `null`을 위한 특별한 처리 로직이 없었다. 당시에는 Java와 비슷해야 한다는 요구사항과 함께 10일간의 프로토타이핑 시간밖에 주어지지 않았기 때문에 그냥 위의 역사적 맥락으로 인해 `null`을 그냥 객체로 판단했던 거라 생각한다.

이 또한 몇몇 자료를 통해 추정해볼 때 다음과 비슷한 느낌이었을 걸로 추정한다. 따로 `null`을 위한 처리 로직을 넣지 않고 `typeof`를 구현했을 때 `null`의 태그 값은 `OBJECT`와 같았다. 앞서 말했듯이 당시의 `null`은 객체의 의미를 내재하고 있는 값이었기 때문이다. 그래서 `typeof null`은 `object`를 반환하게 되었다.

```c
JS_TYPE typeof(struct Value* value) {
  JS_TYPE type = value->tag;
  JS_OBJECT* obj;

  if(JSVAL_IS_VOID(value)) {
    type = JS_TYPE_VOID;
  } else if(JSVAL_IS_NUMBER(value)) {
    type = JS_TYPE_NUMBER;
  } else if(JSVAL_IS_STRING(value)) {
    type = JS_TYPE_STRING;
  } else if(JSVAL_IS_BOOLEAN(value)) {
    type = JS_TYPE_BOOLEAN;
  } else if(JSVAL_IS_OBJECT(value)) {
    obj = JSVAL_TO_OBJECT(value);
    if(obj && ...함수 판단 로직...) {
      type = JS_TYPE_FUNCTION;
    }
    else{
      type = JS_TYPE_OBJECT;
    }
  }
  return type;
}
```

혹은, 타입 태그 중 객체를 나타내는 값이 0이었기에 모든 비트가 0으로 초기화된 null 구조체의 태그 값을 판단했을 때 `OBJECT`와 같았을 거라는 추측도 가능하다(위 코드의 `enum`도 그런 것을 의도해서 작성하였다).

이럴 경우 아마 이런 식의 코드가 되었을 것이다.

```c
JS_TYPE typeof(struct Value* value) {
  JS_TYPE type = JS_TYPE_VOID;
  JS_OBJECT* obj;

  switch (value->tag){
    case JS_TYPE_OBJECT:
    // tag가 0이므로 모든 비트가 0인 null 구조체의 태그 값도 여기 들어간다
      obj = JSVAL_TO_OBJECT(value);
      if(obj && ...함수 판단 로직...) {
        type = JS_TYPE_FUNCTION;
      } else{
        type = JS_TYPE_OBJECT;
      }
      break;
    case JS_TYPE_VOID:
      type = JS_TYPE_VOID;
      break;
    case JS_TYPE_NUMBER:
      type = JS_TYPE_NUMBER;
      break;
    case JS_TYPE_STRING:
      type = JS_TYPE_STRING;
      break;
    case JS_TYPE_BOOLEAN:
      type = JS_TYPE_BOOLEAN;
      break;
  }
  return type;
}
```

이렇게 초기 엔진에서도 `typeof null`은 `"object"`에 해당하는 값으로 판단되게 되었다.

# 4. 고쳐지지 않은 버그

이는 당연히 버그였지만 한동안 제대로 고쳐지지 않았다.

## 4.1. 타입 태그 도입

1996년 표준화 등 여러가지 목적으로 Javascript 초기 구현의 기술 부채를 청산하는 작업이 진행되었다. 그동안 값을 표현하는 방식을 원시값 그대로를 포함하는 tagged pointer로 변경했다. 이 새로운 엔진은 'SpiderMonkey'라는 이름으로 출시되었다.

이 엔진에서는 discriminated union을 사용하지 않았다. 대신 값의 타입을 나타내는 태그를 포함하는 tagged pointer를 사용했다. 변수의 값은 32비트 단위로 저장되었는데 1~3번째 비트는 타입 태그로 변수의 타입에 대해 저장했고 나머지 비트들은 실제 값이나 참조를 저장했다.

타입 태그는 다음과 같이 5종류가 있었다.

- 000 : 객체. 데이터는 객체에 대한 참조다.
- 1: 정수. 데이터는 31비트의 부호를 가진 정수다.
- 010: 실수. 데이터는 double 부동 소수점에 대한 참조다.
- 100: 문자. 데이터는 문자에 대한 참조다.
- 110: 참/거짓. 데이터는 참/거짓이다.

즉 타입 태그의 lowest bit(만약 비트가 110이면 lowest bit는 0)가 1이면 타입 태그는 길이가 1이었고 lowest bit가 0이면 타입 태그는 길이가 3이었다. lowest bit가 0이고 길이가 3인 타입 태그로 4개의 타입을 나타내는 식이었다(2개의 비트를 쓸 수 있으므로).

그리고 $-2^{30}$ 으로 나타났던 `undefined`와 NULL 포인터(사실 0)으로 나타났던 `null`이라는 특수한 값이 있었다.

## 4.2. 새로운 typeof 구현

이 엔진에서는 `typeof`의 구현도 달라졌다. `typeof`는 타입 태그를 읽어서 적절한 타입 문자열을 반환하는 식으로 구현되었다. 그런데 문제는 `null`값을 명시적으로 검사하는 로직이 따로 없었다는 것이다.

이때 `null`은 0으로 나타나므로 만약 `null`의 값의 타입 태그를 검사하게 되면 당연히 0, 즉 객체 타입을 나타내는 태그가 나오게 된다. 당시 `typeof` 코드는 다음과 같았는데 이 코드를 따라가 보면 왜 `null` 즉 0에 해당하는 값이 `"object"`로 판단되는지 알 수 있다.

```c
JS_PUBLIC_API(JSType) JS_TypeOfValue(JSContext *cx, jsval v) {
    JSType type = JSTYPE_VOID;
    JSObject *obj;
    JSObjectOps *ops;
    JSClass *clasp;

    CHECK_REQUEST(cx);
    if (JSVAL_IS_VOID(v)) {  // (1)
        type = JSTYPE_VOID;
    } else if (JSVAL_IS_OBJECT(v)) {  // (2)
        obj = JSVAL_TO_OBJECT(v);
        if (obj &&
            (ops = obj->map->ops,
              ops == &js_ObjectOps
              ? (clasp = OBJ_GET_CLASS(cx, obj),
                clasp->call || clasp == &js_FunctionClass) // (3,4)
              : ops->call != 0)) {  // (3)
              // 함수 혹은 클래스인지 검사하는 부분
            type = JSTYPE_FUNCTION;
        } else {
            type = JSTYPE_OBJECT;
        }
    } else if (JSVAL_IS_NUMBER(v)) {
        type = JSTYPE_NUMBER;
    } else if (JSVAL_IS_STRING(v)) {
        type = JSTYPE_STRING;
    } else if (JSVAL_IS_BOOLEAN(v)) {
        type = JSTYPE_BOOLEAN;
    }
    return type;
}
```

`(1)`에서는 값이 `undefined`인지 검사한다. `(2)`에서는 값이 객체인지 검사한다. 그런데 `null`의 타입 태그에 해당하는 상위 3비트를 조사했을 때 이는 당연히 `000`이므로 `(2)`로 넘어가고 `null`에 함수 혹은 클래스 속성이 붙어 있을 리 없으므로 반환되는 타입은 `JSTYPE_OBJECT`가 된다.

이런 검사를 통해서 `null`을 가려낼 수 있었을 것이다. 하지만 엔진은 급하게 만들어지느라 그런 로직이 없었다. 그래서 `null`은 `typeof`에서 `"object"`로 판단되었다.

```c
#define JSVAL_IS_NULL(v)  ((v) == JSVAL_NULL)
```

즉 정리하면 당시 `typeof` 연산자의 구현은 값의 내부에 들어 있는 어떤 태그 값을 읽어오는 식이었다. 그런데 `null`의 태그 값은 객체의 타입을 나타내는 것과 같은 내부 태그값을 가졌었다. 따라서 `typeof`는 어떤 특별한 처리 로직 없이 `null`에 대해서 `"object"`를 반환하게 되었다.

모두 알다시피 이는 `typeof` 연산자를 통해서 값이 실제 객체인지를 알아보고 싶어하는 사람들에게 큰 혼란을 주었다. `typeof obj === "object"`라는 코드는 `obj`가 `null`일 때도 `true`를 반환하기 때문이다. 그리고 `null`의 프로퍼티 접근은 런타임 에러다...

# 5. 여담

> "I think it is too late to fix typeof. The change proposed for typeof null will break existing code."

이는 당연히 버그였고 이후 이를 고치려는 시도나 제안도 몇 번 있었다. 그러나 이미 너무 많은 코드가 해당 `typeof`를 기반으로 돌아가고 있었기 때문에 breaking change를 만들기 어렵다는 이유로 실패했다.

물론 `typeof null==="object"`가 버그라는 것은 Javascript 제작자 브랜든 아이크조차 인정하는 사실이다. 하지만 이걸 지금 와서 고치기에는 시간이 너무 많이 지났고, 그래서 `typeof`를 지금 고쳐서 기존 코드를 안 돌아가게 하기보다는 서서히 deprecated 시키는 편이 낫다고 한다.

# 참고

“typeof null”의 역사 https://github.com/FEDevelopers/tech.description/wiki/%E2%80%9Ctypeof-null%E2%80%9D%EC%9D%98-%EC%97%AD%EC%82%AC

NaN and Infinity in JavaScript https://2ality.com/2012/02/nan-infinity.html

Categorizing values in JavaScript https://2ality.com/2013/01/categorizing-values.html

JavaScript history: undefined https://2ality.com/2013/05/history-undefined.html

JavaScript quirk 1: implicit conversion of values https://2ality.com/2013/04/quirk-implicit-conversion.html

JavaScript quirk 2: two “non-values” – undefined and null https://2ality.com/2013/04/quirk-undefined.html

The history of “typeof null”(그리고 댓글의 브랜든 아이크의 첨언) https://2ality.com/2013/10/typeof-null.html

왜 undefined와 null이 둘 다 있는지에 대한 브랜든 아이크의 트윗 https://twitter.com/rauschma/status/333252517628628992

JavaScript의 타입과 자료구조 https://developer.mozilla.org/ko/docs/Web/JavaScript/Data_structures

JavaScript: the first 20 years https://dl.acm.org/doi/10.1145/3386327 12~13페이지

Conversion from null to int possible? https://stackoverflow.com/questions/6588856/conversion-from-null-to-int-possible

개발에서의 Leaky Abstraction http://rapapa.net/?p=3266

C/C++ Tagged/Discriminated Union https://medium.com/@almtechhub/c-c-tagged-discriminated-union-ecd5907610bf

브랜든 아이크의 트윗

https://twitter.com/BrendanEich/status/330775086208524288

ECMAScript-regrets https://github.com/DavidBruant/ECMAScript-regrets