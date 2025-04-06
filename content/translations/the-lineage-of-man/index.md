---
title: Man의 계보
date: "2025-04-06T01:00:00Z"
description: "Two-Bit History의 The Lineage of Man 번역"
---

이 글은 Two-Bit History의 "The Lineage of Man"을 원작자의 허락 하에 번역한 것입니다. 원문은 [여기](https://twobithistory.org/2017/09/28/the-lineage-of-man.html)에서 읽을 수 있습니다.

# The Lineage of Man

나는 항상 man 페이지를 흥미로워했다. 이상한 형식을 갖추고 주로 터미널을 통해 접근 가능한 이 문서들은 내게 늘 고대의 유적처럼 느껴졌다. 실제로 일부 man 페이지는 *정말로* 오래되었을 것이다. 예를 들어 `cat` 이나 `tee`같은 명령어의 man 페이지가 유닉스의 초기 시대 이래로 몇 번이나 수정되었는지 매우 알고 싶지만, 많지는 않을 거라고 나는 추측한다. man 페이지는 신비롭다. 이 문서들이 어디서 오는지, 당신의 컴퓨터 어디에 저장되어 있는지, 어떤 형식의 파일로 저장되어 있는지도 명확하지 않다. 이렇게 핵심적이고 또한 견고한 규칙에 따라 작성된 게 확실한 문서가 이토록 불투명하게 남아 있다는 게 믿기 힘들 정도다. 그럼 man 페이지의 규칙들은 어디서 유래했을까? 어디에 정리되어 있는 걸까? 만약 내가 직접 나의 man 페이지를 작성하고 싶다면 어디서부터 시작해야 할까?

`man`의 역사를 유닉스의 이야기와 떨어뜨려 놓고 이야기할 수는 없다. 1971년에 완성되었지만 벨 연구소 내부에서만 사용할 수 있었던 최초의 유닉스 버전에는 `man` 명령어가 없었다. 하지만 그 당시 컴퓨팅 기술 연구 부서를 이끌면서 유닉스 프로젝트를 관리하던 더글라스 매킬로이(Douglas McIlroy)는 어떤 형태로든 문서화가 이루어져야 한다고 주장했다.[^1] 그는 유닉스를 만든 걸로 널리 알려진 두 프로그래머, 켄 톰슨(Ken Thompson)과 데니스 리치(Dennis Ritchie)로 하여금 문서를 작성하게 했다. 그 결과물이 바로 *유닉스 프로그래머 매뉴얼(Unix Programmer’s Manual)*의 [초판(원문의 링크가 깨져서 대체)](https://www.nokia.com/bell-labs/about/dennis-m-ritchie/1stEdman.html)이다.

유닉스 프로그래머 매뉴얼의 첫번째 판은 물리적인 페이지들을 하나의 바인더에 모은 형태였다. 이 매뉴얼은 61개의 명령어와 몇십 개의 시스템 콜, 몇 개의 라이브러리 루틴에 대한 문서였다. `man` 명령어 자체는 이후에 등장했지만 이 유닉스 프로그래머 매뉴얼 초판은 공식 명세가 없음에도 불구하고 오늘날의 man 페이지가 따르고 있는 많은 관례들을 확립했다. 각 명령어에 대한 문서에는 잘 알려진 NAME, SYNOPSIS, DESCRIPTION, SEE ALSO같은 제목들을 포함했다. 선택적 플래그는 대괄호로 묶였다. 메타 인자(예를 들어 파일 경로가 필요한 곳에 "file")는 밑줄로 표시되었다. 또한 이 매뉴얼은 1장은 일반적인 명령어에 관한 것, 2장은 시스템 호출에 관한 것이라는 등의 표준적인 매뉴얼 섹션 분류도 확립했다. 당시에 이러한 섹션들은 매우 긴 인쇄 문서의 단순한 구획에 불과했지만 말이다. 톰슨과 리치는 당시에 자신들이 수십 년 넘게 지속될 전통을 세우고 있었다는 사실을 몰랐겠지만, 실제로 그들은 그렇게 했다.

매킬로이는 이후 man 페이지의 형식이 이렇게 오랫동안 유지된 이유에 대해 이렇게 추측했다. 유닉스의 개념적인 발전을 다룬 기술 보고서에서 매킬로이는 초기의 man 페이지들이 "간결하지만 비공식적인 산문 스타일"로 작성되었고 정보가 알파벳 순으로 정리되어 있어서 "정확한 온라인 문서화를 유도했다"고 지적했다.[^2] 그리고 모든 프로그래머가 한 번쯤은 겪었을 man 페이지에 대한 경험을 이야기하며 이렇게 덧붙였다. man 페이지 형식은 "무엇을 찾아야 할지 모르는 초보자에게는 종종 답답하기는 했지만 찾고자 하는 사실이 있는 숙련자에게는 인기있었다". 매킬로이는 종종 간과되는 '튜토리얼과 레퍼런스의 차이'를 강조했다. man 페이지는 튜토리얼로는 부족할 수 있지만 레퍼런스로는 완벽하다.

*유닉스 프로그래머 매뉴얼*의 [두번째 판](http://bitsavers.informatik.uni-stuttgart.de/pdf/att/unix/2nd_Edition/UNIX_Programmers_Manual_2ed_Jun72.pdf)이 인쇄될 때까지 `man` 명령어는 유닉스에 포함되어 있었다. man은 전체 매뉴얼을 "온라인"으로 그러니까 사용자가 대화형으로 이용할 수 있게 해주었고 이는 매우 유용한 기능으로 여겨졌다. 두번째 판에는 `man` 명령어 그 자체에 대한 매뉴얼 페이지(이 페이지가 바로 원조 `man man`이다)가 있었고 여기서는 `man` 명령어를 통해 "이 매뉴얼의 특정 섹션을 출력(run off)"할 수 있다고 설명한다. 당시의 1세대 유닉스 해커(역자: 원문은 original Unix wizards인데 의미상 마법사라기보다는 당시의 해커 문화 속 사람들에 가깝다고 보임)들 사이에서 "run off"라는 표현은 문서를 정말로 인쇄하는 행위를 의미하기도 했지만 문서를 조판할 때 그들이 사용하던 프로그램인 `roff`를 의미하기도 했다. `roff`는 *유닉스 프로그래머 매뉴얼*의 첫번째, 두번째 판을 인쇄하기 전에 조판할 때 사용한 프로그램이기도 했고 오늘날 `man` 명령어가 매뉴얼 페이지를 화면에 출력하기 전에 처리하는 데에도 사용된다. 매뉴얼 페이지들은 모든 유닉스 시스템상에 `roff`로 읽을 수 있는 파일 형식으로 저장되어 있었다.

`roff`는 man 페이지를 포매팅하는 데 사용된 조판 프로그램들의 오랜 계보 중 첫번째였다. 이 프로그램의 기원은 1960년대 중반에 작성된 `RUNOFF` 라는 프로그램으로 거슬러 올라간다. 벨 연구소에서는 `roff`를 기반으로 여러 후속 프로그램이 등장했다. `nroff`(*en-roff*)와 `troff`(*tee-roff*)가 그 예다. `nroff`는 `roff`를 개선하고 터미널에 더 적절한 출력 형식을 제공하기 위해 설계되었다. `troff`는 CAT 사진 식자기(phototypesetter)를 사용한 인쇄 문제를 해결하기 위해 만들어졌다. (내가 그랬던 것처럼 사진 식자에 대해 잘 모른다면 대단히 볼 만한 [이 영상](https://vimeo.com/127605644)을 추천한다[^3]) 이 프로그램들은 모두 일종의 마크업 언어에 기반했으며 이 마크업 언어는 문서의 모든 줄의 시작 부분에 삽입된 두 글자의 명령어로 구성되어 있었다. 이런 명령어들은 글꼴 크기, 텍스트 위치, 줄 간격 등의 요소들을 제어할 수 있었다. 오늘날 가장 일반적으로 사용되는 `roff` 시스템 구현체는 GNU 프로젝트의 일부인 `groff`이다.

`roff` 입력 파일이 어떤 모습인지 알아보는 건 쉽다. 당신의 컴퓨터에 저장된 man 페이지를 직접 들여다보면 된다. MacOS와 같은 BSD 계열 시스템에서는 `man` 명령어에 `--path` 옵션을 붙이면 특정 명령어의 man 페이지가 어디에 저장되어 있는지 확인할 수 있다. 일반적으로 man 페이지는 `/usr/share/man`이나 `/usr/local/share/man`에 있을 것이다. 이런 방식으로 `man`을 사용하면 당신은 `man` 명령어의 매뉴얼 페이지가 저장된 경로를 찾은 뒤 텍스트 에디터로 열어볼 수 있다. 그 내용은 당신이 `man` 명령어를 통해 보는 화면과는 전혀 다른 모습일 것이다. 내 시스템 기준으로 이 파일의 처음 몇 줄은 다음과 같다:

```
.TH man 1 "September 19, 2005"
.LO 1
.SH NAME
man \- format and display the on-line manual pages
.SH SYNOPSIS
.B man
.RB [ \-acdfFhkKtwW ]
.RB [ --path ]
.RB [ \-m
.IR system ]
.RB [ \-p
.IR string ]
.RB [ \-C
.IR config_file ]
.RB [ \-M
.IR pathlist ]
.RB [ \-P
.IR pager ]
.RB [ \-B
.IR browser ]
.RB [ \-H
.IR htmlpager ]
.RB [ \-S
.IR section_list ]
.RI [ section ]
.I "name ..."

.SH DESCRIPTION
.B man
formats and displays the on-line manual pages.  If you specify
.IR section ,
.B man
only looks in that section of the manual.
.I name
is normally the name of the manual page, which is typically the name
of a command, function, or file.
However, if
.I name
contains a slash
.RB ( / )
then
.B man
interprets it as a file specification, so that you can do
.B "man ./foo.5"
or even
.B "man /cd/foo/bar.1.gz\fR.\fP"
.PP
See below for a description of where
.B man
looks for the manual page files.
```

모든 섹션 제목 앞에는 `.SH`가 붙고 굵게 표시할 항목 앞에는 `.B`가 붙는 걸 확인할 수 있다. 이런 명령어들은 man 페이지 작성을 위해 특별히 설계된 `roff` 매크로들이다. 여기서 사용된 매크로들은 `man` 이라는 패키지에 속해 있지만 같은 목적으로 사용할 수 있는 `mdoc` 같은 다른 패키지들도 있다. 이 매크로들 덕분에 man 페이지 작성을 훨씬 간단하게 할 수 있다. 또한 이 매크로들을 쓰면 일관성도 유지할 수 있는데 같은 기능을 하는 더 하위 레벨의 `roff` 명령어로 컴파일되기 때문이다. `man`과 `mdoc` 패키지는 각각 [GROFF_MAN(7)](https://man7.org/linux/man-pages/man7/groff_man.7.html)과 [GROFF_MDOC(7)](https://man.voidlinux.org/groff_mdoc) 매뉴얼 섹션에 문서화되어 있다.

전체 `roff` 시스템은 오늘날 더 널리 사용되는 조판 도구인 LaTeX를 연상시킨다. LaTex는 본질적으로 말하면 도널드 크누스(Donald Knuth)가 설계한 핵심 TeX 시스템을 기반으로 만든 커다란 매크로 세트라고 할 수 있다. `roff`와 마찬가지로 LaTeX에도 문서에 포함시킬 수 있는 다양한 매크로 패키지들이 존재한다. 이 매크로 패키지들 덕분에 사용자들은 직접 TeX 코드를 작성할 일이 거의 없다. LaTeX는 여러 분야에서 `roff`를 대체했지만 터미널 출력용 텍스트에는 적합하지 않기 때문에 man 페이지 작성에는 아무도 LaTeX를 사용하지 않는다.

그럼 2017년(역자: 이 글 원문의 작성 시점), 오늘날에 man 페이지를 작성하려면 어떻게 해야 할까? 당연히 `man`이나 `mdoc` 같은 `roff` 매크로 패키지를 이용해서 man 페이지를 작성할 수도 *있다.* 그 문법은 익숙하지 않고 다루기 힘들다. 하지만 매크로들이 복잡한 작업의 대부분을 추상화해주기 때문에 그렇게 많은 명령어를 익히지 않고도 제법 완성도 높은 man 페이지를 만들 수 있다. 물론 고려해볼 만한 다른 방법들도 존재한다.

[Pandoc](https://pandoc.org/)은 다양한 문서 형식 간의 변환을 지원하는 도구이며 널리 사용된다. Pandoc을 사용하면 마크다운 파일을 `man` 매크로 기반의 man 페이지로 변환할 수 있다. 당신만의 man 페이지를 마크다운 같은 직관적인 형식으로 작성할 수도 있다는 뜻이다. Pandoc은 대부분의 마크다운 변환기보다 훨씬 더 많은 마크다운 문법을 지원하므로 다양한 방식으로 man 페이지를 포매팅할 수 있다. 이렇게 마크다운으로 편리하게 man 페이지를 작성하면 어느 정도 세밀한 제어를 포기하는 대가가 따르지만, `roff` 매크로 수준의 제어가 필요할 정도의 복잡한 기능은 드물 것이다. 이러한 마크다운 기반 man 페이지가 실제로 어떤 모습인지 궁금할 수 있다. 내가 만든 커맨드라인 도구들의 사용법을 기록하기 위해 [직접 작성한 예시들](https://github.com/sinclairtarget/um/tree/02365bd0c0a229efb936b3d6234294e512e8a218/doc)이 있다. [NPM 문서](https://github.com/npm/npm/blob/20589f4b028d3e8a617800ac6289d27f39e548e8/doc/cli/npm.md)도 마크다운으로 작성된 뒤에 `roff` man 형식으로 변환된다. 다만 이 경우에는 Pandoc 대신 [marked-man](https://www.npmjs.com/package/marked-man)이라는 JavaScript 패키지를 사용하여 변환을 수행한다.

오늘날에는 man 페이지를 작성하는 방법이 아주 많고 당신이 원하는 도구를 자유롭게 선택할 수 있다. 그렇기는 하지만 당신은 당신이 직접 작성하는 man 페이지가 *지금까지 작성된 다른 모든 man 페이지처럼 보이고 읽히도록* 해야 한다. 사용할 수 있는 도구의 선택지는 굉장히 많지만 man 페이지의 규칙은 여전히 강력하다.

아예 man 페이지 작성을 생략하고 싶은 유혹이 들 수 있다. 아마 당신은 웹 상에도 문서가 있을 것이고 `--help` 플래그면 충분하다고 생각할 수도 있다. 하지만 그렇게 한다면 당신은 man 페이지가 제공할 수 있는 격식과 신뢰감을 포기하는 것이다. man 페이지는 빠르게 사라지거나 대체될 가능성이 낮은 제도이다. 이는 매우 흥미롭다. man 페이지를 더 낫게 만들 수 있는 방법이 아주 많음에도 불구하고 이 방식이 고수되고 있기 때문이다. 나는 [이전 글](https://twobithistory.org/2017/09/21/the-rise-and-rise-of-json.html)(번역본은 [JSON의 등장과 성장](https://witch.work/ko/translations/the-rise-and-rise-of-json))에서 XML에 대해 좋지 않게 말했지만 이 맥락에서는 XML이 완벽한 포맷일 수 있다. XML을 사용하면 `man` 페이지에 특정 옵션에 대한 정보를 질의(query)할 수도 있을 것이다. 이런 식으로 말이다.

```
$ man grep -v
Selected lines are those not matching any of the specified patterns.
```

이런 걸 상상해보라! 하지만 우리는 지금의 man 페이지 형식에 너무 익숙해져버린 듯 하다. 빠른 변화가 표준과도 같은 이 분야에서 이러한 안정적인 부분이 있다는 건 좋은 걸지도 모른다. 특히 모두가 무언가를 몰라 당황할 때 찾게 되는 문서 시스템에서 그렇다는 건 말이다.

*만약 이 글이 재미있었다면, 비슷한 글이 4주마다 올라옵니다! 트위터에서 @TwoBitHistory를 팔로우하거나, RSS 피드를 구독하여 새로운 글이 올라올 때 놓치지 않도록 하세요.*

[^1]: https://truss.works/blog/2016/12/9/man-splained

[^2]: https://www.cs.dartmouth.edu/~doug/reader.pdf

[^3]: 역자주 - 조판의 역사를 다룬 영상으로 활자를 한 글자씩 정렬하다가 Linotype이 등장하여 한 줄 전체의 금속 활자를 만들 수 있게 되고 광학적으로 글자 이미지를 필름에 인쇄하는 기술인 Phototypesetting이 등장, 이후에는 타자기를 통해 구멍 뚫린 필름들을 만들고 이를 이용해 인쇄하는 기술이 등장하는 등 오래전 조판 기술의 흐름을 다루고 있다. 당시의 다양한 Phototypesetting 기술들에 대한 간략한 소개도 있다.