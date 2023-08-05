---
title: 중간고사 대비 java 1단원 정리
date: "2022-10-16T00:00:00Z"
description: "중간고사 대비 JAVA 내용 정리 1단원"
tags: ["language"]
---

# 1. 중간고사 대비

이번 학기에 java 언어 수업을 듣는다. 수업에서 배운 java 관련 내용을 벼락치기하면서 블로그에 정리한다. `혼자 공부하는 자바`책도 참고하였다.

# 2. 자바의 특징

자바 프로그램 작성을 위해선 먼저 `.java` 파일을 작성해야 한다. 이 파일은 javac 명령어를 이용하면 자바 컴파일러에 의해 컴파일되어 `.class` 파일로 변환된다. 이 class 파일은 바이트코드를 담고 있으며 java 명령어에 의해서 기계어로 번역되어 실행된다.

이 java 명령어는 자바 가상 머신(JVM)을 실행시키는 명령어이다. JVM의 사용은 바이트코드가 담긴 `.class`파일을 운영체제에 상관없이 실행할 수 있도록 한다. 이러한 특징을 통해 자바는 운영체제에 독립적이라고 한다.

즉 자바 코드가 실행되는 과정은 다음과 같다.

1. `.java` 파일 작성
2. `javac` 명령어로 소스 파일을 바이트코드 파일(`.class`)로 컴파일
3. `java` 명령어로 바이트코드 파일을 실행
4. 각 운영체제가 제공하는 JVM이 바이트코드를 기계어로 번역하여 실행

# 3. 기본적인 코드 작성하고 실행하기

기본적인 코드를 작성하고 실행해 보자. Vscode에서 확장을 설치하여 코드를 실행하였다. [참고한 블로그](https://kangdanne.tistory.com/m/3)

src 폴더 내에 적당한 이름의 폴더(study 폴더를 생성했다)를 만든 후 그 안에 `Hello.java` 파일을 만든다. 그 파일 내에는 폴더 이름의 package와 파일 이름의 class가 선언되어 있다. 즉 다음과 같은 내용이 파일 내에 자동으로 생성된다.

```java
package study;

public class Hello {

}
```

이 파일 내에 `main` 메소드를 만들어 실행해보자. javac 명령어를 이용하여 바이트코드로 컴파일을 한 후 java 명령어를 이용하여 실행하기 위해서는 class 내부에 main 메소드가 있어야 한다. 바이트코드 파일을 실행하면 가장 먼저 main 메소드를 찾아 실행하기 때문이다. 다음 코드는 `System.out.println` 함수까지 이용하여 메인 함수 내에서 `Hello, World!`를 출력하는 코드이다.

```java
package study;

public class Hello {
  public static void main(String[] args){
    System.out.println("Hello, world!");
  }
}
```

vscode에서 run 버튼을 누르면 실행할 수 있다.

# 4. 주석

주석은 다음과 같은 3가지가 있다. 그리고 어차피 컴파일 과정에서 무시되기 때문에 실제 실행 속도나 바이트코드 파일의 크기에는 아무 영향도 없다.

```java
package study;

public class Hello {
  // 한 줄 주석이다. 이 줄의 끝까지 주석으로 처리된다.

  /*
   * 범위 주석. 이 범위의 모든 줄이 주석으로 처리된다.
   */

   /**
    * 문서 주석. 이 주석은 주로 javadoc으로 문서화할 때 사용된다.
    */
  public static void main(String[] args){
    System.out.println("Hello, world!");
  }
}

```
