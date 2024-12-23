---
title: 운영체제 공룡책 7단원 정리
date: "2022-12-07T00:00:00Z"
description: "운영체제 7단원 정리"
tags: ["study", "CS"]
---

운영체제 7단원, 동기화 관련 예제를 정리한다. 학교 강의에서 그렇게 심도있게 다룬 내용이 아니므로 동기화에 관련된 고전적인 문제들과 해결만 적당히 정리하고 넘어갈 예정이다. 대부분 세마포어가 해결책 중 하나로 사용된다.

# 1. 유한 버퍼 문제

유한 버퍼 문제는 생산자-소비자 문제의 일종이다. 생산자 프로세스는 정보를 생산하고 소비자는 정보를 소비한다. 이를 어떻게 구현할 것인가?

3장에서 공유 메모리를 사용한다는 해결책을 보았다. 생산자는 정보를 버퍼에 채워넣고 소비자는 버퍼에서 정보를 소모한다. 그런데 생산자와 소비자가 함께 버퍼에 접근할 때가 문제이다. 아직 생산되지도 않은 항목을 소비하려고 하면 문제가 생길 것이다. 따라서 동기화가 필요하다.

다음과 같이 할 수 있다. 먼저 다음과 같은 변수를 선언한다. 이 변수들은 생산자, 소비자가 공유한다. n개의 버퍼로 구성된 pool이 있고 각 버퍼는 항목 하나를 저장할 수 있다고 하자.

```c
int n; // 버퍼 수
semaphore mutex = 1; // 버퍼 풀에 접근 가능한 프로세스 수
semaphore empty = n; // 비어 있는 버퍼 수
semaphore full = 0; // 꽉 찬 버퍼 수
```

그러면 생산자는 다음과 같이 구현한다. 버퍼가 꽉 차 있다면(즉 비어 있는 버퍼가 없다면)기다린다는 것에 주의해서 보자.

```c
do{
  ...
  /* produce an item in next_produced */
  ...
  wait(empty); // 비어 있는 버퍼가 있을 때까지 대기
  wait(mutex); // 버퍼 풀에 접근 가능한 프로세스 수를 1 감소
  /* add next_produced to the buffer pool */
  ...
  signal(mutex); // 버퍼 풀에 접근하는 프로세스 수를 1 증가
  signal(full); // 꽉 찬 버퍼 수를 1 증가
}while(1);
```

소비자는 다음과 같이 구현한다. 버퍼가 비어 있으면 즉 꽉 찬 버퍼가 없으면(full<=0) 기다린다는 것에 주의해서 보자.

```c
do{
  wait(full); // 정보가 들어 있는 버퍼가 있을 때까지 대기
  wait(mutex); // 버퍼 풀에 접근가능한 프로세스 수를 1 감소
  ...
  /* remove an item from buffer pool to next_consumed */
  ...
  signal(mutex); // 버퍼 풀에 접근가능한 프로세스 수를 1 증가
  signal(empty); // 정보를 소모했으므로 비어 있는 버퍼 수 1 증가
  ...
  /* consume the item in next_consumed */
  ...
}while(1);
```

소비자에서는 정보를 소모함에 따라 empty를 증가시켜 주고 생산자에서는 empty가 0보다 클 때까지 기다린다. 그리고 생산자는 정보를 생산함에 따라 full을 증가시키고 소비자는 full이 0보다 클 때까지 기다린다.

# 2. Reader-Writer Problem

여러 프로세스가 공유하는 데이터에 대하여, 데이터를 읽기만 하는 프로세스와 데이터를 쓰는(갱신하는)프로세스가 분리될 수 있다. 이때 여러 프로세스가 동시에 데이터를 읽는 것은 문제가 없다. 그러나 여러 프로세스가 동시에 데이터를 쓰거나, 하나의 프로세스가 데이터를 쓰는 도중에 다른 프로세스가 데이터를 읽는 건 문제가 될 수 있다.

이러한 문제를 해결하기 위해 우리는 writer 프로세스는 쓰기 작업 동안 데이터에 대해 독점적인 접근을 갖도록 하고, reader 프로세스는 쓰기 작업이 끝날 때까지 기다리도록 한다.

reader, writer가 공유하는 데이터로 다음과 같은 변수를 선언한다.

```c
int readcount = 0; // 현재 읽기 작업을 수행하는 프로세스 수
semaphore mutex = 1; // readcount에 대한 상호 배제를 위함
semaphore wrt = 1; // writer의 상호 배제
```

writer 프로세스는 다음과 같이 구현한다.

```c
do{
  // 데이터를 수정할 때 다른 프로세스가 데이터를 읽지 못하도록 한다.
  wait(wrt); // writer의 상호 배제
  ...
  /* write to the shared data */
  ...
  signal(wrt); // writer의 상호 배제 해제
  ...
  /* do other things */
  ...
}while(1);
```

reader 프로세스는 다음과 같이 구현한다. 누군가 자료를 읽고 있을 때는 wrt 세마포어를 이용해서 writer가 접근하지 못하도록 한다. 또한 이 방식대로라면 한번에 여러 reader도 프로세스에 접근할 수 있다.

```c
do{
  wait(mutex); // readcount에 대한 상호 배제
  readcount++;
  if(readcount == 1) // 지금 이 프로세스가 임계 구역에 진입하는 첫 프로세스라면
    wait(wrt); // writer의 상호 배제
  signal(mutex); // readcount에 대한 상호 배제 해제
  ...
  /* read from the shared data */
  ...
  wait(mutex); // readcount에 대한 상호 배제
  readcount--;
  // 지금 읽기를 종료하는 프로세스가 공유 데이터를 읽고 있던 마지막 프로세스라면
  if(readcount == 0)
    signal(wrt); // writer의 상호 배제 해제
  signal(mutex); // readcount에 대한 상호 배제 해제
  ...
  /* do other things */
  ...
}while(1);
```

이 방법의 문제는 reader 프로세스가 계속 생성될 경우 writer 프로세스가 starvation에 시달릴 수 있다는 것이다.

# 3. 식사하는 철학자들

![dining](./dining.png)

유명한 문제다. 하지만 시간 부족으로 일단 시험에서 더 중요한 다음 부분부터 정리한다..
