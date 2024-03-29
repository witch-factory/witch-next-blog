---
title: 홈 서버로 블로그 배포하기 - proxmox, pfsense 초기세팅
date: "2023-09-18T04:00:00Z"
description: "홈 서버를 세팅해보자"
tags: ["blog"]
---

> 서버 구축은 처음이고 저보다 조금 먼저 서버를 구축한 [불칸](https://vulcan.site/)님의 많은 도움을 받아가며 만들어진 글이라 많이 부족할 수 있습니다. 틀린 부분이 있다면 댓글로 알려주시면 감사하겠습니다.

> 이 글을 보고 홈서버를 세팅하려는 분이 계실지도 모르겠습니다. 제가 알고 있는 부분의 지식은 많은 생략이 있었기 때문에 네트워크에 대한 기본적인 지식은 가지고 있어야 어느 정도 이해하며 글을 읽으실 수 있을 것이라고 알려드립니다. 

# 1. 시작

이 블로그는 원래 Vercel로 배포되고 있었다. 그런데 직접 홈서버를 세팅해서 블로그를 배포하고 있는 [불칸](https://vulcan.site/)님과 교류하다 보니 나도 직접 서버를 세팅해서 블로그를 배포해 보고 싶다는 생각을 하게 되었다.

그러다가 마침 괜찮은 가성비 서버를 추천받아서 홈 서버를 세팅해 보았다. 개인 서버를 먼저 구축한 사람이 도와주려고 기다리고 있는데 이런 기회를 놓칠 수는 없다. 그렇게 빈털터리가 되었다.

아무튼 그 과정을 블로그에 작성할 것인데 이를 위해 구매한 물품들은 다음과 같다.

[인텔의 N100 i226-V(알리익스프레스 링크)](https://ko.aliexpress.com/item/1005005892722060.html?spm=a2g0o.order_list.order_list_main.5.1818140fxGKlvQ&gatewayAdapt=glo2kor)를 알리익스프레스에서 약 17만원에 구매하였다.

![N100 i226-v 이미지](./n100i226v.webp)

[SK하이닉스 GOLD P31 NVMe SSD 1TB(쿠팡 링크)](https://www.coupang.com/vp/products/6091702345?vendorItemId=73680480457&sourceType=MyCoupang_my_orders_list_product_title&isAddedCart=)를 약 10만원에 쿠팡에서 구매하였다.

[삼성전자 노트북 DDR5-4800 (16GB)](https://prod.danawa.com/info/?pcode=17666249)를 다나와 최저가비교에서 약 5만원에 구매하였다. 당시 최저가인 곳에서 사서 어디서 샀는지는 잘 기억나지 않는다. 흔한 모델이니까 어디서든 구매하면 될 거라고 생각한다.

어쨌든 중국에서 먼 길을 온 서버가 도착했다. 드라이버로 하판을 떼고 해당 부품들을 장착해 주었다.

![서버 내부](./server-internal.jpeg)

또 집의 공유기가 너무 오래된 모델이라 그런지 DHCP 설정을 끌 수 없는 등의 문제가 있었다. 그래서 iptime 유무선 공유기, 정확히는 [ipTIME A2003NS-MU(쿠팡 링크)](https://www.coupang.com/vp/products/7414788638?itemId=19220386254&vendorItemId=86771481707&q=iptime+%EA%B3%B5%EC%9C%A0%EA%B8%B0&itemsCount=36&searchId=2fdb4a1230f247e896ce44948cd8e58a&rank=0&isAddedCart=)을 구매하였다. 이건 동봉된 설명서를 보니 iptime 설치 도우미 앱이 있어서 간단히 설치할 수 있었다.

# 2. proxmox 설치

proxmox와 pfsense 기반으로 서버를 세팅할 것이다. 먼저 proxmox를 설치하자.

## 2.1. proxmox란?

서버는 보통 ubuntu를 기반으로 한다. 따라서 웹 서버만 쓴다면 우분투만 사용해도 된다. 라즈베리 파이에 우분투를 깔아서 돌아가고 있는 간단한 웹 서버들도 꽤 많다. 가령 [Yun님의 블로그](https://blog.yuni.dev/)라거나.

하지만 그렇게 하면 웹 서버를 돌리는 것 외에 아무것도 하지 못하게 된다. 만약 내가 블로그를 돌리면서 마인크래프트나 팩토리오 서버도 열고 싶다면? 우분투만 깔려 있다면 어렵다.

그럴 때 사용할 수 있는 선택지 중 가장 대표적인 건 virtualbox같은 가상 머신을 사용하는 것이다. 호스트 OS에 하이퍼바이저를 올리고 그 위에 여러 개의 게스트 OS를 올리는 식이다. 이렇게 하면 하나의 OS에서 여러 개의 운영체제를 올릴 수 있다.

보통은 컴퓨터가 1대이고 그걸 서버만을 위해서 돌릴 수 없기 때문에, 컴퓨터 하나에서 여러 개의 운영체제를 돌리기 위해서는 가상 머신은 꽤 합리적인 선택이다. 하지만 호스트 OS위에 하이퍼바이저가 올라가고 그 위에 또 게스트 OS가 올라가는 것이기 때문에 당연히 최적화에는 그렇게 좋지 않다.

이런 가상 머신과 흔히 비교되는 게 도커인데 이는 소프트웨어를 컨테이너로 패키징해서 독립된 프로세스에서 실행시키고, 이 프로세스가 호스트OS의 커널 자원을 나눠 쓸 수 있도록 한다.

호스트 OS의 커널 자원을 사용하므로 하이퍼바이저 기반의 가상 머신을 사용하는 것보다 효율적이다. 하지만 결국 커널은 호스트OS 기반이기 때문에 완전히 다른 운영체제 커널을 사용할 수는 없다.

![vm과 도커](./vm-and-docker.jpeg)

이 proxmox는 그런 부분을 해결해 준다. 근본은 이런 생각이다. 

```
가상화만을 목적으로 한다면, 호스트OS와 가상화를 위한 하이퍼바이저를 같이 돌리면 안 될까?
```

이런 생각을 실현한 게 proxmox이다. proxmox는 베어메탈 형식으로 하드웨어 바로 위에서 구동되며 호스트 OS의 커널을 일정 부분 격리하여 새로운 OS를 위한 공간을 만든다. proxmox를 사용해 보면 실제로 이런 공간을 얼마나 할당할지도 직접 지정할 수 있다.

위의 VM 구조를 나타낸 사진에서 하이퍼바이저 층을 거의 없앤 것이라고 볼 수 있겠다. 그래서 가상 머신을 돌리는데 있어서 더 효율적이고 도커에 비해 진짜 다른 OS의 커널을 이용해 서버를 돌릴 수 있다는 이점이 있다. 또한 proxmox는 웹 UI도 제공하며 이를 통해 가상 머신을 관리할 수 있다.

이 분야의 초보가 들은 대로 간략히 써본 것이라 더 자세한 이야기는 [Proxmox VE: 오픈소스 가상화 OS란 무엇인가](https://it-svr.com/proxmox-ve-opeunsoseu-gasanghwa-osran-mueosinga/)를 참고하면 볼 수 있다. 그리고 [레드햇의 하이퍼바이저 설명 문서](https://www.redhat.com/ko/topics/virtualization/what-is-a-hypervisor)도 볼 만 하다.

## 2.2. USB 굽기

[proxmox 공식 다운로드 페이지](https://www.proxmox.com/en/downloads)에서 iso 파일을 다운로드 받는다. 그러고 나면 설치 USB를 만들어 주어야 한다. 문구점에서 흔하게 파는 Sandisk USB가 있어서 사용했다.

참고로 이 작업을 하기 전에 USB를 포맷해 줘야 한다. [맥 OS에서 USB를 포맷하는 법](https://100sang.net/143)을 따라했다.

그리고 USB를 구우려고 했는데, 나는 맥os라서 iso 파일을 USB로 바로 구울 수 없다. 다행히 이를 간단히 처리해 주는 balenaEtcher라는 프로그램이 있었다. 이를 사용하면 USB를 간단히 proxmox 부팅 USB로 만들 수 있다.

[맥 USB .iso, .img 이미지 부팅 설치 파일 만들기](https://tttap.tistory.com/223)를 참고하여 USB를 만들었다.

## 2.3. proxmox 설치

usb를 만들었으면 서버에 설치하자. USB를 서버에 꽂고 부팅시켜 주면 proxmox 설치 화면이 나온다. 어차피 이렇게 한번 설치하고 실행시키고 나면 모니터를 쓸 일은 거의 없기 때문에, 나는 집에 안 쓰는 모니터를 잠시 연결하여 설치를 진행했다.

설치는 매우 간단하다. [이를 잘 설명해둔 블로그를 보고 그대로 따라하였다.](https://nad4.tistory.com/entry/Proxmox-%EC%84%A4%EC%B9%98-%EB%B0%8F-%EC%B4%88%EA%B8%B0-%ED%95%84%EC%88%98-%EC%84%A4%EC%A0%95)

이렇게 설치하고 나면 proxmox가 설치된다. 이제 proxmox를 사용할 수 있다.

설치가 끝나면 proxmox의 웹 UI에 접속할 수 있다. 참고로 기본 계정명은 `root`이고 비밀번호는 설치할 때 설정한 것이다. 기본 계정명을 몰라서 처음에 고생을 많이 했다.

### 2.3.1. 트러블슈팅

그런데 문제가 발생했다. 분명 `192.168.219.154:8006`으로 들어가면 proxmox 웹 UI가 뜬다고 해서 들어갔는데 들어가지지 않았다.

알고 보니 내가 기존에 쓰던 공유기의 DHCP는 `192.168.219.1` 게이트웨이 기반으로 IP가 할당되었는데 새로 산 iptime 공유기는 `192.168.0.1`게이트웨이에서 IP가 동적 할당되었다.

따라서 이렇게 동적 할당되는 주소를 바꿔 줘야 한다.

```bash
nano etc/network/interfaces
```

그러면 잘 찾아보면 address, gateway라고 되어 있는 부분이 있다. 이를 편집하자.

```bash
auto vmbr0
iface vmbr0 inet static
        address 192.168.219.154/24 -> 192.168.0.3/24 로 수정
        gateway 192.168.219.1 -> 192.168.0.1 로 수정
        bridge-ports enp1s0
        bridge-stp off
        bridge-fd 0
# 이하 생략
```

그리고 다음 명령어를 입력한다.

```bash
service networking restart
reboot
```

그러면 커맨드 그대로 네트워킹이 재시작되고 서버가 리부트된다. 이렇게 해도 서버 화면 상단에 뜨는 ip는 안 바뀔 수 있다. 나도 그랬다. 그러면 상단에 뜨는 ip는 무시하고 `ip a`를 입력해서 나오는 ip(나 같은 경우 `192.168.0.3:8006`이었다)로 접속하면 로그인을 하라는 창이 뜬다.

![proxmox 로그인 창](./proxmox-login.png)

여기서도 username은 `root`(물론 변경할 수는 있지만 기본 이름이 이렇다), password는 설정한 것을 입력하면 된다. 그러면 `You do not have a valid subscription for this server`라면서 구독이 없다는 메시지가 뜨는데 유료 구독은 필수가 아니므로 무시하고 `OK`를 누른다.

![proxmox 웹 UI](./proxmox-ui-first.png)

# 3. proxmox 웹 UI 가이드

각 메뉴에 대해 아주 간단히만 적어놓는다.

## 3.1. 맨 왼쪽 메뉴

![맨 왼쪽 메뉴](./left-menu.png)

왼쪽 메뉴를 보면 Datacenter와 그 아래 witch라는 게 있다.

하드웨어와 관련된 부분은 Datacenter에 있고 여기서 모든 노드들을 전체적으로 볼 수 있다. 그 아래 있는 것은 데이터센터에 연관된 노드들이다.

그 아래 보이는 witch는 내가 생성한 노드 이름이다. 만약 노드를 더 생성할 시 그 아래에 모든 노드 이름이 생길 것이다.

## 3.2. Datacenter 메뉴

여기는 하드웨어와 관련된 설정들이 있는 곳이다.

![Datacenter 메뉴](./datacenter-menu.png)

search에서는 node(여기서는 내 서버)와 하드웨어에 관련된 정보들을 볼 수 있다. 서버가 더 있다면 여기서 모든 서버들의 정보를 볼 수 있다.

summary에서는 하드, 메모리 사용량과 같은 정보를 간략히 제공한다.

Notes는 메모 같은 느낌인데 쓸 일 없다고 알고 있다.

cluster, ceph는 클러스터링 같은 걸 할 때 쓴다고 하는데 나는 서버가 하나이기 때문에 쓸 일이 없다. 그리고 ceph 메뉴에 들어가면 ceph가 설치되어 있지 않다고 하며 설치하라고 하는 메시지가 뜨는데 여기서 설치하면 매우 귀찮은 설정들이 (강제로)기다리고 있으므로 사용할 게 아니라면 절대 누르지 말라는 조언이 있었다.

options는 말 그대로 옵션 창. storage는 저장 장치를 관리하는 곳이다. 여기서 보이는 local-lvm은 가상 머신을 의미한다. 하드 용량은 local, local-lvm에서 알아서 잘 조절하니까 그렇게 신경쓰지 않아도 된다.

backup은 백업 관련 설정이다. proxmox는 컨테이너 정보 백업 등 좋은 백업 기능들을 제공하기에 이를 사용하면 좋다. 하루에 한번씩 자동으로 백업을 뜨는 등의 설정도 가능하다고 한다.

replication은 서버가 2대 이상이면 사용 가능한 기능이고 permission은 말 그대로 권한 설정이다.

HA는 high availability의 약자로 고가용성을 의미한다. 서버가 2대 이상일 때 사용 가능하다.

ACME는 ACME SSL 인증서 관련 기능이다.

여기의 Firewall은 외부에서 proxmox 서버로 접속할 때가 아니라 가상 머신들 간의 방화벽 설정을 하는 곳이다.

metric server는 Grafana와 같은 모니터링 툴 같은 걸 쓸 때 사용하는 기능인데 나는 사용할 일이 지금은 없다.

## 3.3. node(witch) 메뉴

왼쪽 메뉴에서 `Datacenter`아래에는 내 서버 노드가 위치하고 있다. 여기서도 몇 가지 설정을 할 수 있다.

![witch node 메뉴](./witch-node-menu.png)

여기에서도 search, summary, notes는 Datacenter 메뉴와 같다. summary에서 노드의 정보를 좀더 자세히 볼 수 있다는 정도?

또한 shell에서는 서버 노드 내부의 shell을 다룰 수 있다.

system 메뉴에서는 다양한 설정을 할 수 있는데 Network 메뉴 외에는 디폴트 설정에서 건들 게 별로 없다. 

Updates에서는 패키지 업데이트가 가능하고, Firewall에서는 node 내부 통신에서의 firewall 설정을 할 수 있다.

Disks 메뉴에서는 node 내부의 디스크를 관리할 수 있고 하드 디스크의 상태를 알려준다. 그런데 여기 보면 `S.M.A.R.T.`라는 항목이 있다. 이는 [자가 진단, 분석, 보고 기술](https://ko.wikipedia.org/wiki/S.M.A.R.T.)인데 이게 PASSED가 아니면 정말 큰일난 거니까 당장 백업해야 한다. 이때 끄지 말고 백업부터 해야 한다. 또한 LVM도 오류가 있으면 큰일이니 백업해야 한다. 보통 오류가 누적된 거라서...

그리고 여기서도 Ceph, replication은 클러스터링할 게 아니고 서버도 1대라서 사용하지 않는다.

# 4. proxmox 설정

proxmox 설정을 시작한다. 노드 메뉴에서 System - Network 설정으로 들어간다. 그러면 다음과 같은 화면이 뜰 것이다.

![network 첫 진입](./network-start.png)

`enp1s0`과 같은 이름들이 보이는데 이는 실제 네트워크 디바이스에 있는 이더넷 포트를 뜻한다. 나는 이더넷 포트가 4개 있어서 `enp1s0`, `enp2s0`, `enp3s0`, `enp4s0`이 보인다.

그리고 상단에 Create 버튼을 눌러서 리눅스 브릿지를 생성한다. 자동으로 `vmbr0`이라는 이름이 붙는다. 리눅스 브릿지는 하나의 물리 포트를 여러 개로 나눠 줄 수 있는 역할을 하며 리눅스 브릿지로 들어오는 패킷들을 어떤 물리적인 랜선 포트로 보낼지 결정한다.

처음 만드는 브릿지인 `vmbr0`은 proxmox에 할당해 줄 것이므로 proxmox에 사용할 내부 IP를 할당해 준다. 그리고 여기에 쓸 이더넷 포트에 연결해 준다. 나는 첫번째 포트인 `enp1s0`을 proxmox에 할당할 것이다.

![브릿지 만들기](./make-bridge.png)

물론 내가 가진 장치에는 이더넷 포트가 4개나 있으므로 굳이 리눅스 브릿지를 쓸 필요는 없다. 하지만 이렇게 리눅스 브릿지를 만들어 주면 이더넷 포트를 여러 컨테이너가 나눠 쓸 수 있다는 장점이 있고 추후에 팩토리오 서버라도 몇 개 운영할지 모르므로 이렇게 해주자.

또한 만들 때 MTU도 설정할 수 있는데 이는 NAS 같은 걸 구축할 때 건드릴 수도 있지만 여기서는 그냥 기본값으로 놓아도 된다.

이외에도 각각 WAN, LAN을 위한 브릿지 2개를 더 만들고 각각 다른 이더넷 포트에 연결해준다. 그러면 다음과 같은 화면이 된다. 이때 `vmbr1`, `vmbr2`를 만들 때는 VLAN aware에 체크해준다.

그러면 다음과 같은 화면이 된다.

![브릿지 만든 이후](./network-final.png)

## 4.2. pfsense 설치

pfsense는 적당히 홈페이지에서 내려받아서 설치하면 된다. [pfsense 공식 홈페이지](https://www.pfsense.org/download/)에서 내려받을 수 있다.

그리고 다시 proxmox 화면으로 가면 VM을 새로 만들 수 있다. node 이름을 오른쪽 클릭 후 `Create VM`을 누르면 된다.

![create vm](./create-vm.png)

그러면 적당한 ID(나는 100으로 했다)와 이름을 입력하고 `OS` 항목에서 아까 내려받은 pfsense iso 파일을 업로드하면 된다. 나는 VM 이름부터 pfsense로 지었다.

나머지는 그냥 디폴트로 놓고 진행하면 된다.

VM이 세팅되고 나면 노드의 하단 메뉴에 `내가 설정한 ID(내가 설정한 이름)`으로 VM이 만들어진 것을 볼 수 있다. 거기에 들어가서 Console 메뉴를 누르면 콘솔을 시작할 수 있다.

![vm console](./vm-console-start.png)

## 4.3. interface IP

인터페이스 IP를 지정해야 한다. 콘솔에 나온 옵션에 보면 `2) Set interface(s) IP address`라는 항목이 있다. 따라서 콘솔에서 2를 누르자.

그러면 WAN, LAN 중 어떤 걸 할당할 것인지 물어본다. 2를 눌러 LAN을 선택하면 다음과 같은 창이 뜬다.

![vm 콘솔](./vm-console-lan-ip.png)

IPv4 주소는 DHCP 설정을 하지 않고 직접 설정해 준다. 난 `192.168.0.5`로 설정했지만 다르게 해도 상관없다. IPv6 같은 경우 DHCP로 설정해 준다.

그리고 client address range를 정하라고 하는데 적당히 내가 고정으로 사용할 것 같은 범위를 빼고 지정해 주면 된다. 나는 적당히 `192.168.0.32`부터 `192.168.0.250`까지 지정해 주었다.

![콘솔 IP 지정 2번째](./vm-console-lan-ip2.png)

그리고 HTTPS만 사용하고 싶기 때문에 Do you want to revert to HTTP as the webConfigurator protocol? [y|n]에서 n을 눌러 HTTPS만 사용하도록 설정해 준다.

그러면 다음과 같이 LAN IP 설정이 완료된다.

![LAN IP 지정 완료](./lan-ip-done.png)

이제 pfsense 페이지로 접속할 때는 `192.168.0.5`로 접속할 수 있게 되었다. HTTPS로 접속해 주어야 함에 주의하자.

### 4.3.1. start at boot

그리고 매우 중요하게 설정해 줘야 하는 것이 있다. pfsense VM에 들어가서 왼쪽 메뉴를 보면 Options라는 항목이 있다. 거기 들어가서 보면 Start at boot라는 항목이 있는데 이를 체크해 주어야 한다.

![start at boot 설정](./start-at-boot.png)

이건 서버 재부팅 시 해당 VM을 자동으로 켜주는 설정이다. 이걸 해야 하는 이유는 나중에 VPN으로 이 서버에 접속해서 설정할 일이 꽤 있을 수 있기 때문이다. 늘 서버가 있는 곳까지 가서 내부망에 접속한 후 서버를 다뤄야 한다면 매우 귀찮은 일일 테니까.

그런데 VPN으로 서버를 다루다가 서버를 재부팅할 일이 생기면? 그때 pfsense가 다시 켜지지 않는다면 사실상 직접 가서 pfsense VM을 다시 켜줄 때까지 서버의 역할을 제대로 하지 못할 것이므로 문제가 된다. 따라서 해당 옵션을 켜주는게 편의상 매우 중요하다.

# 5. iptime 설정

이제 iptime의 설정과 연결을 좀 바꿔서 원래 iptime이 하던 기능들을 pfsense에서 하도록 바꾸어야 한다.

## 5.1. 목적

기존에는 외부에서 접속했을 때 iptime이 받아서 내부로 연결해 주는 역할을 했다. 하지만 이제는 pfsense가 받아서 내부로 연결해 주는 역할을 할 것이다.

원래는 공유기가 하던 역할인 layer 4 스위치 역할을 pfsense가 대신하게 되고 DHCP 기능까지도 pfsense에서 할 것이다. 이제 시작할 설정을 완료하면 iptime은 그냥 와이파이만 뿌려주는 역할이 된다.

![pfsense 전후](./what-pfsense-for.png)

## 5.2. 설정

iptime의 경우 `192.168.0.1`로 접속하면 공유기 설정을 할 수 있다. 다른 공유기의 경우는 다른 내부 ip 주소가 공유기를 위해 할당되어 있을 것이다. 하지만 해야 할 작업은 똑같다.

여기서 관리 도구에 들어간 후 DHCP 설정을 끈다. 고급 설정 - 네트워크 관리 - DHCP 서버 설정에서 DHCP 서버 동작을 중지하고 적용을 눌러야 한다. 적용을 누르는 걸 잊으면 안된다!

![설정 창](./iptime-config-1.png)

그리고 고급 설정 - 네트워크 관리 - 내부 네트워크 설정에서 허브/AP모드 내부 게이트웨이를 체크한다. 이 역시 적용을 눌러야 한다.

![설정창 2](./iptime-config-2.png)

랜선을 바꿔 끼우자. 1번째 이더넷 포트는 proxmox에 할당한 거고 proxmox도 결국 내부망이니까 공유기랑 연결해 준다. 2번째 이더넷 포트는 WAN에 사용하므로 집에 있던 외부 인터넷 선을 연결해 주었다. 그리고 3번 이더넷 포트는 LAN에 사용하므로 역시 공유기에 연결해 준다.

주의할 점은 WAN에 사용하는 이더넷 포트에 연결된 리눅스 브릿지는 1개뿐이여야 한다는 것이다. 1개가 아니어도 막 당장 문제가 터지지는 않는다는데 절대 좋지는 않다고 한다.

나는 이더넷 포트가 4개 있는 장치를 사용하고 있고 웬만한 다른 장치들도 홈 서버에 사용할 엄두를 낼 정도면 이더넷 포트가 2개는 달려 있으므로 하나를 WAN, 하나를 LAN으로 사용하면 되기 때문에 WAN 포트에 다른 브릿지를 할당해 줄 필요는 거의 없다.

그리고 위에서 2개의 연결은 공유기랑 서버를 연결하고 있는데 여기서 공유기에 랜선을 꽂을 때 WAN 포트에 꽂으면 안된다. WAN 포트는 보통 색이 다르거나 다른 그림이 그려져 있는 등 표시가 있으니 그 부분을 피해서 LAN 선을 꽂자.

![서버-공유기 연결](./server-iptime-connection.jpeg)

사진의 공유기에 선이 꽂혀 있지 않은 2개의 포트 중 노란색으로 칠해져 있는 것이 WAN 포트이다. 만약 공유기를 외부망과의 연결에 사용한다면 저 포트에 외부 인터넷 선을 연결했어야 하지만, 여기서는 아무것도 연결되어 있지 않은 것을 볼 수 있다.

# 6. pfsense

`192.168.0.5`로 접속하면 pfsense 페이지가 나온다. 다음과 같은 로그인 페이지가 뜰 것이다.

![pfsense 로그인 화면](./pfsense-main.png)

기본적으로 계정명은 `admin`이고 비밀번호는 `pfsense`이다. 나중에 바꿔 줘야 하지만 지금은 일단 로그인한다. 초기 접속이라면 'Welcome to pfsense software!' 같은 메시지와 함께 초기 설정을 진행하게 된다.

초기 설정은 [2cpu에 올라온 글](https://www.2cpu.co.kr/lec/4139)을 참고하면 된다. 중간에 기본 비밀번호를 바꾸는 것도 진행된다. 이 글과 내가 진행한 게 다른 부분은 나는 secondary DNS를 `8.8.8.8`(구글 DNS)로 했다는 것 정도이다.

여기까지 하면 pfsense 대시보드에 진입할 수 있다. 이건 약간의 설정을 마친 상태이다. 여기서 확인할 만한 건 System Information의 version이 최신인지 정도만 확인하면 된다.

![pfsense 대시보드 사진](./pfsense-dashboard.png)

## 6.1. 패키지 설치와 VPN

상단 메뉴의 System - Package Manager부터 들어간다. 거기서 Available Packages로 진입하면 설치 가능한 패키지들을 검색할 수 있는데 acme, haproxy, openVPN client export를 설치한다.

![설치된 패키지들](./package-installed.png)

그리고 VPN 설정을 위해 상단 메뉴에서 VPN - OpenVPN으로 들어간다. 그곳에서 Wizards 메뉴를 클릭하면 쉽게 OpenVPN 서버를 만들 수 있다. 그리고 VPN - OpenVPN - Client Export로 들어가서 아래로 스크롤을 내리면 OpenVPN 클라이언트 설정 파일을 내려받을 수 있다.

![openvpn 클라이언트 파일 다운](./openvpn-client-export.png)

여기서 Inline Configurations의 Most Clients를 선택하면 핸드폰이나 노트북 어디서나 해당 VPN을 이용할 수 있는 `.ovpn` 설정 파일을 다운받을 수 있다. 이를 이용하면 VPN을 사용할 수 있다.

사용은 다음과 같다. 나는 맥 노트북에서 해보았다. 물론 서버가 있는 네트워크와 다른 네트워크 환경에서 실험했다.

[OpenVPN Connect for macOS](https://openvpn.net/client-connect-vpn-for-mac-os/)페이지에서 macOS용 OpenVPN 클라이언트를 내려받아 설치한다. 설치가 끝나면 앱을 실행한 후 UPLOAD FILE 메뉴에서 아까 다운받은 설정 파일을 업로드한다(메일 등으로 보내 놓으면 된다). 그리고 아까 설정한 pfsense 아이디를 통해서 로그인하면 VPN에 접속된다.

![openvpn 클라이언트](./vpn-with-dashboard.png)

이 상태에서 `192.168.0.5`에 접속하면 아까 보았던 pfsense 페이지에 접속할 수 있다.

openVPN은 스마트폰 앱도 있는데 앱을 통해서도 비슷하게 파일 업로드를 통하면 스마트폰으로도 pfsense나 proxmox 설정이 가능하다.

초기 세팅은 어느 정도 된 것 같으니 다음 글에서는 블로그를 배포해보도록 하겠다.


# 참고

맥 OS에서 USB를 포맷하는 법 https://100sang.net/143

맥 USB .iso, .img 이미지 부팅 설치 파일 만들기 https://tttap.tistory.com/223

proxmox란 무엇인가
https://it-svr.com/proxmox-ve-opeunsoseu-gasanghwa-osran-mueosinga/

pfsense 설치
https://www.2cpu.co.kr/lec/4139