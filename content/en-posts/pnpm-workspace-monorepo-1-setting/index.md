---
title: Toy Monorepo Setup - 1. Initial Setup
date: "2024-11-24T00:00:00Z"
description: "Let's set up a toy monorepo using pnpm workspace."
tags: ["web", "study", "monorepo"]
---

# Introduction

I decided to build a monorepo for a side project. The intention was to merge the previously divided code into one and share any reusable code. While it could have been managed by creating packages for shared code, there were not many collaborators, and I had long wanted to try building a monorepo, so I decided to give it a shot.

However, it was not easy due to the absence of team members familiar with monorepo practices. Though there is a wealth of information available online, applying it directly to an already advanced project proved challenging. There were many errors, and even if it worked, it was hard to verify if it functioned correctly. Operating without a clear understanding of various knowledge and structures made it difficult.

So, to better grasp the concept of monorepos, I decided to create a toy monorepo that briefly mimics the necessary parts for the project. I aim to cover the following topics as opportunities arise, starting with the initial setup discussed in this article.

- **(Topics covered in this article)** Setting up a front-end and back-end monorepo using pnpm workspace
- API documentation with Swagger
- Automatic type generation using libraries like swagger-typegen or nestia
- User authentication/authorization using JWT
- Writing test code using jest, vitest, or other testing libraries
- Building a deployment pipeline

# Plan

This article outlines the construction of a monorepo utilizing a React client, a NestJS + Prisma server, and a MySQL database. After creating the project and performing the basic setup for each project, I will create shared code, which is the purpose of this monorepo. The required structure and technology stack closely resemble those of my current side project.

I will manage the monorepo using only pnpm workspace. Although I could start with a management tool like Nx or Turborepo, I wanted to begin with minimal tools. Additionally, as the number of projects will not be large, the convenience features provided by monorepo tools, such as incremental builds and caching, did not seem essential.

However, as I might use a monorepo management tool later, I decided to use pnpm workspace, which appears to be better compatible than yarn workspace with monorepo management tools. Now, let’s get started.

# Designing the Folder Structure

First, I need to design the folder structure. Although I am not using monorepo tools, I decided to roughly follow the structure suggested in the [Nx documentation](https://nx.dev/concepts/decisions/folder-structure). This is the general structure:

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

- apps: Folder containing each application
- libs: Folder containing shared code between applications
- Project root: Contains files affecting the entire project, such as TypeScript configuration files and code formatter settings.

I will create a client and server application for a Todo List and share the types used in the API across projects. Thus, I aim to create the following folder structure:

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

# Project Setup

## Root Folder Setup

First, let’s create the project folder. I created it with the name `toy-monorepo`.

```shell
mkdir toy-monorepo
cd toy-monorepo
```

Next, create the `pnpm-workspace.yaml` file and include the projects under the apps and libs folders in the workspace. Add the following content to the `pnpm-workspace.yaml` file in the root folder.

```yaml
packages:
  - "apps/*"
  - "libs/*"
```

Then, generate the `package.json` file using the `pnpm init` command. Also, install TypeScript and the biome code formatter, which will be used across all projects.

```shell
pnpm init -y
pnpm add -Dw typescript
pnpm add -Dw @biomejs/biome
```

Next, create the TypeScript configuration and biome configuration files in the root folder.

```shell
pnpm tsc --init
pnpm biome init
```

Now, `tsconfig.json` and `biome.json` files are created in the project root.

Set `tsconfig.json` as follows. Although I plan to switch to CommonJS later, for now, I will use esmodule.

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

For the biome configuration file, I will use the defaults. If necessary, I will set the biome as the default code formatter in code editors like VSCode. I created a `.vscode/settings.json` file in the project root and added the following content. This sets biome as the default code formatter and disables prettier.

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

I added this settings folder (`.vscode`) to `.gitignore` to prevent it from being uploaded to Git, as others using different editors might clone this monorepo. Following this guide requires installing the biome plugin for the code formatting to work correctly.

## Client Folder Setup

To create the client application, let’s create the `apps` folder and use Vite to create the React TypeScript template for the todo list client.

```shell
mkdir apps
cd apps
pnpm create vite todo-client --template react-ts
```

Since I will be using biome for code formatting, I will remove eslint-related libraries and configuration files.

```shell
cd apps/todo-client
# Remove other eslint-related libraries
pnpm remove -D eslint eslint-config-prettier eslint-plugin-prettier
rm -rf .eslintrc.js .eslintignore
```

There is nothing particularly more to configure. The main topic of this article is not UI development, and I will address it again later when adding login and TodoList UI.

## Database Setup

I will use MySQL via Docker. I assume Docker (Docker Desktop or Orbstack, etc.) is already installed. Let's create a `docker-compose.yml` file in the project root with the following content.

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

Now, the MySQL container can be executed using `docker-compose up -d`.

## Server Folder Setup

To create the server application, let’s run the nest project creation command in the `apps` folder to create the todo list server.

```shell
cd apps
nest new todo-server
```

Since I will use biome, I will also remove any eslint-related libraries and configuration files.

```shell
cd todo-server
# Remove other eslint-related libraries
pnpm remove eslint eslint eslint-config-prettier eslint-plugin-prettier prettier
```

After this, there may still be prettier configurations left in `node_modules`, so I deleted the `node_modules` folder in the project root and re-installed it.

```shell
# Run in the project root path
rm -rf node_modules
pnpm install
```

Next, let’s set up Prisma ORM.

```shell  
cd apps/todo-server
pnpm add -D prisma
# If prisma client is not available, install it using pnpm prisma command
pnpm prisma init
```

# Database Creation and Prisma

After completing the above steps, you should now have a `todo-server/prisma/schema.prisma` file created, along with a `.env` file in the server folder.

Next, let's write the database schema and apply it to the database, then connect the server. For simplicity, I will access the database using the root user, so modify the `apps/todo-server/.env` file as follows. The root password can be taken directly from the `docker-compose.yml` file settings.

```shell
DATABASE_URL="mysql://root:rootpassword@localhost:3306/tododb"
```

Now, let's write the `schema.prisma` file as follows. Since functionality such as login will be added later, I've created a User model and a Todo model to store tasks for each user. While a production application would have a much more complex structure and require various optimizations, the purpose here is not to master database modeling, so I've kept it as simple as possible.

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
  username  String   @unique
  password  String
  todos     Todo[]   // 1:N relationship - one user can have multiple todos
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false) // default value is not completed
  userId    Int      // foreign key representing relationship with User
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Execute `docker-compose up -d` to run the MySQL container, then apply the schema to the database using the command `pnpm prisma migrate dev`. This will create the User and Todo tables in the database.

You can connect to the MySQL container using `docker exec -it CONTAINER_NAME bash` to verify that the tables have been created correctly. Again, use the root password defined in the earlier `docker-compose.yml` file.

```shell
docker exec -it mysql-container bash
mysql -u root -p
# Enter rootpassword
use tododb;
show tables;
# Verify that User and Todo tables are created
describe Todo; # You can check the structure of the Todo table
```

# Creating a Shared Folder

Finally, let’s create the code that will be shared between the client and server. This is essentially the reason I wanted to use a monorepo. I will conclude this article with the sharing of a simple function.

## Folder Setup

Create a `libs` folder to hold shared code and a `shared` folder within it. Then, set up the shared folder as an independent package.

```shell
mkdir libs
cd libs
mkdir shared
cd shared
pnpm init -y # Create package.json
```

Next, create a `tsconfig.json` file to set up TypeScript configurations. Since I will need to use `.d.ts` files, set the relevant `declaration` options to true.

```json
// libs/shared/tsconfig.json
{
	"extends": "../../tsconfig.json",
	"compilerOptions": {
		"outDir": "./dist",
		"rootDir": "./src",
		"declaration": true, // generate .d.ts files
		"declarationMap": true, // generate source maps (optional)
		"declarationDir": "./dist" // location where .d.ts files will be generated
	},
	"include": ["src"],
	"exclude": ["node_modules", "dist"]
}
```

Next, prepare the `package.json` file considering the output paths of TypeScript compilation. I will name the shared folder `@toy-monorepo/shared` for importing purposes, and specify the files that will be imported from the `dist` folder.

I chose not to use cjs modules, but if needed, the `exports` field can be used to specify cjs modules as well. The proceeding article will cover this, and you can refer to [Developing a Library Compatible with Both CommonJS and ESM: Exports Field](https://toss.tech/article/commonjs-esm-exports-field) for more details.

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

With this setup, after creating the shared code file, executing `pnpm build` in the shared folder will create a `dist` folder containing `index.js` and `index.d.ts` files.

## Configuring Shared Code Usage

Now, let’s set up the shared code for usage. As an example, I created a simple function to be shared.

```ts
// libs/shared/src/index.ts
export function add(a: number, b: number): number {
	return a + b;
}

export function subtract(a: number, b: number): number {
	return a - b;
}
```

Next, we will configure the projects (client and server) to use the shared code. First, install the shared code package in the projects where it will be used. Update the project's `package.json` file as follows.

```json
// apps/ folder where the shared code will be used/package.json
{
  "dependencies": {
    "@toy-monorepo/shared": "workspace:*"
  }
}
```

After that, running `pnpm build` in the shared folder will create the `shared/dist` folder. Now, shared code can be utilized.

```ts
// apps/todo-client/src/App.tsx
import { add } from '@toy-monorepo/shared';

function App() {
  return <div>{add(1, 2)}</div>;
}
```

# Conclusion

In the next article, I will address minor error corrections and convenience improvements, and work on building the actual TodoList. Then, I plan to cover automatic documentation and API type generation using Swagger. In this article, I have discussed the initial setup of the monorepo.

Lastly, let’s specify the `name` field in the `package.json` of each project. This allows for the specification of project names, which can be used to manage dependencies between projects.

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

To execute commands more conveniently for each project, add the following to the root `package.json` file. I added a workspace and included commands to run separate scripts for each project using the `-F` option (`--filter`) to execute commands for specific projects.

```json
// package.json
{
  "name": "toy-monorepo",
  "scripts": {
    "front": "pnpm -F @toy-monorepo/todo-client",
    "back": "pnpm -F @toy-monorepo/todo-server",
  },
  "workspaces": {
    "packages": [
      "apps/*",
      "libs/*"
    ]
  }
}
```

This allows for running commands like `pnpm front dev` or `pnpm back dev` for specific projects. As more projects are added to the monorepo, simple commands like `front` may become insufficient, but commands can always be changed, so this setup is sufficient for now.

Changing `front` and `back` to `client` and `server` may seem preferable, but I opted for `front` and `back` since the [pnpm server](https://pnpm.io/ko/cli/server) command already exists. This can also be changed later if needed.

# References

Nx docs Folder Structure

https://nx.dev/concepts/decisions/folder-structure

Setting Up a Frontend Monorepo with pnpm

https://jasonkang14.github.io/react/monorepo-with-pnpm

Migrating to Monorepo Using pnpm

https://doyu-l.tistory.com/646

Front-end Monorepo Establishment Trials (1) - Reasons for Introduction, Yarn Workspaces, Berry

https://9yujin.tistory.com/100

Using Prisma in Monorepo

https://0916dhkim.medium.com/%EB%AA%A8%EB%85%B8%EB%A6%AC%ED%8F%AC%EC%97%90%EC%84%9C-prisma-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-fb811c189997

Building Monorepo Environment with pnpm

https://bepyan.github.io/blog/dev-setting/pnpm-monorepo

Biome Getting Started

https://biomejs.dev/guides/getting-started/

NestJS Prisma Setup Official Documentation

https://docs.nestjs.com/recipes/prisma

Developing a Library Compatible with Both CommonJS and ESM: Exports Field

https://toss.tech/article/commonjs-esm-exports-field