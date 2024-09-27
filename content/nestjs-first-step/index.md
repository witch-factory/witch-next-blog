---
title: NestJS 처음 시작하기
date: "2024-09-08T00:00:00Z"
description: "John Ahn 님의 강의를 듣고 NestJS를 처음 시작해보자"
tags: ["nestjs", "study"]
---

# Nestjs

nest는 개발자들이 testable, scalable, loosely coupled, easily maintainable 애플리케이션을 만들 수 있게 해주는 아키텍처를 제공하는 프레임워크

nestjs 클라이언트 설치

```bash
npm i -g @nestjs/cli
```

nest cli로 프로젝트 생성, 서비스 생성 등 다 가능

프로젝트 생성

```bash
nest new project-name
# --strict 플래그를 주면 strict 모드로 프로젝트 생성
```

nest 앱은 NestFactory를 사용. 이 객체는 앱 인스턴스를 생성하는 정적 메서드를 제공한다. create는 `INestApplication` 인스턴스를 반환. `app.listen`으로 인바운드 HTTP 요청을 받는다.

이렇게 만들어진 프로젝트 구조는 각 모듈을 전용 디렉토리에 넣는 컨벤션을 따르도록 개발자에게 권장한다.

이렇게 완료되면 `npm run start`로 앱 시작. swc 빌더 쓰려면 플래그를 써서 `npm run start -- -b swc` 혹은 개발 모드로 `npm run start:dev`

## 컨트롤러

컨트롤러는 들어오는 요청을 처리하고 클라이언트에 응답을 반환하는 역할. `@Controller` 데코레이터가 붙은 클래스로 정의

`@Controller("boards")` 데코레이터는 이 컨트롤러가 boards 엔드포인트를 처리한다고 지정한다. 

그리고 해당 컨트롤러 클래스 내부에 `@Get()`, `@Post` 등 HTTP 메서드 핸들러 데코레이터가 붙은 메서드를 만들어서 해당 엔드포인트에 대한 로직을 구현. 어떤 요청을 어떤 컨트롤러가 받을지는 라우팅 메커니즘이 결정.

API를 쏘면 알맞은 엔드포인트 컨트롤러에서 요청을 처리. 그리고 해당 컨트롤러에서 서비스로 로직을 넘겨서 처리하고 결과를 반환

컨트롤러도 마찬가지로 명령어로 생성 가능

```bash
# g는 generate의 약자
# --no-spec은 테스트 코드를 생성하지 않겠다는 옵션
nest g controller boards --no-spec
```

그러면 controller 파일이 생성되고 `.module.ts` 파일에도 자동으로 추가된다.

cli가 먼저 boards 폴더를 찾고, 컨트롤러 파일을 생성하고 module 파일을 찾아서 컨트롤러를 추가한 것이다.

내장 validation(pipe)가 있는 CRUD 컨트롤러를 만들려면 `nest g resource [name]`을 터미널에 입력하면 `name`에 해당하는 모듈, 컨트롤러, 서비스, 엔티티, dto 등이 만들어진다.



## 모듈

nestjs 모듈은?

우리가 만드는 게시판에는 AppModule 안에 BoardModule, AuthModule이 있다.

이때 모듈이란 `@Module` 데코레이터가 붙은 클래스를 말한다. 이 데코레이터는 nest가 앱 구조를 구성하는 데 쓰는 메타데이터를 제공한다.

모듈은 무조건 하나 이상 있어야 한다. 루트 모듈에서 앱을 시작.

모듈은 밀접하게 관련된 기능 집합으로 구성. 모듈은 기본적으로 싱글톤이다. 따라서 인스턴스를 모두 공유 가능

모듈 생성은 명령어로 생성 가능. 예를 들어 이렇게 하면 boards 모듈을 생성할 수 있고 app.module.ts에도 자동으로 추가된다.

```bash
nest g module boards
```



## 프로바이더

대부분의 기본 nest 클래스는 서비스, 리포지토리, 팩토리 등 프로바이더로 취급될 수 있다. 프로바이더는 종속성으로 주입할 수 있다. 즉 객체는 서로 다양한 관계를 만들 수 있다.

예를 들어 컨트롤러에서 필요한 것들이 많은데 이렇게 필요한 기능들을 서비스, 팩토리 등으로 만들어서 컨트롤러에 주입할 수 있다.

## 서비스

소프트웨어 개발 내의 공통 개념. `@Injectable` 데코레이터로 감싸져 모듈에 제공됨. 이렇게 한 서비스 인스턴스는 앱 전체에서 사용될 수 있다.

데이터 체크, 아이템 생성 등의 작업을 처리

그럼 서비스를 컨트롤러에서 사용하려면? 서비스를 컨트롤러에 종속성 주입을 해야 한다.

생성자에 service를 private로 주입하고 서비스 안의 메서드를 사용하면 된다.

## 프로바이더 등록

Provider(서비스, 레포지토리...)를 사용하려면 nest에 등록해 줘야 한다. 이건 module 파일에서 할수 있다. 모듈 파일 providers 배열에 등록하면 된다.

## 서비스 만들기

역시 명령어로 생성 가능. `.service.ts` 파일이 생성되고 module 파일에도 자동으로 추가된다.

```bash
nest g service boards --no-spec
```

이렇게 생성된 파일에는 `@Injectable()` 데코레이터가 붙어 있다. 이를 통해서 nest는 다른 컴포넌트에서 이 서비스를 주입할 수 있다.

클라에서 요청 -> 컨트롤러로 -> 컨트롤러에서 알맞은 요청 경로에 라우팅해서 해당 핸들러로 -> 요청 처리를 위해 서비스로 -> 서비스에서 로직 처리 -> 결과를 컨트롤러로 반환

## 모델

객체의 구조를 나타내는 모델은 `.model.ts` 파일로 만들어진다. 이 파일은 데이터베이스와 통신하거나 데이터를 다루는 데 사용된다. class나 interface로 만들어진다.

## 요청 body

Nestjs에서 req.body를 어떻게 받을까? `@Body()` 데코레이터를 사용하면 된다. 이 데코레이터는 컨트롤러 메서드의 인자로 사용된다. `@Body("title") title`과 같이 하나씩 가져올 수도 있기는 하다.

```typescript
@Post()
create(@Body() body) {
  return body;
}
```

비슷하게 `@Param()`, `@Query()` 데코레이터도 있다. `@Param`은 url 파라미터를 가져올 때 사용하고, `@Query`는 쿼리스트링을 가져올 때 사용한다.

```typescript
// 이런 식으로 쓴다
@Param() params:string[]
@Param('id') id: string
@Query() query: string
@Query(key?: string) query: string
```

## DTO

DTO(Data Transfer Object)는 데이터 전송 객체로, 계층 간에 데이터 교환을 위한 객체. 또한 DTO는 데이터가 네트워크를 통해 전송되는 방법도 정의.

nest에서 interface, class로 DTO를 만들어서 사용할 수 있는데 nest에서는 class를 권장한다.

DTO를 사용하면 데이터 유효성을 검증하고 코드를 안정적으로 만들어 준다.

## 파이프

파이프는 `@Injectable` 데코레이터가 달린 클래스다. 파이프는 데이터 변환, 유효성 검사를 한다.

컨트롤러 인수에 대해 작동하며, 메서드 호출 직전에 nest가 파이프를 삽입하며, 파이프는 메서드 인수를 수신하여 작동한다. 성공시 메서드가 호출되고, 실패시 예외가 발생한다.

- 핸들러 레벨 파이프

핸들러 레벨에서 `@UsePipes()` 데코레이터를 사용하여 파이프를 적용할 수 있다. 이걸 쓰면 모든 파라미터에 적용된다.

- 파라미터 레벨 파이프

특정 파라미터에 적용. `@Body`, `@Param`, `@Query` 데코레이터에 파이프를 적용할 수 있다. 데코레이터 2번째 인수로 제공한다.

- 글로벌 레벨 파이프

들어오는 모든 요청에 적용되며 `app.useGlobalPipes()` 메서드를 사용하여 적용할 수 있다.

nest의 내장 파이프들은 6개 있는데 다음과 같다.

- ValidationPipe
- ParseIntPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- DefaultValuePipe

예를 들어 ParseIntPipe를 사용하면 숫자로 변환해주는데 여기서 문자열을 받거나 하면 에러를 발생시킨다.

## 파이프 사용

파이프 사용을 위해 class-validator와 class-transformer를 설치해야 한다.

```bash
npm i class-validator class-transformer
```

## 예외 필터

에러 표출을 위해서는 예외 인스턴스를 사용하자. `NotFoundException`, `BadRequestException` 등이 있다.

## 커스텀 파이프

파이프를 커스텀하게 만들 수 있다. `PipeTransform` 인터페이스를 구현하면 된다. 이 인터페이스는 모든 파이프에서 구현해 줘야 하는 인터페이스다.

`transform` 구현해 줘야 함. 처리된 인자의 값(value)과 인자에 대한 메타데이터를 포함한 객체를 받는 메서드. 여기서 리턴된 값은 라우트 핸들러로 전달. 예외는 바로 클라에 던짐

## ORM

ORM : Object Relational Mapping. 객체와 관계형 데이터베이스의 데이터를 자동으로 변형/연결하는 작업. 객체와 DB 변형에 유연하게 사용 가능

typeorm은 node에서 실행되고 ts로 작성된 ORM

모델에서 테이블 자동 생성, 개체 crud 작업, 테이블간 매핑 만듬. 간단한 cli 명령 제공. 다른 모듈과의 통합 쉬움

## 엔티티

원래 ORM 없이 DB 테이블을 생성할 땐 CREATE TABLE 명령 사용

그런데 ORM을 생성할 땐 class를 생성하고 그걸 기반으로 ORM이 테이블을 생성

`@Entity`가 붙은 클래스는 엔티티로 인식. 이 클래스는 데이터베이스 테이블과 매핑

`@PrimaryGeneratedColumn()`은 기본키(primary key)를 생성하고, `@Column()`은 컬럼을 생성

## 리포지토리

엔티티 개체와 상호작용하여 crud 처리

컨트롤러에서 API 요청 받음 -> 로직은 서비스에서 담당 -> 레포지토리에서 데이터베이스와 상호작용(리포지토리 패턴)

DB 관련 일은 레포지토리에서 처리

리포지토리 파일 생성 -> 리포지토리 클래스 생성

엔티티와 리포지토리를 연결하려면 `@EntityRepository()` 데코레이터를 사용. 이 데코레이터를 쓰면 특정 엔티티를 관리하는 클래스가 이 리포지토리 클래스라고 알려주는 것.
(근데 이거 deprecated됨)

그리고 리포지토리는 `Repository<Entity>`를 상속받아야 함.

module 파일에서 import 필요

서비스에 리포지토리를 넣어줄 땐 `@InjectRepository()` 데코레이터를 사용

DTO를 이용해서 레이어 간에 소통. 가령 게시글 생성이면 `CreateBoardDto` 이런 걸 만들어서 사용한다.

## typeorm remove vs delete

remove는 존재하는 아이템을 지워야. delete는 존재하면 지우고 없으면 영향 없음. remove를 사용하면 1번 삭제할 때 조회 + 삭제를 해야 하므로 DB 접근 1번이면 되면 delete를 사용

# 인증 기능 구현

모듈, 컨트롤러, 서비스 생성은 cli로 가능. `--no-spec` 옵션은 테스트 코드를 생성하지 않겠다는 옵션

```bash
nest g module auth
nest g controller auth --no-spec
nest g service auth --no-spec
```