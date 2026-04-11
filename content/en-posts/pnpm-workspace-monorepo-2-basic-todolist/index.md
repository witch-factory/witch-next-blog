---
title: Toy Project Monorepo Journey - 2 Basic TodoList Implementation and Type Sharing
date: "2024-12-09T00:00:00Z"
description: "Implement a todo list in a monorepo with API documentation and type sharing."
tags: ["web", "study", "javascript", "monorepo"]
---

# Introduction

I decided to implement a monorepo for my side project, so I created a practice project to better understand monorepos. This is the second article in that series. [In the previous article, I performed a very basic setup of the monorepo using pnpm workspace.](https://witch.work/posts/pnpm-workspace-monorepo-1-setting)

In this article, I aim to implement a TodoList using a monorepo and explore its advantages. The TodoList will have a basic structure where there are users, and each user can have multiple tasks.

What did I hope to gain from using a monorepo? Primarily, I wanted to easily manage multiple projects and shared code across those projects. Therefore, in this article, I will implement the TodoList in a monorepo and cover the following aspects that were significant reasons for choosing a monorepo:

- Basic TodoList implementation using a database
- API documentation using OpenAPI (swagger)
- Automatic type generation for client usage and sharing across the project

In subsequent articles, I plan to gradually tackle topics such as CJS/ESM modules, user authentication, testing, and deployment. This is partly because I anticipated that testing and deployment would be easier with a monorepo.

# TodoList Implementation

First, we need to implement the TodoList. As mentioned in the previous article, the client will use React, the server will use NestJS, and the database will be MySQL. In this section, I will implement the basic functionality of a TodoList that uses a database with the mentioned technologies.

## API Design

The current Prisma data model is structured as follows. There are User and Todo models, and each User can have multiple Todos.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  todos     Todo[]   // 1:N relationship - one user can have multiple tasks
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false) // Default is not completed
  userId    Int      // Foreign key representing the relationship with User
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

This is a basic structure where users exist and each user can have tasks. When a user logs in, they will be able to view their task list and will have the ability to add, edit, or delete tasks.

However, user login and authentication features are complex on their own, so those will be covered in a later article. Therefore, this article will focus on implementing the minimal necessary functionality for user-related aspects while concentrating on the TodoList.

Consequently, I will create the following TodoList-related APIs only. User-related APIs will be thoroughly discussed in the next article, and for now, we will use user information that has been pre-created in the database as seed data.

- POST `/todos`: Create a task
- GET `/todos?userId=#`: Retrieve the task list of the user corresponding to the received userId in the query string
- PATCH `/todos/:todoId`: Edit a task
- DELETE `/todos/:todoId`: Delete a task

## Adding Database Seeds

First, let's create a seed file to generate users. If you have previously run `pnpm prisma migrate dev`, a Prisma folder will have been created containing migration files. Create the `prisma/seed.ts` file and write the following code to generate users.

```typescript
// apps/todo-server/prisma/seed.ts
const prisma = new PrismaClient();

async function main() {
	// Generate User data
	const user1 = await prisma.user.create({
		data: {
			username: "user1",
			password: "password123", // Use hashed passwords in actual services
			todos: {
				create: [{ title: "Study" }, { title: "Read a book", completed: true }],
			},
		},
	});

	const user2 = await prisma.user.create({
		data: {
			username: "user2",
			password: "password456",
			todos: {
				create: [{ title: "Exercise" }, { title: "Prepare presentation materials" }],
			},
		},
	});

	console.log("Seed data generation complete:", { user1, user2 });
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

Now, execute this seed file to create the user and task data. Add the following seeding command in the `package.json` file and then execute it.

```json
// apps/todo-server/package.json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```bash
pnpm prisma db seed
```

This will insert the user and their respective task data found in the seed file into the database.

## Prisma Integration

Now, let's create a Nest.js server that uses Prisma. First, install the Prisma client in the server folder.

```bash
pnpm add @prisma/client
```

Let's create a service to manage the Prisma client. Create a file named `src/prisma.service.ts` and write the following code for connecting the Prisma client.

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

Inject this service as a provider in the module so that Prisma can be used elsewhere in the module. Additionally, you can create a `prisma.module.ts` to encapsulate Prisma functionalities into a module, allowing it to be used globally with `@Global`. However, since this is not a large project and changes might occur later, I will simplify this and use the `PrismaService` directly.

Next, let's create a module to manage todos using the PrismaService. Nest has a command `nest g resource` that creates a controller, service, DTO, and entity together for CRUD operations. Let's use this to create the Todo module we will use.

```bash
# --no-spec option prevents the creation of a test file
nest g resource todos --no-spec
```

This command will create a folder named `src/todos` with the controller, service, module, DTO, and entity folders inside. Let's modify the created module by injecting the `PrismaService` we created earlier so that we can use the Prisma client within the service. Open the `src/todos/todos.module.ts` file and modify it as follows.

```typescript
// import statements omitted
// apps/todo-server/src/todos/todos.module.ts
@Module({
	controllers: [TodosController],
	providers: [PrismaService, TodosService],
})
export class TodosModule {}
```

## Implementing API with Nest.js

Let's implement the service methods for the Todo-related APIs designed earlier. Open the `src/todos/todos.service.ts` file and implement the service as follows. I have injected the `PrismaService` to use the Prisma client, implementing CRUD operations for Todo and a method to retrieve todos specific to a user ID. Initially, we will use the types generated by Prisma.

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

Next, let's create a controller to handle requests starting with `/todos`. However, before that, we will need to install libraries to validate or transform the inputs in the controller using Nest.js's [Pipes](https://docs.nestjs.com/pipes).

```bash
pnpm back add class-validator class-transformer
```

Then, open the `src/todos/todos.controller.ts` file and implement the controller as follows. The `@Get`, `@Post`, `@Patch`, and `@Delete` decorators are used to implement methods that handle respective requests. You can see that built-in pipes like `ParseIntPipe` are being utilized, and also that we are using types generated by Prisma.

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

You can test each request using tools like Postman. Now, the basic CRUD APIs for the TodoList have been implemented.

## TodoList Frontend

Now, I will implement the client in the `todo-client` folder. In the previous article, I had set up a project using Vite's react-ts template. I will create a basic login page, a registration page, and a task list page. First, I will install `react-router` for page routing and `axios` for HTTP requests.

```bash
# Run this for the todo-client folder created in the previous article
pnpm front add react-router axios
```

I created a `pages` folder inside the `src` folder and implemented the pages in `App.tsx`, `Login.tsx`, and `Register.tsx`. The complete UI code can be found in the [repository's `apps/todo-client/src` folder](https://github.com/witch-factory/toy-project-monorepo/tree/main/apps/todo-client/src). Let's take a brief look at the important parts.

First, I built an instance of axios with `baseURL`, which I used for sending and receiving each request. Afterward, if the server is deployed, I can simply change the `baseURL` to the address of the deployed server, making it convenient.

```typescript
// apps/todo-client/src/api.ts
export const todoAPI = axios.create({
	baseURL: "http://localhost:3000",
});
```

I wrote a function to call the API and retrieve the todo list that can be seen in `App.tsx`. The userId is currently a fixed value, but it will be replaced with the ID of the currently logged-in user once the login system is implemented.

```typescript
// apps/todo-client/src/App.tsx
// Temporarily fixed value for a single user
// Will be replaced with the ID of the currently logged-in user once the login system is implemented
const userId = 1;

const fetchTodos = useCallback(async () => {
  if (!userId) return;
  try {
    const response = await todoAPI.get(`/todos?userId=${userId}`);
    setTodos(response.data);
  } catch (error) {
    console.error("Failed to fetch todo list:", error);
  }
}, []);
```

I also wrote functions to use the API for editing or deleting each item in the todo list, utilizing these in the page. In this way, I have implemented the basic functionality of the TodoList. The specific code can be checked from the repository link provided above.

When integrating with the frontend, one important point to note is the potential CORS issue. By default, the Nest.js server does not allow CORS, which might result in a CORS error when the client makes requests to the server. To resolve this, we need to enable CORS in the server. Open the server's `main.ts` file and add the frontend address to the CORS configuration.

```typescript
// apps/todo-server/src/main.ts
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "http://localhost:5173",
	});
  // Other code omitted

	await app.listen(3000);
}
bootstrap();
```

Since little CSS was used, the design is not very appealing, but functionally, a TodoList connected to the database will be successfully created, as shown below.

![todo list image](./todolist-basic-client.png)

## Validating API Requests and Transforming Data

However, there is still an issue. When making requests, we are not validating the request format or data types. These tasks can be handled using Nest.js's pipes, and in this section, we will do that.

While I did handle some validations when creating the API, for example, using `ParseIntPipe` to convert the `userId` query in the `GET /todos?userId=#` controller, it is still necessary to validate and transform a lot of areas.

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

However, it is still the case that if `userId` in `POST /todos` is a string format, the request will succeed at all but will encounter an error only during the insertion process in the database. Also, if the `title` is an empty string, it would be reasonable to think that it is not a valid todo, but the request is successful and reaches the database insertion. This type of validation/transformation work can be handled using pipes.

Of course, the client can also validate inputs directly using a function or libraries such as `<input>` tag validators and zod. However, it is advisable to also validate on the server side.

Since we have already installed `class-transformer` and `class-validator`, let's create a pipe to transform and validate the request data. First, let's write the DTO.

Since we previously used `nest g resource` to create a CRUD boilerplate, the `src/todos/dto/create-todo.dto.ts` file should already exist (the `update-todo.dto.ts` is in the same location). Open this file and write the following content, which is similar to the schema created by Prisma.

```typescript
// apps/todo-server/src/todos/dto/create-todo.dto.ts
export class CreateTodoDto {
	title: string;
	completed: boolean;
	userId: number;
}
```

Now, let’s replace the parts utilizing `Prisma.TodoCreateInput` with `CreateTodoDto`. Unlike types, DTO classes do not disappear at runtime, allowing their values to be validated at runtime. Therefore, let's use decorators provided by `class-transformer` and `class-validator` to create the validation/transformation rules for `CreateTodoDto`. Here’s how I wrote it:

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
	@IsNotEmpty({ message: "Title cannot be empty." })
	title: string;

	@IsOptional()
	@IsBoolean({ message: "Completed must be true or false." })
	@Transform(({ value }) => value === "true" || value === true) // Convert 'true' string to boolean
	completed: boolean;

	@IsInt({ message: "UserId must be an integer." })
	@Type(() => Number) // Convert to number
	userId: number;
}
```

The names of the decorators are quite intuitive, so they shouldn't need further explanation. Now let’s add the pipe to validate and transform the request in the controller. We can use the `@UsePipes` decorator to utilize pipes. Since we will handle the transformations indicated by decorators such as `@Type` in the pipe, we will pass the `transform` option to the `ValidationPipe` to use the created instance.

To prevent the pipe instance from being created multiple times, we could create a separate pipe class for handling it, passing that class itself to `@UsePipes`. However, we will not consider that here. The controller method `createTodo`, which uses the pipe, is shown below. You can also see that we are using `CreateTodoDto` instead of `Prisma.TodoCreateInput`.

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

Don't forget to modify the `TodosService` class to use `CreateTodoDto` instead of `Prisma.TodoCreateInput`.

After performing the changes, if we send requests that do not comply with the rules written in `create-todo.dto.ts`, the requests will fail and an error message will be returned. For example, if we send the `title` as an empty string, we will receive the following response.

```json
{
    "message": [
        "Title cannot be empty."
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

We will also perform the same operation for the controller handling todo updates. We will create an `UpdateTodoDto` and utilize it to validate and transform the request in the controller. The `update-todo.dto.ts` at the same location already contains the following code.

```typescript
// apps/todo-server/src/todos/dto/update-todo.dto.ts
import { PartialType } from "@nestjs/mapped-types";
import { CreateTodoDto } from "./create-todo.dto";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
```

Therefore, we will modify the controller and service methods for todo updates to use `UpdateTodoDto`, and append the `ValidationPipe` to it. This allows validation and transformation of the requests to be performed through the pipe. Let's modify the update methods as follows.

```ts
// apps/todo-server/src/todos/todos.controller.ts
@Controller("todos")
export class TodosController {
	constructor(private readonly todosService: TodosService) {}
  // ...
	@Patch(":todoId")
  // Let the pipe validate and transform the request
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

  // Use UpdateTodoDto instead of Prisma.TodoUpdateInput
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

By doing this, we will enforce validations, such as checking if the `title` is an empty string, when updating a todo. Of course, aside from type validation, there could be other validations required, such as checking whether the todo being updated exists based on the provided id and responding with a specific error message. Such validations can be handled separately in error handling within service methods.

# API Documentation

One of the key reasons for creating a monorepo was to share types. There are several methods to achieve this, but first, I will generate OpenAPI documentation and then use it to generate types. Let's first create the documentation for our API.

## API Documentation Generation Setup

In Nest.js, we can use Swagger to generate API documentation that adheres to OpenAPI specifications. The official Nest.js documentation provides excellent guidance, which I followed to set this up. First, install the `@nestjs/swagger` package.

```bash
pnpm back add @nestjs/swagger
```

Then, configure Swagger within the bootstrap function located in the `main.ts` file of the server folder as follows.

```typescript
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: "http://localhost:5173",
	});

	// Swagger setup
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

After this, run the server (using scripts like `pnpm run start`), and you should be able to access `http://localhost:3000/api-docs`, where you will find the Swagger UI. Here, you can see the endpoints of the APIs you've created, and you can test them directly.

Next, we want to enable the `@nestjs/swagger` plugin for more convenient use. This plugin will automatically attach the `@ApiProperty` decorator to the properties of dto classes and analyze comments to add descriptions for API dtos or endpoints. You can explore all the features provided in the [Nest.js OpenAPI CLI Plugin documentation](https://docs.nestjs.com/openapi/cli-plugin).

For now, we will use the plugin with its default options. Since the project was created using Nest CLI, there is a `nest-cli.json` in the root of the server folder where we will add the plugin.

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

Now restart the server and visit `http://localhost:3000/api-docs`, where you should find the properties of the dto classes displayed in the documentation.

However, you might notice that there are no descriptions for `UpdateTodoDto` in the documentation. This is because we used `@nestjs/mapped-types`'s `PartialType` when defining `UpdateTodoDto`. Instead, if we use `@nestjs/swagger`'s `PartialType`, that will solve the problem. Let's modify the `update-todo.dto.ts` file as follows.

```ts
// apps/todo-server/src/todos/dto/update-todo.dto.ts
// Change the import path for PartialType
import { PartialType } from "@nestjs/swagger";
import { CreateTodoDto } from "./create-todo.dto";

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}
```

Now, when you check `http://localhost:3000/api-docs`, the Swagger documentation for `UpdateTodoDto` should be correctly generated.

## Enhancing Documentation

After doing this, if you check the Swagger documentation (`localhost:3000/api-docs`), you will find that there are several gaps in the documentation. While the `@nestjs/swagger` plugin automatically adds dto properties to the documentation, it still lacks some details. For instance, it would be great to have a brief description of the API, and it would also be beneficial to specify the response formats. Let's enhance those aspects manually.

Use `@ApiTags` to tag the controller. This decorator allows you to set a group name for the controller methods.

```ts 
@ApiTags("todos")
@Controller("todos")
export class TodosController {
  // ...
}
```

We also need to add information about the API responses. This is crucial since Swagger does not know the types being returned by the APIs. Hence, we define entity classes to inform Swagger about the response formats.

In the boilerplate generated by `nest g resource`, entity files were already created in the entities folder. Let's create a todo entity in the created `.entity.ts` file by implementing the schema types generated by Prisma.

```ts
// apps/todo-server/src/todos/entities/todo.entity.ts
import { Todo } from "@prisma/client";

export class TodoEntity implements Todo {
	id: number;
	title: string;
	userId: number;
	completed: boolean;
	createdAt: Date;
	updatedAt: Date;
}
```

By defining this class, we can now use the `@ApiResponse` decorator to add explanations about the responses in the controller methods. For example, let's add details about the response of the `findTodo` method, specifying the response type as `TodoEntity`. This will allow the Swagger documentation to include response descriptions and types.

```ts
@Get()
@ApiOkResponse({
  description: "Successfully retrieved todo",
  type: [TodoEntity],
})
findTodo(@Query("userId", ParseIntPipe) userId: number) {
  return this.todosService.findTodosByUser(userId);
}
```

Additionally, there are decorators like `@ApiOperation` that allow you to add descriptions for the APIs. While query strings and the body are automatically added to the documentation, you may want to enhance those details with `@ApiQuery`, `@ApiBody`, and similar decorators. Using these methods, we have bolstered the OpenAPI documentation for the controllers as follows.

I have also used various response-related decorators. You can refer to [Nest.js OpenAPI Operations - Responses](https://docs.nestjs.com/openapi/operations#responses) for more details.

```ts
// apps/todo-server/src/todos/todos.controller.ts
@ApiTags("todos")
@Controller("todos")
export class TodosController {
	constructor(private readonly todosService: TodosService) {}

	@Post()
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiOperation({ summary: "Create a new Todo" }) // Method description
	@ApiBody({ type: CreateTodoDto, description: "Data for the new Todo" }) // Request body description
	@ApiCreatedResponse({
		description: "Successfully created Todo",
		type: TodoEntity,
	}) // Successful response
	@ApiBadRequestResponse({ description: "Validation error" }) // Failed response
	createTodo(@Body() createTodoDto: CreateTodoDto) {
		console.log(createTodoDto);
		return this.todosService.createTodo(createTodoDto);
	}

	@Get()
	@ApiOperation({ summary: "Retrieve todos for the given user" })
	@ApiQuery({
		name: "userId",
		type: Number,
		description: "User ID to retrieve todos",
	})
	@ApiOkResponse({
		description: "Successfully retrieved todos",
		type: [TodoEntity],
	})
	findTodo(@Query("userId", ParseIntPipe) userId: number) {
		return this.todosService.findTodosByUser(userId);
	}

	@Patch(":todoId")
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiOperation({ summary: "Edit todo" })
	@ApiParam({ name: "todoId", type: Number, description: "ID of the Todo to edit" })
	@ApiBody({ type: UpdateTodoDto, description: "Information to edit the Todo" })
	@ApiOkResponse({
		description: "Successfully edited todo",
		type: TodoEntity,
	})
	@ApiNotFoundResponse({ description: "Todo not found" })
	updateTodo(
		@Param("todoId", ParseIntPipe) todoId: number,
		@Body() updateTodoDto: UpdateTodoDto,
	) {
		return this.todosService.updateTodo(todoId, updateTodoDto);
	}

	@Delete(":todoId")
	@ApiOperation({ summary: "Delete todo" })
	@ApiParam({ name: "todoId", type: Number, description: "ID of the Todo to delete" })
	@ApiOkResponse({
		description: "Successfully deleted todo",
		type: TodoEntity,
	})
	@ApiNotFoundResponse({ description: "Todo not found" })
	removeTodo(@Param("todoId", ParseIntPipe) todoId: number) {
		return this.todosService.removeTodo(todoId);
	}
}
```

# Automatic Type Generation

Now that we have built the TodoList and created pipes to validate and transform requests, we have generated documentation for each API according to the descriptions given. The TodoList is functioning more robustly and has user-facing documentation. But wait, why were we doing all of this? We were creating a monorepo.

What was our goal with the monorepo? We wanted to share code between the client and server projects, particularly types. Let’s automate this type generation now.

## Saving OpenAPI Documentation to a File

To do this, we will save the OpenAPI specification document to a file and then extract types from it. First, let’s configure the server's `main.ts` to generate the Swagger document (which complies with OpenAPI specifications) as a file named `openapi.json`.

```ts
// apps/todo-server/src/main.ts within the bootstrap function
async function bootstrap() {
	// ...omitted...

	// Swagger setup
	const config = new DocumentBuilder()
		.setTitle("Todo API")
		.setDescription("Todo CRUD API documentation")
		.setVersion("1.0")
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
  	// Save the document generated by Swagger module to a file
	writeFileSync("./openapi.json", JSON.stringify(documentFactory(), null, 2));
	SwaggerModule.setup("api-docs", app, documentFactory);

	await app.listen(3000);
}
```

This configuration will generate an `openapi.json` file in the root of the server project every time the server starts. We will now use this file to generate types.

There are several tools available that can generate types from an OpenAPI spec. I have determined that `openapi-typescript` is best suited for my needs since I only require TypeScript types and I am using OpenAPI 3.0 specification. I’ve observed that it is widely used by reputable entities like GitHub and Firebase. It is fast and generates only types without creating runtime HTTP clients.

First, install `openapi-typescript`.

```bash
pnpm add -D openapi-typescript
```

For `openapi-typescript` to properly fetch types, some settings are needed in the `tsconfig.json` file. The `tsconfig.json` exists at the root of the monorepo, which is extended by each project, so I will add the configurations to the monorepo root's `tsconfig.json`.

```json
{
  "compilerOptions": {
    "module": "ESNext", // or "NodeNext"
    "moduleResolution": "Bundler" // or "NodeNext"
  }
}
```

Now, the type generation command format will look as follows.

```bash  
pnpm openapi-typescript [path to openapi file] -o [path to output file]
```

You can set more complex options using a configuration file, which can be seen in the [openapi-typescript CLI documentation](https://openapi-ts.dev/cli).

I wrote a script to run the type generation command named `typegen` to generate the output file in `libs/shared/src/schema.ts`.

```json
// apps/todo-server/package.json
{
  "scripts": {
    "typegen": "openapi-typescript ./openapi.json -o ../../libs/shared/src/schema.ts"
  }
}
```

Now, you can generate types using the following command.

```bash
pnpm run typegen
```

This will create types in the specified path of the `schema.ts` file. Next, we can write code to utilize these types in the client project.

## Using Types in the Client

The types are now generated in the shared folder. Therefore, let’s export these types in the entry point of the shared folder `index.ts` (or it can also point to another file if the `main` field in the shared package's `package.json` is set differently).

```typescript
// libs/shared/src/index.ts
export * from "./schema";
```

Let’s build the shared folder. In summary, the type generation process involves the API being modified, the server being executed, and the `openapi.json` file being updated. Then, using the server's `typegen` script, types are generated from the OpenAPI documentation and finally built in the shared folder.

```bash
# Run this in the libs/shared folder
pnpm run build
```

This will create built files in the `libs/shared/dist` folder. Now we can utilize these types in the client project (`todo-client`). In the client project's `api.ts` file, we can import and use the types created in the shared folder. To achieve optimal usage, we should properly define the `exports` field in the shared/package.json to denote the entry point for the shared folder.

```json
// libs/shared/package.json
{
	"name": "@toy-monorepo/shared",
	"main": "./dist/index.js",
	"module": "./dist/index.js",
	"types": "./dist/index.d.ts",
	"exports": {
		".": {
			"import": "./dist/index.js",
			"types": "./dist/index.d.ts"
		}
	},
  // ...
}
```

Now, let’s use these types to create the axios instance in the client project, `apps/todo-client/src/api.ts`, as shown below. For reference on the types generated, check the created type file (`schema.ts`) format and also refer to the [official documentation of openapi-typescript](https://openapi-ts.dev/introduction).

```ts
// apps/todo-client/src/api.ts
import { components, paths } from "@toy-monorepo/shared";

// Extract types from OpenAPI
export type TodoEntity = components["schemas"]["TodoEntity"];
export type CreateTodoDto = components["schemas"]["CreateTodoDto"];
export type UpdateTodoDto = components["schemas"]["UpdateTodoDto"];
// Example of extracting response types
export type FindTodoResponse =
	paths["/todos"]["get"]["responses"][200]["content"]["application/json"];
```

We can now utilize these types as shown below. For example, here’s how to use `CreateTodoDto` to create a new todo.

```ts
// apps/todo-client/src/App.tsx
const addTodo = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!userId || !newTodoValue.trim()) {
    alert("Please enter a task.");
    return;
  }

  try {
    const data: CreateTodoDto = {
      title: newTodoValue.trim(),
      userId,
      completed: false,
    };
    const response = await todoAPI.post<TodoEntity>("/todos", data);
    setTodos([...todos, response.data]);
    setNewTodoValue("");
  } catch (error) {
    console.error("Failed to add task:", error);
  }
};
```

Using the created types, we can further enhance them to create type-safe functions for making API calls. The focus of this article is to automate type generation and share them across the projects within the monorepo, so I won't delve into that here. However, if necessary, you might check out [Automatic Type Generation with Swagger (feat. openapi-typescript)](https://medium.com/@devparkoon/%EB%8D%94-%EC%9D%B4%EC%83%81-%EC%8A%A4%EC%9B%A8%EA%B1%B0-%EB%B3%B4%EA%B3%A0-%ED%83%80%EC%9E%85%EC%9D%84-%ED%83%80%EC%9D%B4%ED%95%91%ED%95%98%EC%A7%80-%EC%95%8A%EA%B8%B0-feat-openapi-typescript-0229a0581109) for more details.

# Other Type Generation Tools

There are various tools available to generate types from OpenAPI. `openapi-generator` and `swagger-typescript-api` are two of them, among other options. Let's examine these two tools and how they work in generating types.

## OpenAPI Generator

The `openapi-generator` generates client, server, and model code compatible with various programming languages and frameworks based on OpenAPI specifications. It supports not only TypeScript but also a variety of languages like Java and Go. For a comprehensive list of generators, refer to the [OpenAPI Generator documentation](https://openapi-generator.tech/docs/generators).

To use this tool, you first need to install `openapi-generator-cli`.

```bash
pnpm add -D @openapitools/openapi-generator-cli
```

Then, you can add a type generation script in the server's `package.json` as shown below. This script uses the `openapi.json` file and the `typescript-fetch` template, generating types and saving them in the `libs/shared/src/api` folder.

```json
// apps/todo-server/package.json
{
  "scripts": {
    "typegen": "openapi-generator-cli generate -i ./openapi.json -g typescript-fetch -o ../../libs/shared/src/api"
  }
}
```

Using the command below will generate the types.

```bash
pnpm run typegen
```

This will create an `api` folder and a `models` file within the shared folder, generating types and clients for API calls. You can utilize these in your client code. This tool additionally supports runtime validation for API calls.

However, a downside is that a large number of files containing types will be generated, potentially leading to redundancy. Furthermore, due to the extensive language support, the quality of support for each individual language can sometimes feel inadequate. The resulting code, especially for APIs exceeding ten in number, could become quite extensive. 

![OpenAPI Generator results](./openapi-generated.png)

Given these downsides, alternative tools like `openapi-typescript` or `swagger-typescript-api` that are lightweight and focused on TypeScript have emerged.

Nevertheless, being a more substantial library, `openapi-generator` offers more specific configurations and features. You can read more about this in articles like [Automatically Generate Safe Models and Structured Implementation Code with OpenAPI Generator](https://velog.io/@kdeun1/OpenAPI-Generator%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-API%EC%99%80-%EB%8F%99%EC%9D%BC%ED%95%9C-Model%EA%B3%BC-%EC%A0%95%ED%98%95%ED%99%94%EB%90%9C-API%EC%BD%94%EB%93%9C-%EC%9E%90%EB%8F%99%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0) and [How Should OAS Generators Be Used on the Front-end?](https://hmos.dev/how-to-use-oas-generator).

## Swagger Typescript API

`swagger-typescript-api` generates types and API clients based on OpenAPI 2.0 or 3.0 documents. First, install the library.

```bash
pnpm add -D swagger-typescript-api
```

Then, you can add a script to generate types using the `openapi.json` file as shown below. The resulting types will be stored in the `libs/ts-api` folder.

```json
// apps/todo-server/package.json
{
  "scripts": {
    "typegen": "swagger-typescript-api -p ./openapi.json -o ./libs/ts-api"
  }
}
```

Similar to earlier, you can execute the command below to generate the types.

```bash
pnpm run typegen
```

This will create files in the `libs/ts-api` folder containing types and API clients. By default, it generates a fetch client, but you can use the `--axios` option in the command to generate an axios client instead.

There are many other options available. For instance, if you provide the `--no-client` option, it will only generate types without creating any client code. You can verify all options in the [swagger-typescript-api repository README](https://github.com/acacode/swagger-typescript-api). However, since I did not require the runtime client in this case, I did not utilize this library.

# References

Setting up a Frontend Monorepo with pnpm

https://jasonkang14.github.io/react/monorepo-with-pnpm

React Router Documentation

https://reactrouter.com/start/library/routing

Nest.js Documentation, Prisma

https://docs.nestjs.com/recipes/prisma

Nest.js Documentation, Authentication

https://docs.nestjs.com/security/authentication

Nest.js Documentation, OpenAPI section

https://docs.nestjs.com/openapi/introduction

Monorepo Introduction Journey

https://medium.com/@june.programmer/repository-monorepo-%EB%8F%84%EC%9E%85%EA%B8%B0-3eeea7027119

Building a REST API with NestJS and Prisma

https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0

Prisma Documentation, Seeding

https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

FEConf 2020, Developing APIs Type-Safely with OpenAPI Specification: Hope vs. Despair

https://www.youtube.com/watch?v=J4JHLESAiFk

Madup Tech Blog, Will Not Use OpenAPI Generator while using TypeScript?

https://tech.madup.com/openapi-generator/

Applying Automatic Swagger Type Generation (feat. swagger-typescript-api)

https://velog.io/@ktw3577/Swagger-%ED%83%80%EC%9E%85-%EC%9E%90%EB%8F%99-%EC%83%9D%EC%84%B1%EA%B8%B0-%EC%A0%81%EC%9A%A9%EA%B8%B0feat.-swagger-typescript-api

Implementing OpenAPI Generator CLI

https://velog.io/@ktw3577/Openapi-generator-cliSwagger-Codegen-%EC%A0%81%EC%9A%A9%EA%B8%B0

Automatically Generate Safe Models and Structured Implementation Code with OpenAPI Generator

https://velog.io/@kdeun1/OpenAPI-Generator%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-API%EC%99%80-%EB%8F%99%EC%9D%BC%ED%95%9C-Model%EA%B3%BC-%EC%A0%95%ED%98%95%ED%99%94%EB%90%9C-API%EC%BD%94%EB%93%9C-%EC%9E%90%EB%8F%99%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0

npm swagger-typescript-api

https://www.npmjs.com/package/swagger-typescript-api

Openapi-typescript website

https://openapi-ts.dev

Convenient API Generator swagger-typescript-api

https://yozm.wishket.com/magazine/detail/2387/

Building Libraries and Deploying - (2) tsconfig and ESM, CJS

https://0422.tistory.com/361

Understanding TypeScript Compiler and Module Systems

https://0422.tistory.com/362