---
title: 장난감 모노레포 삽질기 - 1. 초기 세팅하기
date: "2024-11-24T00:00:00Z"
description: "pnpm workspace로 장난감 모노레포를 세팅해보자."
tags: ["web", "study"]
---

# 시작

사이드 프로젝트에서 모노레포를 구축하기로 했다. 그러면서 기존에 나눠져 있던 코드를 하나로 합치고 공유할 수 있는 코드는 공유하려는 의도였다. 물론 공유할 수 있는 코드를 패키지로 만들어 관리할 수도 있었다. 하지만 그렇게 협업자가 많지도 않았고, 예전부터 모노레포를 구축해 보고 싶었기 때문에 한번 시도해 보기로 했다.

그런데 모노레포에 익숙한 팀원이 없다 보니 쉽지 않았다. 인터넷에 좋은 자료가 많았지만 이미 꽤나 진행된 프로젝트들에 바로 그대로 적용하기에는 어려움이 있었다. 오류도 많았고 돌아가더라도 제대로 돌아가는지 알 수 없었다. 각종 지식과 구조를 확실하게 파악하지 못한 상태에서 무언가를 하는 건 어려웠다.

그래서 모노레포를 좀더 확실히 익히고자 프로젝트에 필요한 부분들을 간략히 모방한 장난감 모노레포를 만들어 보기로 했다. 다음과 같은 것들을 기회가 닿는 대로 다루어 보고자 한다. 그리고 이 글에서는 가장 처음인 초기 세팅에 대해서 다룰 것이다.

- **(이 글에서 다룰 내용)** pnpm workspace를 이용한 프론트 + 백엔드 모노레포 세팅
- swagger를 이용한 API 문서화
- swagger-typegen이나 nestia 등의 라이브러리를 이용한 타입 자동 생성
- JWT를 이용한 사용자 인증/인가
- jest나 vitest, 혹은 다른 테스팅 라이브러리를 이용한 테스트 코드 작성
- 배포 파이프라인 구축

# 계획

이 글에서는 React 클라이언트, NestJS + Prisma 서버, MySQL DB를 사용하는 모노레포를 구축한다. 프로젝트를 만들고, 각 프로젝트의 기본적인 세팅을 한 후 모노레포의 목적이라고 할 수 있는 공유 코드를 만들어 보겠다. 여기서 요구하는 구조와 사용하는 기술 스택은 내가 하고 있는 사이드 프로젝트와 거의 같다.

모노레포 관리는 pnpm workspace만 사용할 것이다. Nx, 터보레포 같은 관리 툴을 붙여서 시작할 수도 있다. 하지만 최소한의 도구로 시작해 보고 싶었다. 게다가 프로젝트의 수가 많지 않을 것이기에 모노레포 툴들이 제공하는 증분 빌드라든지 캐싱과 같은 편의 기능들이 크게 필요해 보이지도 않았다.

다만 이후 모노레포 관리 툴을 쓸지도 모르기 때문에 이를 고려하여 yarn workspace보다는 모노레포 관리 툴들이 좀 더 잘 호환되는 것 같은 pnpm workspace를 사용하는 결정을 내렸다. 그럼 시작해보자.

# 폴더 구조 설계

먼저 폴더 구조를 설계해야 한다. 모노레포 툴을 쓰지는 않지만 폴더 구조는 [Nx 문서](https://nx.dev/concepts/decisions/folder-structure)에 나온 것을 대략적으로 따라가 보기로 했다. 대략 이런 구조이다.

```
apps
  client-a
  server-a
  client-b
  server-b
  ...
libs
  shared
  ...
pnpm-workspace.yaml
package.json
...
```

- apps: 각각의 애플리케이션을 담는 폴더
- libs: 애플리케이션 간에 공유하는 코드를 담는 폴더
- 프로젝트 루트: TypeScript 설정 파일, 코드 포매터 설정 등 프로젝트 전체에 영향을 미치는 파일을 둔다.

나는 TodoList의 클라이언트와 서버 애플리케이션을 만들 것이다. 그리고 API에서 쓰이는 타입을 프로젝트 간에 공유할 것이다. 따라서 다음과 같은 폴더 구조를 만들고자 한다.

```
apps
  todo-client
  todo-server
libs
  shared
  ...
pnpm-workspace.yaml
...
```

# 각 프로젝트 세팅

## 루트 폴더 세팅

먼저 프로젝트 폴더를 만들자. 나는 `toy-monorepo`라는 이름으로 만들었다.

```shell
mkdir toy-monorepo
cd toy-monorepo
```

pnpm-workspace.yaml 파일을 생성하여 apps와 libs 폴더 아래의 프로젝트들을 workspace에 포함시키도록 설정하자. 루트 폴더에 `pnpm-workspace.yaml` 파일을 만들고 다음 내용을 추가한다.

```yaml
packages:
  - "apps/*"
  - "libs/*"
```

다음으로는 `pnpm init` 명령어로 package.json 파일을 생성한다. 그리고 모든 프로젝트에서 공통으로 사용할 TypeScript와 코드 포매터 biome를 설치한다.

```shell
pnpm init -y
pnpm add -Dw typescript
pnpm add -Dw @biomejs/biome
```

그리고 tsconfig 설정, biome 설정 파일을 루트 폴더에 만들자.

```shell
pnpm tsc --init
pnpm biome init
```

이제 `tsconfig.json`과 `biome.json`이 프로젝트 루트에 생겼다.

tsconfig.json을 다음과 같이 설정한다. 이후에 CommonJS로 바꿀 예정이지만 일단은 esmodule을 사용하도록 했다.

```json
{
	"compilerOptions": {
		"target": "es2016",
		"module": "ESNext",
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"strict": true,
		"skipLibCheck": true,
		"outDir": "./dist"
	},
	"include": ["apps", "libs"]
}
```

biome 설정 파일의 경우 기본적으로 생성된 걸 사용한다. 그리고 필요한 경우 vscode등 코드 에디터의 기본 코드 포매터를 biome로 설정해 준다. 나는 프로젝트 루트에 `.vscode/settings.json` 파일을 만들고 다음 내용을 추가했다. 기본 코드 포매터를 biome로 설정하고 prettier를 끄는 설정이다.

```json
{
	"editor.defaultFormatter": "biomejs.biome",
	"editor.formatOnSave": true,
	"editor.codeActionsOnSave": {
		"source.fixAll.biome": "explicit"
	},
	"prettier.enable": false
}
```

다른 에디터를 쓰는 사람이 이 모노레포를 클론받아 쓸 수도 있으므로 이 설정 폴더(`.vscode`)는 git에 올라가지 않도록 `.gitignore`에 추가하였다. 혹시 이 글을 보고 따라하는 사람이 있다면 biome 플러그인을 깔아야 코드 포매팅이 정상적으로 동작한다는 것을 주의해야 한다.

## 클라이언트 폴더 세팅

클라이언트 애플리케이션을 만들기 위해 `apps` 폴더를 만들고 vite의 react-ts 템플릿으로 todo list의 클라이언트를 만든다.

```shell
mkdir apps
cd apps
pnpm create vite todo-client --template react-ts
```

코드 포매팅을 위해서는 프로젝트 루트에 있는 biome를 사용할 것이므로 eslint 관련 라이브러리와 설정 파일을 삭제한다.

```shell
cd apps/todo-client
# 이외의 eslint 관련 라이브러리들도 삭제
pnpm remove -D eslint eslint-config-prettier eslint-plugin-prettier
rm -rf .eslintrc.js .eslintignore
```

특별히 더 설정할 것은 없다. 애초에 UI를 만드는 것이 글의 주제도 아니며 이후에 로그인과 TodoList UI를 추가할 때 다시 다룰 예정이다.

## DB 세팅

도커를 이용하여 MySQL을 사용할 것이다. 도커(도커 데스크탑 또는 orbstack 등)는 깔려 있다고 가정한다. docker-compose.yml 파일을 프로젝트 루트에 생성한다. 다음과 같이 작성하였다.

```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    container_name: mysql-container
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: tododb
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
volumes:
  db_data:
```

이제 `docker-compose up -d`로 MySQL 컨테이너를 실행할 수 있다.

## 서버 폴더 세팅

서버 애플리케이션을 만들기 위해 `apps` 폴더에서 nest의 프로젝트 생성 명령어로 todo list의 서버를 만들자.

```shell
cd apps
nest new todo-server
```

biome를 사용할 것이므로 eslint 관련 라이브러리와 설정 파일을 삭제한다.

```shell
cd todo-server
# 이외의 eslint 관련 라이브러리들도 삭제
pnpm remove eslint eslint eslint-config-prettier eslint-plugin-prettier prettier
```

이렇게 하고 나서도 prettier 설정 등이 node_modules에 남아 있을 수 있으므로 프로젝트 루트의 node_modules를 한번 삭제한 후 다시 설치해 주었다.

```shell
# 프로젝트 루트 경로에서 실행
rm -rf node_modules
pnpm install
```

다음으로 Prisma ORM을 세팅하자.

```shell  
cd apps/todo-server
pnpm add -D prisma
# 만약 prisma client가 없다면 pnpm prisma 명령어로 설치
pnpm prisma init
```

# DB 생성과 Prisma

위 과정까지 완료하면 todo-server/prisma/schema.prisma 파일이 생성되었을 것이다. 그리고 서버 폴더 내에 .env도 있다.

그럼 DB 스키마를 작성하고 DB에 적용한 후 서버에 연결까지 해보자. 먼저 DB 접속은 가장 단순하게 루트 사용자를 이용할 것이므로 `apps/todo-server/.env` 파일을 다음과 같이 수정한다. root password는 `docker-compose.yml` 파일에서 설정한 것을 그대로 사용하면 된다.

```shell
DATABASE_URL="mysql://root:rootpassword@localhost:3306/tododb"
```

그리고 schema.prisma 파일을 다음과 같이 작성한다. 이후에 로그인 등의 기능도 추가할 것이므로 User 모델 그리고 사용자별로 할 일을 저장할 Todo 모델을 만들었다. 상용 애플리케이션이라면 훨씬 복잡한 많은 정보가 있을 테고 여러 최적화도 하겠지만, DB 모델링을 잘 하는 것이 목적이 아니므로 최대한 간단하게 만들어 보았다.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

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

`docker-compose up -d`로 MySQL 컨테이너를 실행하고, `pnpm prisma migrate dev` 명령어로 DB에 스키마를 적용한다. 그러면 DB에 User와 Todo 테이블이 생성된다.

`docker exec -it CONTAINER_NAME bash` 명령어를 이용해 MySQL 컨테이너에 접속하여 DB에 테이블이 잘 생성되었는지 확인할 수 있다. 여기서도 mysql root password는 앞의 docker-compose.yml 파일에서 설정한 것을 사용하면 된다.

```shell
docker exec -it mysql-container bash
mysql -u root -p
# rootpassword 입력
use tododb;
show tables;
# User, Todo 테이블이 생성되어 있는지 확인
describe Todo; # Todo 테이블의 구조도 확인 가능
```

# 공유 폴더 만들기

드디어, 클라이언트와 서버 간에 공유할 코드를 만들어보자. 사실상 이게 내가 모노레포를 사용하고자 한 이유였다. 그럼 간단한 함수를 공유해보는 것으로 이 글의 세팅을 마치려고 한다.

## 폴더 세팅

공유 코드를 담을 libs 폴더를 만들고 그 안에 shared 폴더를 만들자. 그리고 shared 폴더를 독립적인 패키지로 만든다.

```shell
mkdir libs
cd libs
mkdir shared
cd shared
pnpm init -y # package.json 생성
```

그리고 tsconfig.json 파일을 만들어서 TypeScript 설정을 한다. `.d.ts` 파일을 사용해야 하기 때문에 `declaration` 관련 옵션을 true로 설정한다.

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

다음과 같이 ts 컴파일 결과의 경로를 감안해서 package.json 파일을 작성한다. `name`을 이용해 이 공유 폴더를 import해서 사용할 때는 `@toy-monorepo/shared`라는 이름으로 사용하기로 하고 import되어 사용되는 파일은 `dist` 폴더의 특정 파일로 지정하였다.

나는 cjs 모듈을 사용하지 않을 것이기에 이렇게 했지만 필요하다면 `exports` 필드를 사용하여 cjs 모듈도 지정할 수 있다. 다음 글에서 진행할 예정인데, [CommonJS와 ESM에 모두 대응하는 라이브러리 개발하기: exports field](https://toss.tech/article/commonjs-esm-exports-field)를 참고할 수 있다.

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

이렇게 하면 공유할 코드 파일을 만든 후 `pnpm build`를 shared 폴더에서 실행하면 dist 폴더가 생성되고 그 안에 index.js와 index.d.ts 파일이 생성된다.

## 공유 코드 사용 설정

공유할 코드를 사용할 수 있도록 설정해보자. 공유할 코드의 예시로 간단한 함수를 만들어보았다.

```ts
// libs/shared/src/index.ts
export function add(a: number, b: number): number {
	return a + b;
}

export function subtract(a: number, b: number): number {
	return a - b;
}
```

이 코드를 클라이언트와 서버에서 사용할 수 있도록 설정해보자. 먼저 공유 코드를 사용할 프로젝트에 공유 코드 패키지를 설치한다. 프로젝트의 package.json 파일에 다음과 같이 추가한다.

```json
// apps/공유 코드를 사용할 폴더/package.json
{
  "dependencies": {
    "@toy-monorepo/shared": "workspace:*"
  }
}
```

그렇게 한 후 shared 폴더에서 `pnpm build` 명령어를 실행하면 shared/dist 폴더가 생성된다. 그럼 이제 공유 코드를 사용할 수 있다.

```ts
// apps/todo-client/src/App.tsx
import { add } from '@toy-monorepo/shared';

function App() {
  return <div>{add(1, 2)}</div>;
}
```

# 마무리

다음 글에서는 자잘한 오류 수정과 편의성 개선을 하고, 진짜 todoList를 구성해 볼 것이다. 그 다음에는 swagger를 이용한 자동 문서화와 API 타입 생성 등을 다뤄보고자 한다. 이 글에서는 모노레포의 초기 세팅에 대해 일단 다뤄보았다.

마지막으로 각 프로젝트의 package.json 파일에 다음과 같이 `name` 필드를 지정하자. 이렇게 하면 프로젝트의 이름을 지정할 수 있고, 이를 이용하여 프로젝트 간에 의존성을 관리할 수 있다.

```json
// apps/todo-client/package.json
{
  "name": "@toy-monorepo/todo-client",
  // ...
}

// apps/todo-server/package.json
{
  "name": "@toy-monorepo/todo-server",
  // ...
}
// ...
```

각 프로젝트별로 명령어를 좀더 편하게 실행할 수 있도록 프로젝트 루트의 `package.json` 파일에 다음 내용을 추가한다. workspace를 추가하고, 각 프로젝트마다 따로 스크립트를 실행할 수 있는 명령어를 넣었다. `-F` 옵션(`--filter`)을 통해 특정 프로젝트에만 명령어를 실행하도록 하는 것이다.

```json
// package.json
{
  "name": "toy-monorepo",
  "scripts": {
    "client": "pnpm -F @toy-monorepo/todo-client",
    "server": "pnpm -F @toy-monorepo/todo-server",
  },
  "workspaces": {
    "packages": [
      "apps/*",
      "libs/*"
    ]
  }
}
```

이렇게 설정함으로써 `pnpm client dev`나 `pnpm server dev`처럼 특정 프로젝트의 명령어를 실행할 수 있다. 나중에 모노레포에 속한 프로젝트가 많아지면 `client` 와 같은 단순한 명령으로는 부족할 수 있다. 하지만 명령어야 언제든 바꾸면 되는 것이니 지금은 이 정도면 충분하다.

# 참고

Nx docs Folder Structure

https://nx.dev/concepts/decisions/folder-structure

pnpm과 함께하는 Frontend 모노레포 세팅

https://jasonkang14.github.io/react/monorepo-with-pnpm

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