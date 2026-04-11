---
title: HTML input 태그
date: "2023-07-06T00:00:00Z"
description: "사용자 데이터를 받는 input 태그는 강력하고 기능도 많다."
tags: ["HTML"]
---

[HTML의 폼 양식 만들기](https://witch.work/posts/dev/html-form)글을 작성하는 중 input 태그에 관한 정리가 너무 길어져 글을 분리하였다.

# 1. HTML의 input 태그

[MDN의 input 태그 문서](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input), [더 간략히 정리된 표](https://developer.mozilla.org/ko/docs/Learn/Forms/How_to_structure_a_web_form#the_input_element), [기본 폼 위젯](https://developer.mozilla.org/en-US/docs/Learn/Forms/Basic_native_form_controls) 참고.

HTML input 태그는 다양한 타입의 사용자 데이터를 받을 수 있는 요소를 생성한다. `type` 속성으로 어떤 종류의 데이터를 받을지를 지정할 수 있고 이외에도 다양한 특성을 가지고 있다.

이 요소의 동작 방식은 `type`에 따라 매우 달라지기 때문에 먼저 각 타입별로 간략히 정리해 보았다. 위의 참고한 링크들을 참고하면 더 많은 정보를 얻을 수 있다.

# 2. type="text"

한 줄로 텍스트를 입력받을 수 있는 인터페이스를 제공한다. input 태그의 type을 생략했을 때 혹은 입력한 type값을 브라우저에서 지원하지 않을 때(`type="week"`와 같은 타입 input은 지원하지 않는 브라우저가 꽤 있다) 사용되는 기본값이다. plain text만 입력 가능하다.

앞으로도 많이 반복될 다음과 같은 속성들을 지정할 수 있다.

- `name`: 폼 데이터를 전송할 때 이 input의 이름을 지정한다. 이 이름은 서버에서 폼 데이터를 받을 때 사용된다.
- `value`: input의 기본값을 지정한다. 사용자가 직접 입력하면 이 값은 무시된다.
- `readonly`: input의 값을 사용자가 직접 수정할 수 없도록 한다. 폼 제출시 데이터에는 포함된다.
- `disabled`: input을 비활성화하여 수정될 수 없도록 한다. 폼 제출시 데이터에도 포함되지 않는다.
- `placeholder`: 텍스트 입력 박스 내에 나타나서 사용자에게 힌트를 제공한다.
- `size`: 텍스트 입력 박스의 너비를 지정한다. 글자 수 단위로 지정한다.
- `minlength`, `maxlength`: 입력할 수 있는 최소/최대 글자 수를 지정한다.
- `spellcheck`: 브라우저가 맞춤법 검사를 지원할 경우 입력한 텍스트의 맞춤법을 검사하도록 할 수 있다.
- `pattern`: 유효성 검사를 위한 정규식을 지정한다. 특정 규칙을 만족하는 텍스트만 입력 가능하도록 할 수 있다.
- `required`: 폼 제출시 이 input의 값을 필수로 만들어서 이 input이 비어있으면 폼 제출이 되지 않도록 할 수 있다.

# 3. type="password"

비밀번호를 입력받는 창을 제공하며 입력된 텍스트를 보여주는 대신 `*`과 같이 마스킹한다. `pattern` 속성을 활용해서 정규식으로 값을 검증할 수 있다.

단 이렇게 마스킹되는 건 인터페이스상 그런 것일 뿐이고 폼을 제출하면 그대로 평문으로 전송된다. 따라서 보안상 문제가 될 수 있는 비밀번호 같은 값은 암호화되어 전송되도록 `HTTPS`로 전송해야 한다.

# 4. type="hidden"

사용자에게 보이지는 않지만 폼이 제출되었을 때 전송되어야 할 데이터를 넣어야 할 때 사용한다.

## 4.1. 폼 컨텐츠 ID 전송

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

비슷한 방식으로 타임스탬프를 전송한다든지 할 수 있다. 스크린 리더에도 읽히지 않고 focus도 불가능하기 때문에 사용자에게 보이지 않는 데이터를 전송할 때 쓰기 좋다.

## 4.2. 체크박스 기본값 제공

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

## 4.3. 주의사항

단 hidden input의 값은 개발자 도구 등을 통해서 접근 자체는 가능하므로, 보안상 문제가 될 수 있는 값을 여기에 노출시켜서는 안된다.

# 5. type="checkbox"

클릭에 따라서 상태를 바꿀 수 있는 체크박스를 렌더링한다. 스타일은 브라우저마다 다를 수 있다.

`name`, `value` 속성이 있는데, 이는 체크박스의 데이터가 서버에 전달될 때 부여되는 값이다. 예를 들어 다음과 같은 체크박스 input을 생각하자.

```html
<input type="checkbox" name="nickname" value="witch" />
```

그러면 해당 체크박스가 체크된 채로 들어 있는 폼이 제출되었을 때 폼을 통해 전달되는 데이터에는 `nickname:witch`가 들어 있게 된다. 만약 value가 생략되면 기본값은 `on`이다. 

체크박스가 체크되어 있지 않은 상태로 폼이 제출되면 값 자체가 서버에 전달되지 않는다.

`checked` 프로퍼티는 현재 체크박스가 체크된 상태인지를 나타내는 것이 **아니다.** 이는 체크박스가 기본적으로 체크된 상태로 보여질지를 결정한다.

## 5.1. indeterminate

체크박스는 `indeterminate`라는 제3의 상태를 가질 수 있다. 예를 들어서 전체 약관 동의가 체크되었는지를 표시하는 체크박스가 있을 때, 가령 동의할 약관이 3개라면 그 중에 3개 미만에 체크되었을 때 이 체크박스는 indeterminate 상태로 만드는 등의 용도로 쓸 수 있다.

이는 `HTMLInputElement`의 indeterminate 프로퍼티를 통해 쓸 수 있다. HTML만을 통해서 쓸 수는 없다.

```html
<input type="checkbox" name="agreement" id="agreement" />
<label for="agreement">전체 약관 동의</label>
```

```js
const agreement = document.getElementById("agreement");
agreement.indeterminate = true;
```

## 5.2. 배치

사용성과 접근성을 위해서, 연관된 체크박스들은 설명을 위한 `<legend>`가 들어 있는 `<fieldset>`으로 묶어주는 것이 좋다.

그리고 연관된 `<label>`을 각 체크박스마다 넣어주자. 그러면 사용자가 라벨 클릭을 통해서도 체크박스를 클릭할 수 있게 되어 사용성이 좋아진다.

## 5.3. name 중복

만약 중복된 name을 가진 체크박스 input이 여러 개 있다면 어떨까? 다음과 같이 HTML을 작성했다면, cake를 name으로 가지는 체크박스가 2개다. 만약 이 2개에 모두 체크가 된 상태에서 폼이 제출된다면?

```html
<form>
  <fieldset>
    <legend>주문할 케이크 고르기</legend>
    <input type="checkbox" name="cake" value="choco" id="choco" />
    <label for="choco">초코</label>
    <input type="checkbox" name="cake" value="strawberry" id="strawberry" />
    <label for="strawberry">딸기</label>
  </fieldset>
</form>
```

그러면 모든 체크박스의 값이 서버에 전달된다. 이를 array 등의 형태로 파싱하는 것은 서버에서 할 일이다. 예를 들어서 위의 폼의 경우 다음과 같은 쿼리스트링이 서버에 전달될 것이다.

```
cake=choco&cake=strawberry
```

같은 cake로 2개의 쿼리가 전달되는 것을 볼 수 있다. 마지막 값만 반영되는 등의 동작이 일어나는 게 아니라, 모든 value가 전달되는 것이다.


# 6. type="radio"

라디오버튼 그룹에 사용한다. `name` 특성으로 그룹을 지정하고 `value` 특성으로 라디오버튼의 값들을 지정한다. 같은 `name`을 가진 라디오버튼들 중 하나만 선택될 수 있으며 선택된 라디오버튼의 `value`만 name에 대응되어서 폼 데이터로 전송된다.

```html
<input type="radio" name="coffee" value="아메리카노" id="americano" checked>
<label for="americano">아메리카노</label>
<input type="radio" name="coffee" value="카페라떼" id="latte">
<label for="latte">카페라떼</label>
<input type="radio" name="coffee" value="카페모카" id="mocha">
<label for="mocha">카페모카</label>
```

`value`는 사용자에게 보이지 않으므로 일반적으로 `label` 요소를 사용해서 라디오버튼의 라벨을 지정한다. `value` 특성을 생략하면 기본값은 뜬금없는 `on`이므로 `value`를 지정하는 것을 잊지 말자.

어떤 라디오버튼도 선택되지 않은 경우 제출된 폼 데이터에 해당 라디오버튼 그룹의 데이터는 전혀 포함되지 않는다. 

이를 방지하기 위해서는 `required` 속성을 넣고 `checked` 속성을 하나의 라디오버튼에 넣어서 기본적으로 선택된 요소를 지정해야 한다. 한번 라디오버튼 중 하나가 선택되면 폼을 reset하는 것 외에 사용자가 선택을 해제할 수 있는 방법은 없다.

그럼 만약 같은 `name` 을 가진 여러 라디오버튼에 `checked` 속성을 넣으면 어떻게 될까? 이 경우에는 `checked`가 지정된 라디오버튼 중 마지막에 나오는 라디오버튼이 선택된다. 라디오버튼 그룹 중에 하나만 선택될 수 있기 때문에 마지막 `checked` 버튼 외에 나머지는 모두 선택 해제된다.

# 7. 버튼 타입들

이 3가지 타입들은 버튼 역할을 하며, `<button>` 태그에도 type으로 지정될 수 있다. `button` 태그가 내부 컨텐츠도 넣을 수 있는 등 더 스타일링이 쉽다는 등의 장점이 있다.

## 7.1. type="submit"

폼을 제출하는 버튼을 만든다. `value` 특성으로 버튼의 라벨을 지정할 수 있다. `value` 생략시 제출에 해당하는 기본 라벨(브라우저마다 조금 다르다)이 붙는다.

역시 formaction, formenctype, formmethod, formnovalidate, formtarget 속성을 사용하여 `<form>`에 사용된 대응하는 속성을 오버라이딩할 수 있다.

`<button>` 속성의 type을 지정하지 않고 쓸 경우 이 input과 같은 역할을 하게 된다.

## 7.2. type="reset"

폼의 모든 값을 기본값으로 초기화하는 버튼을 만든다. `value` 특성으로 버튼의 라벨을 지정할 수 있다. `value` 생략시 초기화에 해당하는 기본 라벨(브라우저마다 조금 다르다)이 붙는다. 그다지 사용이 권장되지 않는다.

## 7.3. type="button"

특별한 기능은 없는 푸시 버튼을 렌더링한다. 물론 `onclick` 특성을 통해 클릭 이벤트를 지정할 수는 있다.

```html
<input type="button" value="버튼의 라벨로 사용할 문자열" />
```

요즘은 이미지도 포함할 수 있고 더 직관적이라는 장점 때문에 `button` 요소를 사용하는 것이 더 선호되지만 `input` 요소의 `button` 타입을 쓰는 것도 전혀 문제없다.

`accesskey` 특성을 사용해서 단축키를 지정할 수 있다. 단 지정한 키를 그대로 사용하는 건 아니고 특정 키를 같이 눌러야 할 수 있다. 이는 [accesskey 전역 특성](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/accesskey)문서의 활성화 방법을 참고하자. 

그러나 이는 접근성이나 다른 보조 기술 기능과의 충돌 문제 등으로 인해 단축키 지정은 일반적으로 권장되지 않는다.

`disabled`속성으로 간단히 비활성화 가능하다.

# 8. type="image"

이미지가 들어간 제출 버튼을 만들고 싶을 때 사용한다. `src` 특성으로 이미지를 지정하고 `alt` 특성으로 대체 텍스트를 지정할 수 있다. `value` 속성은 받지 않는다. 

`<img>` 태그와 같은 종류의 어트리뷰트에 더해서 다른 폼 버튼들이 가지고 있는 어트리뷰트들도 사용할 수 있다.

```html
<input type="image" id="imageInput" alt="Login Button" src="/login-button-image.png" />
```

src, alt 속성은 필수로 지정해 주어야 한다. 

## 8.1. formaction 속성

`formaction` 속성은 이 버튼을 눌렀을 때 어떤 URL로 데이터가 제출될지를 지정한다. 이 input을 소유하고 있는 form의 `action`보다 더 우선적으로 적용된다.

## 8.2. formenctype 속성

`formenctype`은 폼 데이터를 인코딩할 때 어떤 방식을 사용할지 결정하며 [form의 enctype 속성](https://witch.work/posts/dev/html-form#4.1.1.-enctype)과 같은 역할을 한다. 

역시 `form`의 enctype보다 우선적으로 적용된다.

## 8.3. formmethod

어떤 HTTP 메서드로 폼 데이터를 전송할지를 결정한다. `form`의 `method` 속성과 같은 역할을 한다. 기본값은 역시 `get` 이다.

`dialog` 라는 값도 있는데 이는 이 버튼이 input이 연관되어 있는 `<dialog>`를 닫는다는 의미이다.

## 8.4. 기타

formnovalidate, formtarget 속성도 있는데 이는 form의 [novalidate, target 속성](https://witch.work/posts/dev/html-form#4.1.-form)과 같은 역할을 한다.

이들은 모두 `form`의 속성보다 우선적으로 적용된다.

그리고 이 input이 폼 제출 용도로 쓰였을 경우, 버튼에 지정한 `value`는 양식에 전송되지 않는다. 대신 제출할 때 클릭한 위치의 좌표(이미지의 왼쪽 위를 `(0,0)`이라 할 때의 좌표)가 `x`, `y`라는 프로퍼티로(즉 버튼에 지정한 `name`이 `prop`이라면 `prop.x`, `prop.y`로 전송된다는 뜻이다) 전송된다. 

예를 들어서 `formmethod`가 `get`인 상태로 폼이 제출되면 다음과 같은 URL이 생성된다. 버튼의 이름이 `prop`이라고 가정하였다.

```
https://example.com/?prop.x=10&prop.y=20
```

# 9. type="file"

저장장치 파일 하나 혹은 여러 개(`multiple` 속성 사용시)를 선택할 수 있다. 그후 폼을 제출하거나 [File API](https://developer.mozilla.org/ko/docs/Web/API/File_API/Using_files_from_web_applications)로 조작 가능하다.

`value`는 선택한 파일 중 첫번째의 경로를 나타내는 DOMString을 담는다.

`accept` 속성을 이용해 허용할 파일 유형을 정할 수 있다. `multiple` 속성을 지정 시 쉼표로 구분해서 여러 파일 유형 지정도 가능.

```html
<input type="file" name="file" id="file" accept="image/*" multiple />
```

[예제도 있다.](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/file#%EC%98%88%EC%A0%9C) 특히 시각적으로는 input을 숨긴 후 해당 input에 대응하는 label을 스타일링해서 파일 업로드를 위한 버튼처럼 쓰는 게 인상깊다. 이외에도 파일 이름/크기 가져오기 등 참고할 부분이 많았다.

몇몇 모바일 장치에서는 이 input이 장치의 카메라나 마이크에 직접 접근해서 사진이나 동영상을 찍어서 올릴 수 있게 해주기도 한다.

```html
<input type="file" accept="image/*;capture=camera" />
<input type="file" accept="video/*;capture=camcorder" />
<input type="file" accept="audio/*;capture=microphone" />
```

# 10. 공통 속성

모든 폼(양식) 요소들에 공통으로 들어가는 속성들이 몇 가지 있다. 당연히 `<input>`에도 들어간다. 이 중 일부를 간단히 알아보자.

## 10.1. name

폼 요소가 제출될 때 해당 요소의 value에 대응되는 이름을 지정한다. 이 이름은 서버에서 폼 데이터를 받을 때 사용된다.

## 10.2. value

폼 요소의 기본값을 지정한다. 사용자가 직접 입력하면 이 값은 무시된다.

## 10.3. disabled

폼 요소를 비활성화하여 사용자가 해당 요소와 상호작용할 수 없도록 한다. 만약 이 속성이 명시되지 않으면 부모로부터 상속한다.

예를 들어서 `<fieldset>` 요소에 `disabled` 속성을 지정하면 그 하위의 모든 폼 요소들이 비활성화된다.

## 10.4. form

해당 양식 요소와 연관되어 있는 `<form>` 요소의 id를 지정한다. `<form>`에 감싸여 있지 않은 요소들에 사용하며, 이렇게 연관시키는 `<form>`은 해당 요소와 같은 문서 내에 있어야 한다.

## 10.5. autofocus

페이지가 로드되었을 때 해당 요소에 자동으로 포커스를 준다. 페이지 내에 하나의 요소만 `autofocus`를 지정할 수 있다.

## 10.6. autocomplete

사용자가 이전에 입력한 값들을 자동완성으로 제공할지를 결정한다(보통은 그렇지만, 기본적으로 자동완성으로 제안하는 값들은 브라우저에서 선택한다). 

`on`이면 자동완성을 제공하고, `off`면 제공하지 않는다. 지정하지 않으면 연관된 `<form>`의 값을 사용한다.

`on`, `off` 외에도 `email` 이나 `username` 등의 특정한 값들을 지정할 수 있다. 이는 브라우저가 해당 값에 맞는 자동완성을 제공한다는 의미이다.

# 11. type="email"

**여기부터는 HTML5에서 추가된 input 타입들이다. 대부분의 타입들이 거의 모든 브라우저에서 지원하나 예외도 가끔씩 있다. 몇몇 주요 브라우저에서 지원하지 않는 type="week"등이 좋은 예시다.**

이메일 혹은 이메일들을 입력받을 수 있는 인터페이스를 제공한다. 

```html
<input type="email" name="email" id="email" />
```

입력되는 값들은 비어 있거나 이메일 형식을 갖추고 있는지 자동으로 유효성 검사를 거친다. 만약 유효성 검사를 통과하지 못하는 값이 들어 있는 채로 폼이 제출될 경우 브라우저가 경고를 띄우고 폼 제출을 막는다.

현재 필드에 있는 값이 유효한 이메일인지에 따라서 `:valid` 혹은 `:invalid` 유사 클래스 CSS 선택자가 활성화된다.

그리고 스마트폰과 같은 기기에서는 `@`가 포함되어 있어 이메일 입력을 더 쉽게 할 수 있는 키보드가 보이는 등의 동작이 기본적으로 지원될 수 있다.

주의할 점은, 이 input 태그의 유효성 검사를 보안상의 데이터 검증 목적으로 쓰면 안된다는 사실이다. 폼에서 제출된 데이터는 언제나 서버사이드에서도 유효성 검사가 이루어져야 한다.

클라이언트 사이드 유효성 검사는 너무 우회하기 쉽기 때문이다. 사용자는 개발자 도구를 이용해서 HTML을 변조하거나 postman 등을 통해서 서버에 직접 데이터를 전송할 수도 있는데 이러면 클라이언트의 유효성 검사를 우회할 수 있다.

## 11.1. list 속성

`<datalist>` 요소의 id를 `list` 속성으로 전달하여 사용자에게 선택지를 제공할 수 있다. 단 이는 사용자에게 제안하는 것이지 사용자는 이렇게 제안된 값들 중 하나를 선택하지 않아도 된다.

```html
<input type="email" name="email" list="emailList">
<datalist id="emailList">
  <option value="soakdma37@gmail.com"></option>
  <option value="foo@unknown.net"></option>
</datalist>
```

## 11.2. 다른 속성들

`minlength`, `maxlength`, `placeholder`, `size`, `pattern` 속성 등 사용 가능.

`multiple` 속성 지정시 유저가 쉼표 혹은 스페이스로 구분된 여러 개의 이메일을 입력할 수 있게 된다.

```html
<input id="email" type="email" multiple />
```

주의할 점이 있다. `multiple` 속성을 지정하게 되면 빈 문자열조차 유효한 값이 되는데, 이렇게 되면 `required`속성을 지정해도 빈 문자열이 유효성 검사를 통과하게 된다. 따라서 최소 하나의 이메일을 받아야 할 때는 정규식 등을 통해 유효성 검사를 직접 하거나 `multiple` 을 쓰지 말자.

# 12. type="search"

검색어를 입력받을 수 있는 인터페이스를 제공한다. 기능적으로는 `text` type과 같지만 브라우저마다 조금 다르게 스타일링될 수 있다. 

폼에서 검색어 쿼리를 날리는 용도이기 때문에 `name`으로 `q`가 많이 사용된다.

```html
<input type="search" name="q" />
```

역시 text type input과 같이 list, minlength, maxlength, pattern, placeholder, readonly, required, size, spellcheck 특성을 사용할 수 있다.

## 12.1. text type과의 차이

브라우저에 따라서 둥근 모서리를 가진 창으로 렌더링될 수 있고, 검색어를 지울 수 있는 `X` 버튼이 표시될 수 있다. 이는 `text` type에서는 지원되지 않는다.(CSS 스타일링을 하지 않았다고 할 때) 그리고 스마트폰 등 키보드가 동적인 기기에서는 키보드에 `검색`키가 포함되어 나올 수 있다.

그리고 몇몇 최신 브라우저에서는 최근 검색어를 저장하고 이를 자동완성으로 제공한다. 

## 12.2. 접근성

다음과 같이 검색 폼을 만드는 경우가 많다. `placeholder`로 검색창임을 나타내는 것이다.

```html
<form>
  <div>
    <input
      type="search"
      id="mySearch"
      name="q"
      placeholder="사이트 내 검색" 
    />
    <button>검색</button>
  </div>
</form>
```

하지만 이렇게 되면 몇몇 스크린 리더는 placeholder를 읽지 않기 때문에 검색창이 무엇인지 알 수 없다. 따라서 `<form>`태그의 role과 `aria-label`을 사용해서 검색창임을 알려줘야 한다.

```html
<form role="search">
  <div>
    <input
      type="search"
      id="mySearch"
      name="q"
      placeholder="사이트 내 검색"
      aria-label="검색어 입력창"
    />
    <button>검색</button>
  </div>
</form>
```

이렇게 하면 보이는 디자인에는 차이가 없지만 접근성이 향상된다.

# 13. type="tel"

전화번호를 입력받을 수 있는 인터페이스를 제공한다. 나라마다 전화번호의 표기 방식이 다르기 때문에 기본 유효성 검사가 제공되지는 않는다. 대신 `pattern` 속성을 사용해서 정규식으로 값을 검증할 수 있다.

```html
<input type="tel" id="tel" name="tel" />
```

MDN에서는 [몇몇 지역에 대해 선택지를 주고 선택한 지역의 전화번호 형식을 검증하는 예제를 제공한다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel#examples)

text type과 같아 보이지만 유용한 점도 있다. 예를 들어서 이 타입의 input을 지원하는 모바일 브라우저에서는 전화번호 입력에 최적화된 동적 키보드를 제공한다. 물론 지원하지 않는 모바일 브라우저에서는 `type="text"`가 된다.

단 모바일 브라우저 중 가장 늦게 이를 지원하기 시작한 웹뷰 안드로이드 브라우저에서조차 2014년 9월 3일부터 `type="tel"`을 지원하므로 대부분의 브라우저에서 된다고 보는 게 맞을 것 같다.

# 14. type="url"

URL을 입력받을 수 있는 인터페이스를 제공한다. `http:` 같은 프로토콜을 갖췄는지 등, 제대로 URL 포맷을 갖춘 문자열인지에 대한 유효성 검사를 자동으로 진행한다. 빈 문자열도 유효하다(빈 문자열을 안 받으려면 `required` 속성 설정). 

단 이것은 문자열 포맷에 대한 검사이지, 실제로 URL 주소에 대한 페이지가 존재하는지에 대한 검사가 아닌 것을 주의하자. 이 URL의 양식에 대해서는 [MDN - URL이란?](https://developer.mozilla.org/ko/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL) 참고.

동적 키보드를 지원하는 브라우저에서는 URL 입력에 유용한 키들을 포함한 동적 키보드를 제공한다. 물론 지원 안하는 브라우저에선 역시 `type="text"`가 된다.

`pattern` 속성을 사용해서 정규식으로 값을 검증할 수 있다. 특정 URL만 받고 싶은 등 단순한 URL 포맷 검증 이상의 검증이 필요할 때 사용할 수 있다.

# 15. type="number"

텍스트 필드처럼 보이지만 숫자만 입력받을 수 있는 인터페이스를 제공하며 숫자가 아닌 값들을 거부하는 유효성 검사를 한다. 이 또한 동적 키보드 디바이스에서는 숫자 입력에 최적화된 키패드를 제공할 때가 있다.

그리고 일반적으로 사용자가 숫자를 늘이거나 줄일 수 있도록 위/아래 화살표 버튼(스피너라고 한다)을 제공한다. 이 화살표에 따라 숫자가 얼마나 증가/감소할지는 `step` 특성으로 지정할 수 있다.

`min+step*i` 꼴이면서 `max` 미만인 숫자만 입력할 수 있는데, 기본 `step` 값은 1이므로 이 경우 소숫점 미만 자릿수는 입력할 수 없다. 소숫점 미만을 취급하고 싶다면 `step` 특성을 0.1같은 최소 단위나 `any` 등으로 지정하면 된다.

`list` 속성으로 `<datalist>`와 연결해서 선택지 지정 가능.

사람의 나이나 키 같은, 어느 정도 제한이 있는 범위 내에서의 숫자를 사용할 때 유용하다. 만약 범위가 너무 크다면 `tel` 과 같은 다른 옵션을 고려해볼 수 있다.

## 15.1. 접근성

`<input type="number">`태그의 role은 `spinbutton`으로 지정되어 있다. 만약 `spinbutton`이 양식에서 중요하지 않다면 이 태그 대신 `inputmode="numeric"`을 쓰고 `pattern` 속성으로 숫자만 받도록 하는 것이 낫다. 

사용자가 다른 작업을 하다가 의도하지 않게 숫자를 증가/감소시킬 수도 있고 숫자가 아닌 것을 입력했을 때 명시적인 피드백도 없기 때문이다.

또한 [autocomplete](https://developer.mozilla.org/ko/docs/Web/HTML/Attributes/autocomplete)속성을 사용해서 사용자가 더 빨리 폼을 완성하도록 도울 수 있다.

# 16. type="range"

슬라이더로 숫자 범위를 입력받을 수 있는 인터페이스를 제공한다. `min`, `max`, `step` 특성을 사용할 수 있다. `value` 특성은 기본값으로 사용되며 `min`과 `max` 사이에 있어야 한다.

이 슬라이더는 마우스, 터치패드, 키보드 방향키(슬라이더가 focus되어 있을 경우)로 조작할 수 있다.

텍스트 필드에 비해서 입력이 덜 정확하기 때문에 그렇게까지 정확하지 않은 범위를 입력받을 때 쓸 수 있다. 

`list`속성으로 `<datalist>`를 연결시켜 tick mark를 표시하는 것으로 대략적인 범위를 표시하거나 `<output>`으로 현재 값을 보여주는 등의 일이 가능은 하지만 기본적으로 사용자가 range input을 통해서 쉽게 정확한 값을 입력하기는 힘들기 때문이다.

# 17. 날짜와 시간 입력

날짜, 시간 입력을 받는 건 언제나 웹 개발자들에게 힘든 일이었다. datepicker와 timepicker의 크로스 브라우징과 같은 건 아직까지도 이슈다! 

HTML에선 완벽하진 않지만 이런 부분을 해결하기 위한 input type을 제공한다. 단 아직 몇몇 브라우저에서 지원되지 않는 input type들도 있는데 이런 input들은 `type="text"`로 자동 변환된다. 

그런데 그렇게 되면 기존에 이 input들에서 지원하던 유효성 검사가 전혀 작동하지 않는다. 따라서 크로스 브라우징이 중요한 환경이라면 이제 소개할 날짜, 시간 입력을 위한 HTML input type을 믿기보다는 잘 알려진 라이브러리를 쓰거나 직접 구현하는 게 낫다.

해당 input type이 지원되는 브라우저들에서도 디자인이 다르기도 하다. 더욱더 라이브러리 혹은 직접 구현이 권장되는 부분...

다음 날짜/시간 입력 필드들은 모두 `min`, `max`, `step` 특성을 사용할 수 있다. `list`, `readonly` 속성도 사용가능. 이때 `max >= min`이어야 한다.

## 17.1. type="datetime-local"

연, 월, 일 그리고 시간(시/분)을 입력받을 수 있는 인터페이스를 제공한다. 

이는 시간을 입력받는 데 쓰이지만 그것이 꼭 사용자가 있는 장소의 시간을 의미하는 것은 아니다. 특정한 time zone의 정보에 상관없이 그저 시간을 입력받을 뿐이다. 따라서 사용자가 있는 곳에서는 불가능한 시간을 입력할 수도 있다.

## 17.2. type="month"

연, 월을 입력받을 수 있는 인터페이스를 제공한다. value는 `YYYY-MM` 형태를 한다. 단 실제 input에서는 `2023년 7월`과 같이 사용자의 지역에 따른 적당한 표현으로 연, 월을 표현한다. 

크로스 브라우징을 위해서 [직접 구현하는 예제가 있다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month#examples)

## 17.3. type="time"

시간을 입력받을 수 있는 인터페이스를 제공한다. `value` 특성은 `HH:MM` 형태를 한다. 초까지 포함하는 시간이라면 `HH:MM:SS`.

크로스 브라우징 지원이 아직 완벽하지 않고 브라우저마다 timepicker의 디자인이 다르다. 따라서 완전한 크로스 브라우징을 위해서는 직접 구현하는 게 낫다.

## 17.4. type="week"

연도와 주를 입력받을 수 있는 인터페이스를 제공한다. 나온지 꽤 되었는데도 Firefox, Safari에서 지원하지 않는 등 널리 쓰이지는 않는 것 같다. 이런 게 필요하면 직접 만들도록 하자.

## 17.5. type="date"

날짜 유효성을 검증하는 텍스트 상자 혹은 날짜 선택을 할 수 있는 인터페이스를 제공한다. 연, 월, 일만 포함한다. 시간+날짜 조합은 앞에서 본 `time` 과 `datetime-local` 타입 input에서 지원한다.

# 18. type="color"

사용자가 색상을 선택할 수 있는 인터페이스를 제공한다. color picker와 RGB값 입력을 제공한다. value는 `#rrggbb`와 같은 색상 코드이며 소문자로 저장된다.

```html
<input type="color" name="color" id="color" />
```

# 19. 기타 속성들

type에 따라 쓰이는 속성이 다른데 [MDN 문서](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input)를 참고해서 필요할 때 갖다 쓰자.

# 참고

https://developer.mozilla.org/ko/docs/Web/HTML/Element/input

https://developer.mozilla.org/en-US/docs/Learn/Forms/Basic_native_form_controls