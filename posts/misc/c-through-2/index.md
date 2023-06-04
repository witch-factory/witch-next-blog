---
title: C-through - 2. Unknown parameter
date: "2022-01-10T00:00:00Z"
description: "C언어의 함수 선언/정의시 파라미터 자리를 비워 놓는 것에 대하여"
tags: ["C", "language"]
---

# 1. 인자 없이 함수 선언하기

```c
#include <stdio.h>

void f();

int main() {
    f();
    return 0;
}

void f(){
    printf("Hello, I'm Witch\n");
}
```

C를 배운 사람이라면 대부분 이 코드를 해석할 수 있을 것이다. 이 코드에 오류가 있을까? 

실행해 보면 딱히 아무 오류도 발생하지 않고 잘 실행된다. 나도 대부분 이렇게 C 코드를 작성해 왔다. 그런데, C언어의 함수를 선언할 때 인자를 아무것도 넣지 않는 것은 함수 인자에 대한 아무 정보도 주지 않는다는 것이라서, 함수가 인자를 받지 않는 것을 명시적으로 선언에 넣어 주기 위해서는 인자에 `void`를 넣어 줘야 한다는 말을 들었다. 다음과 같이 쓰는 게 더 좋다는 것이다.

```c
#include <stdio.h>

void f(void);

int main() {
    f();
    return 0;
}

void f(){
    printf("Hello, I'm Witch\n");
}
```

가능한 한 명시적으로 모든 것을 표현해 주는 게 더 나은 코드이므로, 이게 좋다는 것은 받아들일 수 있었다. 그런데 C에는 대체 왜 이런 기능이 있을까? 하는 의문이 들었다. C++의 경우 함수 선언시에 아무 인자도 넣어 주지 않아도 인자를 받지 않는 함수임을 명시적으로 뜻하게 된다. 그런데 왜 C에는 이런 쓸모없어 보이는 기능이 있는 것일까? 함수 선언시 인자를 넣어 주지 않는 것이 어디 쓰이는 걸까?

탐구한 결과, C언어의 전신인 B언어는 타입이 없는 언어였고, B언어에서 넘어올 당시에는 함수의 인자 개수와 타입을 명시해 주는 함수 프로토타입 같은 건 없었다. C89 표준 이전의 이야기이다. 그때는 다른 방식의 함수 선언과 정의를 사용했다. 함수 선언시 인자를 넣어주지 않는 것은 그 당시의 방식이다. 그 방식으로 함수 선언을 작성한 코드와의 하위 호환성을 지키기 위해서 C 표준에서는 여전히 인자를 넣어 주지 않는 함수 선언 방식을 지원하고 있는 것이다.

이러한 결과를 얻기 위해 공부하면서 얻게 된 지식들을 여기 간략하게 정리한다.

# 2. Identifier List 함수 선언

함수 선언시에 함수 인자를 주지 않으면, 함수 인자의 개수나 타입에 대해서 아무 정보도 주지 않는 것이라고 설명하였다. 따라서 어떤 인자든 함수 정의 시에 전달할 수 있다. 다음과 같은 코드는 `f`의 선언에서 인자가 명시되지 않았음에도 `f`의 함수 정의에서 인자를 정의한다. 그러나 잘 작동한다. `f`의 인자에 대한 정보가 선언부에서 알 수 없다는 말은 모든 것을 허용한다는 것이기 때문이다(C는 프로그래머에게 많은 것을 맡긴다). 

```c
#include <stdio.h>

int f();

int main(void){
    /* 실행 결과는 3이 잘 출력된다 */
    printf("%d\n", f(1,2));
    return 0;
}

int f(int x, int y){
    return x+y;
}
```

반면 `f`의 인자로 `void`를 명시하여 `f`가 인자를 받지 않는다는 것을 나타내어 준 다음 코드는 오류를 발생시킨다. `f`가 인자를 받지 않는다는 것을 선언부에서 명시해 주었는데도 `f`에 인자를 정의했기 때문이다.

```c
#include <stdio.h>

int f(void);
/* 이 코드는 오류를 발생시킨다 */
int main(void){
    printf("%d\n", f(1,2));
    return 0;
}

int f(int x, int y){
    return x+y;
}
```

그런데 별로 쓸모없어 보이는, 인자를 아무것도 전달하지 않는 방식의 함수 선언으로만 함수를 선언할 수 있는 방식이 있다. 바로 C의 레거시 문법이라고 할 수 있는 Identifier List 함수 선언 방식이다. 당장 코드로 예시를 보자.

```c
#include <stdio.h>

int f();

int main(void){
    /* 결과로 3이 출력된다 */
    printf("%d\n", f(1,2));
    return 0;
}

int f(x,y)
int x; int y;
{
    return x+y;
}
```

위와 같은 함수 선언과 정의 방식을 identifier list 방식이라고 부른다. 함수 선언 시에는 아무것도 인자로 넣어주지 않고, 함수 정의 시 인자 리스트에는 함수 인자의 이름들만 넣어 준 후 타입은 아래에서 지시한다. 그리고 중괄호 내부에서 인자들을 이용해 연산을 해주는 것이다.

이는 예전에 C에서 함수 프로토타입 선언이 나오기 전에 쓰였던 방식이다. 타입 같은 게 없던 언어인 B에서 넘어오던 과도기에 쓰이던 방식인 것이다.

# 3. Identifier List 방식의 위험성과 흔적

이 방식은 함수에 적절한 타입과 개수의 인자가 전달되는지를 컴파일러에서 검사하지 않고, 온전히 프로그래머에게 맡긴다. 위의 코드에서는 딱 적절한 타입과 개수의 인자를 전달해 주었지만, `f(1,2,3)` 으로 함수를 호출해도, `f(1.5,2.0)` 으로 함수를 호출해도 잘 컴파일된다.

그러나 함수에 실제 전달된 인자와 함수의 정의에서 사용하는 인자의 개수나 타입이 다를 때 표준은 아무것도 보장해 주지 않는다. 

```c
#include <stdio.h>

int f();

int main(void){
    /* 함수 호출 시 사용한 인자의 타입이 다르므로 결과로 아무 의미 없는 쓰레기값이 출력된다 */
    printf("%d\n", f(1.5,2.0));
    return 0;
}

int f(x,y)
int x; int y;
{
    return x+y;
}
```

만약 함수 프로토타입을 선언하고 함수 인자의 타입과 개수를 명시하여 함수를 정의하는 방식(이를 parameter list 방식이라고도 한다)으로 위와 같은 함수를 정의한다면, 묵시적인 형변환이 이루어지기 때문에 약간의 값 손실은 있을 수도 있지만 어느 정도 정상적인 범위의 값이 출력된다. 하지만 위와 같이, 그런 것을 쓰지 않고 예전 C의 방식대로 함수 선언을  할 경우 아주 이상한 결과가 나오게 된다.

하지만 C에서 함수 프로토타입이 나오기 전에는 분명 쓰였던 방식이기에 표준에서는 이를 서술하고 있고, 이 방식의 함수 선언에 대해 이렇게 설명한다.

```
6.7.5.3 Function declarators(including prototypes)
An identifier list in a function declarator that is not part of a definition of that function shall be empty.
```

identifier list로 함수를 정의하는 경우, 그 선언부의 인자 리스트는 비워 두는 게 표준이다. 물론 `int f(int x, int y);` 와 같이 프로토타입으로 함수 선언을 해 주어도 코드는 작동하긴 하지만 이는 프로토타입을 사용해서 함수 선언을 해 주는 게 identifier list를 호환해 주기 때문일 뿐이다.

이제 우리는 함수 선언부에서 인자 자리를 비워 두는 방식이 왜 존재하는지 알았다! 이는 C89 이전에 사용되던 함수 선언 방식의 흔적이다.

그럼 대체 왜 이런 방식이 존재했을까 하는 의문이 들 수 있다. 스택오버플로우의 몇몇 답변을 요약하면 이렇다. 그때는 프로그래머가 더 빠르게 작업을 수행할 수 있는 방법을 제공하는 데에 언어의 초점이 맞춰져 있었기 때문이다. 그러기 위해서 프로토타입을 이용해서 컴파일 타임에 에러를 잡아내기 위한 방법 같은 걸 도입할 필요는 없었다. 

또한 당시에는 현재보다 컴퓨터의 메모리 제한 등이 훨씬 빡빡했는데, identifier list 방식으로 함수를 선언하고 정의하는 것이 메모리 관리 측면에서 더 효율적인 부분이 있었다고 한다. 지금에야 컴파일 타임에 더 많은 에러를 잡아내는 것이 훨씬 더 중요하게 여겨지지만 말이다.

# 4. 함수 정의에서 인자 자리 비워두기

그런데 함수 정의시에 인자 자리를 비워 놓으면 어떻게 될까? 이 경우에는 함수가 인자를 받지 않는다는 것을 명시적으로 의미해 준다.

```
C99 standard 6.7.5.3
An empty list in a function declarator that is part of a definition of that function specifies that the function has no parameters.
```

정의의 일부에서 함수 인자 리스트가 비어 있으면 인자를 받지 않는다는 걸 명시적으로 의미해 준다는 뜻이다. 그런데 이 경우 함수 호출시에 인자를 전달해 준다 해서 반드시 오류가 발생하는 것은 아니다. 가령 다음과 같은 코드는 clang으로 컴파일하면 오류가 발생하지만 gcc로 컴파일하면 오류가 발생하지 않는다.

```c
#include <stdio.h>

int f(){
    printf("Hello\n");
    return 0;
}

int main(void){
    /* gcc로 컴파일시 함수가 잘 동작한다. 그러나 표준에 보장되어 있는 것은 아니다 */
    f(1,2,3);
    return 0;
}
```

만약 위의 함수 `f`가 프로토타입도 정의되어 있었다면 이야기가 다르다. C에서, 호출된 함수가 프로토타입을 갖는 경우 함수 호출시에 전달해준 인자(보통 argument라 한다) 개수와 함수 프로토타입의 인자(보통 prototype이라 한다) 개수가 일치해야 된다는 것을 표준에서 강제하기 때문이다. 그러나 호출된 함수가 프로토타입을 갖지 않는 경우, 함수 호출시 전달해준 인자 개수와 함수 정의에서의 인자 개수가 일치하지 않는 것은 표준에 정의되어 있지 않다.(undefined behavior라 한다)

따라서 위 코드의 경우 환경에 따라 컴파일 시 오류를 발생시킬 수도 있고 안 발생시킬 수도 있다. 하지만 컴파일이 되더라도 어떤 동작을 할지 표준에서 정의할 수 없는 코드이므로 쓰지 않는 것이 좋다.

다음과 같이 프로토타입에서 인자를 받지 않는다고 미리 선언해준 코드의 경우, 함수 호출시의 인자 개수가 너무 많다는 에러를 컴파일시 발생시키는 것을 관찰할 수 있다.

```c
#include <stdio.h>

int f(void);
/* 함수 선언 시 인자를 받지 않는다는 것을 명시해 주었다 */
int main(void){
    f(1,2,3);
    return 0;
}

int f(){
    printf("Hello\n");
    return 0;
}
```

# 5. 결론

함수의 선언에서 인자의 자리를 비워 놓는 것은 예전의 C 문법의 유산이다. C언어에 프로토타입 같은 건 없던 시절에 함수 선언을 하기 위해서는 인자의 자리를 비워 놓아야 했기 때문이다.

오늘날 인자가 없는 함수를 선언할 때는 인자가 없다는 것을 명시적으로 나타내 주기 위해 인자 자리에 `void`를 꼭 명시적으로 써넣어 주자. 함수 정의에는 굳이 `void`를 쓰지 않아도 인자가 없는 함수임을 뜻한다.

# 6. 참고

https://stackoverflow.com/questions/693788/is-it-better-to-use-c-void-arguments-void-foovoid-or-not-void-foo

https://stackoverflow.com/questions/5481579/why-does-an-empty-declaration-work-for-definitions-with-int-arguments-but-not-fo

https://stackoverflow.com/questions/12643202/why-does-gcc-allow-arguments-to-be-passed-to-a-function-defined-to-be-with-no-ar

https://en.wikipedia.org/wiki/B_%28programming_language%29

https://stackoverflow.com/questions/4664100/does-printfx-1-invoke-undefined-behavior

(`C 표준 문서의 내용이 있다`)

https://stackoverflow.com/questions/18820751/identifier-list-vs-parameter-type-list-in-c

https://stackoverflow.com/questions/41803937/func-vs-funcvoid-in-c99 (C 표준 관련한 설명이 아주 잘되어 있음)

http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.369.3559&rep=rep1&type=pdf

실제 C 표준 문서 중 일부
