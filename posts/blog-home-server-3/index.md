---
title: 홈 서버로 블로그 배포하기 - 더 좋은 배포를 향하여
date: "2023-10-03T04:00:00Z"
description: "방화벽 설정, 자동 배포"
tags: ["blog"]
---

> 서버 구축은 처음이고 저보다 조금 먼저 서버를 구축한 불칸님의 많은 도움을 받아가며 만들어진 글이라 많이 부족할 수 있습니다. 틀리거나 보충해야 할 부분이 있다면 댓글로 알려주시면 감사하겠습니다.

[홈 서버로 블로그 배포하기 - 블로그 올리기](https://witch.work/posts/blog-home-server-2)에서 이어지는 글입니다.

# 1. DDOS 막기

현재 `blog.witch.work`에서는 내 블로그가 돌아가고 있다. 다음과 같은 과정을 거쳐서 말이다.

![내 도메인 접속 구조](./how-my-domain-works.png)

하지만 여기에 누군가가 DDOS 공격을 하면 내 작은 용량의 서버는 무너질 것이다. 그래서 방화벽을 설정해주기로 했다.

[이 분야에서 국내의 굉장한 네임드 중 한 분인 달소님이 Pfsense방화벽 Dos,Ddos 막기. 라는 글을 이미 작성해 두셔서 거의 그대로 따라했다.](https://blog.dalso.org/home-server/firewall/3358)

## 1.1. 필터링

하나의 소스 IP에서 초당 10회 이상 연결될 시 IP가 블락되도록 설정한다. [land attack](https://m.blog.naver.com/brickbot/220416019291)에서는 소스 ip가 제각각 이기 때문에 별 효력은 없다고 하지만 다른 공격 막는데는 유용하다고 한다.

pfsense의 Firewall > Rules > WAN에서 외부 접속을 담당하는 443포트 rule을 편집하자.(이전 글을 보면, HAProxy에서 외부 접속은 모두 443포트에서 처리하도록 해놓았다)

![pfsense-rule](./pfsense-interface-rule.png)

아래로 내리면 Extra Options가 있는데 거기서 Advanced Options를 설정하자. Display Advanced를 누르면 설정창이 나타난다. `Max. src. conn. Rate`와 `Max. src. conn. Rates` 에서 초당 몇 개의 커넥션이 가능한지 설정할 수 있다. 나는 20으로 설정했다.

![max rate 설정](./max-src-conn-rate.png)

## 1.2. SYN Proxy 설정

SYN Proxy는 SYN Flood 공격을 막기 위한 방법이다. SYN Flood 공격은 TCP 3-way handshake 과정에서 SYN 패킷을 계속 보내서 서버의 자원을 고갈시키는 공격이다.

SYN Proxy는 먼저 방화벽이 클라이언트와 3-way handshake를 하고 정상적으로 커넥션을 맺게 되었을 때 커넥션 정보를 서버에 전달하는 방식이다.

이렇게 하면 서버는 정상적인 커넥션에 대한 정보만 받게 되기 때문에 SYN Flood 공격을 막을 수 있다.

이 또한 Firewall > Rules > WAN에서 443포트 rule을 수정하는 것으로 할 수 있다.

![pfsense-rule](./pfsense-interface-rule.png)

아까처럼 Extra Options - Advanced Options를 설정하자. `State Type`을 `SYN Proxy`로 설정하면 된다.

![syn proxy 설정](./syn-proxy.png)

이렇게 하고 Save - Apply Changes를 누르면 설정이 적용된다. SYN Proxy는 TCP 룰에 대해서만 적용된다.(애초에 3-way handshake에 기반한 것이니까) 따라서 룰을 TCP로 바꾸었다.

## 1.3. SYN 쿠키 사용

SYN 패킷에 대한 응답으로 SYN-ACK 패킷에 특별한 쿠키 값을 담아 보내는 것이다. 이 SYN-ACK 패킷에 대한 ACK가 올 경우 쿠키 값을 검증하여 제대로 된 값인 경우 연결을 형성한다.

연결 수립에 필요한 정보들을 Cookie를 통해 보냄으로써 SYN Backlog Queue를 사용하지 않고 따라서 SYN Backlog Queue를 꽉 채우는 SYN Flood 공격을 막을 수 있다.

System > Advanced - System Tunables에서 `net.inet.tcp.syncookies` 값을 1로 설정하면 된다. 나는 기본적으로 되어 있었다.

![syn cookie 설정](./syn-cookie-rule.png)

# 2. 자동 배포

현재 `blog.witch.work`에 배포되어 있는 내 블로그는 git에 내가 뭔가 코드 업데이트를 하고 나면 내가 직접 서버에 접속해서 다음과 같은 커맨드로 업데이트해야 한다.

```bash
git pull origin main
yarn run build
pm2 restart blog
```

이를 자동화하고 싶은데 자료가 정말 없었다. 일단 어떻게 해야 하는지 생각을 해보자.

## 2.1. 구상

이런 자동 배포를 하기 위한 가장 간단한 툴은 내가 알기로 Github action이다. Github action은 Github에서 제공하는 CI/CD 툴이다. 따라서 이걸 사용하자. 어차피 무슨 툴이든 초보인 건 마찬가지니까...

그러면 github에 push 이벤트가 발생했을 때 ssh로 내 proxmox 컨테이너에 접속해서 위의 스크립트를 실행하면 되겠다. 해당 컨테이너 내부에 `deploy.sh`같은 폴더를 만들어 놓아도 좋을 테고 말이다.



# 참고

Pfsense방화벽 Dos,Ddos 막기 https://blog.dalso.org/home-server/firewall/3358

SYN Proxy https://yunseoks.tistory.com/41

Syn Cookie https://itwiki.kr/w/Syn_Cookie