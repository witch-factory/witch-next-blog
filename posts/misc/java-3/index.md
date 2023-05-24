---
title: 중간고사 대비 java 2.4단원 정리
date: "2022-10-17T00:00:00Z"
description: "중간고사 대비 JAVA 내용 정리 2.4단원"
tags: ["java"]
---

자바 2.4 변수와 시스템 입출력 관련 내용이다.

# 1. 시스템 입출력

우리는 지금까지 모니터 입출력을 위해 `System.in` 과 `System.out` 이 붙은 함수들을 사용했다. 특히 `System.out.println`에서 이를 볼 수 있다.

## 1.1 시스템 출력

지금까지 사용한 `System.out.println`은 한 줄을 출력하고 행을 바꾼다는 의미이다. 출력한 내용 이후에 줄바꿈을 하고 싶지 않을 경우 `System.out.print`를 사용하면 된다.

그리고 C언어에서와 같이 포맷 문자열을 출력할 수 있는 `System.out.printf` 도 제공한다. 이 함수는 C언어의 `printf`의 포매팅와 동일하게 동작한다. 포맷 문자열을 사용하는 예시는 다음과 같다.

```java
package study;

public class Hello {
  public static void main(String[] args){
    System.out.printf("제 이름은 %s이고 나이는 %d살입니다." , "홍길동", 20);
  }
}
```

## 1.2 시스템 입력

사용자로부터의 입력을 받는 입력 함수들도 있다. 한 글자를 입력받는 함수로 `System.in.read()`가 있다. 그런데 이 함수는 입력을 한 글자씩만 읽기 때문에 2개 이상의 키가 조합된 ab 같은 문자열이나 한글조차 입력받을 수 없다. 엔터까지도 캐리지 리턴과 라인 피드 2개의 키로 처리된다.

이런 단점을 보완하는 게 Scanner클래스이다. 다음과 같이 스캐너 객체를 생성하여 nextLine() 함수를 사용하면 한 줄을 입력받을 수 있다.

```java
package study;

import java.util.Scanner;

public class Hello {
  public static void main(String[] args){
    // 스캐너 객체 생성 후 sc에 저장
    Scanner sc = new Scanner(System.in);
    // 읽은 문자열을 저장한다
    String userInput= sc.nextLine();
    System.out.println(userInput);
  }
}
```
