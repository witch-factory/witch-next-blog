---
title: JSON(JavaScript Object Notation) 다루기
date: "2023-08-24T00:00:00Z"
description: "JSON을 다루어보자"
tags: ["javascript"]
---

# 1. JSON이란?

인터넷이 발전하면서 네트워크를 통해서 점점 양도 많고 다양한 종류의 데이터를 주고받게 되었다. 그런데 이런 복잡한 데이터를 단순한 문자열만으로 보낼 수는 없었다. 그래서 특정한 형식으로 보내게 되었다. XML, JSON, CSV 등이 그것이다.

하지만 XML은 데이터를 만들기 너무 복잡했고 CSV는 고차원 데이터를 표현하기 힘들었다. 그래서 [더글라스 크록포드](https://en.wikipedia.org/wiki/Douglas_Crockford)가 JS의 객체 리터럴과 비슷한 문법을 따르는(JSON의 원래 이름도 `JavaScript Object Notation`이다) JSON을 만들고 이를 홍보하는 사이트 [json.org(한국어 버전)](https://www.json.org/json-ko.html)도 만들었다. 

이는 XML보다 가볍고 CSV보다 표현력이 좋아서 널리 쓰이게 되었다. 또한 JSON 관련된 문법도 Javascript 문법에 편입되고 `JSON.stringify`와 `JSON.parse`와 같은 메서드도 생겼다. 

그래서 지금은 JSON이 네트워크를 통해 데이터를 주고받는 가장 표준적인 형식 중 하나가 되었다. firebase의 실시간 데이터베이스나 로컬 스토리지와 같은 데에 데이터를 저장할 때도 JSON을 쓴다. YAML같은 대체 형식도 많지만 이미 JS 문법에도 있는 등 JSON이 너무 널리 쓰이고 있어서 덜 쓰이는 편이다.

# 2. JSON 구조

JSON은 말 그대로 JS의 객체 리터럴 문법을 따르는 문자열이다. JS의 기본 타입인 문자열, 숫자, 배열, 불린, null, 다른 객체를 포함할 수 있다. json.org에서도 다음과 같이 JSON의 값으로 쓰일 수 있는 것들을 나열하고 있다.

![JSON의 값 형식](./json_value.png)

다음과 같이 쓸 수 있다. 이 예시는 [json.org의 공식 예시에서 가져왔다.](https://json.org/example.html)

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

이런 JSON 객체를 `.json`확장자를 가진 텍스트 파일에 저장할 수 있다. 그 경우 MIME 타입은 `application/json`이 된다.

JS 객체와의 차이는 undefined와 심볼 자료형이 없고 문자열이나 프로퍼티 키 작성시 큰따옴표만을 써야 한다는 것이다. 프로퍼티 키 또한 큰따옴표로 반드시 묶여 있어야 한다. 또한 JSON은 함수를 포함할 수 없다. [더 자세한 규칙은 MDN의 JSON 문서를 참고하자.](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/JSON)

# 3. JSON 사용하기

## 3.1. stringify, parse

객체와 JSON간의 변환을 지원하기 위한 함수로 `JSON.stringify`와 `JSON.parse`가 있다. `JSON.stringify`는 객체를 JSON으로 변환하고 `JSON.parse`는 JSON을 객체로 변환한다. 이 함수들은 중첩 객체나 중첩 객체가 변환된 JSON 문자열도 잘 처리한다.

```js
let myStudy={
  name:"Javascript",
  level:"Beginner",
  time:"2 months",
  isCompleted:true,
  members:[
    "John",
    "Peter",
    "Mary",
    "Bessy",
  ]
}

let myStudyJSON=JSON.stringify(myStudy);
/* {"name":"Javascript","level":"Beginner","time":"2 months","isCompleted":true,"members":["John","Peter","Mary","Bessy"]} */
console.log(myStudyJSON);
```

이렇게 변경된 문자열은 JSON으로 인코딩된, 직렬화 처리된, 문자열로 변환된, 결집된 객체(JSON-encoded, serialized, stringified, marshalled object)라 한다. 이 문자열은 네트워크를 통해 전송하거나 저장소에 저장할 수 있다.

또한 `JSON.stringify`는 객체뿐 아니라 배열, 문자열, 숫자, 불린, null도 JSON으로 변환할 수 있다. 함수나 undefined, 심볼 자료형은 변환할 수 없으며 이러한 프로퍼티를 가진 객체에 대해서는 해당 프로퍼티를 무시한다.

```js
let myStudy={
  name:"Javascript",
  level:"Beginner",
  time:"2 months",
  isCompleted:true,
  sayHello:function(){
    console.log("Hello");
  }
}

let myStudyJSON=JSON.stringify(myStudy);
/* 결과에서 sayHello 함수는 무시된다 */
console.log(myStudyJSON);
```

단 주의할 점은 순환 참조가 있을 때 객체를 JSON 문자열로 바꾸는 것이 실패한다는 점이다. 순환 참조를 JSON으로 바꾸려고 한다는 `Error: Converting circular structure to JSON` 오류가 발생한다.

그리고 `JSON.parse`를 사용하면 JSON으로 인코딩된 객체를 다시 객체로 변환할 수 있다.

## 3.2. stringify 심화

JSON의 전체 형식은 다음과 같다.

```js
JSON.stringify(value[, replacer[, space]])
```

value는 당연히 인코딩하려는 값이다. `replacer`는 JSON으로 인코딩하려는 프로퍼티들이 담긴 배열 혹은 매핑 함수이다. `space`는 직렬화 시 중간에 삽입해 줄 공백 문자 수를 나타낸다.

### 3.2.1. replacer

JSON으로 객체를 직렬화할 때 특정 프로퍼티만 포함하거나 특정 프로퍼티만 제외하고 싶을 수 있다. 그럴 때 이 인자를 사용할 수 있다. 예를 들어 다음과 같이 하면 `members` 프로퍼티를 제외한 나머지 프로퍼티만 JSON으로 변환된다. 그렇게 replacer 배열을 전달해 줬기 때문이다.

```js
let myStudy={
  name:"Javascript",
  level:"Beginner",
  time:"2 months",
  isCompleted:true,
  members:["John","Peter","Mary","Bessy"]
}

let myStudyJSON=JSON.stringify(myStudy, ["name","level","time","isCompleted"]);
console.log(myStudyJSON);
```

하지만 이보다 훨씬 더 객체의 프로퍼티 갯수가 많은 경우가 있을 수 있으므로, 특정 프로퍼티를 직렬화에서 제외할 때는 함수를 쓰는 게 더 간편하다.

`replacer`에 넘기는 함수는 key, value를 인자로 받으며 객체의 각 프로퍼티를 재귀적으로 순회한다. value값이 객체라면 해당 객체로 진입해서 프로퍼티들을 순회한다는 뜻이다. 그리고 해당 함수는 기존 프로퍼티 값을 대신해 사용할 값을 반환하게 된다.

즉 만약 프로퍼티 값 그대로 직렬화하려면 value를 반환하도록 하면 되고 누락시키려는 프로퍼티에 대해서는 undefined를 반환하면 된다. 물론 value 대신 사용할 다른 값을 반환해도 된다. 다음과 같이 하면 members 프로퍼티는 누락된다.

```js
let myStudy={
  name:"Javascript",
  level:"Beginner",
  time:"2 months",
  isCompleted:true,
  members:["John","Peter","Mary","Bessy"]
}

let myStudyJSON=JSON.stringify(myStudy, (key, value)=>{
  if(key==="members"){
    return undefined;
  }
  return value;
});
```

참고로 replacer 내에서 `this`는 현재 처리하고 있는 프로퍼티가 위치한 객체를 가리키게 된다. 중첩 객체일 수도 있으므로 이게 꼭 전체 객체를 가리키는 것은 아니다.

그리고 `replacer`함수에서 처리하는 key, value 쌍을 모두 훑어보면 신기한 것을 발견할 수 있다. 다음과 같은 코드를 실행해보자.

```js
let myStudy={
  name:"Javascript",
  level:"Beginner",
  time:"2 months",
  isCompleted:true,
  members:["John","Peter","Mary","Bessy"],
}

let myStudyJSON=JSON.stringify(myStudy, (key, value)=>{
  console.log(key, value);
  if(key=="name"){
    return "My study";
  }else{
    return value;
  }
});
console.log(myStudyJSON);
```

그러면 다음과 같은 출력 결과가 나온다. `name`이 key인 프로퍼티에 대해서는 값이 `My study`로 바뀐 것을 볼 수 있다.

![출력 결과](./stringify-iteration.png)

배열이야 사실 객체니까 인덱스와 그 값을 순회하는 건 이상할 게 없다. 아마 결과값을 만들 때 걸러낼 것이다. 그런데 맨 윗줄 출력에 전체 객체가 출력되는 것은 뭘까?

이는 `replacer`함수가 처음으로 호출될 때 전체 객체를 감싸는 래퍼 객체가 만들어지기 때문이다. 즉 `replacer`함수는 `key`가 `""`이고 `value`가 전체 객체인 래퍼 객체부터 순회하게 된다. 그래서 처음에 전체 객체가 1번 출력된 것이다.

### 3.2.2. space

`JSON.stringify`의 세 번째 인수 space는 가독성을 위해서 들여쓰기에 삽입해줄 공백 문자 수를 나타낸다. space는 가독성을 위한 목적일 뿐이므로 데이터 전달만을 위한다면 space 인수를 전달하지 않는 편이다.

하지만 만약 space 인수를 전달하면 space 수만큼의 들여쓰기와 함께 stringify 결과가 포매팅된다.

```
- space를 2로 전달했을 때의 stringify 결과
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

객체에 `toJSON`메서드가 구현되어 있으면 `JSON.stringify`에서는 이를 감지하고 객체의 `toJSON`을 자동으로 호출해 반영해준다. 따라서 특정 객체에 대해서 `stringify`결과를 적당히 변경하고 싶다면 해당 객체에 `toJSON`메서드를 구현하면 된다.

```js
let obj={
  test:{
    name:"Javascript test",
    time:"1 hour",
    toJSON(){
      return this.time;
    }
  }
}

// {"test":"1 hour"}
let myJSON=JSON.stringify(obj);
console.log(myJSON);
```

## 3.3. parse 심화

`JSON.parse`의 전체 형태는 다음과 같다.

```js
JSON.parse(text[, reviver])
```

여기서 당연히 text는 JSON 형식 문자열이다. 그럼 `reviver`는 무슨 역할일까? 특정 값을 변경해야 한다는 것을 `JSON.parse`에게 알리는 역할을 한다.

다음과 같이 하면 `JSON.parse`는 객체를 반환할 때 `age`프로퍼티의 값을 5 늘려서 변환한다.

```js
let obj={
  name:"John",
  age:30,
  city:"New York"
}

let myJSON=JSON.stringify(obj);
console.log(myJSON);

let myObj=JSON.parse(myJSON, (key, value)=>{
  if(key=='age') return value+5;
  else return value;
});
// {name: 'John', age: 35, city: 'New York'}
console.log(myObj);
```

## 3.3. fetch

JSON을 그대로 import해서 사용하는 방법도 몇 가지 있지만([JS에서의 JSON 모듈](https://ui.toast.com/posts/ko_20211209), [ES6로 JSON 가져오기](https://stackoverflow.com/questions/34944099/how-to-import-a-json-file-in-ecmascript-6)) 복잡하기 때문에 여기서는 MDN에서 제공하는 JSON 객체를 fetch해서 사용하도록 하자.

`fetch`를 사용하면 `json()`메서드를 활용하여 Response를 JSON으로 파싱한 결과를 감싼 Promise를 간단히 얻을 수 있다는 이점도 있다.

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

// 가져온 JSON 객체가 콘솔에 출력된다
getJSON(requestURL);
```

`getJSON`에서 `data`를 반환하도록 하면 JSON으로부터 추출된 객체를 반환받을 수도 있다.

# 참고

코딩애플 - JSON (존슨) 은 자바스크립트 문법이 아닙니다 https://www.youtube.com/watch?v=1ID6pfTViXo

JSON으로 작업하기 https://developer.mozilla.org/ko/docs/Learn/JavaScript/Objects/JSON

JSON과 메서드 https://ko.javascript.info/json