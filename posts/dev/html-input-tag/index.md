---
title: HTML input 태그
date: "2023-07-06T00:00:00Z"
description: "사용자 데이터를 받는 input 태그는 강력하고 기능도 많다."
tags: ["html"]
---

# 1. HTML의 input 태그

HTML input 태그는 사용자의 데이터를 받을 수 있는 요소를 생성한다. `type` 속성으로 어떤 종류의 데이터를 받을지를 지정할 수 있고 이외에도 다양한 특성을 가지고 있다.

이 요소의 동작 방식은 `type`에 따라 매우 달라지기 때문에 타입별로 간략히 정리하였다.

# 2. type="button"

푸시 버튼을 렌더링한다.

```html
<input type="button" value="버튼의 라벨로 사용할 문자열" />
```

요즘은 이미지도 포함할 수 있고 더 직관적이라는 장점 때문에 `button` 요소를 사용하는 것이 더 선호되지만 `input` 요소의 `button` 타입을 쓰는 것도 전혀 문제없다.

`accesskey` 특성을 사용해서 단축키를 지정할 수 있다. 단 지정한 키를 그대로 사용하는 건 아니고 특정 키를 같이 눌러야 할 수 있다. 이는 [accesskey 전역 특성](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/accesskey)문서의 활성화 방법을 참고하자. 

그러나 이는 접근성이나 다른 보조 기술 기능과의 충돌 문제 등으로 인해 단축키 지정은 일반적으로 권장되지 않는다.

`disabled`속성으로 간단히 비활성화 가능.

# 2. type="checkbox"

체크박스를 렌더링한다. 스타일은 브라우저마다 다를 수 있다.

`name`, `value` 속성이 있는데, 이는 체크박스의 데이터가 서버에 전달될 때 부여되는 값이다. 예를 들어 다음과 같은 체크박스 input을 생각하자.

```html
<input type="checkbox" name="nickname" value="witch" />
```

그러면 해당 체크박스가 체크된 채로 들어 있는 폼이 제출되었을 때 폼을 통해 전달되는 데이터에는 `nickname:witch`가 들어 있게 된다. 만약 value가 생략되면 기본값은 `on`이다. 

체크박스가 체크되어 있지 않은 상태로 폼이 제출되면 값 자체가 서버에 전달되지 않는다.

`checked` 프로퍼티는 현재 체크박스가 체크된 상태인지를 나타내는 것이 **아니다.** 이는 체크박스가 기본적으로 체크된 상태로 보여질지를 결정한다.

체크박스는 `indeterminate`라는 제3의 상태를 가질 수 있다. 예를 들어서 전체 약관 동의가 체크되었는지를 표시하는 체크박스가 있을 때, 가령 동의할 약관이 3개라면 그 중에 3개 미만에 체크되었을 때 이 체크박스는 indeterminate 상태로 만드는 등의 용도로 쓸 수 있다.

이는 `HTMLInputElement`의 indeterminate 프로퍼티를 통해 쓸 수 있다. HTML만을 통해서 쓸 수는 없다.

# 3. type="color"

사용자가 색상을 선택할 수 있는 인터페이스를 제공한다. color picker와 RGB값 입력을 제공한다. value는 ``#rrggbb`와 같은 색상 코드이며 소문자로 저장된다.

# 4. type="date"

날짜 유효성을 검증하는 텍스트 상자 혹은 날짜 선택을 할 수 있는 인터페이스를 제공한다. 연, 월, 일만 포함한다. 시간+날짜 조합은 `time` 과 `datetime-local` 타입 input에서 지원한다.

받을 수 있는 최소/최대 날짜를 지정하는 min, max 특성(`max>min`이어야 함)과 날짜 조절 버튼을 눌렀을 때 조절되는 일수를 지정하는 `step` 특성이 있다.

datepicker 지원이 완벽하지 않은 브라우저도 있다. 이 경우 `type="text"`의 input이 되지만 이렇게 되면 입력 검증 등이 안된다. 크로스 브라우저로 날짜 처리를 하려 한다면 최선은 사실 input을 쓰는 게 아니라 datepicker를 직접 만드는 것이다.

# 5. type="datetime-local"

연, 월, 일 그리고 시간(시/분)을 입력받을 수 있는 인터페이스를 제공한다. 

이는 지역적인 시간을 입력받는 데 쓰이지만 그것이 꼭 사용자가 있는 장소의 시간을 의미하는 것은 아니다. 따라서 사용자가 있는 곳에서는 불가능한 시간을 입력할 수도 있다.

다만 아직은 크로스 브라우징이 완벽하지 않다. 따라서 크로스 브라우저 지원을 위해서는 외부 라이브러리를 사용하거나 직접 input을 구현하는 게 낫다.

# 6. type="email"

이메일 혹은 이메일들을 입력받을 수 있는 인터페이스를 제공한다. 

```html
<input type="email" name="email" />
```

입력되는 값들은 비어 있거나 이메일 형식을 갖추고 있는지 자동으로 유효성 검사를 거친다. 그리고 현재 필드에 있는 값이 유효한 이메일인지에 따라서 `:valid` 혹은 `:invalid` 유사 클래스 선택자가 활성화된다.

단 이를 보안상의 데이터 검증 목적으로 쓰면 안된다. 사용자는 postman 등을 통해서 서버에 직접 데이터를 전송할 수도 있고, 이러면 HTML에서 진행하는 유효성 검사를 우회할 수 있기 때문이다.

## 6.1. list 속성

`<datalist>` 요소의 id를 `list` 속성으로 전달하여 사용자에게 선택지를 제공할 수 있다. 단 이는 사용자에게 제안하는 것이지 사용자는 이렇게 제안된 값들 중 하나를 선택하지 않아도 된다.

```html
<input type="email" name="email" list="emailList">
<datalist id="emailList">
  <option value="soakdma37@gmail.com"></option>
  <option value="foo@unknown.net"></option>
</datalist>
```

## 6.2. 다른 속성들

`minlength`, `maxlength`, `placeholder` 속성을 사용할 수 있다. 용도는 이름 그대로다. `size`는 글자수 단위로 너비 지정.

`multiple` 속성 지정시 유저가 쉼표 혹은 스페이스로 구분된 여러 개의 이메일을 입력할 수 있게 된다.

```html
<input id="email" type="email" multiple />
```

주의할 점이 있다. `multiple` 속성을 지정하게 되면 빈 문자열조차 유효한 값이 되는데, 이렇게 되면 `required`속성을 지정해도 빈 문자열이 유효성 검사를 통과하게 된다. 따라서 최소 하나의 이메일을 받아야 할 때는 정규식 등을 통해 유효성 검사를 직접 하거나 `multiple` 을 쓰지 말자.

`pattern` 속성은 유효성 검사에 쓸 수 있는 정규식을 지정한다. 이를 이용해 특정 URL의 이메일만 입력 가능하게 하는 등의 동작이 가능하다.

단 당연히 이런 검증은 서버에서도 이루어져야 한다. 개발자 도구를 통해서 HTML을 변조하거나, postman 등을 통해서 직접 서버에 데이터를 전송하는 등으로 클라이언트 사이드에서의 유효성 검사를 피해갈 수 있는 방법은 많기 때문이다.

# 7. type="file"

저장장치 파일 하나 혹은 여러개(`multiple` 속성 사용시)를 선택할 수 있다. 그후 폼을 제출하거나 [File API](https://developer.mozilla.org/ko/docs/Web/API/File_API/Using_files_from_web_applications)로 조작 가능.

`value`는 선택한 파일 중 첫번째의 경로를 나타내는 DOMString을 담는다.

`accept` 속성을 이용해 허용할 파일 유형을 정할 수 있다. 쉼표로 구분해서 여러 파일 유형 지정도 가능.

[예제도 있다.](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/file#%EC%98%88%EC%A0%9C) 특히 시각적으로는 input을 숨긴 후 해당 input에 대응하는 label을 스타일링해서 파일 업로드를 위한 버튼처럼 쓰는 게 인상깊다. 이외에도 파일 이름/크기 가져오기 등 참고할 부분이 많았다.

# 8. type="hidden"

사용자에게 보이지 않는 데이터를 전송할 때 사용한다. 

## 8.1. 폼 컨텐츠 ID 전송

예를 들어서 편집되고 있는 컨텐츠의 ID를 서버에 전송할 때 사용할 수 있다.

```html
<form 
  action="서버URL" 
  method="post" 
>
  <div>
    뭔가 편집하고 있는 컨텐츠
  </div>
  <button type="submit" form="loginForm">편집 완료</button>
  <input type="hidden" id="contentID" name="contentID" value="1234" />
</form>
```

이렇게 하면 서버에 컨텐츠 ID가 함께 전송되기 때문에 서버는 이를 이용해 어떤 컨텐츠가 편집되었는지 알 수 있다.

## 8.2. 체크박스 기본값 제공

위에서 체크박스의 `name` 과 `value`를 이용해서 체크박스가 체크된 상태로 폼이 제출되었을 때 서버에 전달되는 값을 지정할 수 있다고 했다. 

그런데 만약 체크박스가 체크되어 있지 않은 상태로 폼이 제출되었을 때 서버에 전달되는 값을 지정하고 싶다면 이때 `type="hidden"`을 사용할 수 있다.

```html
<form 
  action="서버URL" 
  method="post" 
>
  <input type = "checkbox" id="checkboxValue" name="checkboxName" value="checkboxValue"/>
  <button type="submit">제출</button>
  <input type="hidden" id="defaultInput" name="checkboxName" value="checkboxDefault" />
</form>
```

위처럼 하면 체크박스가 체크되지 않은 채 폼이 제출되어도 서버에는 `checkboxName:checkboxDefault`가 전달된다.

## 8.3. 주의사항

단 hidden input의 값은 개발자 도구 등을 통해서 접근 자체는 가능하므로, 보안상 문제가 될 수 있는 값을 여기에 노출시켜서는 안된다.

# 9. type="image"

이미지가 들어간 제출 버튼을 만들고 싶을 때 사용한다. `src` 특성으로 이미지를 지정하고 `alt` 특성으로 대체 텍스트를 지정할 수 있다. `value` 속성은 받지 않는다.

```html
<input type="image" id="imageInput" alt="Login Button" src="/login-button-image.png" />
```

## 9.1. form 관련 속성

### 9.1.1. formaction

`formaction` 속성은 이 버튼을 눌렀을 때 어떤 URL로 데이터가 제출될지를 지정한다. 이 input을 소유하고 있는 form의 `action`보다 더 우선적으로 적용된다.

### 9.1.2. formenctype

`formenctype`은 폼 데이터를 인코딩할 때 어떤 방식을 사용할지 결정하며 form의 enctype 속성과 같은 역할을 한다. 

[UTF-8 유니코드로 문자를 인코딩하는 encodeURI](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)를 사용하는 `application/x-www-form-urlencoded`가 기본값이다. 




# 참고

https://developer.mozilla.org/ko/docs/Web/HTML/Element/input