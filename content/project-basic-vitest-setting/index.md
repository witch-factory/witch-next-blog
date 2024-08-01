---
title: NodeJS + Prisma 백엔드 테스트 환경 설정하기
date: "2024-07-31T00:00:00Z"
description: "신촌연합 관리 페이지 백엔드에 테스트를 달아 보자"
tags: ["typescript", "javascript", "web"]
---

# 이 글은 작성 중입니다.

# 시작

[MySQL, Prisma, NodeJS 서버를 Google Cloud Platform으로 배포하기](https://witch.work/posts/project-backend-gcp-deploy)에서 이어지는 글이다. 이번에는 프로젝트에 테스트를 올려보자.

프론트 대부분 그리고 백엔드 약간을 맡아 개발하고 있었는데 뭔가 수정할 때마다 잘 되는지 하나하나 postman으로 확인하는 것이 귀찮아졌다. 그래서 말로만 듣던 테스트를 올려보기로 했다.

기술 같은 경우 백엔드는 mysql, prisma ORM, nodejs, express를 사용하고 있다. 그리고 프론트는 nextjs 12 버전을 사용하고 있다.

# 기본적인 세팅

## 설치와 설정

jest를 쓰려고 했으나 module 지원이 안되는 문제가 있었다. 그래서 코드가 호환되는 vitest를 사용하기로 했다.

```bash
npm install --save-dev vitest
```

그리고 package.json에 다음과 같이 테스트 스크립트를 추가해준다.

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

그리고 다음과 같이 vitest 설정 파일을 만들어서 `__test__`폴더에 들어 있는 `.test.js` 혹은 `.test.ts` 확장자의 파일을 테스트하도록 설정해준다.

```js
// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["__tests__/*.test.(js|ts)"],
	},
});
```

## 기본적인 테스트해보기

간단히 함수를 만들고 테스트해보는 걸로 시작해보자. `utils/sample.js` 파일을 생성하고 다음과 같이 코드를 작성한다. n을 받아서 2의 제곱수들을 `2^n`까지 넣은 배열을 반환하는 함수이다.

```js
// utils/sample.js
function powersOfTwo(n) {
	return [...Array(n + 1)].map((_, i) => 2 ** i);
}

export { powersOfTwo };
```

그리고 `__test__/sample.test.js` 파일을 생성하고 다음과 같이 코드를 작성한다. 간단한 덧셈과 `powersOfTwo` 함수를 테스트해보자.

```js
import { expect, it, describe } from "vitest";
import { powersOfTwo } from "utils/samples";

describe("Sample Test", () => {
	it("1 + 1 = 2", () => {
		expect(1 + 1).toBe(2);
	});

	it("2 + 1 = 3", () => {
		expect(2 + 1).toBe(3);
	});
});

describe("Basic Tests", () => {
	it("Testing for fixed tests", () => {
		expect(powersOfTwo(0)).toEqual([1]);
		expect(powersOfTwo(1)).toEqual([1, 2]);
		expect(powersOfTwo(4)).toEqual([1, 2, 4, 8, 16]);
	});
});
```

그리고 `npm test`를 실행하면 다음과 같이 테스트가 실행된다. 예상대로 잘 실행되는 걸 볼 수 있다. 당연히 테스트도 성공이다.

```bash
$ npm test
> sinchon-server@1.0.0 test
> vitest

 DEV  v1.6.0 /Users/kimsunghyun/Desktop/sinchon-admin-service/admin-service-new-backend

 ✓ __tests__/sample.test.js (3)
   ✓ Sample Test (2)
     ✓ 1 + 1 = 2
     ✓ 2 + 1 = 3
   ✓ Basic Tests (1)
     ✓ Testing for fixed tests

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:20:57
   Duration  144ms (transform 19ms, setup 0ms, collect 10ms, tests 3ms, environment 0ms, prepare 48ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

# 테스트용 DB 설정

하지만 이런 JS 함수나 테스트하자고 테스트를 돌리는 건 아니다. 먼저 백엔드에서 DB가 잘 다루어지는지 테스트를 하고 또 궁극적으로는 프론트에서 백엔드와 잘 연결되는지 테스트를 해야 한다. 따라서 먼저 테스트용 DB를 설정해보자.

## 컨테이너 생성

테스트용 DB로 mysql을 사용하기로 했다. docker로 다음과 같이 mysql 컨테이너를 생성하자. 로컬에서 돌아갈 테스트이므로 DB 이름은 `testdb`로 설정하고 비밀번호는 `testpassword`로 아주 간단히 설정했다. 또한 3307포트로 접근할 수 있도록 했다.

```bash
docker run --name mysql-test -e MYSQL_ROOT_PASSWORD=testpassword -e MYSQL_DATABASE=testdb -p 3307:3306 -d mysql:latest
```

## 테스트 DB 설정

`prisma/schema.prisma` 파일에는 db url을 설정할 수 있는데 이를 환경 변수를 이용하도록 설정한다.

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

그리고 `.env.test` 파일을 생성하고 다음과 같이 DB URL을 설정한다. 프로덕션용 URL은 물론 `.env`에 들어 있다. 테스트용 DB URL은 `.env.test`에 설정해준다.

```env
DATABASE_URL="mysql://root:testpassword@localhost:3307/testdb"
```

이제 테스트 DB에 필요한 테이블을 생성해보자. `prisma migrate` 명령어를 사용하면 `prisma/migrations` 폴더에 마이그레이션 파일이 생성된다. 이 파일을 통해 DB에 테이블을 생성할 수 있다.

```bash
npx prisma migrate dev --name init
```

이때 오류가 뜰 수 있다. 이는 `prisma migrate`가 프로젝트의 `.env`에 있는 `DATABASE_URL`을 사용하기 때문이다.

따라서 이때만 잠시 `.env` 파일의 `DATABASE_URL`을 위에서 만든 `.env.test`의 것으로 변경하거나, 아니면 package.json의 스크립트에 직접 `DATABASE_URL`을 넣어주거나 `schema.prisma`에 직접 `DATABASE_URL`을 넣어주거나 등등 아무튼 testdb의 URL이 잘 들어가도록 해주면 된다. 바로 다음에 볼 dotenv-cli를 사용할 수도 있겠다.

그리고 테스트 시에 `.env.test` 파일을 사용하도록 설정해줘야 한다. 먼저 dotenv-cli를 설치해서 스크립트에서 환경 변수 파일을 설정할 수 있도록 하자.

```bash
npm install --save-dev dotenv-cli
```

그리고 `package.json`에 다음과 같이 테스트 스크립트를 수정한다. `.env.test` 파일을 테스트 시 환경변수로 쓰도록 설정한다.

```json
{
  "scripts": {
    "test": "dotenv -e .env.test -- vitest"
  }
}
```

## seed 설정하기

도커 컨테이너로 테스트 DB가 올라갔고 prisma migrate를 통해 테이블도 생성했다. 이제 seed 데이터를 넣어보자. `prisma/seed-test.js` 파일을 생성하고 다음과 같이 코드를 작성한다. 단순히 모든 테이블의 기존 데이터를 지워 버리는 코드이다.

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	// 기존 데이터 삭제
	await prisma.admin.deleteMany();
	await prisma.student.deleteMany();
	await prisma.semester.deleteMany();
	await prisma.lecture.deleteMany();
	await prisma.studentLectureLog.deleteMany();
	await prisma.weeklyAttendLog.deleteMany();
}

export default function setup() {
	main()
		.then(async () => {
			await prisma.$disconnect();
		})
		.catch(async (e) => {
			console.error(e);
			await prisma.$disconnect();
			process.exit(1);
		});
}
```

`vitest.config.js` 파일을 다음과 같이 수정해서 테스트 전에 `seed-test.js` 파일을 실행하도록 설정한다. `globalSetup`에서는 주어진 파일들에서 default export된 함수를 실행한다.

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["__tests__/*.test.(js|ts)"],
		globalSetup: ["prisma/seed-test.js"],
	},
});
```

## 테스트 코드 작성

이제 테스트 코드를 작성해보자. `__test__/student.test.js` 파일을 생성하고 다음과 같이 코드를 작성한다. 일단 테스트 파일에서 테스트용 데이터베이스에 연결하도록 설정하고 간단한 테스트 케이스를 작성한다. 학생을 만드는 함수는 미리 만들어둔 `StudentRepository`를 사용했다.

```js
import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, it, expect } from "vitest";
import StudentRepository from "../repositories/student_repository";

const prisma = new PrismaClient();

beforeAll(async () => {
	await prisma.$connect();
});

afterAll(async () => {
	await prisma.$disconnect();
});

describe("StudentRepository", () => {
	it("creates student", async () => {
		expect(
			await StudentRepository.createStudent({
				name: "John Doe",
				bojHandle: "JohnDoe",
				school: "SOGANG",
				email: "me@acme.org",
				phone: "01000001111",
				studentNumber: "2021-12345",
				paymentStatus: "PAID_30000",
			}),
		).toMatchObject({ bojHandle: "JohnDoe", email: "me@acme.org" });
	});
});
```

`npm run test`를 실행하면 다음과 같이 테스트가 실행된다. mysql 컨테이너가 실행되고 있는지 확인하는 것에 주의하자.

```bash
$ npm test

> sinchon-server@1.0.0 test
> dotenv -e .env.test -- vitest

 DEV  v1.6.0 /Users/kimsunghyun/Desktop/sinchon-admin-service/admin-service-new-backend

stdout | __tests__/student.test.js > StudentRepository > creates student
{ url: 'mysql://root:testpassword@localhost:3307/testdb' }

 ✓ __tests__/sample.test.js (3)
 ✓ __tests__/student.test.js (1)

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  00:47:12
   Duration  339ms (transform 42ms, setup 0ms, collect 70ms, tests 43ms, environment 0ms, prepare 131ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

# 도커 컴포즈로 자동화

`docker-compose.test.yml` 파일을 만들어서 테스트용 DB를 자동으로 생성하도록 설정해보자. 다음과 같이 도커 컴포즈 파일을 작성한다.

```yaml
version: "3.8"

services:
  db:
    image: mysql:8.0
    ports:
      - 3307:3306
    env_file:
      - .env.test 
    environment:
      TZ: Asia/Seoul
      MYSQL_ROOT_PASSWORD: testpassword
      MYSQL_DATABASE: testdb
    volumes:
      - mysql_test_data:/var/lib/mysql

volumes:
  mysql_test_data:
```

이제 다음과 같은 스크립트들을 통해서 테스트를 실행할 수 있다. docker-compose down을 통해 컨테이너를 정리하는 것도 매우 쉬워졌다.

```bash
docker compose -f docker-compose.test.yml up -d
npm run migrate:test
npm run test
docker compose -f docker-compose.test.yml down
```

다음과 같이 `package.json`에 이 명령들을 묶어서 스크립트로 추가한다.

```json
{
  "scripts": {
		"test": "dotenv -e .env.test -- vitest",
		"migrate:test": "dotenv -e .env.test -- npx prisma migrate deploy",
		"test:docker": "docker-compose -f docker-compose.test.yml up -d && npm run migrate:test && npm run test && docker-compose -f docker-compose.test.yml down",
    // ...
  }
}
```

이제 `npm run test:docker`를 실행하면 테스트용 DB를 생성하고 마이그레이션을 수행하고 테스트를 실행하고 DB를 삭제하는 과정을 자동으로 수행한다.

![도커를 통한 테스트](image.png)

## 트러블 슈팅

그런데 문제가 발생한다. 자꾸 다음과 같은 에러가 발생하는 것이다. 직접 명령을 실행하면 이런 에러가 발생하지 않는데 `npm run test:docker`를 실행하면 이런 에러가 발생한다.

```bash
Error: P1017: Server has closed the connection.
```

신기한 건 이렇게 에러가 발생하고 명령이 종료된 후 다시 한 번 `npm run test:docker`를 실행하면 이번에는 에러가 발생하지 않았다. 그리고 다시 성공적으로 명령이 완료되고 `docker-compose down`까지 실행되고 나서 다시 `npm run test:docker`를 실행하면 또다시 에러가 발생한다.

따져보니 다음과 같은 상황이었다.

- `npm run test:docker`을 실행한다.
- 스크립트의 첫 명령인 `docker-compose -f docker-compose.test.yml up -d`가 실행된다.
- 테스트를 위한 mysql 컨테이너가 실행된다.
- `npm run migrate:test`가 실행된다.
- prisma migrate가 실행되는데, 아직 docker-compose에서 실행하려고 하는 mysql 컨테이너가 완전히 준비되지 않은 상태에서 실행된다.
- 따라서 서버에 접근할 수 없다는 에러가 발생하고 스크립트가 종료된다. docker-compose down이 실행되기 전에 종료되었으므로 mysql 컨테이너는 계속 실행된다.
- 다시 `npm run test:docker`를 실행하면 mysql 컨테이너가 실행되어 있는 상태에서 prisma migrate가 실행되고 이번에는 컨테이너가 준비된 상태에서 실행되어 성공한다.
- 그리고 테스트가 실행되고 성공적으로 종료된다. 이때 docker-compose down이 실행되어 mysql 컨테이너가 종료된다.
- mysql 컨테이너가 종료되었으므로 다시 `npm run test:docker`를 실행하면 앞선 상황이 반복된다.

이 문제를 해결하기 위해서는 prisma migrate가 실행되기 전에 mysql 컨테이너가 완전히 준비되었는지 확인해야 한다. 이를 위해서 `wait-for-it`이라는 스크립트를 사용하자.

일단 [wait-for-it GitHub 레포지토리](https://github.com/vishnubob/wait-for-it)에서 `wait-for-it.sh` 파일을 다운로드 받는다. 그리고 프로젝트 루트에 `bin/`폴더를 만들고 `wait-for-it.sh` 파일을 넣는다.

`bin/run-test.sh` 파일을 만들고 다음과 같이 코드를 작성한다. 이 스크립트는 mysql 컨테이너가 준비되었는지 확인하고 준비되었으면 다음 명령을 실행한다.

```bash
#!/bin/bash

# Docker Compose로 컨테이너 실행
docker-compose -f docker-compose.test.yml up -d

# 데이터베이스가 준비될 때까지 60초 대기
./wait-for-it.sh localhost:3307 -t 60

# 데이터베이스가 준비되면 마이그레이션 실행
npm run migrate:test

# 테스트 실행
npm run test

# 테스트 완료 후 컨테이너 종료
docker-compose -f docker-compose.test.yml down
```

그리고 package.json의 `test:docker` 스크립트를 다음과 같이 수정한다.

```json
{
  "scripts": {
    // 기존 스크립트...
    "test:docker": "./bin/run-test.sh",
    // ...
  }
}
```

이 스크립트를 실행하면 이제는 mysql 컨테이너가 준비된 상태에서 prisma migrate가 실행되어 에러가 발생하지 않는다. 실행이 안될 수도 있는데, 그럴 때는 파일의 실행 권한을 주자.

```bash
chmod +x bin/run-test.sh
```

`npm run test:docker`를 실행하면 테스트용 DB를 생성하고 마이그레이션을 수행하고 테스트를 실행하고 DB를 삭제하는 과정을 자동으로 수행한다. DB가 실행되고 나서 마이그레이션, 테스트를 실행하는 이 순서를 지키기 위해서 `wait-for-it.sh`를 사용했다.

# 참고

https://vitest.dev/guide/

(6) How was your day? - docker-compose.yml으로 구성하기

https://velog.io/@heyday_7/6-How-was-your-day-docker-compose.yml%EC%9C%BC%EB%A1%9C-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0