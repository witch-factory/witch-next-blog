---
title: 홈 서버로 블로그 배포하기 - 블로그 올리기
date: "2023-09-29T04:00:00Z"
description: "블로그를 홈 서버에 올려보자"
tags: ["blog"]
---

# 이 글은 현재 작성 중입니다.

> 서버 구축은 처음이고 저보다 조금 먼저 서버를 구축한 [불칸](https://vulcan.site/)님의 많은 도움을 받아가며 만들어진 글이라 많이 부족할 수 있습니다. 틀린 부분이 있다면 댓글로 알려주시면 감사하겠습니다.

> 이 글을 보고 홈서버를 세팅하려는 분이 계실지도 모르겠습니다. 제가 알고 있는 부분의 지식은 많은 생략이 있었기 때문에 네트워크에 대한 기본적인 지식은 가지고 있어야 어느 정도 이해하며 글을 읽으실 수 있을 것이라고 알려드립니다. 

[홈 서버 만들기 - 초기 세팅, proxmox, pfsense](https://witch.work/posts/blog-home-server)에서 이어지는 글입니다.

# 1. 블로그 배포

## 1.1. 컨테이너 만들기

LXC 컨테이너를 만드는 작업은 [나만의 홈서버 구축하기 - 1](https://velog.io/@kisuk623/Proxmox-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0)글을 참고하였습니다.

나는 이 홈서버를 산 목적이 애초에 블로그를 배포하기 위한 것이었으므로 컨테이너를 만들어주자. 위의 링크를 참고하면 된다.

ID는 적당히 1001로 하고 이름은 `blog`로 지었다. 템플릿 OS는 Ubuntu 20.04로 선택했다. 참고로 CT를 만들 때 `General`항목에서 `unprivileged container`라는 체크박스가 있는데 이는 절대 해제하면 안된다. 커널과 컨테이너를 분리해서 보안성을 높여주는 기능이다.

나머지는 디폴트로 놓고 진행해도 된다. 다만 나는 컨테이너에 좀 더 많은 성능을 할당해주고 싶어서 코어 4개, 메모리 4GB로 설정했다. 이는 나중에 수정할 수 있으므로 크게 신경쓰지 않아도 된다. 단, 이를 늘릴 수는 있어도 줄이는 건 절대 쉽지 않다고 하니 주의하자.

## 1.2. 컨테이너 설정

해당 컨테이너에 접속해서 Console 메뉴에서 start 후 아까 입력한 아이디와 비밀번호를 입력하면 콘솔이 띄워진다. 이제 이 컨테이너에 필요한 패키지들을 설치해주자.

```bash
sudo apt-get update
sudo apt-get install git
sudo apt install nginx
```

블로그는 nextjs로 되어 있으므로 clone해와서 빌드하면 된다. 

```bash
git clone MY_BLOG_URL
cd MY_BLOG_DIR
yarn
sudo n lts # nodejs 버전을 lts로 설정
sudo n prune  
yarn run build
```

이때 nextjs의 기본 빌드 경로는 `.next`인데, 곧 이걸 사용해서 배포하기는 하겠지만 처음부터 이걸로 하면 많은 애로사항이 따른다. 따라서 나는 [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)로 먼저 빌드하겠다.

`next.config.js`의 `nextConfig`에서 `output: 'export'` 프로퍼티를 추가해 주면 된다.

```js
// next.config.js
// nextjs 공식 문서에서 가져왔다.
const nextConfig = {
  output: 'export',
 
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,
 
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,
 
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
}
```

이렇게 하면 `yarn run build`를 했을 때 `.next`가 아닌 `out` 폴더가 생성된다(물론 이것도 `distDir`프로퍼티로 바꿀 수 있다). 어쨌든 이렇게 빌드가 static export된 폴더를 nginx에 연결해주면 된다. image loader가 없는 등의 문제로 이미지가 안 뜨고 그럴 수 있는데 어차피 이후 고칠 거니까 무시한다.

그리고 방금 빌드한 파일을 nginx에 연결해주자. 설정 파일을 만져주면 된다.

```bash
sudo nano /etc/nginx/sites-available/static.site
```

그리고 다음과 같이 작성해주자. 나는 빌드 파일 경로가 `블로그_폴더_경로/out`이다.

```bash
server {
  listen PORT_NUMBER;
  server_name 0.0.0.0;
  charset utf-8;

  location / {
    root 빌드파일_경로;
    index index.html index.htm;
    try_files $uri $uri.html $uri/ =404;
  }
}
```

그리고 심볼릭 링크를 연결해 준 후 nginx 테스트, 성공시 리로드한다.

```bash
sudo ln -s /etc/nginx/sites-available/static.site /etc/nginx/sites-enabled/
sudo nginx -t
sudo service nginx reload
```

이제 `ip a`로 입력하면 나오는 내부망 ip + 포트번호로 접속하면 블로그가 뜬다. 이미지가 나오지 않는 문제는 해결해야 하고 외부망 접속도 해야 하지만 일단은 블로그를 띄우는 데 성공한 것이다.

![첫번째 블로그 올린결과](./blog-first-nginx.png)

## 1.3. 외부 포트포워딩

[pfsense에서 포트포워딩하는 방법에 대한 서버포럼 글이 있어 이를 참고하였다.](https://svrforum.com/svr/27343)

먼저 pfsense에 접속해서 상단 메뉴의 `Interfaces` -> `WAN` 를 클릭한다. 그리고 제일 하단으로 내려가서 `Block private networks and loopback addresses`를 체크 해제한다.

그다음에는 `Firewall` -> `NAT` -> `Port Forward`를 클릭한다. `Add(위쪽 방향 화살표)`를 눌러서 다음과 같이 입력한다.

이 포트포워딩의 목적이 WAN 주소의 특정 포트로 들어오는 접속을 내부 IP의 특정 포트로 연결해 주기 위한 것이므로 이 부분만 설정해 주면 된다.

![pfsense 포트포워딩 설정화면](./pfsense-port-forwarding.png)

이를 설정하고 적용 후 WAN IP의 8080포트로 접속하면 아까 만들어진 블로그 페이지(이미지는 아직 안 뜨지만)가 뜨는 것을 확인할 수 있다.

# 2. HTTPS 설정

[이 글을 대부분 참고하여 작성하였다.](https://www.linkedin.com/pulse/configuring-pfsense-firewall-haproxy-maximum-security-goldhammer/)

그런데 지금 블로그 페이지에 접속하게 되면 HTTP로 접속할 수밖에 없다. 이를 HTTPS로 바꿔주자. nginx에서 이를 하나하나 설정할 수도 있지만 이를 대신해주는 프로그램이 있다. 바로 `HAProxy`이다. 그러니 pfsense에서 haproxy를 이용해서 HTTPS를 설정하자.

이렇게 하면 IP주소 접속에 대해서는 HTTPS 설정을 못하지만 도메인을 구입해서 DNS를 설정하면 HTTPS로 접속할 수 있다.

나는 cloudflare에서 도메인을 관리하고 있고, haproxy에서는 cloudflare와 연동해서 설정할 수 있는 기능을 매우 잘 제공한다. 따라서 이를 사용한다. 다만 아직 실제 블로그 배포를 하기에는 해결해야 할 여러 문제가 있기 때문에 예전에 만들어둔 서브도메인을 통해서 실험하도록 하겠다.

[cloudflare에서 서브도메인을 만드는 것에 대해서는 이전에 쓴 글을 참고할 수 있다.](https://witch.work/posts/cloudflare-make-subdomain)

## 2.1. Cloudflare 설정

Cloudflare에 접속하여 내 도메인에 접속한다. 그러면 도메인에 연결된 DNS들이 나오는데 우리는 여기서 `blog`서브도메인을 사용할 것이다. 따라서 도메인 리스트에서 `blog`를 선택해 편집하자.

![Cloudflare 도메인 리스트](./cloudflare-domain-list.png)

프록시를 끄고 Target을 `1.1.1.1`로 바꾼다. 이는 haproxy에서 cloudflare와 연동하면서 알아서 바꿔줄 것이다.

![target 변경](./cloudflare-target-change.png)

> 만약 자동으로 변경되지 않는다면 cloudflare에서 DNS IP를 수동으로 다시 설정해주면 된다.

## 2.2. acme 세팅

pfsense에서 System - Advanced - Admin Access에서 TCP Port는 기본적으로 443으로 되어 있을 텐데 이를 다른 포트로 적당히 바꿔준다. 나는 12443으로 했다.

이렇게 바꿔주고 나면 pfsense 접속을 위해 12443 포트를 사용하게 된다. 원래는 `192.168.0.5`로 접속해서 pfsense를 사용했는데 `192.168.0.5:12443`으로 접속하는 것이다.

그리고 System - Package Manager - Available Packages에서 acme와 HAProxy를 설치한다. 나는 이전 글에서 했으니 생략한다.

Services - Acme Certificates - Account keys에 들어가서 add를 누르고 account key를 생성하자. 적당히 이름과 설명을 입력하고 이메일을 입력한다. 그리고 `Create Account Key`를 누르면 account key가 생성된다. `Register ACME account key`를 누르면 이 key가 등록된다.

![acme account key 생성](./new-account-key.png)

그다음 Services - Acme Certificates - Certificates에 들어가서 add를 누르고 이름과 설명을 적당히 입력하고 Acme Account는 방금 만든 것을 선택한다.

Private key는 384-bit ECDSA로 설정하고 OCSP Must Staple은 체크해준다.

![acme certificate 생성](./acme-certificate.png)

Domain SAN list를 설정해 줘야 한다. `+ Add`를 클릭하고 method는 `DNS - Cloudflare`로 선택한다. 
나는 `witch.work`와 `*.witch.work`를 추가했다. 이렇게 하면 witch.work와 모든 서브도메인에 대한 인증서가 추가된다.

![인증서 추가](./add-certificate.png)

입력해야 할 Key가 많은데 Cloudflare API Keys는 클플에서 My profile에 들어간 후 왼쪽 메뉴의 API Tokens - Global API Key에서 찾을 수 있다. Email은 cloudflare에 등록한 이메일을 입력하면 된다.

Token은 API Token인데 역시 클플에서 My profile에 들어간 후 왼쪽 메뉴의 API Tokens - Create Token에서 만들 수 있다. 여기서는 `Edit zone DNS`를 체크해준다. 이 토큰은 한번 만들면 Cloudflare에서는 다시 볼 수 없으므로 한번 복사해서 잘 입력해두자. 하지만 한번 이렇게 잘 입력해 두면 pfsense에서 다시 볼 수 있으므로 굳이 어디 따로 저장해 둘 필요는 없다.

Account ID, Zone ID는 도메인 메뉴에 들어가서 우측 메뉴의 스크롤을 내리면 Quick Actions, Domain Registration, Active Subscriptions, Support Resourcesd 아래에 API라는 메뉴가 있는데 거기에서 둘 다 찾을 수 있다. 그렇게 입력한 후 저장하면 된다.

이렇게 하고 저장한 후 메뉴에서 `Issue/Renew`를 클릭하면 뭔가 로딩되다가 초록색 알림 창에 많은 텍스트가 뜨는데 `Reload success`가 알림창 마지막에 나오면 성공이다.

이러면 `*.witch.work`에 해당하는 도메인 중 Cloudflare에서 DNS를 pfsense 쪽으로 연결해준 도메인들에 대해서 인증서가 사용된다.

## 2.3. HAProxy 설정

### 2.3.1. Settings

이제 HAProxy를 설정해주자. Services - HAProxy - Settings에 들어가서 Global parameters에서 `Enable HAProxy`를 체크해주자.

그리고 Logging에서 Remote Syslog host를 `/var/run/log`로 한다.

Max SSL Diffie-Hellman size는 2048로 되어 있을 텐데 이를 4096으로 바꾼다. SSL/TLS Compatibility Mode는 Intermediate로 설정한다.

### 2.3.2. Backend

Services - HAProxy - Backend에 들어가서 Add를 누르고 다음과 같이 이름을 적당히 지어준다.

Server list에는 앞으로 우리가 연결할 모든 서버들을 추가하면 된다. 여기서는 내가 연결할 내부 포트 IP와 포트번호를 적어주었다. 여기서 SSL 암호화를 안하더라도 내부 트래픽이 암호화되지 않을 뿐 여전히 프론트엔드 서버는 HTTPS이므로 상관없다.

![backend 설정](./haproxy-backend.png)

health check는 딱히 안해도 잘 된다.

### 2.3.3. Frontend

Services - HAProxy - Frontend에 들어가자. 먼저 http를 https로 리다이렉션하는 규칙을 설정해주자. `Add`를 누르고 다음과 같이 이름과 설명을 적당히 적어 준다. 그다음 external address 포트를 80으로 적어주고 offloading SSL을 체크 해제한다. Type은 `http / https(offloading)`로 설정한다.

![설정](./haproxy-front-http-to-https.png)

다른 프론트엔드 리스너를 하나 만들자. 이 리스너는 443포트로 들어온 https 트래픽을 핸들링하고 [SSL 오프로딩](https://minholee93.tistory.com/entry/SSL-offloading-%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C)을 한다.

그러니 이는 포트를 443으로 지정하고 SSL 오프로딩을 체크한 후 Type은 `http / https(offloading)`로 설정한다. 역시 이름과 설명은 적당히.

![https 설정](./haproxy-front-rule-443.png)

Access Control List를 설정해줄 차례다. 어떤 도메인으로 들어오는지에 따라서 다른 서버로 연결해주기 위함이다.

우리가 해야 하는 건 blog.witch.work로 들어오는 트래픽을 방금 만든 `my-backend` 서버로 연결해주는 것이다.

Access Control list의 name과 Actions의 Condition acl names이 같은 것끼리 연결된다는 것에 주의해서 해당 섹션을 다음과 같이 설정해주자. `cs.witch.work`는 내가 이전에 설정한 것이니 무시하면 된다.

![acl](./haproxy-acl.png)

그렇게 설정 후 아래로 내려보면 Advanced settings 항목이 있는데 여기의 `Advanced pass thru`부분에 다음과 같은 값을 입력해준다. 응답 헤더를 추가해 주는 것이다.

```
http-response set-header strict-transport-security "max-age=31536000;includeSubDomains;preload;"
```

그다음 SSL Offloading에서는 Certificate을 아까 만든 acme 인증서로 추가하고 Add ACL for certificate Subject Alternative Names를 체크 후 Additional certificate을 추가한다. 이는 위의 certificate에서 추가한 것과 같은 인증서를 추가하면 된다.

Advanced ssl options에는 보안 강화를 위해 다음 문구를 작성한다.

```
curves secp384r1:secp521r1 ciphers ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-GCM-SHA384 ciphersuites TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
```

여기까지 설정하면 ssl offloading 설정이 완료된다.

![ssl offloading 설정](./haproxy-ssl-offloading.png)

## 2.4. rules 설정

이제 트래픽을 받을 규칙을 설정해 줘야 한다.

firewall - rules - WAN에 들어가서 rule을 추가하자.

먼저 하나는 외부에서 요청을 받을 규칙이다. interface는 WAN, 프로토콜은 TCP로 하여 하나의 rule을 만든다. 이는 외부에서 pfsense가 트래픽을 받을 규칙이므로 Destination은 WAN address, 포트번호는 아까 만들었던 12443으로 한다. 설명은 `allow for pfsense ports`로 적었다.

다음과 같이 rule이 만들어진다. 설정을 변경한 부분은 빨갛게 표시하였다.

![wan rule](./firewall-rule-wan.png)

그럼 외부에서 오는 트래픽은 pfsense가 받는데 이 트래픽을 내부적으로 받을 규칙을 생성해야 한다. HTTP를 위한 80포트 규칙, HTTPS를 위한 443포트 규칙을 만들어주자.

역시 Interface는 WAN으로 하고 프로토콜은 이번에는 TCP/UDP로 한다. 그 다음 Destination을 `This firewall(self)`로 설정하고 포트번호는 http rule인지 https rule인지에 따라 80 혹은 443으로 한다. 설명은 `allow for http`, `allow for https`로 적었다. 예를 들어 allow for https의 경우 다음과 같이 설정하면 된다.

![allow for https](./firewall-rule-https.png)

그러면 다음과 같이 규칙들이 생성되게 된다.

![firewall 규칙들](./firewall-all-rules.png)

## 2.5. ssllab 테스트

[ssllabs에서는 웹서버의 ssl 설정을 테스트하고 점수를 매겨준다.](https://www.ssllabs.com/ssltest/index.html) 위처럼 설정한 사이트의 경우 A+를 받을 수 있다.

![ssllab 테스트 결과](./ssllab-test.png)

또한 [해당 페이지 링크](https://blog.witch.work/)에도 잘 접속되는 것을 볼 수 있었다.

하지만 아직 이미지가 제대로 뜨지 않는 등 페이지도 제대로 작동하지 않는 부분이 많고 방화벽 설정 같은 것도 안되어 있어서 다음 섹션에서는 그런 부분들을 해결해보도록 하겠다.

# 3. 블로그 문제 해결

## 3.1. 이미지 문제

현재 `blog.witch.work`에 접속할 시 메인 페이지의 이미지가 뜨지 않는 문제가 있다. 이는 nextjs의 `Image` 컴포넌트가 Vercel 배포가 아닐 시 제대로 작동하지 않기 때문이다.

반면 글 등에 들어 있는 그냥 `<img>` 태그는 잘 된다. 그러니 이를 해결하는 가장 간단한 방법은 nextjs의 Image 컴포넌트를 사용하지 않고 그냥 `<img>` 태그를 사용하면 된다.

하지만 그렇게 하면 Nextjs를 쓰는 의미가 하나 사라진다...물론 `<Image>`태그 최적화를 직접 해준다고 해도 의미가 사라지는 건 비슷하지만. 그럼 이를 살릴 수 있는 방법은 없을까?



# 방화벽 설정



# 참고

gatsby로 블로그 만들기 (https://vulcan.site/blog-gatsby/)

나만의 홈서버 구축하기 - 1 https://velog.io/@kisuk623/Proxmox-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0

Pfsense에서 포트포워딩(NAT)하기 https://svrforum.com/svr/27343

Pfsense방화벽 Dos,Ddos 막기 https://blog.dalso.org/home-server/firewall/3358

Nginx를 이용하여 https 적용하는 법 https://gist.github.com/woorim960/dda0bc85599f61a025bb8ac471dfaf7a

Configuring pfSense firewall and HAProxy for maximum security rating at SSLLabs
https://www.linkedin.com/pulse/configuring-pfsense-firewall-haproxy-maximum-security-goldhammer/

Installing HAProxy on pfSense with SSL access to web server https://gainanov.pro/eng-blog/linux/installing-haproxy-pfsense/

SSL 오프로딩 https://minholee93.tistory.com/entry/SSL-offloading-%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C

How to Deploy a Next.js app to a Custom Server - NOT Vercel! (Full Beginner Tutorial) https://www.youtube.com/watch?app=desktop&v=HIb4Ucs_foQ