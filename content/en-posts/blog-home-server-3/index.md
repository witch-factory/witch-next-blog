---
title: Deploying a Blog on a Home Server - Towards Better Deployment
date: "2023-10-03T04:00:00Z"
description: "Firewall configuration, automatic deployment"
tags: ["blog"]
---

> This article may lack depth as it was created with much help from Bulkan, who built a server slightly before me. I would appreciate any comments pointing out inaccuracies or areas for improvement.

This continues from the article [Deploying a Blog on a Home Server - Publishing a Blog](https://witch.work/posts/blog-home-server-2).

# 1. Preventing DDoS Attacks

My blog is currently running on `blog.witch.work`. This was achieved through a process as shown below.

![My Domain Connection Structure](./how-my-domain-works.png)

However, if someone executes a DDoS attack on it, my small capacity server would collapse. Therefore, I decided to configure a firewall.

[One of the prominent names in this field in Korea, Dalsu, has already written an article titled "Preventing Dos and Ddos with Pfsense" which I followed closely.](https://blog.dalso.org/home-server/firewall/3358)

## 1.1. Filtering

Configure the system to block any IP that attempts to connect more than 10 times per second. Although [land attacks](https://m.blog.naver.com/brickbot/220416019291) may render this ineffective due to varying source IPs, it is useful against other types of attacks.

Edit the rule for port 443, which handles external connections, in pfsense's Firewall > Rules > WAN. (As noted in the previous article, all external connections are processed on port 443 via HAProxy.)

![pfsense-rule](./pfsense-interface-rule.png)

Scroll down to find Extra Options, and set the Advanced Options. Click on Display Advanced to show the settings window. You can set how many connections are allowed per second under `Max. src. conn. Rate` and `Max. src. conn. Rates`. I set it to 20.

![max rate 설정](./max-src-conn-rate.png)

## 1.2. SYN Proxy Configuration

SYN Proxy is a method to mitigate SYN Flood attacks, which exhaust server resources by continuously sending SYN packets during the TCP 3-way handshake process.

SYN Proxy allows the firewall to first establish a 3-way handshake with the client and then relay the connection information to the server once the connection is successfully made.

Thus, the server will only receive information about legitimate connections, effectively blocking SYN Flood attacks.

This can also be configured by modifying the port 443 rule in Firewall > Rules > WAN.

![pfsense-rule](./pfsense-interface-rule.png)

As before, set the Extra Options - Advanced Options. Set `State Type` to `SYN Proxy`.

![syn proxy 설정](./syn-proxy.png)

After configuring, click Save - Apply Changes to implement the settings. SYN Proxy only applies to TCP rules (since it is inherently based on the 3-way handshake), so I changed the rule to TCP.

## 1.3. Using SYN Cookies

This involves sending a special cookie value in the SYN-ACK packet in response to a SYN packet. If an ACK is received for the SYN-ACK packet, the cookie value is validated, and the connection is established if it is correct.

By sending the necessary information for connection establishment through cookies, we can avoid using the SYN Backlog Queue, thus preventing SYN Flood attacks that could fill the SYN Backlog Queue.

Set the value of `net.inet.tcp.syncookies` to 1 in System > Advanced - System Tunables. It was set to this value by default.

![syn cookie 설정](./syn-cookie-rule.png)

# 2. Automatic Deployment

Currently, to update my blog deployed on `blog.witch.work` after making changes in git, I need to log into the server and execute the following commands:

```bash
git pull origin main
yarn run build
pm2 restart blog
```

I wanted to automate this, but there was very little information available. Let's consider what needs to be done.

## 2.1. Concept

The simplest tool for automating deployment, as far as I know, is GitHub Actions. GitHub Actions is a CI/CD tool provided by GitHub. Therefore, let’s use it. Regardless of the tool, I'm still a beginner...

So when a push event occurs on GitHub, I will SSH into my Proxmox container and execute the above script. It would also be convenient to create a folder like `deploy.sh` inside the container.

## 2.2. SSH Connection Setup

To enable SSH access, you need to create an account. Although you can change `PermitRootLogin` to `yes` in `/etc/ssh/sshd_config` to log in as root, this is not secure. Therefore, let's create a new account.

```bash
sudo adduser my_id
sudo passwd my_id
-> Enter password
```

Now try connecting using the internal IP. You can access it by `ssh my_id@internal-ip` and enter the password to enter the blog container.

Now, let's allow external IP access. But first, let's modify the SSH server configuration file. SSH typically connects through port 22, which is too common, so let's use a different port number. Open the configuration file with nano.

```bash
sudo nano /etc/ssh/sshd_config
```

In the configuration file, there will be a section labeled `#Port 22`. Change this to `Port my_custom_port`. Next, restart the server daemon to apply the changes.

```bash
sudo systemctl restart sshd
```

Now, you should connect using `ssh my_id@internal-ip -p my_custom_port` to access the blog container.

To allow external IP access, port forwarding needs to be set up. Currently, port forwarding is being handled in pfsense, so we need to configure that.

Go to Firewall - NAT - Port Forward and click Add to create a new port forwarding rule. This rule will forward a specific port from the external IP to a specific port on the internal IP.

![ssh 포트포워딩](./ssh-portforwarding.png)

After applying this, accessing the specified port on the external IP will connect you to the blog container.

However, the current pfsense firewall may still block that port. Therefore, we need to allow it.

Go to Firewall - Rules - WAN, click Add to create a new rule, and set it to allow requests from any source to port 22443.

![ssh firewall](./ssh-firewall-rule.png)

Now you can connect to your container using the following command.

```bash
ssh my_id@my_external_ip -p my_forwarded_port
```

If you encounter a `Connection refused` error, check whether the SSH service is running on the server. If it's not, start it with the following command.

```bash
sudo service ssh start
```

If something goes wrong here, it could lead to failures in GitHub Actions due to I/O timeouts, so ensure everything is set up correctly.

## 2.3. GitHub Actions

Now, let’s automate this with GitHub Actions. GitHub Actions uses a `.yml` file in the `.github/workflows` folder. I created one named `main.yml`.

[Of course, someone has already created a library for this called `ssh-action`, so let’s use that.](https://github.com/appleboy/ssh-action)

The example provided by that library looks like this. I made slight adjustments to the timeout and script.

```yml
name: CICD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: executing remote ssh commands using password
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        password: ${{ secrets.PASSWORD }}
        port: ${{ secrets.PORT }}
        timeout: 60s
        script: |
          whoami
          echo "cicd"
```

`secrets` is a space provided by GitHub to store confidential information. This allows confidential information to be used within GitHub Actions. Therefore, we need to set it up.

You can add a new secret by going to GitHub repository - Settings - Secrets and variables and using the `New repository secret` button. The secrets I've used are as follows.

```
HOST: my_external_ip
USERNAME: my_id
PASSWORD: my_password
PORT: my_forwarded_port
```

![github secrets](./github-secrets.png)

## 2.4. Configuring SSH Key Access

However, wait! With this setup, anyone who knows my password can easily access my container. Of course, since everything is available in both GitHub and locally, if someone finds my password and wipes the container data, it won’t have a huge impact, but we should still enhance security.

Let's set it up so that SSH access can only occur via SSH keys and have GitHub Actions access it the same way.

[The ssh-action library provides a very good guide for setting this up.](https://github.com/appleboy/ssh-action#setting-up-a-ssh-key)

[A related Tistory article is also helpful.](https://bug41.tistory.com/entry/Github-Github-Actions-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94%EB%B2%95-SSH-%EC%97%B0%EA%B2%B0)

First, execute the command to create an RSA key. Note that this should be done on the local machine (like my MacBook), not in a remote environment.

```
The best practice is create the SSH Keys on local machine not remote machine.
```

Anyway, run the following command in the Mac terminal.

The input of my GitHub email in the next command is just for my own reference, so it doesn't matter much whether you do it or not. Anyway, after executing the following command, `~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub` will be created.

```bash
ssh-keygen -t rsa -b 4096 -C "my_github_email"
```

For your information, `-t` is the encryption type, `-b` is the bit size, and `-C` is a comment (though the original word is 'comment').

Now, add the contents of the public key to the server's authorized key list.

```bash
cat .ssh/id_rsa.pub | ssh [my_id]@[my_container_ip] -p [port_number] 'cat >> .ssh/authorized_keys'
```

Next, we need to register my private key as a secret in GitHub.

Similar to the above steps, go to the GitHub repository - Settings - Secrets and variables and use the `New repository secret` button to add a new secret named `KEY`.

Just paste the contents of my private key directly. You can use the `pbcopy` command for this. Running the following command in your Mac will copy the private key to the clipboard.

```bash
pbcopy < ~/.ssh/id_rsa
```

Then modify `main.yml` as follows to use the key instead of the password.

```yml
name: CICD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: executing remote ssh commands using password
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        # Just change this part
        key: ${{ secrets.KEY }}
        port: ${{ secrets.PORT }}
        timeout: 60s
        script: |
          whoami
          echo "cicd"
```

### 2.4.1. Restricting to SSH Key Only

You can also disable password access entirely. Let's edit the SSH daemon configuration file.

```bash
sudo nano /etc/ssh/sshd_config
```

You will find a section that likely has comments enabled by default. This section determines whether to allow password authentication, and the default value is yes, which is why we were able to access via password.

Uncomment this line and change it to `no`.

```bash
# To disable tunneled clear text passwords, change to no here!
PasswordAuthentication no 
```

Then restart the SSH daemon.

```bash
sudo systemctl restart sshd
```

After this, attempting to access via password will yield a `Permission denied (publickey).` message, while our configured GitHub Action will work flawlessly due to the KEY being provided.

Now, let's execute the commands originally intended via the GitHub Action script.

## 2.5. Writing Shell Script

First, let’s place the script written above into the container where my blog is deployed. I placed mine in `/home/witch/build.sh`.

```bash
cd witch-next-blog
echo "in my blog page"

git pull origin main
echo "recent job pull done"

yarn run build
echo "yarn build done"

pm2 restart blog
echo "process restart done"
```

You will see the command executing successfully when you run `bash build.sh`. Now, we’ll have the GitHub Action execute that script after SSH access.

```bash
    steps:
    - name: executing remote ssh commands using password
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        port: ${{ secrets.PORT }}
        timeout: 60s
        script: |
          whoami
          echo "cicd"
          # Add this command
          bash build.sh
```

# 3. Troubleshooting - Environment Variable Issues

## 3.1. Problem Overview

However, after doing this and running `bash build.sh`, an issue arises. In fact, it was a problem that existed from before, but I had been overlooking it until now... An error occurs at `contentlayer build`, stating that it cannot properly convert Markdown files.

```bash
Error: Found 184 problems in 184 documents.

 └── Encountered unexpected errors while processing of 184 documents. This is possibly a bug in Contentlayer. Please open an issue.

     • "binary-search/index.md": UnexpectedMarkdownError: Must supply api_key
     # Errors like it cannot find api_key...
     
error Command failed with exit code 1.
```

So how have I solved this until now? I would first run `yarn dev`, complete the document generation of contentlayer, and then run `yarn run build`, which worked well. However, it's difficult to use this method when executing shell files in GitHub actions. Therefore, I decided to trace the root cause.

## 3.2. Root Cause Analysis

While the message indicated it could be a contentlayer error, the likelihood is very low. Therefore, I decided to investigate why this error occurred in my program.

First, where is the `api_key` being utilized? A few months ago, I wrote an article about an automatic thumbnail generation plugin for articles [that uploads thumbnails automatically to Cloudinary CDN](https://witch.work/posts/blog-remake-9).

The `api_key` is part of that automatic upload process with Cloudinary. There is a configuration object defined in `src/utils/cloudinary.ts` as follows.

```ts
// src/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
```

Thus, during the build phase, contentlayer converts the `.md` files into JSON. The custom file `make-thumbnail.mjs` I created among the remark plugins uses `process.env.CLOUDINARY_API_KEY`, which is why the error occurred — because it could not find that environment variable.

But why did it work when I ran `yarn dev`? When executing `yarn dev`, let’s take a look at the output messages.

```bash
me@me-ui-MacBookAir nextjs-blog % yarn dev
yarn run v1.22.19
$ yarn run copyimages
$ node ./src/bin/pre-build.mjs
$ next dev
- info Loaded env from /Users/kimsunghyun/Desktop/nextjs-blog/.env.local
- ready started server on [::]:3000, url: http://localhost:3000
- event compiled client and server successfully in 933 ms (20 modules)
- wait compiling...
Contentlayer config change detected. Updating type definitions and data...
- event compiled client and server successfully in 146 ms (20 modules)
- info Loaded env from /Users/kimsunghyun/Desktop/nextjs-blog/.env.local
- info Loaded env from /Users/kimsunghyun/Desktop/nextjs-blog/.env.local
Generated 184 documents in .contentlayer
```

[Next.js](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables) automatically loads the `.env` files to use. The message `info Loaded env ...` confirms this.

So what happens when I run `yarn run build` after `yarn dev`, in other words, when the build occurs successfully? The following message is shown.

```bash
me@me-ui-MacBookAir nextjs-blog % yarn run build
yarn run v1.22.19
$ yarn run copyimages
$ node ./src/bin/pre-build.mjs
$ contentlayer build && next build
Generated 184 documents in .contentlayer
- info Loaded env from /Users/kimsunghyun/Desktop/nextjs-blog/.env.local
- info Creating an optimized production build
- info Compiled successfully
# and more...
```

If you observe the messages carefully, you can see that during `yarn dev`, the environment variables are loaded first, allowing contentlayer to process the task with necessary variables present. In contrast, in `yarn run build`, the environment variables were still not loaded when contentlayer tried to complete its tasks, which led to the error.

> Since environment variables are only used in thumbnail generation, removing `makeThumbnail` from `contentlayer.config.js'`s `remarkPlugins` allowed the build to succeed.

Summarizing the distinctions and problem scenarios between `yarn dev` and `yarn run build`, we get:

![Problem Situation](./yarn-dev-and-yarn-build.png)

Thus, the solution is to load the environment variables before `contentlayer build`. For reference, there was no issue with deployments on Vercel, as Vercel’s build commands seem to preload the environment variables.

## 3.3. Problem Resolution

I examined if Next.js could load environment variables automatically quicker, but I couldn't find time to implement that, so I resolved the issue by loading the environment variables before `contentlayer build`.

[In Unix-based systems like MacOS, you can use the `export` command to set environment variables.](https://www.daleseo.com/js-node-process-env/) Therefore, I added the following to my `build.sh`. The `environment_value` should be the values of the environment variables I use. I copied and pasted the values from the local `.env.local`.

```bash                         
cd witch-next-blog
echo "in my blog page"

git pull origin main
echo "recent job pull done"

export NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=environment_value
export CLOUDINARY_API_KEY=environment_value
export CLOUDINARY_API_SECRET=environment_value
export CLOUDINARY_URL=environment_value
echo "environment variable setting"

yarn run build
echo "yarn build done"

pm2 restart blog
echo "process restart done"
```

Next, I modified the GitHub Actions configuration file `.github/workflows/main.yml` as follows, adding `bash build.sh` in the `script` section and increasing the timeout duration.

```yml
name: CICD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: executing remote ssh commands using password
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        port: ${{ secrets.PORT }}
        timeout: 180s
        script: |
          whoami
          echo "cicd"
          bash build.sh
```

After pushing to the main branch this way, it confirmed that the GitHub action worked properly, and `yarn run build` and deployment were successful.

# References

**Blocking DDoS Attacks with Pfsense Firewall**: https://blog.dalso.org/home-server/firewall/3358

**SYN Proxy**: https://yunseoks.tistory.com/41

**Syn Cookies**: https://itwiki.kr/w/Syn_Cookie

**Ubuntu 22.04 - Enabling SSH Access, Port Configuration, and Connection Methods**: https://osg.kr/archives/1269

**GitHub Actions - Executing Commands via SSH on External Servers**: https://velog.io/@sweetchip/Github-Actions-%EC%99%B8%EB%B6%80-%EC%84%9C%EB%B2%84%EC%97%90-SSH%EB%A1%9C-%EC%A0%91%EC%86%8D%ED%95%B4%EC%84%9C-%EC%BB%A4%EB%A7%A8%EB%93%9C-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0

**Getting Started with GitHub Actions**: https://velog.io/@jeongs/GitHub-Actions-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0

**Using SSH with GitHub Actions**: https://bug41.tistory.com/entry/Github-Github-Actions-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94%EB%B2%95-SSH-%EC%97%B0%EA%B2%B0

**Disable Password Authentication for SSH**: https://stackoverflow.com/questions/20898384/disable-password-authentication-for-ssh

**Handling Environment Variables in Node.js**: https://www.daleseo.com/js-node-process-env/

**Next.js - Environment Variables Documentation**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables