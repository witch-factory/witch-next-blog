---
title: Applying HTTPS in Local Development Environment
date: "2024-09-08T00:00:00Z"
description: "Let's explore how to apply HTTPS in a local development environment"
tags: ["web", "tip"]
---

# 1. Overview

While implementing JWT login, I was creating a demo using a simple Vite React project (with login and registration pages) and a Node.js server. I decided to store the token in a cookie.

Upon successful login, the JWT is sent in a cookie to the client, which sends this cookie to the server whenever authentication is required.

Since the frontend and backend run on different origins, the `sameSite: "none"` setting is necessary to facilitate cookie exchange. This setting also requires the `Secure` attribute, meaning HTTPS must be used.

To enable HTTPS in a local development environment, some configuration is needed. The `sameSite:"none"` cookie setting is one of the scenarios described in the [web.dev documentation regarding the use of HTTPS in local development.](https://web.dev/articles/when-to-use-local-https?hl=ko#when_to_use_https_for_local_development_2)

Therefore, let's configure both the server and client to use HTTPS.

## 1.1. Folder Structure

The current folder structure contains client and server folders within the `login` folder. A certificate will be created in the project root and used by both the server and client.

```
login
├── client
│   ├── src
│   ├── package.json
│   └── ...
└── server
    ├── src
    ├── package.json
    └── ...
```

# 2. Creating Certificates

This explanation is based on macOS.

To create certificates, we will use `mkcert`, a tool that facilitates easy certificate generation for local development.

First, install `mkcert` at the project root and create the certificates.

```bash
brew install mkcert
# Add mkcert to the local root CA
mkcert -install
# Create a localhost certificate in the project root
mkcert localhost
```

This will create `localhost.pem` and `localhost-key.pem` files in the project root. Ensure these `.pem` files are not included in version control. Modify the `.gitignore` in the project root to ignore the `.pem` extension.

```
# .gitignore
*.pem
```

Now, these certificates will be used by the server and client.

# 3. Server HTTPS Configuration

Let's configure the Node.js server to use HTTPS with the certificates just created. We will use the `https` module.

```ts
// server/src/index.ts
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";
import https from "https";

const app = express();
const port = 3000;

const options = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem"),
};

// CORS configuration
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware for cookie usage
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

// Start the server
https.createServer(options, app).listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
```

If you wish to redirect HTTP requests to HTTPS, configure it as follows, setting the HTTPS server to run on port 3001 and redirecting HTTP requests on port 3000 to port 3001.

```ts
https.createServer(options, app).listen(port + 1, () => {
  console.log(`Server is running at https://localhost:${port + 1}`);
});

http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://localhost:${port + 1}${req.url}` });
    res.end();
  })
  .listen(port);
```

It is advisable to use status code 301 for GET requests and status code 308 for POST requests, but for simplicity, we will use only 301 here.

# 4. Client Configuration

In Vite, server settings can be configured through the configuration file. The Vite configuration file is automatically executed in the Node environment, allowing the use of the fs module.

Therefore, by passing the options object used in `https.createServer` directly to the `server.https` option, we can run the HTTPS server using the certificates.

```ts
// client/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

const options = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem"),
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: options,
  },
});
```

After this setup, when running the development environment, it will be accessible at `https://localhost:5173`.

# References

Browser Cookies and SameSite Attribute

https://seob.dev/posts/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EC%BF%A0%ED%82%A4%EC%99%80-SameSite-%EC%86%8D%EC%84%B1

When to Use HTTPS for Local Development 

https://web.dev/articles/when-to-use-local-https?hl=ko

Preparing for the New SameSite=None; Secure Cookie Setting

https://developers.google.com/search/blog/2020/01/get-ready-for-new-samesitenone-secure?hl=ko

Using HTTPS in Local Development

https://web.dev/articles/how-to-use-local-https?hl=ko

Vite Server Options

https://vitejs.dev/config/server-options

How to Import File as Text into vite.config.js?

https://stackoverflow.com/questions/73348389/how-to-import-file-as-text-into-vite-config-js

MDN 301 Moved Permanently

https://developer.mozilla.org/ko/docs/Web/HTTP/Status/301