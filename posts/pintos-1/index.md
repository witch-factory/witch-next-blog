---
title: 서강대학교 핀토스 - project 0
date: "2022-11-11T00:00:00Z"
description: "핀토스를 실행해 보자"
tags: ["cs", "study", "os", "project"]
---

# 1. 핀토스 시작

운영체제 과제로 핀토스가 나왔다. 프로젝트 0은 핀토스를 설치하고 간단한 커맨드를 실행시켜 보는 것이다. 제공된 ppt에서 시키는 대로 하면 된다.

핀토스 실행에 필요한 QEMU등은 cspro에서 제공하므로 따로 설치할 필요가 없다. 따라서 제공된 pintos_modified.tar.gz 파일을 받아서 압축을 해제하는 것부터 시작한다.

```
tar -xvzf pintos_modified.tar.gz
```

그리고 `.bashrc`파일을 이용해서 환경 변수를 추가해 줘야 한다. `.bashrc`파일은 `~/`디렉토리에 존재하므로 `vi ~/.bashrc`로 열어서 다음과 같이 추가해 준다.

```
export PATH=/sogang/under/cseXXXXXXXX/pintos/src/utils:$PATH
```

여기서 `cseXXXXXXXX`는 자신의 학번이다. 그리고 `pintos/src/utils`는 핀토스를 실행하기 위한 스크립트가 있는 디렉토리이다. 이렇게 추가하고 나면 `source ~/.bashrc`를 실행해서 적용시켜 준다.

그리고 `cd ~/pintos/src/threads`로 디렉토리를 이동한 후 `make`를 실행하면 핀토스의 스레드 부분이 컴파일된다.

그 다음 `src/threads`로 이동하여 다음 커맨드를 실행한다.

```
pintos -v -- -q run alarm-multiple
```

핀토스가 실행되고 `alarm-multiple` 명령이 실행된다.

이때 핀토스를 실행시키는 시뮬레이터에 몇 가지 옵션을 줄 수 있고 이는 핀토스 커널에 전달되는 명령과 구분되어야 한다. 이 분리를 `--` 가 담당한다. 따라서 핀토스 명령의 형태는 다음과 같아진다. `pintos 핀토스 시뮬레이터 옵션 -- 핀토스 커널 argunemt ...` 이때 어떤 옵션이 가능한지는 `pintos` 명령으로 볼 수 있다. 예를 들어 -v는 VGA 디스플레이를 끄는 옵션이다.

그리고 위 명령 중 -q는 `--` 뒤에 있으므로 핀토스 커널에 전달하는 argument인데 출력이 끝나면 핀토스를 종료하라는 옵션이다.
