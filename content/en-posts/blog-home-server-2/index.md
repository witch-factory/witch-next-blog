---
title: Deploying a Blog on a Home Server - Uploading the Blog
date: "2023-10-03T01:00:00Z"
description: "Let's upload the blog to the home server"
tags: ["blog"]
---

> This article was written with much help from [Vulcan](https://vulcan.site/), who built a server slightly earlier than I did. Therefore, it may have many shortcomings. If there are any errors or points that need clarification, please let me know in the comments.

> There may be readers who wish to set up their home servers after reading this. However, please note that a basic understanding of networking is required, as there are many oversights in the knowledge I provided.

This article follows from [Creating a Home Server - Initial Setup, Proxmox, pfSense](https://witch.work/posts/blog-home-server).

# 1. Basic Settings

## 1.1. Creating a Container

The process of creating an LXC container is referenced from the article [Building My Own Home Server - Part 1](https://velog.io/@kisuk623/Proxmox-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0).

Since the primary purpose of purchasing this home server was to deploy a blog, let's create a container in Proxmox. You can refer to the link above for more details.

I set the ID to 1001 and named it `blog`. The template OS selected was Ubuntu 20.04. Note that when creating a CT, there is a checkbox in the `General` section for `unprivileged container`, which must not be unchecked. This feature enhances security by separating the kernel from the container.

You can proceed with the rest of the settings as defaults. However, I wanted to allocate more resources to the container, so I set it to 4 cores and 4GB of memory. This can be modified later, but be cautious as it is much easier to increase resources than to decrease them.

## 1.2. Container Configuration

Access the container, go to the Console menu, start it, and enter the username and password you assigned earlier to access the console. Now, let’s install the necessary packages in this container.

```bash
sudo apt-get update
sudo apt-get install git
sudo apt install nginx
```

Since the blog is built with Next.js, you can simply clone it.

```bash
git clone MY_BLOG_URL
cd MY_BLOG_DIR
yarn
sudo n lts # Set Node.js version to LTS
sudo n prune  
```

Here, two options arise. One is to build and deploy using static export, and the other is to use `pm2`, a Node.js process manager, to keep the Next.js server running as a background process, allowing you to access it through a specific port.

![static export vs pm2](./static-vs-pm2.png)

I chose to use pm2.

Various methods can be employed to port forward WAN IP traffic to the build output or a specific port in the internal network, and I utilized HAProxy. There are other methods as well, which I will briefly introduce after describing the deployment process.

# 2. Running the Server with pm2

As the name suggests, pm2 enables us to run the deployment page as a background process, allowing access to this process through a specific port. In this section, I will demonstrate how to launch the page.

## 2.1. What to Do

Revert the `output: 'export'` setting made earlier and run `yarn run build` in the Proxmox console again. 

After that, run `yarn start` and access the `internal IP address:started port number` of the blog container. In my case, it is `192.168.0.33:3000`.

You should see the built blog loading correctly. If you connect an external domain to this address and port, this page will appear when accessing the external domain.

So, what does pm2 do? When we run `yarn start`, the page appears, but at this point, the console window displays outputs from `yarn start`, and no other console input can be accepted, which is due to Node.js being single-threaded.

We will use pm2 to delegate this `yarn start` command to a background process.

[One benefit of this approach is that it allows for zero-downtime deployments.](https://engineering.linecorp.com/ko/blog/pm2-nodejs)

## 2.2. pm2 Configuration

Let's install pm2. (If something goes wrong, try prefixing it with sudo.)

```bash
sudo yarn global add pm2
```

This will start a process named `blog` running `yarn start`.

```bash
pm2 start yarn --name "blog" -- start
```

Now, `yarn start` will be executed in the background, so nothing will be displayed in the console window, but if you navigate to `192.168.0.33:3000`, the page should be running.

You can view the status of processes managed by pm2 by entering `pm2 status`. To stop the process named `blog`, use `pm2 stop blog`, and to delete it, use `pm2 delete blog`. There are many other features, but for now, let’s focus on the essentials.

```bash
# Example output of pm2 status
witch@blog:~/witch-next-blog$ pm2 status
┌──┬───────┬─────┬───┬───────┬─────┬─────────┐
│id│name   │mode │↺  │status │cpu  │memory   │
├──┼───────┼─────┼───┼───────┼─────┼─────────┤
│0 │blog   │fork │0  │online │0%   │81.4mb   │
└──┴───────┴─────┴───┴───────┴─────┴─────────┘
```

Let’s set pm2 to automatically start on system reboot and recreate the current processes. First, run the following command.

```bash
pm2 startup
```

You will see a message as below. Here, `witch` is my username.

```bash
[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:
sudo env PATH=$PATH:/usr/local/bin /usr/local/share/.config/yarn/global/node_modules/pm2/bin/pm2 startup systemd -u witch --hp /home/witch
```

Execute the command that starts with `sudo~` as instructed. A series of messages will appear, and towards the end, it will say `Freeze a process list on reboot via: pm2 save`, which is what we want, so run `pm2 save`.

```bash
pm2 save
```

Future deployment work will proceed using the processes started by pm2.

### 2.2.1. Additional Work

Since port 3000 is widely used, let’s change the port used when running `yarn start`. I changed mine to 3141; it aligns with the first four digits of π, but 8080 or any of [the ports supported by Cloudflare's proxy](https://developers.cloudflare.com/fundamentals/reference/network-ports/) would also be suitable.

Change the `start` script in `package.json` accordingly.

```json
  "scripts": {
    // ...
    "start": "next start -p 3141",
    // ...
  },
```

After pushing this to git, restart pm2 from the Proxmox console. After all deployment processes are completed, if there are modifications on the page, simply run:

```bash
git pull origin main
yarn run build
pm2 restart blog
```

Now the built page can be accessed at `192.168.0.33:3141`.

# 3. External Access Configuration

[This section was largely referenced from the following article.](https://www.linkedin.com/pulse/configuring-pfsense-firewall-haproxy-maximum-security-goldhammer/)

However, accessing it only within the internal network is of little significance. Let's enable access to this page from external networks.

I will use HAProxy to perform this task, allowing access to the page launched internally via HTTPS when accessing `blog.witch.work`. Using acme along with HAProxy simplifies the HTTPS configuration compared to setting each up in nginx (though if you wish to configure HTTPS via IP address, you need to use nginx).

I manage the domain through Cloudflare, and HAProxy provides excellent functionality for integration with Cloudflare. Therefore, I will utilize this. However, several issues must be resolved before deploying the blog properly, so I will experiment through a previously created subdomain.

[For details on creating a subdomain in Cloudflare, refer to this prior article.](https://witch.work/posts/cloudflare-make-subdomain)

## 3.1. Cloudflare Configuration

Log in to Cloudflare and access your domain. You will see a list of DNS entries associated with your domain where we will use the `blog` subdomain. Select `blog` from the list of domains and edit it.

![Cloudflare Domain List](./cloudflare-domain-list.png)

Turn off the proxy and change the Target to `1.1.1.1`. HAProxy will automatically adjust this as needed.

![Target Change](./cloudflare-target-change.png)

> If it does not automatically change, you can manually set the DNS IP in Cloudflare to your WAN IP.

## 3.2. Acme Settings

In pfSense, go to System - Advanced - Admin Access, where the TCP Port is set to 443 by default; change it to a suitable port, such as 12443.

After doing this, you will use port 12443 to access pfSense. Initially, you accessed it at `192.168.0.5`, so now you will visit `192.168.0.5:12443`.

Next, install acme and HAProxy in System - Package Manager - Available Packages. I previously did this, so I will skip ahead.

In Services - Acme Certificates - General settings, checking the Cron entry will enable automatic certificate renewals. You can check this if you wish.

Then, go to Services - Acme Certificates - Account keys, click add, and generate an account key. Enter a suitable name, description, and your email, and then click `Create Account Key` to generate the key. Clicking `Register ACME account key` will register this key.

![Acme Account Key Creation](./new-account-key.png)

Next, enter Services - Acme Certificates - Certificates, click add, and fill in the name and description as needed, selecting the recently created Acme Account.

Set the Private key to 384-bit ECDSA and check the OCSP Must Staple option.

![Acme Certificate Creation](./acme-certificate.png)

You need to set the Domain SAN list. Click `+ Add`, and select `DNS - Cloudflare` as the method. 
I added `witch.work` and `*.witch.work`, allowing certificates to cover both `witch.work` and all subdomains.

![Add Certificate](./add-certificate.png)

You will need to enter various Keys, such as the Cloudflare API Keys, which can be found under My profile, left menu, API Tokens - Global API Key. Use the email registered with Cloudflare.

The Token is an API Token that can be created under My profile, left menu, API Tokens - Create Token, with the permission `Edit zone DNS`. Note that once created, this token cannot be viewed again in Cloudflare, so ensure to copy it immediately for your records. However, once saved correctly, it can be viewed again in pfSense, so it does not need to be stored elsewhere.

Both Account ID and Zone ID can be found in the domain menu by scrolling to the API section, located under Quick Actions, Domain Registration, Active Subscriptions, Support Resources.

Now, add the following command in the Actions list. This command ensures HAProxy restarts automatically when the certificate is renewed, allowing the new certificate to take effect.

![Certificate Actions List](./certificate-actions-list.png)

After saving this, click `Issue/Renew` in the menu. If successful, the green notification box will display messages, concluding with `Reload success`.

This means that the certificates will be used for the domains associated with `*.witch.work` where the Cloudflare DNS points to pfSense.

Clicking `Issue/Renew` may sometimes yield messages indicating too many certificate requests. Reading the messages will indicate when to retry.

```
An unexpected error occurred:
There were too many requests of a given type :: Error creating new order :: too many certificates (5) already issued for this exact set of domains in the last 168 hours: <my-domain>: see https://letsencrypt.org/docs/rate-limits/
```

## 3.3. HAProxy Configuration

### 3.3.1. Settings

Let’s now configure HAProxy. Access Services - HAProxy - Settings and check `Enable HAProxy` under Global parameters.

For Logging, set Remote Syslog host to `/var/run/log`, although this setting is not critical.

Change Max SSL Diffie-Hellman size from 2048 to 4096; set SSL/TLS Compatibility Mode to Intermediate.

### 3.3.2. Backend

Navigate to Services - HAProxy - Backend and click Add, giving it an appropriate name.

In the Server list, add all internal servers with which we will connect. Here, I specified my internal IP and port number (3141). Although internal traffic will not be encrypted without SSL, it remains inconsequential since the frontend server will still utilize HTTPS.

![Backend Configuration](./haproxy-backend.png)

No specific health checks are needed here; just save the settings.

### 3.3.3. Frontend

Access Services - HAProxy - Frontend. First, set up a rule to redirect HTTP to HTTPS. Click `Add` and provide a suitable name and description. Set the external address port to 80 and leave SSL Offloading unchecked. Set Type to `http / https(offloading)`.

![Setting](./haproxy-front-http-to-https.png)

Create another frontend listener to handle incoming HTTPS traffic at port 443, performing [SSL offloading](https://minholee93.tistory.com/entry/SSL-offloading-%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C).

Thus, set port to 443 with SSL offloading checked; Type should also be `http / https(offloading)`. Provide appropriate names and descriptions.

Now, set an Access Control List (ACL) to determine routing based on the incoming domain.

Our task is to route incoming traffic on `blog.witch.work` to the just created `my-backend` server.

Ensure to connect the same name for the ACL and Actions’ Conditions, configuring the section as described. You can ignore `cs.witch.work`, which I previously set.

![ACL](./haproxy-acl.png)

Scroll down to the Advanced settings section; add the following value under `Advanced pass thru` to append a response header.

```
http-response set-header strict-transport-security "max-age=31536000;includeSubDomains;preload;"
```

Now, in SSL Offloading, add the certificate created previously in acme and check `Add ACL for certificate Subject Alternative Names` before adding an Additional certificate, which should match the one added above.

For Advanced SSL options, add the following for enhanced security.

```
curves secp384r1:secp521r1 ciphers ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES256-GCM-SHA384 ciphersuites TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
```

Once this configuration is complete, SSL offloading will be fully configured.

![SSL Offloading Settings](./haproxy-ssl-offloading.png)

## 3.4. Rule Configuration

Now we need to set rules to receive traffic.

Go to Firewall - Rules - WAN and add a rule.

We must create rules to accept both HTTP and HTTPS requests. By default, pfSense firewall blocks all incoming traffic, so we need to override this to allow external traffic. Create a rule for HTTP on port 80 and another for HTTPS on port 443.

The Interface should be set to WAN, and the Protocol to TCP/UDP (though TCP alone is sufficient). Set the Destination to `This firewall(self)` and the port number according to whether it is the HTTP or HTTPS rule: 80 for HTTP, 443 for HTTPS. Label these as `allow for http` and `allow for https`. For the allow for https rule, configure as follows.

![Allow for HTTPS](./firewall-rule-https.png)

This will create the following rules.

![Firewall Rules](./firewall-all-rules.png)

> If it doesn't work properly, try changing the Destination to `WAN address`.

You can also set rules for pfSense to receive traffic, where the Destination should be set to WAN address and the port number to the one you previously created (12443), labeling as `allow for pfSense ports`. Keep in mind that this allows you to access pfSense via `WAN IP:12443`, which is not ideal.

The rules will be created as shown, with the modified parts highlighted in red.

![WAN Rule](./firewall-rule-wan.png)

At this stage, when users access my domain `blog.witch.work`, they will reach the page launched via `yarn start` on pm2, as shown below.

![How Users Reach My Domain Content](./how-my-domain-works.png)

## 3.5. SSL Lab Test

[SSLLabs tests the SSL configuration of web servers and assigns grades.](https://www.ssllabs.com/ssltest/index.html) The site configured as above can receive an A+ grade.

![SSL Lab Test Results](./ssllab-test.png)

Additionally, I confirmed access via [this page link](https://blog.witch.work/).

## 3.6. Troubleshooting

If something doesn't work, try rebooting pfSense. I have resolved many issues this way.

Reboots can be performed via Diagnostics - Reboot in pfSense.

![Reboot Screen](./pfsense-reboot.png)

# 4. HTTP/2 Configuration

By default, HAProxy uses HTTP/1.1. Therefore, when running Lighthouse diagnostics, it is advised to switch to HTTP/2.

In Services - HAProxy - Frontend, locate the Frontend Rule you are using. Under the `SSL Offloading` section, you will see the `Advanced certificate specific ssl options` field, where you can enter the following line to set HAProxy to use HTTP/2.

```
alpn h2,http/1.1 ciphers EECDH+aRSA+AES:TLSv1+kRSA+AES:TLSv1+kRSA+3DES ecdhe secp256k1
```

# 5. Additional Methods

## 5.1. Static Export Deployment

In the previous sections, we used pm2 to run `yarn start` in a background process, allowing user access through the server. However, it is also possible to build the page in static export format, enabling users to view the resulting `index.html`.

To build, run `yarn run build` in the cloned blog folder.

```bash
yarn run build
```

Note that the default Next.js build path is `.next`, but since we will deploy as a [static export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports), we need to specify the build format.

In `next.config.js`, add the `output: 'export'` property under `nextConfig`.

```js
// next.config.js
// Taken from the official Next.js documentation.
const nextConfig = {
  output: 'export',
 
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,
 
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,
 
  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
}
```

Thus, when running `yarn run build`, a folder named `out` will be generated instead of `.next` (although this can also be changed with the `distDir` property). You can now connect this statically exported folder to nginx. To do so, let's edit the nginx configuration file.

```bash
sudo nano /etc/nginx/sites-available/static.site
```

Then, write the configuration as follows. Since I didn’t change the build file path, it will be `BLOG_FOLDER_PATH/out`. Don’t forget to include an `.env` file that won’t be pushed to git.

```bash
server {
  listen PORT_NUMBER;
  server_name 0.0.0.0;
  charset utf-8;

  location / {
    root BUILD_FILE_PATH;
    index index.html index.htm;
    try_files $uri $uri.html $uri/ =404;
  }
}
```

Then create a symbolic link and test nginx; reload it if successful.

```bash
sudo ln -s /etc/nginx/sites-available/static.site /etc/nginx/sites-enabled/
sudo nginx -t
sudo service nginx reload
```

Now, if you access via internal IP + port number using `ip a`, the blog should appear. External access will need to be configured, but you have successfully displayed the blog.

![First Blog Deployment Result](./blog-first-nginx.png)

The Next.js page displayed this way may show images incorrectly as the Next.js image component does not function properly in static export. To resolve this, you need to specify an image loader, as detailed in the official documentation.

[Static Export - Image Optimization](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#image-optimization)

## 5.2. Other Port Forwarding Methods

In the sections above, we used HAProxy to forward requests arriving at specific external ports to internal ones. However, similar tasks can be accomplished with pfSense and nginx, and I will briefly describe methods for doing so. Note that these implementations may not function perfectly as they are more of a preliminary attempt.

### 5.2.1. Port Forwarding in pfSense

[I referred to a server forum post on how to port forward in pfSense.](https://svrforum.com/svr/27343)

First, log in to pfSense and click `Interfaces` -> `WAN` from the top menu. Scroll down to the bottom and uncheck `Block private networks and loopback addresses`.

Next, click `Firewall` -> `NAT` -> `Port Forward`. Click `Add (upward arrow)` and fill in the fields as follows.

The purpose of this port forwarding is to connect traffic coming to a specific port on the WAN address to a specific port on the internal IP. I will connect traffic on port 8080 of the WAN IP to port 3141 of the internal IP (or any other port used within the internal network).

![Port Forwarding Configuration in pfSense](./pfsense-port-forwarding.png)

After configuring and applying, accessing WAN IP on port 8080 will display the previously created blog page.

### 5.2.2. Port Forwarding in nginx

Port forwarding can also be configured in nginx, although it won’t be used in this instance.

```bash
sudo nano /etc/nginx/sites-available/static.site
```

Modify this file as follows to connect incoming traffic on port 8080 from any IP to the internal port 3141. In my deployment setup, HAProxy will perform this function, so this may not be significant.

```bash
server {
    listen 8080;
    server_name _;

    location / {
        proxy_pass http://localhost:3141;
        proxy_set_header Host $host;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    charset utf-8;
}
```

## 5.2.3. Troubleshooting - Can't Access from My Computer

A problem may arise where access works fine from other networks, such as mobile data or different network devices, but not from within the server’s network (using the same IP).

The solution involves configuring for access via my IP. This can be done under System - Advanced - Firewall & NAT, specifically in the Network Address Translation section. Change `NAT Reflection mode for port forwards` to pure NAT; it may originally be set to disabled.

Activating this enables NAT rules to carry out port forwarding, alongside additional options for situations where the server lies on the same subnet as the clients. You can then check `Enable automatic outbound NAT for Reflection` further down the page.

![Firewall & NAT Settings](./firewall-nat-setting.png)

[For more detailed explanations of these options, refer to the official documentation.](https://docs.netgate.com/pfsense/en/latest/nat/reflection.html)

# Next Article

The build process is still not automated, and firewall settings and optimizations have yet to be addressed. The next sections will tackle these issues.

- Firewall Settings
- Build Automation
- Optimizations such as standalone deployment

# References

Creating a blog with Gatsby (https://vulcan.site/blog-gatsby/)

Building My Own Home Server - Part 1 https://velog.io/@kisuk623/Proxmox-%EC%84%A4%EC%B9%98%ED%95%98%EA%B8%B0

Port Forwarding (NAT) in pfSense https://svrforum.com/svr/27343

How to apply HTTPS using Nginx https://gist.github.com/woorim960/dda0bc85599f61a025bb8ac471dfaf7a

Configuring pfSense firewall and HAProxy for maximum security rating at SSLLabs
https://www.linkedin.com/pulse/configuring-pfsense-firewall-haproxy-maximum-security-goldhammer/

Installing HAProxy on pfSense with SSL access to web server https://gainanov.pro/eng-blog/linux/installing-haproxy-pfsense/

SSL Offloading https://minholee93.tistory.com/entry/SSL-offloading-%EC%9D%B4%EB%9E%80-%EB%AC%B4%EC%97%87%EC%9D%BC%EA%B9%8C

How to Deploy a Next.js app to a Custom Server - NOT Vercel! (Full Beginner Tutorial) https://www.youtube.com/watch?app=desktop&v=HIb4Ucs_foQ

Zero-Downtime Services Using PM2 in Node.js https://engineering.linecorp.com/ko/blog/pm2-nodejs

https://www.lesstif.com/javascript/pm2-system-rebooting-125305469.html

Setup a Next.js project with PM2, Nginx and Yarn on Ubuntu 18.04 https://www.willandskill.se/en/articles/setup-a-next-js-project-with-pm2-nginx-and-yarn-on-ubuntu-18-04

Using Cloudflare with pfSense
https://blog.skylightqp.kr/292

Cloudflare Network Ports https://developers.cloudflare.com/fundamentals/reference/network-ports/

Lawrence Systems -
How To Guide For HAProxy and Let's Encrypt on pfSense: Detailed Steps for Setting Up Reverse Proxy https://www.youtube.com/watch?v=bU85dgHSb2E

How to activate HTTP2 on pfSense haproxy https://techoverflow.net/2020/12/29/how-to-activate-http2-on-pfense-haproxy/