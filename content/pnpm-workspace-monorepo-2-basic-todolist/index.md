---
title: 장난감 모노레포 삽질기 - 2. 기초적인 TodoList로 모노레포 맛보기
date: "2024-12-04:00:00Z"
description: "pnpm workspace로 장난감 모노레포를 세팅해보자."
tags: ["web", "study"]
---

# 이 글은 작성 중입니다.

# 시작

[이전 글에서는 pnpm workspace를 이용하여 모노레포의 정말 기초적인 세팅을 진행해보았다.](https://witch.work/posts/pnpm-workspace-monorepo-1-setting) 이 글에서는 TodoList를 구현해 보고 모노레포를 활용하는 방법을 알아보도록 하겠다.

모노레포를 사용해서 좋은 점이 무엇인가? 물론 많이 댈 수 있겠지만 하나로 요약한다면 결국 여러 프로젝트를 한 번에 관리하고 프로젝트 간 공유하는 코드도 쉽게 관리할 수 있다는 것이다. 따라서 이 글에서는 TodoList를 다음과 같은 부분들과 함께 구현해보려고 한다.

- 기본적인 TodoList 구현
- 공유 폴더 모듈 제대로 구현하기
- API 문서화 및 타입 자동 생성
- 테스트
- 배포 파이프라인 구성

# TodoList 구현

기본적인 TodoList의 기능을 구현할 것이다. 

## API 설계

현재 prisma 데이터 모델은 다음과 같이 짜여 있다. User와 Todo 모델이 있으며 User는 여러 Todo를 가질 수 있다.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username     String   @unique
  password  String
  todos     Todo[]   // 1:N 관계 - 한 회원이 여러 할 일을 가질 수 있음
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false) // 기본값은 완료되지 않음
  userId    Int      // User와의 관계를 나타내는 외래 키
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

애플리케이션의 사용자가 있고 각 사용자는 할 일을 가질 수 있는 기본적인 구조다. 사용자가 로그인을 하면 해당 사용자의 할 일 목록을 볼 수 있고, 할 일을 추가하거나 수정, 삭제할 수 있는 애플리케이션이 될 것이다.

하지만 로그인, 사용자 인증 등의 기능은 그 자체로 복잡해서 다음 글에서 다룰 예정이다. 따라서 이 글에서는 사용자 관련해서는 최소한의 기능만 구현하도록 하고 TodoList에 집중하도록 하겠다.

따라서 이 글에서는 다음과 같이 todo list에 대한 API만 만들 것이다. 사용자 관련 API는 다음 글에서 온전히 다루고, 여기서는 seed 데이터로 미리 생성해둔 사용자 정보만 쓸 것이다.

- POST `/todos`: 할 일 생성
- GET `/todos?userId=1`: 쿼리스트링으로 받은 userId에 해당하는 사용자의 할 일 목록 조회
- PATCH `/todos/:todoId`: 할 일 수정
- DELETE `/todos/:todoId`: 할 일 삭제

## 데이터베이스 시드 넣기

먼저 사용자를 생성할 시드 파일을 만들자. `pnpm prisma migrate dev`를 앞서 실행해 놓았다면 prisma 폴더가 마이그레이션 파일이 든 채로 생성되어 있을 것이다. `prisma/seed.ts` 파일을 만들고 다음과 같이 사용자를 생성하는 코드를 작성하였다.

```typescript
// apps/todo-server/prisma/seed.ts
const prisma = new PrismaClient();

async function main() {
	// User 데이터 생성
	const user1 = await prisma.user.create({
		data: {
			username: "user1",
			password: "password123", // 실제 서비스에서는 해시된 비밀번호 사용
			todos: {
				create: [{ title: "공부하기" }, { title: "책 읽기", completed: true }],
			},
		},
	});

	const user2 = await prisma.user.create({
		data: {
			username: "user2",
			password: "password456",
			todos: {
				create: [{ title: "운동하기" }, { title: "발표 자료 준비" }],
			},
		},
	});

	console.log("시드 데이터 생성 완료:", { user1, user2 });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
```

이제 이 시드 파일을 실행하여 사용자와 할 일 데이터를 생성하자. 다음과 같이 seeding 커맨드를 package.json에 추가하고 실행하면 된다.

```json
// apps/todo-server/package.json
{
  "scripts": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```shell
pnpm prisma db seed
```

그럼 시드 파일에 들어 있는 사용자와 각 사용자의 할 일 데이터가 DB에 들어간다.

## Prisma 연동

prisma를 사용할 Nest.js 서버를 만들어보자. 먼저 서버 폴더에 prisma client를 설치한다.

```shell
pnpm add @prisma/client
```

prisma client를 관리할 서비스를 만들어보자. `src/prisma.service.ts` 파일을 만들고 다음과 같이 prisma client를 연결하는 코드를 작성한다.

```typescript
// apps/todo-server/src/prisma.service.ts
import { Injectable, type OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect();
	}
}
```

이 서비스를 모듈에 프로바이더로 주입하면 모듈의 다른 곳에서 prisma client를 사용할 수 있다. 이를 사용할 모듈을 만들어 주자. Nest에서는 CRUD를 위한 컨트롤러, 서비스, DTO, 엔티티를 한 번에 만들어주는 명령어가 있다. 이를 이용하여 우리가 사용할 Todo 모듈을 만들어 보자.

```shell
# --no-spec 옵션을 주면 테스트 파일을 생성하지 않음
nest generate resource todos --no-spec
```

이 명령어를 실행하면 `src/todos` 폴더가 생성되고 그 안에 컨트롤러, 서비스, 모듈, DTO, 엔티티 폴더까지 생성된다. 만들어진 모듈에 앞서 만든 `PrismaService`를 주입하여 서비스를 이용해 prisma client를 사용할 수 있도록 하자. `src/todos/todos.module.ts` 파일을 열어 다음과 같이 수정한다.

```typescript
// import문은 생략
// apps/todo-server/src/todos/todos.module.ts
@Module({
	controllers: [TodosController],
	providers: [PrismaService, TodosService],
})
export class TodosModule {}
```

prisma와의 연결을 위한 다른 방법도 있다. `prisma.module.ts`를 만들어서 prisma를 사용할 수 있는 기능을 모듈로 감싸는 것이다. 다른 모듈에서 `imports`에 추가하여 사용하거나 `@Global`을 사용하여 전역으로 사용하면 된다.

그렇게 하면 관리도 쉬워지고 prisma를 사용하는 기능이 명확히 분리되는 등의 장점이 있다. 그러나 그렇게 큰 프로젝트가 아니고 이후 전환할 수도 있기 때문에 여기서는 생략하고 `PrismaService`를 직접 사용하도록 하겠다.

## Nest.js로 API 구현

todo를 관리하기 위한 서비스 메서드들을 구현하도록 하자. `src/todos/todos.service.ts` 파일을 열어 다음과 같이 서비스를 구현한다. `PrismaService`를 주입해서 prisma client를 사용하였고 todo에 대한 CRUD 그리고 사용자 id를 받아서 해당 사용자의 todo 목록을 조회하는 메서드를 구현했다. 타입은 일단 Prisma에서 생성한 타입을 사용하였다.

```typescript
@Injectable()
export class TodosService {
	constructor(private prisma: PrismaService) {}

	createTodo(data: Prisma.TodoCreateInput) {
		return this.prisma.todo.create({ data });
	}

	findTodosByUser(userId: number) {
		return this.prisma.todo.findMany({
			where: {
				userId,
			},
		});
	}

	findTodo(todoId: number) {
		return this.prisma.todo.findUnique({
			where: {
				id: todoId,
			},
		});
	}

	updateTodo(todoId: number, updateData: Prisma.TodoUpdateInput) {
		return this.prisma.todo.update({
			where: {
				id: todoId,
			},
			data: updateData,
		});
	}

	removeTodo(todoId: number) {
		return this.prisma.todo.delete({
			where: {
				id: todoId,
			},
		});
	}
}
```

이제 `/todos`로 시작하는 주소의 요청을 처리할 컨트롤러를 만들어보자. 다만 그전에 컨트롤러 입력을 검증하거나 변환할 때 Nest.js의 [Pipe](https://docs.nestjs.com/pipes)를 사용할 것인데 이를 위한 라이브러리들을 설치하자.

```shell
pnpm back add class-validator class-transformer
```

그리고 `src/todos/todos.controller.ts` 파일을 열어 다음과 같이 컨트롤러를 구현한다. `@Get`, `@Post`, `@Patch`, `@Delete` 데코레이터를 이용하여 각각의 요청을 처리하는 메서드를 구현하였다.

```typescript
@Controller("todos")
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post()
	createTodo(@Body() createTodoDto: Prisma.TodoCreateInput) {
		return this.todosService.createTodo(createTodoDto);
	}

	@Get()
	findTodo(@Query("userId", ParseIntPipe) userId: number) {
		console.log(userId);
		return this.todosService.findTodosByUser(userId);
	}

	@Patch(":todoId")
	updateTodo(
		@Param("todoId", ParseIntPipe) todoId: number,
		@Body() updateTodoDto: Prisma.TodoUpdateInput,
	) {
		return this.todosService.updateTodo(todoId, updateTodoDto);
	}

	@Delete(":todoId")
	removeTodo(@Param("todoId", ParseIntPipe) todoId: number) {
		return this.todosService.removeTodo(todoId);
	}
}
```

Postman 등을 이용해서 각 요청을 테스트해볼 수 있다. 이제 TodoList에 대한 기본적인 CRUD API가 구현되었다.

## TodoList 프론트엔드

todo-client 폴더에 클라이언트를 구현할 것이다. 이전 글에서 Vite의 react-ts 템플릿을 사용해 프로젝트를 만들어놓았다. 기본적인 로그인 페이지, 회원가입 페이지, 할 일 목록 페이지를 만들 것이다. 먼저 페이지 라우팅을 위해 `react-router`를, http 요청을 위해 `axios`를 설치하자.

```shell
# 이전 글에서 만든 todo-client 폴더에 대해 실행
pnpm front add react-router axios
```

`src` 폴더에 `pages` 폴더를 만들고 그 안에 `App.tsx`, `Login.tsx`, `Register.tsx` 파일을 만들어 각 페이지를 구현하였다. 전체 UI 코드는 [레포지토리의 `apps/todo-client/src` 폴더](https://github.com/witch-factory/toy-project-monorepo/tree/main/apps/todo-client/src)에서 확인할 수 있다. 중요한 부분만 간략히 살펴보자.

먼저 `baseURL`을 설정한 axios 인스턴스를 만들어서 사용하였다. 이를 이용하여 각 요청을 보내고 받을 수 있다. 이후 서버를 배포하더라도 이 `baseURL`만 변경하면 되기 때문에 편리하다.

```typescript
// apps/todo-client/src/api.ts
export const todoAPI = axios.create({
	baseURL: "http://localhost:3000",
});
```

다음과 같은 식으로 API를 호출하고 데이터를 받아오는 함수를 작성했다. 이는 `App.tsx`에서 사용한 todo 목록을 받아오는 함수이다. `userId`는 현재는 고정값이지만 이후에 로그인 시스템을 만들면서 현재 로그인된 사용자의 ID로 대체할 예정이다.

```typescript
// 현재는 하나의 사용자만을 대상으로 하기 때문에 고정값
// 이후에 로그인 시스템을 만들면서 현재 로그인된 사용자의 ID로 대체할 예정
const userId = 1;

const fetchTodos = useCallback(async () => {
  if (!userId) return;
  try {
    const response = await todoAPI.get(`/todos?userId=${userId}`);
    setTodos(response.data);
  } catch (error) {
    console.error("할 일 목록 조회 실패:", error);
  }
}, []);
```

이외에도 Todo list의 각 항목을 수정하거나 삭제하는 함수도 작성하고 페이지에서 사용하였다. 이렇게 하여 TodoList의 기본적인 기능을 구현하였다. 구체적인 코드는 위의 레포지토리 링크에서 확인할 수 있다.

이렇게 프론트엔드와 연동했을 때 주의할 점이 있는데 바로 CORS 문제다. Nest.js 서버에서는 기본적으로 CORS를 허용하지 않기 때문에 클라이언트에서 서버로 요청을 보낼 때 CORS 에러가 발생할 수 있다. 이를 해결하기 위해 서버에서 CORS를 허용하도록 설정해주자. 서버의 `main.ts` 파일을 열어 프론트엔드의 주소를 cors 설정에 추가하면 된다.

```typescript
// apps/todo-server/src/main.ts
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "http://localhost:5173",
	});
  // 기타 코드 생략

	await app.listen(3000);
}
bootstrap();
```

그러면 CSS를 거의 사용하지 않았기에 디자인은 별로지만 기능은 DB와 연동되어 정상적으로 동작하는 TodoList가 다음과 같이 만들어진다.

![todo list 이미지](./todolist-basic-client.png)

# API 문서화 및 타입 자동 생성

모노레포를 만들고자 한 이유는 타입을 공유하기 위해서였다. 이를 위해서는 여러 가지 방법이 있겠지만 여기서는 먼저 swagger를 이용해서 API 문서를 생성하고, 이를 이용하여 타입을 생성하는 방법을 알아보도록 하겠다. 이렇게 타입을 공유하는 것에 대해서는 [FEConf 2020, OpenAPI Specification으로 타입-세이프하게 API 개발하기: 희망편 VS 절망편](https://www.youtube.com/watch?v=J4JHLESAiFk) 등을 참고했다.

## API 문서 생성 설정

Nest.js에서는 swagger를 이용하여 OpenAPI 사양을 따르는 API 문서를 생성할 수 있다. 방법에 대해서는 Nest.js의 공식 문서를 보면 친절한 설명이 나와있어서 따라하였다. 먼저 `@nestjs/swagger` 패키지를 설치하자.

```shell
pnpm back add @nestjs/swagger
```

그리고 서버 폴더의 `main.ts`에 있는 bootstrap 함수에 다음과 같이 swagger를 설정한다.

```typescript
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "http://localhost:5173",
	});

	// Swagger 설정
	const config = new DocumentBuilder()
		.setTitle("Todo API")
		.setDescription("Todo CRUD API documentation")
		.setVersion("1.0")
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api-docs", app, documentFactory);

	await app.listen(3000);
}
bootstrap();
```

이렇게 한 후 서버를 실행하고(`pnpm run start` 등의 스크립트 실행) `http://localhost:3000/api-docs`로 접속하면 Swagger UI가 나타난다. 여기서 api 문서를 확인할 수 있다. 앞서 만들었던 컨트롤러의 엔드포인트들이 나타나는 것을 확인할 수 있고 각 엔드포인트를 직접 테스트해볼 수도 있다.

그리고 이후에 swagger를 더 편하게 사용할 수 있도록 해주는 `@nestjs/swagger` 플러그인을 활성화하자. dto 클래스의 속성을 swagger 문서에 표시하기 위해 사용해야 하는 `@ApiProperty` 데코레이터를 자동으로 붙여주고 주석을 분석하여 API dto나 엔드포인트에 대한 설명을 붙여주는 등 여러 편의를 제공한다. 제공하는 모든 기능은 [Nest.js OpenAPI CLI Plugin 공식 문서](https://docs.nestjs.com/openapi/cli-plugin)를 참고할 수 있다.

여기서는 특별한 옵션 설정 없이 플러그인을 그대로 사용하겠다. 프로젝트는 Nest CLI로 생성되었으므로 서버 폴더 루트에는 `nest-cli.json`이 있고 여기에 플러그인을 추가하면 된다. 다음과 같이 추가하자.

```json
// apps/todo-server/nest-cli.json
{
	"$schema": "https://json.schemastore.org/nest-cli",
	"collection": "@nestjs/schematics",
	"sourceRoot": "src",
	"compilerOptions": {
		"plugins": ["@nestjs/swagger"]
	}
}
```

## 요청 검증과 변환

그런데 아직 문제가 있다. 요청을 보낼 때 요청의 형식이나 데이터 타입을 검증하고 있지 않다. 이런 작업은 Nest.js의 파이프를 통해서 할 수 있는데 이 섹션에서는 이걸 해보도록 하겠다.

앞서 API를 만들면서 몇 가지 처리를 하기는 했다. 예를 들어 `GET /todos?userId=#`의 컨트롤러를 만들 때는 `userId` 쿼리에 대해서 정수 변환을 하는 `ParseIntPipe`를 사용하였었다.

```typescript
// apps/todo-server/src/todos/todos.controller.ts
@Controller("todos")
export class TodosController {
	constructor(private readonly todosService: TodosService) {}
  // ...

	@Get()
	findTodo(@Query("userId", ParseIntPipe) userId: number) {
		return this.todosService.findTodosByUser(userId);
	}

  // ...
}
```

하지만 여전히 검증이나 요청 데이터 변환이 필요한 부분이 많이 있다. 예를 들어 지금은 `POST /todos`의 요청을 보낼 때 `userId`가 문자열 형식이라도 요청이 성공하고, DB에 삽입하는 과정에 다다라서야 오류가 발생한다. `title`이 빈 문자열인 경우에는 상식적으로 생각했을 때 정상적인 todo가 아니지만 요청도 성공하고 DB 삽입까지도 된다. 이런 검증/변환 작업을 파이프를 통해 할 수 있다.

앞서 `class-transformer`와 `class-validator`를 설치하였다. 이를 이용하여 요청 데이터를 변환하고 검증하는 파이프를 만들어보자. 먼저 DTO를 작성하자. 앞서 `nest g resource`를 사용해서 CRUD 보일러플레이트를 만들었기 때문에 `src/todos/dto/create-todo.dto.ts`파일은 이미 생성되어 있을 것이다(같은 경로에 `update-todo.dto.ts`도 있다). 이 파일을 열어 다음과 같이 작성하자. prisma에서 작성한 스키마와 거의 비슷하다.

```typescript
// apps/todo-server/src/todos/dto/create-todo.dto.ts
export class CreateTodoDto {
	title: string;
	completed: boolean;
	userId: number;
}
```

이제 앞서 `Prisma.TodoCreateInput` 타입을 사용했던 부분을 `CreateTodoDto`로 대체하자. 타입과 달리 dto 클래스는 런타임에도 사라지지 않기 때문에 런타임의 값 검증에 사용할 수 있다. 따라서 `class-transformer`, `class-validator`에서 제공하는 데코레이터를 이용하여 `CreateTodoDto`의 검증/변환 규칙을 만들어보자. 나는 다음과 같이 작성하였다.

```typescript
// apps/todo-server/src/todos/dto/create-todo.dto.ts
import {
	IsString,
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsOptional,
} from "class-validator";
import { Transform, Type } from "class-transformer";

export class CreateTodoDto {
	@IsString()
	@IsNotEmpty({ message: "Title은 비워둘 수 없습니다." })
	title: string;

	@IsOptional()
	@IsBoolean({ message: "Completed는 true 또는 false여야 합니다." })
	@Transform(({ value }) => value === "true" || value === true) // 'true' 문자열도 boolean으로 변환
	completed: boolean;

	@IsInt({ message: "UserId는 정수여야 합니다." })
	@Type(() => Number) // 숫자로 변환
	userId: number;
}
```

`IsString`등 굳이 설명하지 않아도 직관적인 이름의 데코레이터들이다. 이제 컨트롤러에 요청을 검증하고 변환하는 파이프를 달아주면 된다. `UsePipes` 데코레이터를 이용하여 파이프를 사용할 수 있다. 우리는 데이터의 변환도 처리할 것이므로 `ValidationPipe`에 `transform` 옵션을 넘겨주어서 생성한 인스턴스를 사용한다.

파이프 인스턴스가 중복 생성되는 걸 막기 위해서는 따로 이를 처리하는 파이프 클래스를 만들고 클래스 자체를 `@UsePipes`에 넘겨주어야 하지만 여기서는 간단하게 처리하도록 하겠다. 앞서 설명한 대로 파이프를 사용하는 `createTodo` 컨트롤러 메서드는 다음과 같다.

```typescript
@Controller("todos")
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post()
	@UsePipes(new ValidationPipe({ transform: true }))
	createTodo(@Body() createTodoDto: CreateTodoDto) {
		console.log(createTodoDto);
		return this.todosService.createTodo(createTodoDto);
	}
  // ...
}
```

`TodosService` 클래스에서도 `Prisma.TodoCreateInput` 대신 `CreateTodoDto`를 사용하도록 수정하는 것을 잊지 말자.

이렇게 한 후 `create-todo.dto.ts` 파일에 작성한 규칙에 맞지 않는 요청을 보내면 요청이 실패하고 에러 메시지가 반환된다. 예를 들어 `title`을 빈 문자열로 보내면 다음과 같은 응답이 온다.

```json
{
    "message": [
        "Title은 비워둘 수 없습니다."
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

todo를 업데이트하는 컨트롤러에 대해서도 같은 작업을 한다. `UpdateTodoDto`를 만들고 이를 사용하여 요청을 검증하고 변환하는 파이프를 달아주는 것이다. 그런데 `create-todo.dto.ts`와 같은 경로에 있는 `update-todo.dto.ts`에 가보면 이미 다음과 같이 작성되어 있다.

```typescript
// apps/todo-server/src/todos/dto/update-todo.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateTodoDto } from "./create-todo.dto";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
```

따라서 todo 업데이트를 수행하는 컨트롤러와 서비스 메서드에서 `UpdateTodoDto`를 사용하도록 수정하고 `ValidationPipe`를 달아주면 된다. 이렇게 하면 요청을 검증하고 변환하는 파이프를 통해 요청을 처리할 수 있다. 다음과 같이 업데이트 메서드들을 수정한다.

```ts
// apps/todo-server/src/todos/todos.controller.ts
@Controller("todos")
export class TodosController {
	constructor(private readonly todosService: TodosService) {}
  // ...
	@Patch(":todoId")
  // 파이프가 요청을 검증하고 변환하도록 함
	@UsePipes(new ValidationPipe({ transform: true }))
	updateTodo(
		@Param("todoId", ParseIntPipe) todoId: number,
		@Body() updateTodoDto: UpdateTodoDto,
	) {
		return this.todosService.updateTodo(todoId, updateTodoDto);
	}
  // ...
}
```

```ts
// apps/todo-server/src/todos/todos.service.ts
@Injectable()
export class TodosService {
	constructor(private prisma: PrismaService) {}
  // ...

  // Prisma.TodoUpdateInput 대신 UpdateTodoDto를 사용
	updateTodo(todoId: number, updateData: UpdateTodoDto) {
		return this.prisma.todo.update({
			where: {
				id: todoId,
			},
			data: updateData,
		});
	}

  // ...
}
```

이렇게 하면 todo를 업데이트하는 경우에도 `title`이 빈 문자열인지 등의 조건에 대한 검증을 하게 된다.

여기서 하나 더 해야 하는 게 있다. `UpdateTodoDto`는 `CreateTodoDto`를 이용해 정의되었는데, `@nestjs/mapped-types`의 `PartialType`를 사용하면 이에 대한 swagger 문서가 제대로 생성되지 않는다. 실제로 swagger 문서(`localhost:3000/api-docs`)를 확인해보면 `UpdateTodoDto`에 대한 설명이 없는 것을 확인할 수 있다.

따라서 `@nestjs/swagger`의 `PartialType`을 사용하도록 바꿔주자. `update-todo.dto.ts` 파일을 다음과 같이 수정하자.

```ts
// apps/todo-server/src/todos/dto/update-todo.dto.ts
// PartialType import 경로 수정
import { PartialType } from "@nestjs/swagger";
import { CreateTodoDto } from "./create-todo.dto";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
```

이제 `UpdateTodoDto`에 대한 swagger 문서가 제대로 생성된다.

## 타입 자동 생성

TodoList를 만들었고, API 문서를 생성하고, 요청을 검증하고 변환하는 파이프를 만들었다. 이제 TodoList는 더 견고하게 작동하고, 사용자를 위한 문서도 갖췄다. 그런데 우리가 무엇을 하고 있었더라? 모노레포를 만들고 있었다.

왜 모노레포를 만들고 있었는가? 클라이언트와 서버 프로젝트 간에 공유하고 싶은 코드가 있었기 때문이다. 그 중 하나가 타입이다. 이제 이 타입을 자동으로 생성해보자.



## 문서 보강

`@ApiResponse` 등을 이용해 더 강력한 타입 생성하도록 설정, 엔티티도 정의



















# 타입 자동 생성

swagger-typescript-api에서 타입 생성 시 `--no-client` 옵션을 주면 API 호출을 위한 클라이언트 코드를 생성하지 않고 타입만 생성할 수 있다. 이를 이용하여 타입만 생성하고 이를 이용하여 API 호출을 할 것이다.




























# 공유 폴더 세팅하기

내가 모노레포를 사용하는 이유라고 할 수 있을, 클라이언트와 서버 간에 공유할 코드를 만들어 보자. 간략한 함수를 공유해보는 것으로 이 글의 세팅을 마치려고 한다.

## 폴더 세팅

공유 코드를 담을 libs 폴더를 만들고 그 안에 shared 폴더를 만들자. 그리고 shared 폴더를 독립적인 패키지로 만들자.

```shell
mkdir libs
cd libs
mkdir shared
cd shared
pnpm init -y # package.json 생성
```

다음과 같이 ts 컴파일을 감안해서 package.json 파일을 작성한다. 이 공유 폴더를 import해서 사용할 때는 `@toy-monorepo/shared`라는 이름으로 사용하기로 지정한다. 그리고 그렇게 import되어 사용되는 파일을 `dist` 폴더 파일로 지정하였다.

나는 cjs 모듈을 사용하지 않을 것이기에 이렇게 했지만 필요하다면 `exports` 필드를 사용하여 cjs 모듈도 지정할 수 있다. [CommonJS와 ESM에 모두 대응하는 라이브러리 개발하기: exports field](https://toss.tech/article/commonjs-esm-exports-field)를 참고하자.

```json
// libs/shared/package.json
{
	"name": "@toy-monorepo/shared",
	"version": "1.0.0",
	"description": "",
	"main": "./dist/index.js",
	"module": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": "./dist/index.js",
			"types": "./dist/index.d.ts"
		}
	},
	"scripts": {
		"build": "tsc",
		"dev": "tsc -w"
	}
}
```

tsconfig.json도 작성하자. `.d.ts` 파일을 사용해야 하기 때문에 `declaration` 관련 옵션을 true로 설정한다.

```json
// libs/shared/tsconfig.json
{
	"extends": "../../tsconfig.json",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src",
		"declaration": true, // .d.ts 파일 생성
		"declarationMap": true, // 소스맵 생성 (선택사항)
		"declarationDir": "./dist" // .d.ts 파일이 생성될 위치
	},
	"include": ["src"],
	"exclude": ["node_modules", "dist"]
}
```

이렇게 하면 공유할 코드 파일을 만든 후 `pnpm build`를 shared 폴더에서 실행하면 dist 폴더가 생성되고 그 안에 index.js와 index.d.ts 파일이 생성된다.


# 참고

pnpm과 함께하는 Frontend 모노레포 세팅

https://jasonkang14.github.io/react/monorepo-with-pnpm

react router docs

https://reactrouter.com/start/library/routing

Nest.js docs, Prisma

https://docs.nestjs.com/recipes/prisma

Nest.js docs, Authentication

https://docs.nestjs.com/security/authentication

Nest.js docs, OpenAPI 섹션

https://docs.nestjs.com/openapi/introduction

Monorepo 도입기

https://medium.com/@june.programmer/repository-monorepo-%EB%8F%84%EC%9E%85%EA%B8%B0-3eeea7027119

Building a REST API with NestJS and Prisma

https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0

prisma docs, Seeding

https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

FEConf 2020, OpenAPI Specification으로 타입-세이프하게 API 개발하기: 희망편 VS 절망편

https://www.youtube.com/watch?v=J4JHLESAiFk












pnpm을 이용한 모노레포 마이그레이션

https://doyu-l.tistory.com/646

프론트엔드 모노레포 구축 삽질기 (1) - 도입 이유, yarn workspaces, berry

https://9yujin.tistory.com/100

모노리포에서 Prisma 사용하기

https://0916dhkim.medium.com/%EB%AA%A8%EB%85%B8%EB%A6%AC%ED%8F%AC%EC%97%90%EC%84%9C-prisma-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-fb811c189997

pnpm으로 모노레포 환경 구축하기

https://bepyan.github.io/blog/dev-setting/pnpm-monorepo

Biome Getting Started

https://biomejs.dev/guides/getting-started/

nestjs prisma 세팅 공식 문서

https://docs.nestjs.com/recipes/prisma

CommonJS와 ESM에 모두 대응하는 라이브러리 개발하기: exports field

https://toss.tech/article/commonjs-esm-exports-field