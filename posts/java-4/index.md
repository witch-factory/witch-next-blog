---
title: 중간고사 대비 java 3, 4단원 정리
date: "2022-10-17T01:00:00Z"
description: "중간고사 대비 JAVA 내용 정리 3단원"
tags: ["language"]
---

혼자 공부하는 자바 3단원의 연산자와 4단원의 조건문과 반복문 관련 내용이다. 이미 C등에서 많이 본 내용이 있으므로 주의할 점만 간단히 정리했다.

- 단항 연산자로 부호 연산자가 있는데 이 계산도 int형으로 자동 타입 변환이 일어난다.
  따라서 다음과 같은 코드는 에러가 발생한다.

```java
byte a=1;
byte b=-a; // -a의 결과가 int형이 되므로 에러
```

- Math.random() 을 사용해서 0.0<=x<1.0 범위의 값을 뽑을 수 있다. 1.0은 미포함이다.

이를 이용해서 start부터 시작하는 n개의 정수 중 하나를 얻기 위한 연산식을 다음과 같이 만들 수 있다. `(int)(Math.random()*n)+start`

- java의 switch문은 문자열에도 적용할 수 있다. 더 구체적으로는 switch문의 조건식은 int, char, String, enum 타입이어야 한다.

```java
package study;

import java.util.Scanner;

public class Hello {
  public static void main(String[] args){
    // 스캐너 객체 생성 후 sc에 저장
    Scanner sc = new Scanner(System.in);
    // 이름을 입력받아 name에 저장
    String name = sc.nextLine();
    switch (name){
      case "김성현":
        System.out.println("안녕하세요 김성현님");
        break;
      default:
        System.out.println("안녕하세요");
    }
  }
}
```

- 루프 카운터 변수는 실수를 사용하면 안된다.

컴퓨터 내에서 실수를 완벽히 정확하게 표현할 수 없기 때문에 잘못된 카운팅이 될 수 있다.

```java
package study;

public class Hello {
  public static void main(String[] args){
    for(double i=0.1;i<=1.0;i+=0.1){
      System.out.println(i);
      // 중간중간 정확하게 0.1씩 증가하지 않는 부분이 존재하며 경우에 따라 의도대로 실행되지 않을 수 있다
    }
  }
}
```

- 라벨을 이용해서 중첩 반복문을 한번에 탈출할 수 있다.

탈출하고 싶은 반복문 앞에 적절한 이름의 Label을 붙인 후 `break Label;` 을 사용하면 된다. Label은 지정한 라벨명으로 적절히 바꾸면 된다.

```java
package study;

public class Hello {
  public static void main(String[] args){
    Label:for(int i=0;i<5;i++){
      for(int j=0;j<i;j++){
        for(int k=0;k<j;k++){
          System.out.printf("%d %d %d\n", i,j,k);
          if(k==1){break Label;}
        }
      }
    }
  }
}
```
