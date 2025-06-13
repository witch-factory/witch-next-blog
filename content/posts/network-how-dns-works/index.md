---
title: DNS 1편 - 도메인 이름이 IP 주소로 변환되는 DNS 요청의 흐름
date: "2025-06-13T00:00:00Z"
description: "도메인이 어떻게 IP 주소로 변환되는 걸까? DNS 리졸버의 메시지 전달과 DNS 서버의 메시지 처리 과정"
tags: ["CS", "network"]
---

부족한 네트워크 지식, 그리고 찾아야 할 키워드를 알아냄에 있어서 홈 서버 관련 블로그를 운영하는 지인 [불칸](https://vulcan.site/)의 큰 도움을 받았다.

# 시작

"google.com"에 접속하면 무슨 일이 일어나는지는 흔하게 찾아볼 수 있는 면접 질문이다. 나도 이 질문을 면접에서 받아 본 적이 있다. 나뿐 아니라 취업 준비를 하는 사람이라면 한번쯤 이 질문을 받아봤거나 최소한 찾아보았을 거라고 생각한다.

그리고 이 질문에 대비해 본 사람이라면 답변 중 DNS를 마주친 적이 있을 것이다. 내가 면접에서 이 질문을 받았을 때도 "google.com의 IP 주소를 알아내기 위해 DNS 서버에 요청을 보내고~"로 시작하는 답을 했다고 기억한다.

맞다. 나를 포함한 많은 개발자들이 면접에서 읊는 대로 DNS는 "google.com"같은 호스트 이름을 IP 주소로 변환해 주는 시스템이다. 그런데 생각해 보면 이런 과정이 그냥 마법처럼 일어날 리 없다. 그래서 좀 더 자세히 알아보았다.

DNS 서버에는 어떻게 요청을 보낼 수 있는 것이고 또 DNS 서버는 어떻게 요청을 처리해서 도메인의 IP 주소를 알아낼까? DNS는 어쩌다 나왔고 어떻게 구성되어 있을까? 다른 데에 쓸 수는 없을까? 직접 뭔가를 할 순 없을까? 여러 질문들을 할 수 있고 몇 개의 글을 통해 내가 할 수 있는 만큼 알아보려고 한다.

시작해보자. 그럼 이번 글에서는 DNS 서버에 어떻게 요청을 보내고 DNS 서버는 어떻게 요청을 처리해서 IP 주소를 알아내는지 알아보겠다. DNS가 "google.com"을 IP 주소로 변환해 주는 과정을 살펴보자.

- 이 글의 본문에 쓰인 그림들은 [컴퓨터 네트워킹 하향식 접근](https://product.kyobobook.co.kr/detail/S000061694627) 8판에서 가져왔다.
- DNS는 일반적으로 2가지 의미로 쓰인다. 하나는 호스트 이름을 IP주소로 변환할 때 쓰는 레코드들을 보관하는 분산형 데이터베이스 서버를 의미하고 다른 하나는 클라이언트가 그 서버랑 메시지를 주고받을 수 있게 해주는 프로토콜을 의미한다. 이 글에서는 필요한 경우 각각을 "DNS 서버"와 "DNS 프로토콜"로 구분해서 사용하도록 하겠다.

# DNS 서버에 메시지를 보내기까지

사용자가 탐색하고 싶은 사이트 주소를 입력했다고 하자. 그럼 먼저 브라우저 혹은 라이브러리가 이 주소를 파싱해서 호스트 이름을 추출한다. 입력한 주소가 "google.com?q=witch.work&lang=ko"이라면 거기서 요청에 필요한 호스트 이름인 "google.com"을 추출한다.

그럼 이 호스트 이름에 대한 질의를 DNS 서버로 보내서 대응되는 IP주소를 얻어 오면 된다. 하지만 그러려면 DNS 서버에 메시지를 보내야 한다. 그런데, 어떻게?

## DNS 리졸버란

DNS 서버에 메시지를 보내서 IP 주소를 알아내는 건 생각보다 여러 과정이 필요하다. 따라서 DNS의 구성 요소에는 호스트 이름에 관한 정보를 제공하는 역할을 하는 DNS 서버뿐 아니라 사용자의 애플리케이션과 DNS 서버 간에 메시지를 주고받는 걸 담당하는 구성 요소가 따로 있다. DNS 리졸버(DNS Resolver)라고 한다. 즉 DNS 서버 입장에서 클라이언트는 사용자의 애플리케이션이 아니라 DNS 리졸버이다.

DNS 리졸버는 사용자가 DNS 서버에 메시지를 보내고 DNS 서버로부터 응답을 받는 과정을 처리한다. 이건 또 2가지로 나뉜다. 하나는 사용자 컴퓨터 등에 있는 스텁 리졸버(Stub Resolver)이고 다른 하나는 정말로 DNS 서버와 메시지를 주고받아서 이름 변환을 해주는 풀 리졸버(Full Resolver)이다. 

이 정의와 구체적인 요구 사항은 [RFC 1123 6.1.3.1 Resolver Implementation](https://datatracker.ietf.org/doc/html/rfc1123#page-74)에 정의되어 있다.

그리고 풀 리졸버는 일반적으로 재귀 DNS 쿼리를 사용하므로 재귀 리졸버(Recursive Resolver)라고도 하지만 이 글에서는 풀 리졸버라고 부르겠다.

## 스텁 리졸버

스텁 리졸버는 사용자의 애플리케이션과 풀 리졸버 간의 인터페이스 역할을 하여 애플리케이션의 도메인 이름에 대한 요청을 적절한 DNS 요청 메시지로 변환한다. 또한 풀 리졸버에서 결과를 받아서 애플리케이션이 이해할 수 있는 형태로 돌려준다. 스텁 리졸버와 풀 리졸버 사이에도 DNS 프록시가 또 들어갈 수 있지만 기본적으로는 그렇다.(내 pfSense같은 경우. 설명을 이후 섹션에 추가 예정)

그럼 이 스텁 리졸버는 어떻게 풀 리졸버를 찾을까? 컴퓨터나 다른 장치가 네트워크에 연결될 때 해당 네트워크에서 풀 리졸버 주소를 받아온다. 다음 섹션에서 더 자세히 보겠지만 일반적으로 ISP나 통신사에서 제공하는 DNS 서버의 IP 주소이다.

이렇게 장치에서 받아온 풀 리졸버의 IP 주소를 보려면 `/etc/resolv.conf` 파일을 확인하면 된다. 일반적으로 

또는 MacOS의 경우 `scutil --dns` 명령어를 사용해도 된다. 이 명령어를 이용하면 현재 사용 중인 DNS 서버의 IP 주소를 확인할 수 있다.

나는 학교의 와이파이를 사용하면서 이 글을 작성하고 있기 때문에 다음과 같은 결과가 나왔다.

```bash
$ scutil --dns
DNS configuration

resolver #1
  search domain[0] : sogang.ac.kr
  nameserver[0] : 163.239.1.1
  nameserver[1] : 168.126.63.1
  if_index : 11 (en0)
  flags    : Request A records
  reach    : 0x00000002 (Reachable)

resolver #2
# ...
```

이 설정을 변경하고 싶다면 OS의 시스템 설정에서 요청을 보낼 풀 리졸버 주소를 변경할 수 있다. 혹은 pfSense와 같은 프로그램을 이용하고 있다면 해당 프로그램 설정에서 추가하거나 변경 가능하다. 보통 "DNS 서버 주소"라고 불리는 설정인데 이 글에서의 풀 리졸버에 해당한다.

이때 구체적으로 풀 리졸버에 메시지를 전달하는 것은 MAC 주소를 알아내서 연결해야 한다. 이건 IP 주소와 MAC 주소를 매핑해주는 ARP(Address Resolution Protocol)를 통해 알아낼 수 있다.

ARP가 이 글의 핵심은 아니니 과정을 간략히만 설명한다. 클라이언트는 LAN 상에서 풀 리졸버의 IP 주소를 가진 호스트를 찾는 메시지를 브로드캐스팅한다. LAN 상에 있을 풀 리졸버는 이 메시지를 받고 자신의 MAC 주소를 응답으로 보내준다. 

클라이언트는 이 응답을 이용해 풀 리졸버의 IP 주소와 MAC 주소를 매핑할 수 있다. 이건 ARP 테이블이라는 곳에 저장되고 클라이언트는 이 ARP 테이블에 기록된 풀 리졸버의 MAC 주소를 이용해 풀 리졸버에 메시지를 보낸다.

## 풀 리졸버

풀 리졸버는 스텁 리졸버가 보낸 DNS 요청 메시지를 받아서 처리한다. 루트 DNS 서버의 정보를 보관하고 있으며 이후에 살펴볼 재귀 DNS 요청을 수행한다. DNS 서버에 보내는 요청을 줄이기 위해 캐시를 사용하는 경우도 많다.

그럼 풀 리졸버는 어디일까? 네트워크에 연결될 때 풀 리졸버의 IP 주소를 받아온다고 했지만 구체적으로는 다양한 경우가 있다.

- ISP에서 운영하는 DNS 서버의 IP 주소
- 네트워크 라우터나 공유기에서 DHCP를 통해 IP를 할당하면서 함께 제공하는 DNS 리졸버 주소. 통신사 DNS 서버 주소 등
- 사용자가 직접 설정한 DNS 주소
  - 위와 같은 통신사 DNS 서버 주소나 [공용 DNS 리졸버](https://en.wikipedia.org/wiki/Public_recursive_name_server) 주소(예시: Cloudflare의 `1.1.1.1`)를 사용할 수 있다.

이 중 어떤 것을 사용하는지는 사용자의 네트워크 환경에 따라 달라지고 다른 네트워크에 연결될 때마다 업데이트된다. 예를 들어 위에서 나는 학교의 와이파이에 연결되어 있지만 집에 가서 DNS 서버 주소 확인을 위해 `scutil --dns` 명령어를 실행하면 다른 DNS 서버 주소가 나온다.

나의 경우 공유기를 pfSense로 관리하고 여기서 DNS 서버 주소를 관리하기에 궁극적으로는 pfSense에서 설정한 DNS 서버 주소에 요청을 보낸다. 해당 서버가 풀 리졸버 역할을 할 수도 있고 내부에 또 다른 풀 리졸버를 두고 있을 수도 있다. 이 설정에 관해서는 [내가 홈 서버를 설정하며 쓴 글의 pfSense 설정 부분](https://witch.work/ko/posts/blog-home-server#6-pfsense)을 참고.

# DNS 서버의 동작

## DNS 계층 구조의 동작

이렇게 DNS 리졸버의 IP 주소를 알아내고 메시지를 보내서 DNS 서버로 전달하는 긴 과정을 거쳤다. 드디어 DNS 서버가 특정 호스트 이름의 IP 주소를 요청하는 메시지를 받게 되었다. 이제 DNS 서버는 이 요청을 처리해야 한다. 이건 어떻게 일어날까?

이 블로그의 주소인 "witch.work"의 IP 주소를 요청하는 메시지를 보낸다고 가정하자. 먼저 이 메시지가 DNS 서버까지 도달하기도 전에, "witch.work"의 IP 주소가 통신사 DNS 서버 같은 DNS 리졸버 단에서 캐싱되어 있을 수 있다. 그러면 DNS 리졸버는 캐시된 IP 주소를 응답 메시지로 보내고 끝난다. 이 캐시는 보통 이틀 정도 유지되므로 만약 이 블로그를 보고 있는 사람이 다음날 또 내 블로그에 접속해 준다면(감사한 일이다) DNS 리졸버는 캐시된 IP 주소를 응답으로 보낸다.

하지만 "google.com"같은 유명한 도메인이라면 모를까 대부분의 DNS 서버에서는 내 블로그에 대한 DNS 레코드를 가지고 있지 않을 것이다. 이 경우 로컬 DNS 서버는 다음과 같은 과정을 거쳐서 IP 주소를 알아낸다.

DNS 서버는 계층 구조로 되어 있다. 루트 DNS 서버, TLD(Top-Level Domain) DNS 서버, 책임(authoritative) DNS 서버가 있다. 다음 그림처럼 루트 DNS 밑의 TLD DNS 서버는 `.com`, `.net`, `.org`와 같은 최상위 도메인(TLD)을 관리하고, TLD DNS 서버 밑의 책임 DNS 서버는 특정 도메인 이름에 대한 IP 주소를 관리한다.

![DNS 계층 구조](./dns-hierarchy.png)

이 계층 구조 데이터베이스는 DNS 요청을 받아서 그걸 처리하는 데 필요한 정보를 점점 더 구체적으로 좁혀가는 방식으로 동작한다. 따라서 로컬 DNS 서버는 먼저 루트 DNS 서버에 요청을 보낸다.[^1]

루트 DNS 서버는 일반적으로 외부 네트워크에 있기 때문에 게이트웨이 라우터를 통과해야 한다. 게이트웨이 라우터의 MAC 주소 또한 ARP를 통해 알아낼 수 있다. 게이트웨이 라우터에서는 DNS 요청 메시지에 들어 있는 루트 DNS 서버의 IP 주소를 이용해 DNS 요청 메시지를 전달한다. DNS 요청 메시지는 UDP를 사용하며 포트 53을 사용한다. 게이트웨이에서 DNS로 요청 메시지가 전달되는 구체적인 방식은 DNS와는 직접적인 관련이 없으므로 생략한다.

## DNS 서버가 IP주소를 알아내는 과정

루트 DNS 서버가 DNS 프로토콜을 따르는 메시지를 받으면 계층 구조로 된 분산형 데이터베이스를 통해 IP 주소를 찾는다. 이 방식을 설명한다.

계층 구조는 루트 DNS 서버, TLD DNS 서버, 책임 DNS 서버 순서로 되어 있다. 따라서 루트 DNS 서버는 요청 메시지에 들어 있는 최상위 도메인을 확인하고 거기 해당하는 TLD DNS 서버의 IP 주소를 응답 메시지로 보낸다.

예를 들어 "witch.work"의 경우 루트 DNS 서버는 ".work" TLD DNS 서버의 IP 주소를 응답으로 보낸다. 이제 로컬 DNS 서버는 같은 방식으로 TLD DNS 서버에 요청 메시지를 보내는데 그러면 TLD DNS서버는 해당 도메인을 관리하는 책임 DNS 서버의 IP를 응답으로 보낸다.

마지막으로 로컬 DNS 서버가 책임 DNS 서버에 메시지를 보내면 책임 DNS 서버는 요청 메시지에 들어 있는 도메인 이름에 대한 IP 주소를 응답 메시지로 보낸다. 책임 DNS 서버는 해당 도메인 이름에 대한 레코드를 관리하고 있다.

이제 로컬 DNS 서버는 클라이언트에서 요청한 도메인 이름에 대한 IP 주소를 알게 되었다. 이 IP 주소를 클라이언트에게 응답 메시지로 보내면 된다. 클라이언트는 이렇게 받은 IP 주소에 HTTP와 같은 요청을 보내서 웹 페이지를 받아오거나 다른 작업을 할 수 있다. 이렇게 설명한 전체 과정을 그림으로 나타내면 다음과 같다.

![여러 DNS 서버를 거쳐서 IP 주소를 알아내는 과정](./dns-servers-interaction.png)

이때 TLD DNS 서버가 책임 DNS 서버의 IP를 알고 있는 게 자연스러운 것처럼 설명했지만 그렇지는 않다. TLD DNS 서버는 책임 DNS 서버의 IP를 알아낼 수 있게 해주는 중간 DNS 서버만 알고 있다. "witch.work"의 경우라면 "work" TLD DNS 서버가 중간 DNS 서버에 질의를 보내면 중간 DNS 서버가 "witch.work"의 책임 DNS 서버의 IP 주소를 응답으로 보내주는 식이다. 그러면 TLD DNS 서버는 이 IP 주소를 로컬 DNS 서버에 응답으로 보내준다. 따라서 로컬 DNS 서버는 중간 DNS 서버를 거쳐서 책임 DNS 서버의 IP 주소를 알게 된다.

# DNS 서버가 부하를 줄이는 법

IP 주소를 직접 타이핑해서 웹 사이트에 접속하는 사람은 거의 없다. 대부분은 "google.com"같은 호스트 이름을 이용한다. DNS 조회는 이런 호스트 이름을 통해 사이트에 접속할 때마다 일어나므로 DNS 서버는 엄청난 양의 요청을 처리해야 한다. 따라서 DNS 서버는 좀 더 효율적으로 많은 요청을 처리하고 위에 설명한 긴 요청-응답 과정의 부하를 줄이기 위한 여러 가지 최적화 기법을 사용한다.

## 캐싱

일단 캐싱을 사용한다. 앞서 설명한 요청과 응답의 과정에서 사용하는 DNS 서버들은 받았던 요청에 대한 응답을 캐싱할 수 있다. 이후 캐싱이 유지되는 기간(흔히 이틀) 동안 같은 요청이 들어오면 캐시된 응답을 바로 보내준다.

단순히 응답을 캐싱하는 방법만 있는 건 아니다. TLD DNS 서버의 IP 주소를 캐싱하는 식으로 다른 DNS 서버의 IP 주소를 캐싱할 수도 있다. 이렇게 하면 DNS 리졸버가 루트 DNS 서버에 질의하는 것을 피함으로써 루트 DNS에 가해지는 부하를 줄일 수 있다.

## 응답 순환

DNS 서버 자체를 여러 개 두고 순환시키는 방법도 있다. Primary/Secondary DNS라고 불린다. Primary DNS 서버가 책임 DNS 서버의 레코드를 관리하고 Secondary DNS 서버는 Primary DNS 서버의 레코드를 복제해서 사용한다. Secondary DNS 서버는 백업 역할을 하는데 여러 개 존재할 수도 있다. 이때 Primary/Secondary DNS 서버의 데이터는 거의 동기화되어 있으므로 이 서버들을 이용해서 부하를 분산시킬 수 있다. 여기에 [라운드 로빈 DNS](https://www.cloudflare.com/ko-kr/learning/dns/glossary/round-robin-dns/) 기술을 활용한다.

Secondary DNS 서버는 Primary DNS 서버에 저장된 정보와 동기화되어 있어야 한다. 따라서 Secondary DNS 서버는 Primary DNS 서버에 주기적으로 질의를 보낸다. 여기에 AXFR 혹은 IXFR이라고 불리는 프로토콜이 사용된다. 그러면 Primary DNS 서버에 변경 사항이 있는지를 확인하는데 이때 SOA(Start of Authority) 레코드가 사용된다.

SOA 레코드는 DNS 서버(정확히는 DNS zone인데 이 맥락에서 크게 중요하지 않다)에 대한 중요한 정보를 저장하는데 여기에 일종의 일련번호가 저장되어 있다. DNS 서버에 변경사항이 있으면 이 일련번호가 변경된다. 이 일련번호가 Primary/Secondary DNS 서버 간에 다르면 Secondary DNS 서버는 Primary DNS 서버에 데이터 전송을 요청해 동기화한다.

이후 Secondary DNS 서버와의 동기화까지 걸리는 시간을 줄이기 위해 Primary DNS 서버에 변경사항이 있을 시 알림을 보낼 수 있는 메커니즘(NOTIFY)도 나왔다. Secondary DNS는 NOTIFY 메시지를 받으면 Primary DNS 서버에 질의를 보낼지 결정할 수 있다.

# DNS 서버의 정보 저장

그럼 DNS 서버는 구체적으로 어떤 정보를 저장하고 있을까?

## 자원 레코드

DNS 서버는 호스트 이름과 IP 주소를 매핑하기 위해 자원 레코드(resource record, RR)라고 불리는 정보를 저장한다. 자원 레코드는 다음과 같은 형식을 하고 있다.[^2]

```
<Name> <Value> <Type> <TTL>
```

`<TTL>`은 Time To Live의 약자로 이 레코드가 얼마나 오랫동안 유효한지를 나타낸다. 캐시에서 제거되는 기간을 뜻한다. `<Name>`, `<Value>`의 의미는 `<Type>`에 따라 다르다. 주로 쓰이는 레코드 타입은 다음과 같다. 더 많은 레코드 종류는 [Cloudflare의 DNS 레코드 개요](https://www.cloudflare.com/ko-kr/learning/dns/dns-records/)에서 볼 수 있다.

- A: Name은 호스트 이름, Value는 IPv4 주소
- AAAA: Name은 호스트 이름, Value는 IPv6 주소
- NS: Name은 도메인, Value는 해당 도메인의 호스트에 대한 IP 주소를 가진 책임 DNS 서버의 호스트 이름
- CNAME: Canonical Name의 약자. Name은 별칭 호스트 이름, Value는 원본 호스트 이름
- MX: Name은 도메인, Value는 `Name`을 별칭으로 갖는 메일서버의 원본 호스트 이름

만약 호스트 이름 X에 대해 어떤 DNS 서버가 책임 DNS 서버라면 이 DNS 서버는 X에 대한 A 레코드를 포함한다. 호스트 이름의 책임 DNS 서버를 찾기 위해서는 NS 레코드를 사용한다.

그리고 새로운 레코드를 DNS에 삽입하는 건 ICANN의 승인을 받은 등록 기관에서 처리한다. 이 등록 기관의 목록은 [ICANN, List of Accredited Registrars](https://www.icann.org/en/contracted-parties/accredited-registrars/list-of-accredited-registrars)에서 볼 수 있다.

나는 저 목록에도 있는 Cloudflare를 이용해서 "witch.work" 도메인을 등록했다.

## 자원 레코드 확인해보기

DNS 서버에 저장된 자원 레코드를 확인하려면 `nslookup` 명령어를 이용할 수 있다. 이 명령어는 DNS 서버에 질의를 보내고 응답을 읽기 편한 형태로 출력해준다. 예를 들어 "witch.work"의 A 레코드를 확인하려면 다음과 같은 명령어를 입력한다.

```bash
nslookup -type=A witch.work

# 응답
Name:	witch.work
Address: 104.21.32.1 # Cloudflare의 IP 주소이다
# 다른 IP 주소가 있을 수도 있다
```



# 참고

James F. Kurose, Keith W. Ross 지음, 최종원, 강현국, 김기태 외 5명 옮김, 컴퓨터 네트워킹 하향식 접근, 8판

기술평론사 편집부 엮음, 진명조 옮김, 인프라 엔지니어의 교과서 시스템 구축과 관리편, 5장 '최신 DNS 교과서'

아미노 에이지 지음, 김현주 옮김, 하루 3분 네트워크 교실

인터넷이 동작하는 아주 구체적인 원리

https://parksb.github.io/article/36.html

DNS 개념잡기 - (2) DNS 구성 요소 및 분류(DNS Resolver, DNS 서버)

https://anggeum.tistory.com/entry/DNS-%EA%B0%9C%EB%85%90%EC%9E%A1%EA%B8%B0-2-DNS-%EA%B5%AC%EC%84%B1-%EC%9A%94%EC%86%8C-%EB%B0%8F-%EB%B6%84%EB%A5%98DNS-Resolver-DNS-%EC%84%9C%EB%B2%84

macOS DNS Suffix 테스트( /etc/resolve.conf 관련)

https://k-security.tistory.com/155

NsLookup.io, What is a DNS stub resolver?

https://www.nslookup.io/learning/what-is-a-dns-resolver/

How DNS Works (Recursive Resolution and Stub Resolvers)

https://dev.to/lovestaco/how-dns-works-recursive-resolution-and-stub-resolvers-4k21

cloudflare, DNS란 무엇입니까? | DNS 작동 원리

https://www.cloudflare.com/ko-kr/learning/dns/what-is-dns/

cloudflare, DNS 서버 유형

https://www.cloudflare.com/ko-kr/learning/dns/dns-server-types/

cloudflare, DNS AAAA 레코드

https://www.cloudflare.com/ko-kr/learning/dns/dns-records/dns-aaaa-record/

cloudflare, DNS SOA 레코드란?

https://www.cloudflare.com/ko-kr/learning/dns/dns-records/dns-soa-record/

cloudflare, 기본 및 보조 DNS

https://www.cloudflare.com/ko-kr/learning/dns/glossary/primary-secondary-dns/

IBM Technology, "What are DNS Zones And Records?"

https://www.youtube.com/watch?v=U-i_UDDYLxY

IBM Technology, "Primary and Secondary DNS: A Complete Guide"

https://www.youtube.com/watch?v=qhiyTH5B21A

[^1]: 이 루트 DNS 서버는 12개의 다른 기관에서 관리되는 13개의 서버로 구성되어 있으며 전세계에 1000개 이상의 인스턴스가 퍼져 있다. 이건 ICANN(Internet Corporation for Assigned Names and Numbers) 소속의 IANA(Internet Assigned Numbers Authority)에서 관리한다.

[^2]: 컴퓨터 네트워킹 하향식 접근 8판 120-121p