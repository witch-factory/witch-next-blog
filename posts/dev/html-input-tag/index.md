---
title: HTML input 태그
date: "2023-07-06T00:00:00Z"
description: "사용자 데이터를 받는 input 태그는 강력하고 기능도 많다."
tags: ["html"]
---

# 1. HTML의 input 태그

[MDN의 input 태그 문서](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input), [더 간략히 정리된 표](https://developer.mozilla.org/ko/docs/Learn/Forms/How_to_structure_a_web_form#the_input_element)

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

src, alt 속성은 필수로 지정해 주어야 한다.

## 9.1. form 관련 속성

### 9.1.1. formaction

`formaction` 속성은 이 버튼을 눌렀을 때 어떤 URL로 데이터가 제출될지를 지정한다. 이 input을 소유하고 있는 form의 `action`보다 더 우선적으로 적용된다.

### 9.1.2. formenctype

`formenctype`은 폼 데이터를 인코딩할 때 어떤 방식을 사용할지 결정하며 [form의 enctype 속성](https://witch.work/posts/dev/html-form#4.1.1.-enctype)과 같은 역할을 한다. 

역시 `form`의 enctype보다 우선적으로 적용된다.

### 9.1.3. formmethod

어떤 HTTP 메서드로 폼 데이터를 전송할지를 결정한다. `form`의 `method` 속성과 같은 역할을 한다. 기본값은 역시 `get` 이다.

`dialog` 라는 값도 있는데 이는 이 버튼이 input이 연관되어 있는 `<dialog>`를 닫는다는 의미이다.

### 9.1.4. 기타

formnovalidate, formtarget 속성도 있는데 이는 form의 [novalidate, target 속성](https://witch.work/posts/dev/html-form#4.1.-form)과 같은 역할을 한다.

이들은 모두 `form`의 속성보다 우선적으로 적용된다.

# 10. type="month"

연, 월을 입력받을 수 있는 인터페이스를 제공한다. value는 `YYYY-MM` 형태를 한다. 단 실제 input에서는 `2023년 7월`과 같이 사용자의 지역에 따른 적당한 표현으로 연, 월을 표현한다. 

`date`와 마찬가지로 `min`, `max`, `step` 특성을 사용할 수 있다. `list`, `readonly` 속성도 사용가능.

해당 type이 지원되지 않는 브라우저에서는 `type="text"` 가 되지만 그럼에도 유효성 검사의 호환성 등이 보장되지 않는 건 마찬가지다. 

따라서 다른 최신 input type들과 같이 크로스 브라우징을 위해서는 [직접 구현하자.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month#examples)

# 11. type="number"

숫자를 입력받을 수 있는 인터페이스를 제공하며 숫자가 아닌 값들을 거부하는 유효성 검사를 한다. 

사용자가 숫자를 늘이거나 줄일 수 있도록 위/아래 화살표 버튼을 제공한다. 이 화살표에 따라 숫자가 얼마나 증가/감소할지는 `step` 특성으로 지정할 수 있다.

`min+step*i` 꼴이면서 `max` 미만인 숫자만 입력할 수 있는데, 기본 `step` 값은 1이므로 이 경우 소숫점 미만 자릿수는 입력할 수 없다. 소숫점 미만을 취급하고 싶다면 `step` 특성을 0.1 등으로 지정하면 된다.

`list` 속성으로 `<datalist>`와 연결해서 선택지 지정 가능.

## 11.1. 접근성

`<input type="number">`태그의 role은 `spinbutton`으로 지정되어 있다. 만약 `spinbutton`이 양식에서 중요하지 않다면 이 태그 대신 `inputmode="numeric"`을 쓰고 `pattern` 속성으로 숫자만 받도록 하는 것이 낫다. 

사용자가 다른 작업을 하다가 의도하지 않게 숫자를 증가/감소시킬 수도 있고 숫자가 아닌 것을 입력했을 때 명시적인 피드백도 없기 때문이다.

또한 [autocomplete](https://developer.mozilla.org/ko/docs/Web/HTML/Attributes/autocomplete)속성을 사용해서 사용자가 더 빨리 폼을 완성하도록 도울 수 있다.

# 12. type="password"

비밀번호를 입력받는 창을 제공하며 입력된 텍스트를 보여주는 대신 `*`과 같이 마스킹한다. `pattern` 속성을 활용해서 정규식으로 값을 검증할 수 있다.

# 13. type="radio"

라디오버튼 그룹에 사용한다. `name` 특성으로 그룹을 지정하고 `value` 특성으로 라디오버튼의 값들을 지정한다. 같은 `name`을 가진 라디오버튼들 중 하나만 선택될 수 있으며 선택된 라디오버튼의 `value`가 폼 데이터로 전송된다.

`value`는 사용자에게 보이지 않으므로 일반적으로 `label` 요소를 사용해서 라디오버튼의 라벨을 지정한다. `value` 특성을 생략하면 기본값은 뜬금없는 `on`이므로 `value`를 지정하는 것을 잊지 말자.

어떤 라디오버튼도 선택되지 않은 경우 제출된 폼 데이터에 해당 라디오버튼 그룹의 데이터는 전혀 포함되지 않는다. 이를 방지하기 위해서는 `required` 속성을 넣고 `checked` 속성을 하나의 라디오버튼에 넣어서 기본적으로 선택된 요소를 지정해야 한다.

그럼 만약 같은 `name` 을 가진 여러 라디오버튼에 `checked` 속성을 넣으면 어떻게 될까? 이 경우에는 `checked`가 지정된 라디오버튼 중 마지막에 나오는 라디오버튼이 선택된다. 라디오버튼 그룹 중에 하나만 선택될 수 있기 때문에 마지막 `checked` 버튼 외에 나머지는 모두 선택 해제된다.

# 14. type="range"

숫자 범위를 입력받을 수 있는 인터페이스를 제공한다. `min`, `max`, `step` 특성을 사용할 수 있다. `value` 특성은 기본값으로 사용되며 `min`과 `max` 사이에 있어야 한다.

그렇게까지 정확하지 않은 범위를 입력받을 때 쓸 수 있다. 

`list`속성으로 `<datalist>`를 연결시켜 대략적인 범위를 표시하거나 `<output>`으로 현재 값을 보여주는 등의 일이 가능은 하지만 기본적으로 사용자가 range input을 통해서 쉽게 정확한 값을 입력하기는 힘들기 때문이다.

# 15. type="reset"

폼의 모든 값을 초기화하는 버튼을 만든다. `value` 특성으로 버튼의 라벨을 지정할 수 있다. `value` 생략시 초기화에 해당하는 기본 라벨(브라우저마다 조금 다르다)이 붙는다. 그다지 사용이 권장되지 않는다.

# 16. type="search"

검색어를 입력받을 수 있는 인터페이스를 제공한다. 기능적으로는 `text` type과 같지만 브라우저마다 조금 다르게 스타일링될 수 있다. 

폼에서 검색어 쿼리를 날리는 용도이기 때문에 `name`으로 `q`가 많이 사용된다.

```html
<input type="search" name="q" />
```

역시 text type input과 같이 list, minlength, maxlength, pattern, placeholder, readonly, required, size, spellcheck 특성을 사용할 수 있다.

## 16.1. text type과의 차이

브라우저에 따라서 검색어를 지울 수 있는 `X` 버튼이 표시될 수 있다. 이는 `text` type에서는 지원되지 않는다.

그리고 몇몇 브라우저에서는 최근 검색어를 저장하고 이를 자동완성으로 제공한다. 

## 16.2. 접근성

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

# 17. type="submit"

폼을 제출하는 버튼을 만든다. `value` 특성으로 버튼의 라벨을 지정할 수 있다. `value` 생략시 제출에 해당하는 기본 라벨(브라우저마다 조금 다르다)이 붙는다.

역시 formaction, formenctype, formmethod, formnovalidate, formtarget 속성을 사용하여 `<form>`에 사용된 대응하는 속성을 오버라이딩할 수 있다.

# 18. type="tel"

전화번호를 입력받을 수 있는 인터페이스를 제공한다. 나라마다 전화번호의 표기 방식이 다르기 때문에 기본 유효성 검사가 제공되지는 않는다. 대신 `pattern` 속성을 사용해서 정규식으로 값을 검증할 수 있다.

MDN에서는 [몇몇 지역에 대해 선택지를 주고 선택한 지역의 전화번호 형식을 검증하는 예제를 제공한다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel#examples)

text type과 같아 보이지만 유용한 점도 있다. 예를 들어서 이 타입의 input을 지원하는 모바일 브라우저에서는 전화번호 입력에 최적화된 키패드를 제공한다. 물론 지원하지 않는 모바일 브라우저에서는 `type="text"`가 된다.

단 모바일 브라우저 중 가장 늦게 이를 지원하기 시작한 웹뷰 안드로이드 브라우저에서조차 2014년 9월 3일부터 `type="tel"`을 지원하므로 대부분의 브라우저에서 된다고 보는 게 맞을 것 같다.

# 19. type="text"

텍스트를 입력받을 수 있는 인터페이스를 제공한다. input 태그의 type을 생략했을 때 기본값이다. 따로 유효성 검사는 없으며 역시 `pattern`이나 `required`로 직접 유효성 검사 로직을 만들 수 있다.


# 20. type="time"

시간을 입력받을 수 있는 인터페이스를 제공한다. `min`, `max`, `step` 특성을 사용할 수 있다. `value` 특성은 `HH:MM` 형태를 한다. 초까지 포함하는 시간이라면 `HH:MM:SS`.

다른 시간 입력 input과 마찬가지로, 이 또한 크로스 브라우징 지원이 아직 완벽하지 않고 브라우저마다 timepicker의 디자인이 다르다. 따라서 완전한 크로스 브라우징을 위해서는 직접 구현하는 게 낫다.

지원 안하는 브라우저에선 역시 `type="text"`가 된다.

# 21. type="url"

URL을 입력받을 수 있는 인터페이스를 제공한다. 제대로 URL 포맷을 갖춘 문자열인지에 대한 유효성 검사를 자동으로 진행한다. 빈 문자열도 유효하다(빈 문자열을 안 받으려면 `required` 속성 설정). 

단 이것은 문자열 포맷에 대한 검사이지, 실제로 URL 주소에 대한 페이지가 존재하는지에 대한 검사가 아닌 것을 주의하자. 이 URL의 양식에 대해서는 [MDN - URL이란?](https://developer.mozilla.org/ko/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL) 참고.

지원 안하는 브라우저에선 역시 `type="text"`가 된다.

`pattern` 속성을 사용해서 정규식으로 값을 검증할 수 있다. 특정 URL만 받고 싶은 등 단순한 URL 포맷 검증 이상의 검증이 필요할 때 사용할 수 있다.

# 22. type="week"

연도와 주를 입력받을 수 있는 인터페이스를 제공한다. 나온지 꽤 되었는데도 Firefox, Safari에서 지원하지 않는 등 널리 쓰이지는 않는 것 같다. 이런 게 필요하면 직접 만들도록 하자.

# 23. 기타 속성들

type에 따라 쓰이는 속성이 다른데 [MDN 문서](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input)를 참고해서 필요할 때 갖다 쓰자.

# 참고

https://developer.mozilla.org/ko/docs/Web/HTML/Element/input