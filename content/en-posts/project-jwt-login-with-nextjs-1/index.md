---
title: Implementing JWT Login - First Step Preparation
date: "2024-09-03T00:00:00Z"
description: "Prepare the project and set up basic configurations for login implementation"
tags: ["typescript", "javascript", "web"]
---

# This document is in progress.

In this project, I have decided to implement JWT-based login functionality. I will record the steps for creating a simple demo here.

Since I will apply this to an actual project, I will implement the server using Node, Express, and Prisma, and integrate it with a basic React project that has login functionality.

# 1. Server Configuration

First, create a server folder and initialize an npm project, then install the necessary packages. Although pnpm is used in the project where this will be applied, it is not significantly important, so I will use npm.

```bash
# Navigate to the /server folder
npm init -y
npm install express
```

Next, install the required packages for using TypeScript and setting up the development environment.

```bash
npm install -D typescript ts-node @types/node @types/express
```

Initialize the TypeScript configuration file `tsconfig.json`.

```bash
npx tsc --init
```

There is no need to change other configurations significantly, but let’s set the `outDir` to the `dist` folder so that the resulting files generated from transpiling the ts files are created separately since this is a simple example and we won’t separate source files into a separate src folder.

```json
{
  "compilerOptions": {
    // ...
    "outDir": "./dist",
    // ...
  }
}
```

Also, install `nodemon` to automatically restart the server during development.

```bash
npm install -D nodemon
```

To handle requests coming from the client, also install the `cors` package.

```bash
npm install cors
```

Create the `index.ts` file and set up a basic server. Add CORS settings for the localhost address that will act as the client. Later, handle cross-origin requests.

```typescript
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}.`);
});
```

Now, add script commands to `package.json` to run with `ts-node` during development and execute the resulting files in the `dist` folder after build.

```json
{
  "scripts": {
    "start": "ts-node dist/index.js",
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc"
  }
}
```

If you encounter the following error when setting up TypeScript in an existing project and running `npm run dev`, it can be resolved by checking for the `"type": "module"` setting in `package.json` and removing it if present. This setting is unnecessary when using TypeScript and actually causes the mentioned error.

```bash
TypeError: Unknown file extension ".ts" for /Users/kimsunghyun/Desktop/projects/login-practice/server/index.ts
```

# 2. Prisma Setup

We will use a database for storing and retrieving user information, and Prisma as the ORM. Since this is a simple demo, we will use SQLite.

```bash
# Install prisma as a development dependency
npm install prisma --save-dev
# Initialize prisma ORM with sqlite as the data source
npx prisma init --datasource-provider sqlite
```

A `prisma` folder and a `schema.prisma` file should have been created in the project. Open this file and add the following schema. I have added a `User` model to save straightforward user information.

It might be a good choice to use an enum for roles, like `Admin`, `User`, and `Guest`. However, since SQLite does not support enums and to simplify other aspects to focus on the authentication implementation, I have only included the `isAdmin` field, assuming we are distinguishing between admin and regular users.

```prisma
model User {
  /// Primary Key.
  id       Int    @id @default(autoincrement())
  /// User IDs must be unique
  username String @unique
  password String
  isAdmin  Boolean @default(false)
}
```

Then, execute the `npx prisma migrate` command to generate an SQL file based on the newly created schema and apply it to the database. When running this command, `npx prisma generate` will also be executed automatically to create the Prisma Client API based on the defined schema.

```bash
npx prisma migrate dev --name init
```

Since SQLite is an in-memory database, a database file will not be created, and the data will be stored in memory. To check the database file, you can look at the `prisma/dev.db` file.

# 3. Implementing the Signup API

Create a `routes` folder and a `auth.ts` file to implement the login, signup, and logout APIs. As login and logout functionalities will be implemented using JWT in the next section, we will first create the signup API that encrypts and stores information.

First, install the necessary encryption module. I chose `bcryptjs` because it automatically includes salt when hashing and is easy to use. More detailed settings can be done through `genSaltSync`, but I will use the default settings here.

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

Next, create the `routes/auth.ts` file and implement the signup API as follows.

```typescript
// routes/auth.ts
import express, { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const authRouter = express.Router();
const prisma = new PrismaClient();

type RegisterBody = {
  username: string;
  password: string;
};

authRouter.post(
  "/register",
  async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { username, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    // 201 Created
    res.status(201).json(newUser);
  }
);

export default authRouter;
```

Then, add the router to the `index.ts` file.

```typescript
// index.ts
app.use("/auth", authRouter);
```

# 4. Simple Client Implementation

Let’s create login and signup pages for the demo using React.

First, generate the frontend project using the Vite React + TypeScript template.

```bash
npm create vite@latest client -- --template react-ts
```

To handle routing for the login and signup pages, install `react-router-dom`, and install `ky` for HTTP requests.

```bash
npm install react-router-dom ky
```

Define an instance of ky. Add the server domain and include the `credentials: "include"` option since we will be sending requests across different domains.

```typescript
// utils/apiClient.ts
import ky from "ky";

const apiClient = ky.create({
  prefixUrl: "http://localhost:3000",
  credentials: "include",
  throwHttpErrors: false,
});

export default apiClient;
```

## 4.1. Login Page

Define the login page as follows. The styling has not been focused on much, and the functionality has not been implemented yet, so the `handleSubmit` function simply sends a request to the server.

```tsx
import { useState } from "react";
import apiClient from "./utils/apiClient";

type LoginCredentials = {
  username: string;
  password: string;
};

function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(credentials);
    apiClient.post("/auth/login", { json: credentials });
  };

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='username'
          placeholder='Username'
          required
          value={credentials.username}
          onChange={handleChange}
        />
        <input
          type='password'
          name='password'
          placeholder='Password'
          required
          value={credentials.password}
          onChange={handleChange}
        />
        <button type='submit'>Login</button>
      </form>
      <a href='/register'>Sign Up</a>
    </>
  );
}

export default LoginPage;
```

## 4.2. Signup Page

The signup page has also been implemented simply.

Continue...

# References

Prisma Quickstart Documentation

https://www.prisma.io/docs/getting-started/quickstart