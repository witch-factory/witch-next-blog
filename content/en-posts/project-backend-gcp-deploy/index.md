---
title: Deploying MySQL, Prisma, NodeJS Server to Google Cloud Platform
date: "2024-07-15T00:00:00Z"
description: "This document outlines the process of deploying the backend for the Sinchon Union Algorithm Camp to Google Cloud Platform."
tags: ["study", "web"]
---

# Introduction

This document continues from [Creating Attendance Page for Sinchon Union Algorithm Camp - Setting Up Development Environment](https://witch.work/posts/sinchon-attendance-project). It summarizes the process of creating a database for attendance management at Sinchon Union, setting up a server connected to it, and deploying it to the network. A domain will also be linked.

While there is a method to create a separate database like Google Cloud SQL and connect it with the server, this time we will use a method where the database and server are on the same virtual machine. We will first ensure that it runs, and later consider backup and database isolation solutions.

# 1. Configuring the Virtual Machine

Reference was made to [Comprehensive Guide to Deploying Springboot with Docker+GCP (Try using GCP VM, Cloud SQL instead of AWS EC2, RDS)](https://choo.oopy.io/5c999170-dde5-4418-addc-00a0d263287c).

## 1.1. Creating Project and Virtual Machine

First, visit [Google Cloud Platform](https://cloud.google.com/) and create a project. Once the project is created, the console will appear, where a virtual machine can be created under the Compute Engine - VM instances menu.

![Creating GCE Instance](./make-gce-instance.png)

Set the boot disk to Ubuntu 20.04 LTS x86_64. For security purposes, click the default item in the network interface and set the external IP address of the alias IP range to none. Although it is possible to create the cheapest e2-micro instance, it is better to create an e2-medium instance with more memory for deployment, so I opted for somewhat higher spending.

## 1.2. Configuring External IP Address

The external IP address can be set through static IP reservation as explained in the link above. You can reserve an external IP address under the VPC Network - IP address menu in the left sidebar of the console.

I naturally reserved an IP address in the Seoul region (asia-northeast3). This IP address will later be linked to the domain.

The other settings are default. The standard service tier and IPv4 for the IP version. Also, when configuring the IP address, don't forget to set the target to the virtual machine instance, which can be set below the region configuration.

## 1.3. Configuring the Firewall

In the VPC Network - Firewall menu, you need to open the ports for external access. I opened port 8080 as mentioned in the reference link above. More detailed screenshots can be found in [Creating a Web Server with Docker on Google Cloud Platform](https://kibbomi.tistory.com/241).

Now, once the server listens on port 8080, you can access it via `fixedIPAddress:8080`.

# 2. Configuring Docker and MySQL

The server we aim to set up will operate as follows: MySQL is installed on port 3306 of the virtual machine, and the Node.js server is installed on port 8080. Both are contained within Docker containers. The Node.js server connects to MySQL to read and write data, and externally, nginx forwards requests coming in on port 80 to port 8080.

![Server Structure](./server-structure.png)

## 2.1. Installing Docker

You can install Docker on your virtual machine by referring to [Installing Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/).

Access the virtual machine by clicking the SSH button in the Compute Engine list.

![SSH Button in GCE Console](./gce-ssh-button.png)

Then, follow the link to enter the commands and install Docker.

## 2.2. Running MySQL DB Docker Container

MySQL DB must be running for the NodeJS server to fetch data later. Let's download the MySQL image and run it by referring to [Installing and Connecting to MySQL Using Docker by poiemaweb](https://poiemaweb.com/docker-mysql).

Since I will be downloading MySQL 8.0, enter the following command:

```bash
docker pull mysql:8.0
```

This command will download the MySQL 8.0 image. Next, run it as follows. The `-v` flag is used to specify a volume to store data, ensuring that the data remains even if the container is terminated.

```bash
docker run --name mysql-container -p 3306:3306 -v /tmp/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD={your_password} -d mysql
```

Check if the container is running by entering `docker ps` and accessing it. Since there is data in Korean, [you need to configure the locale to use UTF-8 (using `-e LC_ALL=C.UTF-8`)](https://songacoding.tistory.com/66).

```bash
docker exec -e LC_ALL=C.UTF-8 -it mysql-container bash
# Enter mysql when bash is opened
mysql -u root -p
```

Now connect to MySQL, create a database, and create tables. Eventually, prisma will take care of this, but we want to confirm that everything is working. The data will be erased when initializing the tables with prisma later.

You can check databases and current tables by using the `show databases` or `show tables` commands. As seen with names like "김철수," this is fake data generated by ChatGPT.

```sql
CREATE DATABASE attendance_db;
USE attendance_db;

CREATE TABLE student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10),
    school VARCHAR(10),
    boj_handle VARCHAR(30),
    email VARCHAR(50),
    phone VARCHAR(20),
    money_type VARCHAR(5),
    is_invited BOOLEAN,
    is_canceled BOOLEAN
);

INSERT INTO student (name, school, boj_handle, email, phone, money_type, is_invited, is_canceled)
VALUES
    ('김철수', '연세대학교', 'chulsoo123', 'chulsoo@example.com', '010-1234-5678', '3', TRUE, FALSE),
    ('이영희', '서강대학교', 'younghi456', 'younghi@example.com', '010-2345-6789', '3', FALSE, FALSE),
    ('박지민', '홍익대학교', 'jimin789', 'jimin@example.com', '010-3456-7890', '6', TRUE, TRUE),
    ('최현우', '이화여자대학교', 'hyunwoo1011', 'hyunwoo@example.com', '010-4567-8901', '6', FALSE, FALSE),
    ('정소연', '숙명여자대학교', 'soyeon1213', 'soyeon@example.com', '010-5678-9012', '3', TRUE, FALSE);

SELECT * FROM student; -- Confirm that the data is correctly entered
```

# 3. Configuring the NodeJS Server

Since the MySQL DB is in a Docker container, let's set up a server that can retrieve it. Let's assume NodeJS is already installed.

## 3.1. Writing Server Code

Although a more complex DB was actually created, this document simplifies it for the deployment process. First, let's initialize the project and install prisma. Express is used for easier server configuration.

```bash
# Navigate to project folder
npm init -y
npm install express prisma @prisma/client
npx prisma init # Initialize prisma and create folder
```

Open the generated `prisma/schema.prisma` file and add the Student model as follows.

```prisma
datasource db {
  provider = "mysql" // or whatever type of database you are using
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum School {
  YONSEI
  SOGANG
  HONGIK
  EWHA
  SOOKMYUNG
}

model Student {
  id               Int                @id @default(autoincrement())
  name             String             @db.VarChar(50)
  bojHandle       String             @db.VarChar(50) @unique
  email            String
  phone            String             @db.VarChar(20)
  school           School             @default(SOGANG)
  studentNumber   String             @db.VarChar(20) // Student number
}
```

Then, set the `DATABASE_URL` environment variable in the `.env` file by referencing the [Connection URLs Documentation of Prisma](https://www.prisma.io/docs/orm/reference/connection-urls).

Next, run prisma migrate and generate the client.

```bash
npx prisma migrate dev --name init
npx prisma generate
npm install @prisma/client
```

Now let's create the NodeJS server. Create an `index.js` file and write the following code.

```javascript
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();

app.get('/', async (req, res) => {
  const students = await prisma.student.findMany();
  res.json(students);
});

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
```

Set the `start` and `dev` scripts in package.json as follows. The `dev` script uses nodemon to automatically restart the server. You need to install it using `npm install --save-dev nodemon`, but you can also use node if you prefer.

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

## 3.2. Building the Server Docker Container

Reference materials include [[Docker] Building a Server with Docker](https://ebbnflow.tistory.com/m/206).

Now let's put the NodeJS server into a Docker container. First, create a Dockerfile for building the Docker container. The `DATABASE_URL` variable is set because prisma uses it to generate the client. We need to use the `--build-arg` option when running `docker build`.

```dockerfile
# Set up based on the official Node.js image
FROM node:20

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Create app directory
WORKDIR /usr/src/app

# Add app source
COPY . .

# Install application dependencies
# Copy package.json and package-lock.json
COPY package*.json /usr/src/app

RUN npm install

# Install Prisma CLI and run prisma generate
RUN npx prisma generate

# Expose port used by the app
EXPOSE 8080

# Command to run when the container starts
CMD ["npm", "start"]
```

Now, perform the build locally. I have simply named it nodeapp for testing since I plan to use docker-compose later.

```bash
docker build --build-arg DATABASE_URL=${DATABASE_URL} -t nodeapp .
# Check if the docker image was created correctly
docker images
```

To run it, execute `docker run -p 8080:8080 nodeapp`. Now you should be able to confirm that the server is running by accessing `localhost:8080`.

If it doesn't work, you might encounter an error indicating that the prisma files are missing. In that case, add a line to copy the prisma folder in the Dockerfile.

```dockerfile
# Copy Prisma schema file
COPY prisma /usr/src/app/prisma
```

## 3.3. Pushing the Server Docker Container

Since we will need to fetch and run this from the virtual machine later, we must upload the Docker image somewhere. This can be done using Docker Hub or GitHub Container Registry. I will use the GitHub Container Registry. Reference [Sharing Docker Images via GitHub | Packages Container Registry](https://mvje.tistory.com/172).

In this link, you need to create a Personal Access Token to upload images to GitHub. Follow [Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) to create and copy the Personal Access Token, then set it as an environment variable.

```bash
export CR_PAT=YOUR_TOKEN
```

Next, upload the built image to the GitHub Container Registry as follows.

```bash
# Login
echo $CR_PAT | docker login ghcr.io -u witch-factory --password-stdin
# Push image
docker tag nodeapp ghcr.io/icpc-sinchon/nodeapp
docker push ghcr.io/icpc-sinchon/nodeapp
```

The image should now be available in the GitHub Container Registry. You can then pull and run this image on the virtual machine. Accessing `your VM instance's static IP:8080` should connect you to the server.

```bash
docker pull ghcr.io/icpc-sinchon/nodeapp
```

# 4. Automating with Github Action and Docker Compose

However, rebuilding the Docker image and pulling it to the virtual machine each time I make changes to the server is cumbersome. Let's automate this using Github Actions.

## 4.1. Github Action

First, create a service account to integrate GitHub Actions with GCP.

You can refer to the 'Creating and Registering a Service Account for GitHub Actions' section in [Practicing CI/CD with GitHub Actions with GCP - Execution Version](https://minkukjo.github.io/devops/2020/08/29/Infra-23/). The official repository from Google at [Google's Official GitHub Actions Repository](https://github.com/google-github-actions/auth) also explains how to create a service account key.

According to the official repository's description, there is a method using workload identity federation. You can consult [How to Securely Use GCP via Workload Identity Federation (feat. AWS)](https://medium.com/@derek10cloud/workload-identity-federation%EC%9D%84-%ED%86%B5%ED%95%B4-%EC%95%88%EC%A0%84%ED%95%98%EA%B2%8C-gcp-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-feat-aws-545232ffb9d2). However, managing the service account keys securely seems sufficient, as they can be registered in GitHub secrets.

Once the service account is created, register it in the GitHub repository secrets under the names `GCE_PROJECT_ID` and `GCE_SERVICE_ACCOUNT_KEY`. The `GCE_SERVICE_ACCOUNT_KEY` is simply the JSON provided as the service account key.

Now, create a `deploy.yml` file in the `.github/workflows` folder and write the following. The name indicates its role in deployment, but you can name it `main.yml` or `ci.yml`, etc.

The rest utilizes libraries provided by GitHub Actions and automates the commands executed previously. There were challenges while configuring the GitHub Action commands.

Previously, I had to generate a new Personal Token to access the GitHub registry. However, [GitHub Actions provides an environment variable called `GITHUB_TOKEN` by default.](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow) This token is used to access the GitHub Container Registry.

The `Deploy to Google Compute Engine` section sends numerous commands in one line that effectively access the virtual machine and executes commands to run the necessary containers. It retrieves the MySQL 8.0 image and the server's image from the GitHub registry. If there is an existing running image, it deletes it.

Also, in order to connect to Google Compute Engine, you need to register `GCE_USERNAME`, `GCE_INSTANCE_NAME`, and `GCE_INSTANCE_ZONE` in the GitHub repository secrets. You can find this information by clicking on the VM instance in the Google Cloud Console.

When connecting via SSH through the browser, you can easily find your USERNAME. The format is appended as `USERNAME@INSTANCE_NAME` in front of the command input line. You can copy and register this directly in the repository's secrets.

```yaml 
name: Deploy to Google Compute Engine

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-20.04
    permissions:
      contents: read
      packages: write
      id-token: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up environment variables
        run: |
          echo "DATABASE_URL=${{ secrets.DATABASE_URL }}" >> .env

      - name: Build and push Docker images
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          docker build \
          --build-arg DATABASE_URL=${DATABASE_URL} \
          -t ghcr.io/${{ github.repository }}/node-app .
          docker push ghcr.io/${{ github.repository }}/node-app

      - name: google auth
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCE_SERVICE_ACCOUNT_KEY }}

      - name: Setup Google Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
        with:
          version: ">= 363.0.0"
          project_id: ${{ secrets.GCE_PROJECT_ID }}

      - name: Deploy to Google Compute Engine
        run: |
          gcloud compute ssh ${{ secrets.GCE_USERNAME }}@${{ secrets.GCE_INSTANCE_NAME }} --zone ${{ secrets.GCE_INSTANCE_ZONE }} --command "\
          sudo docker ps -q | xargs --no-run-if-empty docker container stop && \
          sudo docker ps -a -q | xargs --no-run-if-empty docker container rm && \
          sudo docker images -q mysql:8.0 | xargs --no-run-if-empty sudo docker rmi && \
          sudo docker images -q ghcr.io/${{ github.repository }}/node-app | xargs --no-run-if-empty sudo docker rmi && \
          sudo docker pull mysql:8.0 && \
          sudo docker run --name mysql-container -p 3306:3306 -v /tmp/mysql:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=${{ secrets.MYSQL_ROOT_PASSWORD }} -d mysql && \
          echo ${{ secrets.GITHUB_TOKEN }} | sudo docker login ghcr.io -u ${{ github.actor }} --password-stdin && \
          sudo docker pull ghcr.io/${{ github.repository }}/node-app && \
          sudo docker run -p 8080:8080 -d -e DB_HOST=${{ secrets.DB_HOST }} -e DB_USER=${{ secrets.DB_USER }} -e DB_PASS=${{ secrets.DB_PASS }} -e DB_NAME=${{ secrets.DB_NAME }} -e DB_PORT=3306 ghcr.io/${{ github.repository }}/node-app"
```

## 4.2. Docker Compose

However, this process is challenging to comprehend and modify later. Additionally, launching multiple containers for local testing requires lengthy command lines. To resolve this, we will use Docker Compose.

First, create a `docker-compose.yml` file and write the following configuration, which allows multiple containers to be launched simultaneously.

```yaml
version: "3.8"

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: attendance_db
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  app:
    image: ghcr.io/icpc-sinchon/admin-service-new-backend/node-app
    command: sh -c "npx prisma migrate deploy && npx prisma generate && npm run start"
    ports:
      - "8080:8080"
    environment:
      DB_HOST: db
      DB_USER: {user_name}
      DB_PASS: {your_password}
      DB_NAME: attendance_db
      DB_PORT: ${your_port}
      JWT_SECRET: ${JWT_SECRET}
      DATABASE_URL: ${DATABASE_URL}
    depends_on:
      - db

volumes:
  db_data:
```

Now you can run `docker-compose up -d` locally, and both MySQL 8.0 and the Docker image for the NodeJS server will start simultaneously. Modify the GitHub Action to reflect this change. The rest of the components will remain mostly unchanged, only adjusting the `Deploy to Google Compute Engine` portion.

To do this, you must first install `docker-compose`. Follow the instructions in [Running All Containers at Once with Docker Compose on Ubuntu](https://velog.io/@tekies09/%EC%9A%B0%EB%B6%84%ED%88%AC%EC%97%90%EC%84%9C-Docker-compose%EB%A1%9C-%EB%AA%A8%EB%93%A0-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%ED%95%9C%EB%B0%A9%EC%97%90-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0).

Next, update the GitHub Action to transfer the `docker-compose.yml`, `Dockerfile`, and Prisma folder to the virtual machine using the scp command, and execute the Docker Compose commands upon SSH access to the virtual machine.

While the length of the script has increased, each section's role is now separated, making it easier to understand and modify. Now, updating the `docker-compose.yml` will automatically apply to the virtual machine. The existing container removal and recreation have been simplified to `docker-compose down` and `docker-compose up -d`.

Testing locally is easier as well; if the server image is built, simply run `docker-compose up -d`. The section handling environment variables has also been separated, and as with `GCE_INSTANCE`, new grouping for variables is possible if needed.

```yaml
  - name: Deploy to Google Compute Engine
    env:
      GCE_INSTANCE: ${{ secrets.GCE_USERNAME }}@${{ secrets.GCE_INSTANCE_NAME }}
      GCE_ZONE: ${{ secrets.GCE_INSTANCE_ZONE }}
      MYSQL_ROOT_PASSWORD: ${{ secrets.MYSQL_ROOT_PASSWORD }}
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
      DB_HOST: ${{ secrets.DB_HOST }}
      DB_PORT: ${{ secrets.DB_PORT }}
      DB_USER: ${{ secrets.DB_USER }}
      DB_PASS: ${{ secrets.DB_PASS }}
      DB_NAME: ${{ secrets.DB_NAME }}
    run: |
      gcloud compute scp docker-compose.prod.yml ${GCE_INSTANCE}:~/docker-compose.yml --zone ${GCE_ZONE}
      gcloud compute scp Dockerfile ${GCE_INSTANCE}:~/Dockerfile --zone ${GCE_ZONE}
      gcloud compute scp --recurse ./prisma ${GCE_INSTANCE}:~/prisma --zone ${GCE_ZONE}
      gcloud compute ssh ${GCE_INSTANCE} --zone ${GCE_ZONE} --command "
        echo \"MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}\" > .env
        echo \"DATABASE_URL=${DATABASE_URL}\" >> .env
        echo \"JWT_SECRET=${JWT_SECRET}\" >> .env
        echo \"DB_HOST=${DB_HOST}\" >> .env
        echo \"DB_PORT=${DB_PORT}\" >> .env
        echo \"DB_USER=${DB_USER}\" >> .env
        echo \"DB_PASS=${DB_PASS}\" >> .env
        echo \"DB_NAME=${DB_NAME}\" >> .env
        sudo docker-compose down
        sudo docker-compose pull
        sudo docker-compose --env-file .env up -d
      "
```

Of course, the `build` option exists in Docker Compose, allowing the Docker build to occur within the `docker-compose.yml` file, enabling execution via `docker-compose up -d --build`. However, doing so would lead to `prisma generate` being executed during both the build step and again on the virtual machine, resulting in unnecessary duplication and frequent errors.

Thus, the Docker image building portion is retained as originally commanded, while Docker Compose is exclusively utilized on the virtual machine.

# 5. Additional Tasks

## 5.1. Connecting Domain with Nginx Reverse Proxy

Now that the server is deployed and accessible via `virtual machine static IP:8080`, it will be listening on port 8080, with firewall settings permitting access through this port.

I obtained a domain through Cloudflare. Let's connect to it. Since a static IP is already available, it can be linked as an A record. Go to the Cloudflare dashboard, navigate to the specific domain detail page, and select DNS from the sidebar. Then, add an A record under the DNS management tab.

![Adding A Record](./dns-record.png)

I intended to use the `api` subdomain, so I connected it to that subdomain, but if you want to connect to the root of a domain, you can set it to `@`. Additional details concerning subdomain setup can be found in [My Journey to Adding a Page as a Subdomain to My Domain](https://witch.work/posts/cloudflare-make-subdomain).

However, the issue arises because linking it via A record will direct all traffic to either port 80 or 443, while we only have port 8080 open. To resolve this, we will use Nginx as a reverse proxy. Although a Cloudflare enterprise plan might allow for port redirects, I unfortunately do not have access to such a plan.

SSH into the virtual machine (available via Google Cloud Console) and install Nginx initially.

```bash
sudo apt update
sudo apt install nginx
```

Next, create the Nginx configuration file.

```bash
sudo nano /etc/nginx/sites-available/your_domain
```

Write the configuration as follows, where `server_name` is your connected domain, and `proxy_pass` is the server's address we are forwarding to, which would be the virtual machine's static IP and port 8080.

```nginx
server {
    listen 80;
    server_name api.suapc.kr;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

After saving the file, create a symbolic link and restart Nginx.

```bash
# Create a symbolic link
sudo ln -s /etc/nginx/sites-available/api.suapc.kr /etc/nginx/sites-enabled/
# Test Nginx and restart
sudo nginx -t
sudo systemctl restart nginx
```

If SSL/TLS is handled via Cloudflare, there's no need to install SSL certificates on the server as Cloudflare manages it, and HTTPS will be supported. Additionally, GCP's firewall rules typically permit access on ports 80 and 443 by default. However, if those ports are not open, make sure to adjust your firewall settings to allow both ports for all IPs (`0.0.0.0/0`).

## 5.2. Cleaning Up Docker Images

During the development and deployment process, one day I encountered an issue where SSH access to the VM instance was not possible. I searched for the problem and checked the logs on the Google Cloud VM instances page.

![VM Instance Log](./vm-instance-log.png)

The problem was that the instance's storage was full, preventing SSH access. It turned out that the issue stemmed from accumulating Docker images during builds. To resolve this, first increase the VM instance's capacity to regain access and then clean up the Docker images.

You can follow [Lee Sang-hyup's Guide on Increasing GCP Google Cloud Boot Disk Size](https://velog.io/@723poil/GCP-%EA%B5%AC%EA%B8%80-%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C-%EB%B6%80%ED%8C%85-%EB%94%94%EC%8A%A4%ED%81%AC-%EC%9A%A9%EB%9F%89-%EB%8A%98%EB%A6%AC%EA%B8%B0) for the steps. Alternatively, refer to [Official Google Cloud Documentation on Increasing Persistent Disk Size](https://cloud.google.com/compute/docs/disks/resize-persistent-disk?hl=ko).

After gaining access, modify the deployment `deploy.yml` file to execute the `docker system prune -af` command on the virtual machine. This command will delete unused images, containers, volumes, and networks.

In the command executed via `gcloud compute ssh`, simply add `docker system prune -af` before `docker-compose down`.

```yaml
      - name: Deploy to Google Compute Engine
        run: |
          gcloud compute ssh ${{ secrets.GCE_USERNAME }}@${{ secrets.GCE_INSTANCE_NAME }} --zone ${{ secrets.GCE_INSTANCE_ZONE }} --command "\
          ... omitted ...
          sudo docker system prune -af && \
          sudo docker-compose down && \
          sudo docker-compose pull && \
          sudo docker-compose --env-file .env up -d"
```

## 5.3. Backing Up with Snapshots

However, the current state is not safe. If the virtual machine were to fail completely or if there were issues in the DB volume area, all data would be lost.

While most cloud services offer functionality to create cloud databases and Google Cloud Platform provides Cloud SQL, these services often incur costs. Moreover, given the nature of the data being stored on the server, real-time backups are not critically necessary. So, rather than establishing a new DB instance that incurs costs, I opted for a method of securing minimal safety by taking daily snapshots of the virtual machine.

You can refer to [Creating Scheduled Disk Snapshots](https://cloud.google.com/compute/docs/disks/scheduled-snapshots?hl=ko) to set up snapshot schedules in the Google Compute Engine's Storage menu, linking them to the disks used by the virtual machine.

I created a simple schedule named `default-schedule-1` to take snapshots every morning and connected it to the boot disk. This allows you to view snapshot schedules in the VM instance's boot disk, or check within the Storage - Snapshots menu.

![Created Snapshot Schedule](./making-snapshot.png)

# References

Comprehensive Guide to Deploying Springboot with Docker+GCP (Try using GCP VM, Cloud SQL instead of AWS EC2, RDS)

https://choo.oopy.io/5c999170-dde5-4418-addc-00a0d263287c

Creating a Web Server with Docker on Google Cloud Platform

https://kibbomi.tistory.com/241

Setting Up a Development/Operating Environment with Docker

https://inhibitor1217.github.io/2019/10/25/devlog-docker.html

Issues Encountered When Deploying on Google Cloud Platform via Docker Compose

https://choiblog.tistory.com/147

A GitHub Action for Installing and Configuring the gcloud CLI

https://github.com/google-github-actions/setup-gcloud

Understanding and Utilizing the Concept of Volumes

https://formulous.tistory.com/17

Deleting Containers Prior to Pulling

https://stackoverflow.com/questions/74800773/how-to-avoid-getting-an-error-message-when-there-is-no-docker-container-image-vo

Deploying to Google App Engine in 15 Minutes with GitHub Actions

https://medium.com/humanscape-tech/15%EB%B6%84%EB%A7%8C%EC%97%90-github-actions-%EB%A1%9C-google-app-engine%EC%97%90-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0-ae97e53ed096

Practicing CI/CD with GitHub Actions with GCP - Execution Part

https://minkukjo.github.io/devops/2020/08/29/Infra-23/

Sharing Docker Images via GitHub | Packages Container Registry

https://mvje.tistory.com/172

Publishing and Installing a Package with GitHub Actions

https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions

GitHub Actions (2)

https://velog.io/@greentea/GitHub-Actions-2

Learning More About SSH Connection to GCE (VM)

https://medium.com/google-cloud-apac/gcp-ssh-%EB%A1%9C-gce-vm-%EC%A0%91%EC%86%8D%EB%B0%A9%EB%B2%95-%EC%A2%80-%EB%8D%94-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-cb37dce39f87

In the middle, I increased the default disk size of 10GB as it became insufficient. You can refer to the document on increasing persistent disk size here.

https://cloud.google.com/compute/docs/disks/resize-persistent-disk?hl=ko

Increasing Google Cloud Boot Disk Capacity

https://velog.io/@723poil/GCP-%EA%B5%AC%EA%B8%80-%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C-%EB%B6%80%ED%8C%85-%EB%94%94%EC%8A%A4%ED%81%AC-%EC%9A%A9%EB%9F%89-%EB%8A%98%EB%A6%AC%EA%B8%B0