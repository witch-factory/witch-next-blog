---
title: OOP Before OOP with Simula
date: "2025-02-14T00:00:00Z"
description: "Two-Bit History의 OOP Before OOP with Simula 번역"
---

이 글은 Two-Bit History의 "OOP Before OOP with Simula"을 원작자의 허락 하에 번역한 것입니다. 원문은 [여기](https://twobithistory.org/2019/01/31/simula.html)에서 읽을 수 있습니다.

# OOP Before OOP with Simula

풀로 덮인 강가의 제방에 앉아 있다고 상상해 보자. 앞에는 물이 빠르게 흘러가고 있다. 오후의 햇살은 당신을 나른하고 철학적인 기분에 빠지게 한다. 그리고 당신은 눈앞에 있는 이 강이 정말로 존재하는 것인지 궁금해지기 시작한다. 물론, 엄청난 양의 물이 바로 몇 발짝 앞에서 흘러가고 있다. 하지만 당신이 "강"이라고 부르는 이것은 과연 무엇인가? 결국 당신이 보는 물은 잠시 머물렀다가 사라지고 곧 다른 물이 흘러와 그 자리를 채운다. 즉 "강"이라는 단어는 어떤 고정된 대상을 가리키는 것 같지는 않다.

2009년 Clojure의 창시자 Rich Hickey는 이러한 철학적인 문제가 객체지향 프로그래밍 패러다임에서 어떤 문제를 만드는지에 대한 [훌륭한 발표](https://www.infoq.com/presentations/Are-We-There-Yet-Rich-Hickey/)를 했다. 그는 우리가 프로그램 내의 객체를 강에 대해 생각하는 바로 그 방식으로 생각한다고 지적한다. 즉 객체의 많은 속성들이 시간에 따라 변함에도 불구하고 객체를 어떤 고정된 정체성을 가진 것으로 상상한다는 것이다. 이는 실수이다. 왜냐 하면 우리는 같은 객체 인스턴스가 서로 다른 상태에 있는 것을 구분할 수 있는 방법이 없기 때문이다. 우리는 프로그램에서 시간의 개념을 명시적으로 다룰 수 없다. 우리는 단순히 동일한 이름을 사용하면서 그 시점에 객체가 우리가 원하는 상태에 있기를 바란다. 그리고 이러한 사고방식은 버그를 만들어낸다.

Hickey는 이에 대한 해결책으로 세상을 변경 가능한 객체의 집합으로 모델링하는 게 아니라, 불변 데이터에 작용하는 **프로세스**의 집합으로 모델링해야 한다고 주장한다. 즉 우리는 각 객체를 인과적으로 연결된 상태의 흐름으로 바라보아야 한다. 우리가 앞서 "강"을 보았듯이 말이다. 결국 Clojure와 같은 함수형 언어를 사용해야 한다는 결론이다.

![객체지향에 대한 사색](./author-on-a-hike.png)
등산 중인 저자. 객체 지향 프로그래밍의 존재론적 전제에 대해 깊이 생각하고 있다.

2009년 Hickey가 발표를 한 이후 함수형 프로그래밍 언어에 대한 관심은 점점 커졌다. 그리고 널리 쓰이는 대부분의 객체 지향 프로그래밍 언어에 함수형 프로그래밍의 패턴들이 스며들기 시작했다. 그럼에도 불구하고 대부분의 프로그래머들은 여전히 객체를 생성하고 그 객체의 상태를 직접 변경하는 작업을 매일 하고 있다. 그들은 너무 오랫동안 그 방식으로 해왔기 때문에 프로그래밍이 다른 방식으로도 가능하다는 사실을 상상하기조차 어려운 사람들이다.

나는 Simula에 대한 글을 쓰고자 했다. 그리고 그 글에서는 우리가 현재 익숙하게 사용하는 객체지향적 개념들이 언제 어떻게 Simula에 추가되었는지에 대해서 주로 다루게 되리라고 생각했다. 하지만 내가 생각하기에 Simula가 현대의 객체지향 프로그래밍 언어들과 원래 얼마나 *달랐는지*가 더 흥미로운 주제이다. 사실 이는 놀라운 일이 아니다. 우리가 알고 있는 객체지향 패러다임은 처음부터 완성된 형태로 등장한 것이 아니기 때문이다. Simula에는 Simula I과 Simula 67이라는 두 가지 주요 버전이 있었다. Simula 67은 클래스, 클래스 계층 구조, 가상 메서드 같은 개념을 세상에 처음으로 소개했다. 하지만 Simula I은 어떻게 데이터와 프로시저가 같이 묶일 수 있는지에 다른 개념들과 함께 실험했던 초안이었다. Simula I의 모델은 Hickey가 제안한 것과 같은 함수형 모델이 아니었다. Simula I은 내부에 숨겨진 상태를 가지고 서로 상호작용하는 객체들이 아니라, 시간에 따라 전개되는 *프로세스*들에 초점을 맞추었다. Simula 67이 Simula I에 있었던 개념들을 더 많이 유지했다면 우리가 지금 알고 있는 객체지향 패러다임은 상당히 다른 모습이었을 수 있다. 그리고 그러한 가능성을 따져보는 것은 현재의 패러다임이 영원히 지배적일 거라는 생각을 경계하게 만든다.

# Simula 0에서 67까지

Simula는 Kristen Nygaard와 Ole-Johan Dahl이라는 두 노르웨이 사람이 만들었다. 

1950년대 후반 Nygaard는 노르웨이군과 제휴한 연구 기관인 노르웨이 국방 연구소(Norwegian Defense Research Establishment, NDRE)에 재직하고 있었다. 그는 그곳에서 원자로 설계 및 운영 연구를 위한 몬테카를로 시뮬레이션을 개발했다. 이 시뮬레이션은 처음에는 수작업으로 수행되었지만 이후에는 Ferranti Mercury 컴퓨터를 이용해 프로그래밍되어 실행되었다[^1]. Nygaard는 곧, 이러한 시뮬레이션을 컴퓨터에서 좀 더 고수준의 방식으로 기술하고 싶어졌다.

Nygaard가 주로 개발했던 시뮬레이션은 "이산 사건 모델(discrete event model)"로 알려져 있다. 이 시뮬레이션은 일련의 사건들이 시간에 따라 시스템의 상태를 어떻게 변화시키는지를 포착한다. 여기서 중요한 점은 시뮬레이션이 하나의 사건에서 다음 사건으로 건너뛸 수 있다는 점이다. 사건들이 이산적이므로 사건이 발생하지 않는 동안에는 시스템 상태에 변화가 없기 때문이다. 1966년 Dahl과 Nygaard가 Simula에 대해 발표한 논문에 따르면, 이러한 종류의 모델링 방식은 "신경망, 통신 시스템, 교통 흐름, 생산 시스템, 행정 시스템, 사회 시스템 등"을 분석하기 위해 점점 더 많이 사용되고 있었다.[^2] 그래서 Nygaard는 자신처럼 다른 사람들도 이런 시뮬레이션을 더 고수준으로 설명할 수 있는 방법을 필요로 할 것이라 생각했다. 이에 따라 그는 이 "시뮬레이션 언어(Simulation Language)" 또는 "몬테카를로 컴파일러(Monte Carlo Compiler)"라 부르던 프로젝트를 구현하는 걸 도와줄 사람을 찾기 시작했다.[^3]

NDRE에서 일하고 있던 Dahl이 이 시기에 프로젝트에 합류했다. 그는 언어 설계 경험이 있었는데 그가 프로젝트에서 한 역할은 워즈니악과 같았다(역자: 애플에서 스티브 워즈니악이 담당했던 공학적인 부분을 언급하는 듯 하다). 이후 1년여에 걸쳐서 Nygaard와 Dahl은 "Simula 0"이라고 불리는 언어를 개발했다[^4]. 이 초기 버전은 ALGOL 60에 소규모 확장을 추가하는 형태였고 이를 전처리기(preprocessor)로 구현할 계획이었다. 당시의 Simula는 이후 버전에 비해서 훨씬 덜 추상적이었다. 당시 언어의 핵심 구성 요소는 "stations"(정류장)과 "customers"(고객)였다. 그리고 이를 통해 특정한 이산 사건 네트워크를 모델링할 수 있었다. Nygaard와 Dahl이 제안한 예시는 공항의 항공기 출발에 대한 시뮬레이션이었다[^5]. 하지만 Nygaard와 Dahl은 결국 "정류장"과 "고객"을 아울러 표현할 수 있고 또한 더 다양한 시뮬레이션을 모델링할 수 있는 보다 일반적인 언어 구성 요소를 고안해냈다. 이건 Simula가 특정 도메인에 한정된 ALGOL 패키지에서 범용 프로그래밍 언어로 발전하는 과정에서 이루어진 두 가지의 주요 일반화 중 첫 번째였다.

Simula I에서는 "정류장"이나 "고객"같은 개념이 없었다. 하지만 이를 "프로세스(processes)"를 이용해서 재현할 수 있었다. 프로세스는 프로세스의 *운영 규칙(operating rule)*로 알려진 단일 동작과 연관된 데이터 속성들의 묶음이었다. 프로세스를 단 하나의 메서드만 가진 객체(`run()` 같은 메서드)로 생각할 수도 있다. 하지만 이 비유는 완벽하지 않다. 왜냐 하면 각 프로세스의 운영 규칙은 언제든지 중단(suspend)되거나 재개(resume)될 수 있었다. 운영 규칙 자체가 일종의 코루틴(coroutine)이었기 때문이다. Simula I 프로그램은 시스템을 여러 개의 프로세스로 모델링했다. 그 프로세스들은 개념적으로는 모두 병렬로 실행되는 것처럼 동작했다. 하지만 실제로는 한 번에 하나의 프로세스만 "현재 실행 중"일 수 있었다. 하지만 실행 중인 프로세스가 스스로 중단되면 대기열에 있던 다음 프로세스가 자동으로 실행을 이어받았다. 시뮬레이션이 진행되는 동안 Simula는 내부적으로 "이벤트 알림(event notice)" 타임라인을 유지했는데, 이는 각 프로세스가 언제 재개되어야 하는지를 추적했다. 중단된 프로세스를 재개하기 위해서 Simula는 여러 개의 호출 스택(call stack)을 관리해야 했다. 그런데 ALGOL은 단 하나의 콜스택만 갖고 있었기 때문에 Simula는 더 이상 ALGOL의 전처리기로 구현될 수 없었다. 결국 Nygaard와 Dahl은 자체 컴파일러를 작성하기로 결정했다.

이 시스템을 소개하는 논문에서 Nygaard와 Dahl은 주문을 처리할 수 있는 제한된 수의 기계를 가진 공장의 시뮬레이션을 구현하는 예제를 보여준다[^6]. 여기서의 프로세스는 주문이다. 주문은 먼저 사용 가능한 기계를 찾고 만약 사용 가능한 기계가 없으면 중단된다. 그리고 빈 기계가 생기면 실행되고 완료될 때까지 진행한다. 서로 다른 여러 개의 주문 인스턴스를 인스턴스화(instantiate)하는 데 쓰이는 주문 프로세스의 정의가 있지만 이러한 인스턴스들에서 별도의 메서드가 호출되지는 않는다. 프로그램의 주요 부분은 프로세스를 생성하고 실행하는 게 전부다.

최초의 Simula I 컴파일러는 1965년에 완성되었다. 이 언어는 Nygaard와 Dahl이 NDRE를 떠난 후 합류한 노르웨이 컴퓨터 센터(Norwegian Computer Center)에서 인기를 끌었다. Simula I의 구현은 UNIVAC 사용자와 Burroughs B5500 사용자들이 쓸 수 있었다[^7]. Nygaard와 Dahl은 스웨덴 회사 ASEA와 컨설팅 계약을 체결하여 Simula를 활용한 작업장(job shop) 시뮬레이션을 수행했다. 하지만 Nygaard와 Dahl은 곧 Simula를 단순한 시뮬레이션뿐 아니라 전혀 다른 범주의 프로그램을 작성하는 데도 사용할 수 있다는 사실을 깨달았다.

Simula의 역사에 대해 저술한 오슬로 대학교 교수인 Stein Krogdahl은 "Simula가 새로운 범용 프로그래밍 언어로 발전하는 데 결정적인 역할을 한 계기"가 영국의 컴퓨터 과학자인 C.A.R. Hoare가 작성한 [**"Record Handling"**이라는 논문](https://archive.computerhistory.org/resources/text/algol/ACM_Algol_bulletin/1061032/p39-hoare.pdf)이었다고 주장한다[^8]. Hoare의 논문을 읽어보면 이러한 주장을 쉽게 이해할 수 있다. 나는 객체지향 언어의 역사에 대해 이야기할 때 Hoare의 이름이 자주 언급되지 않는 것에 오히려 놀랐다. Hoare의 논문에서 발췌한 이 부분을 보자.

> 이 제안에서는 프로그램 실행 중에 컴퓨터 내부에는 임의 개수의 레코드가 존재하며 각 레코드는 프로그래머가 과거, 현재 혹은 미래에 관심을 가질 수 있는 어떤 객체를 나타낸다고 가정한다. 프로그램은 존재하는 레코드의 갯수를 동적으로 제어하며 주어진 작업에서의 요구 사항에 따라 새로운 레코드를 생성하거나 기존 레코드를 삭제할 수 있다.
>
> 컴퓨터 내의 각 레코드는 서로 배타적인(disjoint) 레코드 클래스 중 하나에 속해야 한다. 또한 프로그래머는 필요한 만큼 많은 레코드 클래스를 선언할 수 있다. 그리고 프로그래머는 각 클래스에 이름이라고 할 수 있는 식별자를 할당할 수 있다. 레코드 클래스의 이름은 "소(cow)", "테이블(table)", "집(house)" 등과 같은 일반적인 개념으로 생각할 수 있으며, 이 클래스에 속한 레코드는 개별적인 소, 테이블, 집을 나타낸다.

Hoare는 해당 논문에서 서브클래스에 대한 언급을 하지 않았다. 하지만 Dahl은 자신과 Nygaard에게 해당 개념을 소개해 준 사람으로 Hoare를 언급한다[^9]. Nygaard와 Dahl은 Simula I의 프로세스들이 공통적인 요소를 가지고 있을 때가 많다는 사실을 발견했다. 그리고 이러한 공통 요소를 구현하는 데에 슈퍼클래스(superclass)를 사용하는 것이 편리할 것이라고 생각했다. 그리고 이는 "프로세스" 개념 자체를 슈퍼클래스로 구현할 수 있다는 가능성으로 이어졌다. 이 말은 모든 클래스가 단일 운영 규칙을 갖는 프로세스일 필요가 없다는 뜻이다. 이게 바로 Simula 67을 진정한 범용 프로그래밍 언어로 만들었던 두 가지 중요한 일반화 중 두 번째였다. 이런 초점의 변화는 아주 중요했다. Nygaard와 Dahl은 사람들이 이 언어가 시뮬레이션만을 위한 게 아니라는 걸 알 수 있도록 이름을 바꾸는 걸 잠깐 고려할 정도였다[^10]. 하지만 "Simula"라는 이름이 이미 널리 알려져 있었기 때문에 그들은 이름을 바꾸는 위험을 감수하지 않기로 했다.

1967년 Nygaard와 Dahl은 Control Data와 계약을 맺고 이 새로운 버전의 Simula를 개발하기로 했다. 이 새로운 버전은 Simula 67이라 불리게 되었다. 같은 해 6월 Control Data, 오슬로 대학교, 노르웨이 컴퓨팅 센터의 사람들과 Nygaard와 Dahl이 모여서 이 새로운 언어의 명세를 결정하는 회의를 열었다. 이 회의의 결과로 ["Simula 67 공통 기반 언어(Simula 67 Common Base Language)"](https://www.softwarepreservation.org/projects/ALGOL/manual/Simula-CommonBaseLanguage.pdf)라는 문서가 작성되었고 이 문서가 앞으로의 언어 표준을 정의하는 역할을 했다.

Simula 67 컴파일러는 서로 다른 여러 벤더들에 의해 만들어졌다. 또한 Simula 사용자 협회(Association of Simula Users, ASU)가 설립되어 매년 컨퍼런스를 개최하기 시작했다. Simula 67은 빠르게 확산되어 23개 이상의 국가에서 사용자가 생겼다[^11].

# 21세기의 Simula

오늘날 Simula는 Simula를 대체한 프로그래밍 언어들에 미친 영향으로 인해 기억되고 있다. 오늘날 Simula로 어플리케이션 프로그램을 작성하는 사람을 찾기는 어려울 것이다. 하지만 그렇다고 해서 Simula가 완전히 죽은 언어라는 뜻은 아니다. [GNU cim](https://www.gnu.org/software/cim/) 덕분에, 오늘날에도 여전히 당신의 컴퓨터에서 Simula 프로그램을 컴파일하고 실행할 수 있다.

cim 컴파일러는 1986년 개정된 Simula 표준을 구현하고 있다. 하지만 대체로 언어의 Simula 67 버전과 비슷하다. 따라서 Simula 67과 마찬가지 방식으로 클래스와 서브클래스, 가상 메서드(virtual method)를 작성할 수 있다. 즉 소규모의 객체지향 프로그램을 Simula로 작성해볼 수 있다. 이는 Python이나 Ruby로 쉽게 작성할 수 있는 프로그램과 매우 유사해 보인다.

```simula
! dogs.sim ;
Begin
    Class Dog;
        ! cim 컴파일러는 가상 프로시저(virtual procedure)가 완전히 정의될 것을 요구한다. ;
        Virtual: Procedure bark Is Procedure bark;;
    Begin
        Procedure bark;
        Begin
            OutText("Woof!");
            OutImage;           ! 줄바꿈을 출력한다 ;
        End;
    End;

    Dog Class Chihuahua;        ! Chihuahua 클래스는 Dog 클래스를 "prefix로 둠으로써 상속"받는다. ;
    Begin
        Procedure bark;
        Begin
            OutText("Yap yap yap yap yap yap");
            OutImage;
        End;
    End;

    Ref (Dog) d;
    d :- new Chihuahua;         ! :- 는 참조 할당 연산자이다. ;
    d.bark;
End;
```

이를 다음과 같이 컴파일하고 실행할 수 있다.

```bash
$ cim dogs.sim
Compiling dogs.sim:
gcc -g -O2 -c dogs.c
gcc -g -O2 -o dogs dogs.o -L/usr/local/lib -lcim
$ ./dogs
Yap yap yap yap yap yap
```

(cim이 Simula를 C로 컴파일한 후 C 컴파일러에 넘기는 방식이라는 걸 눈치챘을지도 모른다.)

이게 1967년의 객체 지향 프로그래밍의 모습이었다. 여기서 문법적인 차이를 제외하면 2019년의 객체 지향 프로그래밍의 모습도 크게 다르지 않다는 것에 당신도 동의하길 바란다. 이제 당신도 Simula가 왜 역사적으로 중요한 언어로 평가받는지 이해할 수 있을 것이다.

하지만 나는 Simula I의 핵심이었던 프로세스 모델을 여기서 보여주는 데에 더 관심이 있다. 이 프로세스 모델은 Simula 67에서도 여전히 사용할 수 있지만, `Process` 클래스와 특별한 `Simulation` 블록을 사용할 때만 적용된다.

프로세스가 어떻게 동작하는지 보여주기 위해 나는 다음과 같은 시나리오를 시뮬레이션해 보기로 했다. 강 옆에 마을이 있고 마을은 마을 사람들로 가득하다고 생각해 보자. 강에는 물고기가 많지만 마을 사람들이 사용할 수 있는 낚싯대는 단 하나뿐이다. 마을 사람들은 게걸스러운 식욕을 갖고 있어서 약 60분마다 배가 고파진다. 배가 고파진 마을 사람은 물고기를 잡기 위해 낚싯대를 사용해야 한다. 하지만 만약 다른 사람이 낚싯대를 사용하고 있다면, 그 사람은 낚싯대를 사용하기 위해 차례를 기다리게 된다. 마을 사람이 물고기를 잡기 위해 5분 이상 기다리게 되면 체력이 감소한다. 체력이 너무 많이 감소하면 결국 굶어 죽는다.

이건 약간 기묘한 예제인데, 왜 처음에 이게 예시로 떠올랐는지 나도 잘 모르겠다. 하지만 어쨌든 계속해 보자. 우리는 마을 사람들을 Simula의 프로세스로 표현하고 네 명의 마을 사람이 있는 환경에서 하루 동안 어떤 일이 벌어지는지 시뮬레이션해 볼 것이다.

전체 프로그램은 [이 Gist에서 확인할 수 있다.](https://gist.github.com/sinclairtarget/6364cd521010d28ee24dd41ab3d61a96)

이 프로그램 출력의 마지막 부분은 다음과 같다. 하루를 시뮬레이션한 것의 마지막 몇 시간이 출력하는 결과는 이렇다.

```text
1299.45: John is hungry and requests the fishing rod.
1299.45: John is now fishing.
1311.39: John has caught a fish.
1328.96: Betty is hungry and requests the fishing rod.
1328.96: Betty is now fishing.
1331.25: Jane is hungry and requests the fishing rod.
1340.44: Betty has caught a fish.
1340.44: Jane went hungry waiting for the rod.
1340.44: Jane starved to death waiting for the rod.
1369.21: John is hungry and requests the fishing rod.
1369.21: John is now fishing.
1379.33: John has caught a fish.
1409.59: Betty is hungry and requests the fishing rod.
1409.59: Betty is now fishing.
1419.98: Betty has caught a fish.
1427.53: John is hungry and requests the fishing rod.
1427.53: John is now fishing.
1437.52: John has caught a fish.
```

불쌍한 제인은 굶어 죽고 말았다. 하지만 그는 오전 7시도 되기 전에 죽은 샘보다는 오래 버텼다. 베티와 존은 이제 훨씬 더 편해졌다. 낚싯대가 필요한 사람이 2명으로 줄었기 때문이다.

여기서 주목해야 할 점은 프로그램의 최상위 레벨(top-level)에서 하는 일은 4명의 마을 사람에 대한 프로세스를 생성하고 실행하는 것뿐이라는 점이다. 프로세스들은 오늘날 우리가 객체를 다루는 방식과 똑같은 방식으로 낚싯대 객체를 다룬다. 그러나 프로그램의 최상위 레벨에서는 메서드를 호출하거나 프로세스의 속성을 수정하지 않는다. 프로세스들은 각각의 내부 상태를 갖고 있지만 이 상태는 오로지 해당 프로세스 자신만이 수정할 수 있다.

물론 이 프로그램에서는 여전히 수정되는 필드들이 있다. 따라서 이러한 스타일의 프로그래밍이 순수 함수형 프로그래밍(pure functional programming)이 해결하고자 하는 문제를 직접적으로 다루는 것은 아니다. 하지만 Krogdahl이 말하는 것처럼 "이 메커니즘은 시뮬레이션의 프로그래머가 기반 시스템을 여러 개의 프로세스로 모델링하도록 유도한다. 이때 각 프로세스는 해당 시스템에서 발생하는 자연스러운 일련의 사건들을 기술하는 역할을 한다."[^12] 명사(nouns)나 액터(actors) 그러니까 다른 객체에 대해 작업을 수행하는 객체를 중심으로 사고하는 것이 아니라 지금 진행 중인 프로세스(ongoing process)를 중심으로 사고하는 것이다. 이 접근법의 장점은 프로그램의 전체적인 제어권을 Simula의 이벤트 알림(event notice) 시스템에 넘길 수 있다는 것이다. Krogdahl은 이를 "시간 관리자(time manager)"라고 부른다. 즉, 우리는 여전히 프로세스를 변경(mutate)하고 있지만, 각 프로세스는 다른 프로세서의 상태를 가정하지 않는다. 각 프로세스는 다른 프로세스들과 간접적으로만 상호작용한다.

이러한 패턴이 컴파일러나 HTTP 서버 같은 시스템을 구축하는 데에 어떻게 적용될 수 있을지는 명확하지 않다. (하지만 Unity 게임 엔진에서 게임 프로그래밍을 해본 적이 있다면 이 방식이 익숙하게 느껴질 수 있다) 물론 우리가 "시간 관리자"를 가지고 있다고 해서 이것이 반드시 Hickey가 말했던 주장, 그러니까 우리는 프로그램에서 명시적인 시간 개념이 필요하다는 주장에서 나온 개념에 정확히 일치하는 건 아닐 수도 있다. (Hickey는 아마 시간의 흐름에 따른 변수 값의 변화를 표현하기 위해 [Ada Lovelace가 사용했던 위 첨자 표기법](https://witch.work/ko/translations/what-did-ada-lovelace-program-actually-do)과 같은 것을 원했다고 생각한다)

하지만 여전히, 나는 객체 지향 프로그래밍이 시작되던 시절에는 오늘날의 객체지향에서의 접근 방식과 전혀 다른 객체지향 프로그래밍의 스타일이 존재했다는 사실이 매우 흥미롭다고 생각한다. 우리는 객체 지향 프로그래밍이 단순히 한 가지 방식으로만 동작한다고 당연하게 받아들일 수도 있다. 즉 프로그램은 특정 객체들이 다른 객체와 하는 상호작용들을 정확한 순서로 기술한 긴 목록일 뿐이라는 접근이다. 하지만 Simula I의 프로세스 시스템은 객체 지향 프로그래밍에 대한 다른 접근 방식이 존재할 수 있음을 보여준다. 함수형 프로그래밍 언어가 아마 객체지향의 대안으로서 더 정교하게 설계되었을 것이다. 하지만 Simula I은 현대 객체 지향 프로그래밍의 대안적인 개념이 당연히 나올 수 있다는 사실을 우리에게 상기시켜 준다.

*만약 이 글이 재미있었다면, 비슷한 글이 4주마다 올라옵니다! 트위터에서 @TwoBitHistory를 팔로우하거나, RSS 피드를 구독하여 새로운 글이 올라올 때 놓치지 않도록 하세요.*

[^1]: Jan Rune Holmevik, "The History of Simula", https://users.dcc.uchile.cl/~cgutierr/cursos/LP/SimulaHistory.html (원문 링크가 깨져서 대체)

[^2]: Ole-Johan Dahl and Kristen Nygaard, "SIMULA—An ALGOL-Based Simulation Langauge", Communications of the ACM 9, no. 9 (September 1966): 671, https://www.mn.uio.no/tjenester/it/hjelp/programvare/simula/history/artikkel1966cacm.pdf (원문 링크가 깨져서 대체)

[^3]: Stein Krogdahl, "The Birth of Simula", https://portablesimula.github.io/github.io/doc/HiNC1-webversion-simula.pdf (원문 링크가 깨져서 대체)

[^4]: ibid.

[^5]: Ole-Johan Dahl and Kristen Nygaard, "The Development of the Simula Languages", ACM SIGPLAN Notices 13, no. 8 (August 1978): 248 https://hannemyr.com/cache/knojd_acm78.pdf

[^6]: Dahl and Nygaard (1966), 676.

[^7]: Dahl and Nygaard (1978), 257.

[^8]: Krogdahl, 3.

[^9]: Ole-Johan Dahl, "The Birth of Object-Orientation: The Simula Languages", 3, https://ethw.org/w/images/d/d6/Dahl2001.pdf

[^10]: Dahl and Nygaard (1978), 265.

[^11]: Holmevik.

[^12]: Krogdahl, 4.