---
title: HTML로 멀티미디어 다루기
date: "2023-08-15T01:00:00Z"
description: "텍스트만 있는 따분한 페이지 벗어나기"
tags: ["HTML"]
---

웹이 발전하면서 페이지에 이미지나 비디어 등의 멀티미디어를 넣을 수 있게 되었다. 어떻게 하는지 알아보자.

# 1. img

HTML에서 이미지를 넣기 위해서는 img태그를 사용한다. img태그는 내부 내용이나 닫는 태그가 없는 빈 태그이지만 src 속성 하나는 사용되어야 한다. 물론 대체 텍스트를 나타내는 `alt`속성도 지정해 주는 게 좋다.

이때 src 속성에는 사용자 에이전트가 지원하는 파일 형식을 제공해야 한다. [웹 브라우저의 지원 이미지 형식 안내서](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types)

src 속성은 삽입할 이미지의 경로를 나타내는데, 이는 절대경로, 상대경로, 또는 URL로 표현할 수 있다. 몇몇 검색 엔진은 이미지 파일 이름도 읽고 SEO에 포함시키므로 가능하면 파일 이름에도 의미를 담자. `img234395.jpg`보다는 `profile.jpg`가 낫다는 것이다.

```html
<img src="assets/profile.jpg">
```

단 이때 `src`에 다른 웹사이트 주소를 바로 담는 것은 좋지 않다. 이를 hotlinking이라 하는데 이는 다른 사람의 bandwidth를 쓰는 것이므로 비도덕적이며 또한 웹사이트가 사라지거나 이미지가 삭제되는 등에 대한 제어를 전혀 할 수 없다는 단점도 있다.

이미지는 inline 요소이지만 기본적으로 이미지 크기를 차지하므로 `inline-block`요소처럼 보인다.

`<img>`는 [대체 요소](https://developer.mozilla.org/ko/docs/Web/CSS/Replaced_element)이다. 현재 문서 스타일 영향을 받지 않으며 표현 결과가 CSS 서식 모델과 분리되어 외부 객체로 취급된다는 것이다. `div`등의 박스에 넣고 `object-fit`속성 등으로 제어하는 게 낫다.

## 1.1. alt 속성

img 태그의 alt 속성에 문자열을 할당해서 이미지가 로드되지 않았을 때 대체 텍스트를 넣을 수 있다. 이는 path나 파일명을 잘못 적거나 로드가 실패했을 때 표시된다.

또한 스크린 리더는 alt 속성을 읽어주므로, 이미지가 아닌 텍스트로 표현할 수 있는 경우 alt 속성을 사용하는 도움이 된다. 그리고 검색 엔진은 alt 속성을 읽어서 SEO에 포함시키므로 검색 최적화에도 도움이 된다.

Lynx와 같은 브라우저는 텍스트만 지원하므로 이런 브라우저의 사용자에게도 alt 속성이 필요하다.

따라서 alt 속성에는 이미지가 나타나지 않을 때 사용자에게 대신 제공할 수 있는 설명을 넣어주자. 이미지가 쓰이는 목적을 설명하거나, 이미지에 포함된 텍스트를 대체할 수 있는 설명을 넣는 것이다.

```html
<img src="assets/profile.jpg" alt="프로필 사진">
```

alt 특성을 아예 지정하지 않은 경우 이미지가 콘텐츠의 중요 부분이 아니거나 텍스트로 표현될 수 없음을 의미한다.

빈 문자열로 지정한 경우에도 이미지가 콘텐츠의 중요 부분이 아니라는 것을 나타낸다.

## 1.2. 다른 속성들

width, height 속성으로 이미지의 크기를 지정할 수 있다. 제공하는 숫자에는 단위가 없지만 픽셀 단위로 해석된다. `width="100"`은 너비를 100px로 지정하는 것과 같다. 이렇게 이미지 크기를 미리 지정해 놓으면 브라우저가 이미지를 다운로드하기 전부터 해당 이미지가 어느 크기로 렌더링될지를 알고 있으므로 layout shift를 줄여서 UX를 향상시킬 수 있다.

하지만 HTML 속성을 통해 이미지 크기를 지정하는 것보다는 CSS를 통해 지정하는 것이 좋다. 혹은 이미지 편집기를 쓰거나.

title 속성으로 이미지 제목을 설정할 수 있다. 그러면 이미지에 마우스 호버 시 이미지 제목이 나타난다. 다만 이 속성은 많은 스크린 리더가 읽어주지 않으므로 이미지에 대한 설명이 사용자에게 중요한 정보를 포함한다면 alt 속성을 사용하는 게 좋다.

참고로 이미지의 저작권에 대해서는 [MDN 문서 일부](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML#searching_for_permissively-licensed_images)에서 도움될 만한 내용을 찾을 수 있다. 무료 이미지 사이트 등을 알려준다.

## 1.3. figcaption으로 캡션 달기

이미지에 캡션을 달 때, div 태그로 감싼 후 div태그 내부에 img 태그와 p 태그를 넣어줄 수도 있다.

하지만 이렇게 하면 특정 이미지에 캡션을 연결해 주는 의미가 전달되지 않는다. 따라서 HTML5의 figure와 figcaption 태그를 사용할 수 있다.

이 태그는 이미지에 캡션을 다는 역할을 수행한다.

```html
<figure>
  <img src="assets/profile.jpg">
  <figcaption>내 프로필 사진</figcaption>
</figure>
```

이때 figure 태그내의 요소가 꼭 이미지일 필요는 없다. 동영상이나 표, 코드 등이 올 수 있다.

이미지를 넣을 때 CSS의 background-image 속성 등을 사용할 수도 있다. 하지만 그렇게 하면 이미지를 사용할 수는 있어도 이미지에 어떤 의미를 페이지 자체에서 부여할 수는 없다. 이미지를 정말 장식의 의미로만 사용하는 것이 아니라면 시맨틱을 위해서 img 태그로 이미지를 넣는 것이 좋다.

## 1.4. 이미지를 가져올 수 없을 때

src 속성이 비거나 null이거나 현재 URL과 같을 때, 혹은 이미지 자체나 메타데이터의 손상, 지원하지 않는 이미지 형식 등의 이유로 이미지를 불러올 수 없을 때 오류가 발생한다.

`onerror`(전역 속성)에 오류 핸들러를 등록했다면 위와 같은 오류가 발생했을 때 해당 핸들러가 호출된다.

# 2. map, area

`<map>`은 `<area>`와 함께 쓰여서 클릭 가능한 이미지 맵을 정의한다. `<map>` 내부에 area 태그 여러 개가 있으며, img의 `usemap` 속성을 이용해서 map과 이미지를 연결한다.

`<map>` 태그에는 반드시 name 속성이 있어야 한다. 이는 모든 문서 내의 map에서 유일해야 하며 id 특성이 있을 경우 name과 동일해야 한다.

`<area>` 요소는 map 요소 안에서만 사용 가능하며 이미지 영역을 정의하고 하이퍼링크를 추가할 수 있다.

[imagemap.org](https://imagemap.org/)라는 사이트에서 이미지에 해당하는 map 태그를 생성할 수 있다.

# 3. audio

`<audio>` 태그를 사용하면 오디오 파일을 페이지에 삽입할 수 있다. src 속성 또는 내부의 source 요소를 삽입해서 오디오 소스를 지정할 수 있다. 다수의 오디오 소스를 지정한 경우 가장 적절한 소스를 브라우저가 고른다.

```html
<audio controls>
  <source src="assets/audio.mp3" type="audio/mpeg">
  <source src="assets/audio.ogg" type="audio/ogg">
  <!-- 여기에 fallback content가 들어갈 수도 있다. -->
</audio>
```

오디오 태그는 보여줄 시각 컨텐츠가 없으므로 width, height 속성을 사용할 수 없다. 같은 이유로 poster 속성도 지원하지 않는다.

그런데 접근성을 생각하면 오디오 또한 캡션과 자막을 제공하는 게 맞다. 문제는 audio 태그가 WebVTT를 현재로서는 제공하지 않는다는 것이다. 따라서 이를 제공하는 라이브러리를 찾거나 직접 구현해야 한다. 

혹은 video 태그를 사용해서 audio를 제공하는 것도 방법이다. 오디오 소스는 audio 태그를 이용하는 게 사용자 경험이 더 낫긴 하지만.

# 4. video

`<video>`태그를 쓰면 동영상을 페이지에 삽입할 수 있다. 이 태그는 src 속성을 가지는데 이는 img 태그에서와 같이 넣을 동영상의 경로를 지정한다.

controls 속성을 지정하면 사용자에게 비디오 되감기, 볼륨 조절, 탐색 등의 인터페이스를 제공할 수 있다. 이를 사용하면 비디오 플레이어의 모든 컨트롤 요소가 표시된다.

```html
<video src="assets/video.mp4" controls></video>
```

controls 속성을 사용하지 않고 JS의 HTMLMediaElement API를 사용하여 컨트롤 요소를 직접 만들 수도 있다.

video 태그 안에 p 태그 등을 넣어서 비디오가 지원되지 않는 브라우저에 대비할 수도 있다. 비디오가 표시되지 않을 때 사용자에게 보여줄 일종의 fallback content를 만드는 것이다. 비디오로 가는 링크를 넣는다거나 하는 것이다.

```html
<video src="assets/witch.mp4" controls>
  <p>
    이 브라우저는 비디오가 지원되지 않습니다. <a href="assets/witch.mp4">비디오 링크</a>를 통해서 감상해주세요.
  </p>
</video>
```

## 4.1. 여러 비디오 소스 제공하기

브라우저에 따라서 지원하는 비디오 포맷이 다르기 때문에 우리가 제공한 source의 비디오가 재생되지 않을 수 있다. 

우리는 `audio`나 `picture` 등에서 한 것처럼 이런 문제를 보완하기 위해 여러 소스를 제공하여 브라우저가 지원하는 포맷을 찾아 재생할 수 있도록 할 수 있다. source 태그를 쓸 수 있다.

```html
<video controls>
  <source src="assets/video.mp4" type="video/mp4">
  <source src="assets/video.webm" type="video/webm">
  <source src="assets/video.ogv" type="video/ogg">
</video>
```

지금까지는 video 태그의 src 속성에 비디오 파일의 경로를 넣었는데, 이제는 source 태그를 사용하여 여러 소스를 제공한다. 이렇게 하면 브라우저는 source 태그들의 src를 훑으면서 브라우저가 지원하는 코덱을 가진 첫 비디오를 찾아 재생한다.

이렇게 여러 소스를 제공하는 데에 쓸 수 있는 source 태그는 picture, audio, video 태그에 모두 쓸 수 있다.

그리고 source 태그에는 type 속성을 이용해서 파일의 미디어 타입(MIME 타입)을 명시할 수 있다. 이렇게 하면 브라우저가 지원하지 않는 비디오 코덱 타입을 바로 넘어가도록 할 수 있다.

만약 type 속성을 지정하지 않으면 브라우저는 파일을 로드하고 코덱을 확인한 후 재생할 수 있는지를 판단한다. 이는 시간이 걸리기 때문에 type 속성을 명시하는 게 좋다.

가장 적절한 비디오 코덱을 찾기 위해서는 [미디어 타입, 포맷 가이드](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)를 참고할 수 있다.

## 4.2. video 기타 속성

그 외에도 width, height 태그도 있다. 이 속성을 사용하면 비디오의 크기를 지정할 수 있지만 aspect ratio는 유지된다. 만약 ratio가 다른 높이/너비를 지정한다면 비디오는 가로로 늘어나서 화면을 채울 것이고 안 채워진 부분은 기본 배경색으로 채워진다.

autoplay, loop, muted 속성도 있다. autoplay는 비디오를 자동으로 재생하고, loop는 비디오를 반복 재생하고, muted는 음소거한다.

poster 속성은 비디오가 로드되기 전에 보여줄 이미지를 지정한다. preload는 버퍼링 관련 속성이다.

## 4.3. 비디오에 자막 넣기

귀가 잘 들리지 않는 사람이나 시끄러운 환경에 있는 사람, 영상의 언어를 모르는 사람 같은 경우 자막이 필요할 수 있다.

이런 사람에게 자막을 제공할 수 있다. webVTT파일과 `<track>` 태그를 사용하면 된다.

webVTT 파일은 간단히 말해서 자막 파일이다. 여러 줄의 자막 문자열과 해당 자막마다 자막을 표시할 시작 시간과 끝 시간을 지정할 수 있다. 자막 위치 등을 지정할 수도 있다.

이를 이용해 자막을 표시하기 위해서는 `.vtt`파일을 적당한 곳에 저장하고 `<video>`나 `<audio>`태그 내부의 `<track>`요소를 이용해서 해당 파일을 지정해 준다.

```html
<video controls>
  <source src="assets/video.mp4" type="video/mp4">
  <source src="assets/video.webm" type="video/webm">
  <source src="assets/video.ogv" type="video/ogg">
  <track src="assets/subtitles.vtt" kind="subtitles" srclang="en" label="English">
</video>
```

`<track>` 태그의 kind 속성을 이용하여 자막의 종류를 지정할 수 있다. subtitles, captions, descriptions, chapters, metadata 등이 있다.

자막은 subtitles, 자막은 captions, 설명은 descriptions, 단원 구분은 chapters, 메타데이터는 metadata 등이다.

이때 .vtt 파일은 `<track>` 태그를 통해 지정하는데 이 태그는 모든 `<source>` 태그보다 뒤에 와야 한다. 

그리고 `<track>` 태그에 srclang 속성을 이용하여 자막의 언어를 지정할 수 있고 label 속성을 이용하여 사람들이 자막의 언어가 어떤 것일지 알 수 있도록 할 수 있다.

```html
<track kind="subtitles" src="subtitles_es.vtt" srclang="es" label="Spanish" />
```

위에서 보았듯이, `<track>`요소는 미디어 요소의 자식으로서 자막 등 시간별로 필요한 텍스트 트랙을 지정하는 데 사용한다. 

# 5. 내장 콘텐츠

멀티미디어 콘텐츠 외에도 다양한 기타 콘텐츠를 포함할 수 있게 해준다.

`<embed>`, `<iframe>`, `<object>`, `<portal>`, `<picture>`, `<source>` 태그를 포함한다.

svg와 mathML을 HTML 문서에 직접 삽입할 수 있게 해주는 `<svg>`, `<math>` 태그도 있다.

## 5.1. 간략한 역사

예전에는 웹사이트의 작은 부분을 frame이라 하고, 메인이 되는 문서인 frameset이라는 문서에 frame을 넣어서 만들었다. 즉 페이지를 frame들의 집합으로 보았던 것이다.

그리고 90년대 후반 Flash의 등장으로 영상, 애니메이션 같은 여러 콘텐츠를 웹에 삽입할 수 있게 되었다. 액션스크립트를 통해서 동영상을 제어할 수 있고, 애니메이션을 훨씬 더 적은 용량으로 만들 수 있게 한 플래시는 2000년대를 풍미했다. 

`<object>`, `<embed>` 요소 등을 이용해서 같은 작업을 할 수 있었지만 접근성, 보안 등의 이유로 인기가 별로 없었다.

그러다 플래시가 여러 문제들로 인해 인기가 사그라들고 HTML5가 등장하면서 `<iframe>`, `<embed>`, `<object>` 태그를 이용해서 웹 페이지에 다른 콘텐츠를 넣을 수 있게 되었다.

## 5.2. iframe

`<iframe>` 태그는 다른 HTML 페이지를 현재 페이지 안에 삽입할 수 있게 해준다. `<iframe>` 태그의 src 속성을 이용해서 다른 웹 페이지를 지정할 수 있다.

유튜브에서 공유-퍼가기를 선택하면 그 동영상에 해당하는 `<iframe>` 태그를 복사할 수 있다. 다음과 같은 식이다.

```html
<iframe width="560" height="315" src="https://www.youtube.com/embed/b7Pt4hHGi2I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
```

이렇게 삽입된 다른 페이지는 각자 자신의 History를 가지고 있다. 뒤로가기 버튼을 눌렀을 때 현재 페이지가 아니라 삽입된 페이지의 이전 페이지로 이동한다. 그리고 아예 다른 문서로 관리되므로 페이지에 iframe을 추가할 때마다 자원을 더 사용하게 된다.

`<iframe>` width, height, src, allowfullscreen 속성이 주로 쓰인다. width, height, src속성은 당연히 각각 크기와 삽입할 페이지를 지정한다.

이때 src 속성의 경우, 속도 향상을 위해서는 메인 페이지 로딩 이후 JS를 통해 지정하는 것이 좋다. 페이지 로딩 시간을 더 줄여 준다.

allowfullscreen속성은 Fullscreen API를 사용하여 `<iframe>` 삽입된 페이지가 전체화면으로 보이게 할 수 있는지를 지정한다.

또한 iframe 태그 사이에 삽입된 내용은 `<iframe>` 태그가 지원하지 않는 브라우저에서 fallback으로 보여진다.

### 5.2.1. iframe의 보안 문제

다음과 같이 `<iframe>` 태그로 내 페이지에 네이버 페이지를 삽입하려고 해보자.

```html
<iframe
  src="https://www.naver.com/"
  width="100%"
  height="500"
  allowfullscreen
>
</iframe>
```

그런데 이렇게 하면 네이버 페이지가 제대로 로딩되지 않는다.

![iframe 로딩 안됨](./iframe-denied.png)

이는 `<iframe>`이 해커들의 공격 벡터가 될 수 있기 때문이다. 해커들은 `<iframe>`을 이용하여 특정 페이지를 악의적으로 수정하거나 민감한 정보를 유출하기를 시도할 수 있다.

HTML 인젝션 중에서도 iframe 인젝션이라고 하는 공격이 있다. 페이지 내에 `<iframe>` 태그를 삽입하고 사이즈를 0으로 설정하여 숨기는 것이다. 따라서 사용자는 `<iframe>`이 삽입되었다는 것을 시각적으로 알 수 없고 의도치 않게 악성 페이지를 로드하게 된다.

그리고 유명한 페이지의 경우 많은 사람들이 임베드하고 싶어할 것이므로 이를 모두 허용하면 서버비가 더 많이 들 것이다. 이를 대비해서 `<iframe>`으로 해당 페이지를 임베딩하는 것을 막아 놓는 경우도 있다. 예를 들어서 MDN 페이지는 `X-Frame-Options: DENY` 헤더를 보내서 `<iframe>`을 막아 놓았다.

따라서 필요한 경우에만 삽입하고, 저작권에도 주의하자.

그 외에 해야 할 것들은 HTTPS 사용하기가 있다. Let's Encrypt를 이용하면 무료로 HTTPS를 사용할 수 있으니 이를 사용하자.

또한 좀더 자세히 살펴볼 만한 것은 다음과 같다.

### 5.2.2. sandbox 속성

iframe에는 sandbox 특성이 있다. 이는 삽입된 콘텐츠에 대해 필요한 작업만 허용하도록 할 수 있다.

sandbox 특성이 없는 콘텐츠는 JS를 실행하거나 새 창을 띄우는 등의 작업을 할 수 있기 때문에 악의적 공격 가능성이 늘어난다.

sandbox 특성은 문자열인데 이는 콘텐츠가 허용하는 작업을 지정한다. 만약 sandbox=""로 지정되어 있다면 모든 작업이 허용되지 않는다.

예를 들어서 `allow-modals`를 sandbox 문자열에 추가한다면 `<iframe>`으로 삽입한 페이지에서 모달 창을 띄울 수 있게 된다. 이외에도 띄어쓰기를 통해서 여러 작업을 iframe sandbox 속성을 통해 허용할 수 있다.

단 주의할 점은 `allow-scripts`와 `allow-same-origin` 옵션을 sandbox에 동시에 적용할 시 `<iframe>` 콘텐츠는 same origin policy를 우회하여 sandbox 특성을 해제하는 JS를 실행할 수 있게 된다. 따라서 이 두 옵션은 동시에 적용하지 않는 것이 좋다.

### 5.2.3. CSP 지시어 설정

[CSP](https://developer.mozilla.org/ko/docs/Web/HTTP/CSP)는 XSS 공격과 같은 보안 위협으로부터 페이지를 보호하기 위한 추가적인 보안 계층이다. 이는 HTML 문서 보안을 개선하기 위해 고안된 HTTP 헤더인 `Content-Security-Policy`를 제공한다.

iframe의 보안 문제 해결을 위해서 CSP 설정을 통해 `X-Frame-Options` 헤더를 전송하도록 설정 가능하다. 이 헤더는 해당 페이지를 iframe으로 삽입할 수 있는지를 지정한다.

만약 deny로 설정할 시 같은 사이트 내에서의 `<iframe>`을 통한 접근도 막는다. sameorigin으로 설정할 시 같은 사이트 내에서만 frame 접근이 가능하다. 이런 식으로 적절한 `X-Frame-Options` 헤더를 설정하면 `<iframe>` 보안 문제를 어느 정도 해결 가능하다.

이러한 CSP 설정은 meta 요소를 통해서도 할 수 있지만 웹서버를 구성할 때 하는 것이 좋다. 특히 위에서 다룬 `X-Frame-Options` 헤더의 경우 meta 태그를 통해서 CSP 정책을 구성할 수 없다. 이는 이후 HTTP에서 더 자세히 다룰 것이다.

## 5.3. embed, object

`<iframe>`은 다른 HTML페이지를 페이지 내에 삽입하는 기능을 했다. `<embed>`, `<object>`는 PDF와 같은 외부 콘텐츠를 페이지에 포함하기 위한 기능을 한다. 단 이 요소들을 사용하는 경우가 많지는 않다. 플러그인 콘텐츠를 삽입하기 위해 사용되는 경우가 있다.

```html
<embed src="./dummy.pdf" type="application/pdf" width="100" height="200" />
<object data="./dummy.pdf" type="application/pdf" width="100" height="200">
  <p>대체 텍스트</p>
</object>
```

`<object>` 태그가 일반적으로 페이지에 무언가를 삽입할 때 더 많이 쓰인다. 또한 `<embed>`는 대체 콘텐츠를 넣을 방법이 없지만 `<object>`는 태그 사이에 대체 콘텐츠를 넣는 방식으로 대체 콘텐츠도 지원한다.

단 emb`<embed>`ed 태그만 지원되는 낡은 브라우저도 있으므로 만약 정말 모든 브라우저에 대응해야 한다면 두 태그를 모두 사용해야 한다. 다음과 같이 `<object>`의 대체 콘텐츠로 `<embed>`를 넣는 식이다.

```html
<object type="application/pdf"
    data="/media/examples/In-CC0.pdf"
    >
    <embed type="application/pdf"
    src="/media/examples/In-CC0.pdf">
</object>
```

## 5.4. svg

[웹에 벡터 그래픽 삽입하기](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Adding_vector_graphics_to_the_Web)

[SVG](https://developer.mozilla.org/ko/docs/Web/SVG)는 Scalable Vector Graphics의 약자로 2차원 벡터 그래픽을 XML로 서술하는 언어이다.

텍스트를 HTML로 기술하듯이 그래픽을 SVG로 기술하는 것이다. `<circle>` 태그를 통해 원을 그리고 `<rect>` 태그를 통해 사각형을 그리는 등이다. 여기에도 여러 태그들이 있는데 이를 이용하면 다양한 그래픽을 그릴 수 있다. [SVG에 관한 더 많은 정보](https://developer.mozilla.org/en-US/docs/Web/SVG)

```html
<svg width="100%" height="100%">
  <rect width="100%" height="100%" fill="black" />
  <circle cx="150" cy="100" r="90" fill="red" />
</svg>
```

간단한 SVG는 위와 같이 직접 만들 수 있지만 복잡한 그래픽을 그리려면 SVG를 직접 구성하는 건 매우 어렵다. 그럴 땐 [Inkscape](https://inkscape.org/ko/)와 같은 프로그램을 이용해야 한다.

그러나 SVG는 쉽게 복잡해지기 때문에 파일 크기가 커질 수 있고 만들기 어렵다는 단점도 있다. 사진과 같은 복잡한 이미지의 경우 래스터 이미지를 쓰는 게 낫다.

### 5.4.1. svg를 페이지에 넣기

svg를 페이지에 넣는 것에는 여러 가지 방법이 있다. 일단 img 태그의 src 속성에 svg파일을 넣음으로써 페이지에 SVG를 넣을 수 있다.

이 방법은 익숙한 문법이라 쉽고 alt text 등의 기능을 사용할 수 있다. 이미지를 하이퍼링크로 만들 수도 있고 브라우저에서 이미지를 캐싱하여 빠르게 로딩할 수 있다.

그러나 이미지를 JS로 제어할 수 없고 CSS를 넣으려고 하면 SVG 코드에 인라인 CSS를 포함시켜야 한다. SVG 파일에 외부 CSS 스타일시트를 넣으면 무시된다. 같은 이유로 SVG에 의사 클래스 CSS(:hover 등)를 적용할 수 없다.

몇몇 브라우저의 경우 SVG를 지원하지 않는데 이 경우 srcset 속성을 사용해서 대체 콘텐츠를 만들어줄 수 있다. 다만 srcset 속성도 최신 브라우저만 지원하는 기능이다. 따라서 SVG를 지원하는 브라우저는 srcset 속성의 SVG 파일을 사용하고, 지원하지 않는 브라우저는 src 속성의 PNG 파일을 사용한다.

```html
<img src="image.png" srcset="image.svg" alt="SVG image" />
```

css의 배경 이미지를 사용하여서도 svg를 삽입할 수 있는데, img 태그를 사용할 때와 같이 JS로 svg를 제어할 수 없다는 같은 단점이 있다.

이런 단점을 극복하기 위해 inline SVG로 svg를 삽입할 수 있다.

SVG를 페이지에 직접 넣는 방법이다. svg 파일을 텍스트 에디터로 열어서 코드를 복사한 다음 HTML 파일에 붙여넣으면 된다.

```html
<svg width="300" height="200">
  <rect width="100%" height="100%" fill="green" />
</svg>
```

이렇게 하면 HTTP 요청을 줄일 수 있어서 로딩 시간을 줄일 수 있고 svg 요소에 class, id등을 통해 스타일을 적용할 수 있다. inline SVG는 CSS 상호작용(`:hover`같은)과 CSS 애니메이션을 svg에 적용할 수 있게 하는 유일한 방법이다.

그러나 HTML 파일 내에 SVG 코드를 직접 삽입하기 때문에 코드가 길어지고, 재사용이 불가능하다. 또한 브라우저가 svg 파일 캐싱을 할 수 없다.

마지막으로 iframe 태그를 써서 svg 파일을 넣을 수 있다. iframe 태그의 src 속성에 svg 파일을 넣음으로써 페이지에 SVG를 넣는 것이다.

```html
<iframe src="mysvg.svg" width="500" height="500" sandbox>
  <img src="mypic.png" alt="내 사진" />
</iframe>
```

그러나 SVG와 웹페이지가 같은 origin을 가지고 있으므로 SVG에 JS를 적용할 수 없고 iframe을 사용할 수 없는 브라우저에서는 SVG 지원이 있어도 동작하지 않는다는 단점이 있다. 일반적으로 iframe 태그를 써서 svg를 렌더링하는 건 좋은 선택이 아니다.

## 5.5. 반응형 이미지 넣기

[HTML로 반응형 이미지 가져오기](https://witch.work/posts/html-responsive-image)글을 따로 작성하였다. picture 태그를 사용한다.

## 5.6. portal

다른 HTML 페이지를 임베딩하는 것을 지원하는, `iframe`과 비슷한 태그라고 하는데 아직 실험적인 기능이라서 지원하는 브라우저가 현재로서는 사실상 없다. [언젠가 이 문서를 보고 공부해야 할지도](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/portal)

# 참고

https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding