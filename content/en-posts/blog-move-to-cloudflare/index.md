---
title: Migrating the Blog to Cloudflare Pages
date: "2023-04-11T00:00:00Z"
description: "Migrating the blog to Cloudflare Pages to manage increased bandwidth"
tags: ["blog", "web", "tip"]
---

In [this article](https://witch.work/posts/blog-cloudflare-proxy), I documented the process of setting up a proxy to manage the bandwidth of the blog. However, despite these efforts, access through the Cloudflare proxy was minimal, and the bandwidth on Vercel continued to increase.

Recently, I received an email warning that my free plan account might be blocked if the bandwidth continued to rise.

![limit-exceeded](./vercel-limit-exceed.png)

It is puzzling where all the access is coming from, but managing the bandwidth takes priority, so I decided to migrate the blog to Cloudflare Pages.

# 1. Deploying to Cloudflare Pages

According to [Cloudflare's get started guide](https://developers.cloudflare.com/pages/get-started/), it explains how to deploy a site using Cloudflare Pages.

Similar to Vercel, Cloudflare Pages can be connected to GitHub and GitLab. Since my blog is hosted on GitHub, I will link it there.

Go to the Cloudflare dashboard, then navigate to the left menu > Pages > Create a project > Connect to Git, to link with GitHub.

![create-project](./create-project.png)

![connect-to-git](./connect-to-github.png)

Select my blog repository from GitHub. After selecting it correctly, a screen like the following will appear. Scroll down and click Begin setup.

![select-repo](./select-repo.png)

Next, you need to set up the build settings. Choose a project name for the deployment—this will be what appears in the domain. Then select the branch for deployment. I kept the same settings as I had in Vercel.

![project-name](./project-name-set.png)

Since my blog is based on Gatsby, selecting the Gatsby preset in the build settings will automatically configure the build command and output directory.

![build-setting](./build-settings.png)

After this, proceed to the next step, and the deployment will commence.

## 1.1. Error Resolution

However, an error occurs during the package installation in the project build process. The error message is as follows.

![node-error](./node-error-log.png)

It mentions that the library type-fest requires Node version 12.20 or higher, but Cloudflare uses version 12.18.0 during the build, leading to the failure.

The latest LTS version of Node is 18.15.0, yet 12.18.0 is in use. According to the [Cloudflare build configuration](https://developers.cloudflare.com/pages/platform/build-configuration/), Cloudflare’s build environment uses 12.18.0 by default. However, you can change this version using the `NODE_VERSION` environment variable.

Go to the project page, select the recently deployed `witch-work` project, and enter settings. There, access the `Environment variables` section from the menu.

Click Add variable, input `NODE_VERSION` as the variable name, and set it to `17.9.1`, since Cloudflare supports Node version 17.x.

It will be added as shown below.

![env](./node_version_env.png)

After upgrading the Node version, the build was completed successfully and deployment was confirmed.

![build-complete](./build-complete.png)

It has been deployed to the domain [witch-work.pages.dev](https://witch-work.pages.dev/).

# 2. Connecting a Custom Domain

The blog was previously connected to the original domain `witch.work` on Vercel. Let's migrate it to Cloudflare.

First, access the Cloudflare dashboard. Then select Pages from the left menu, choose the project I deployed (which is witch-work), and select Custom Domains from the top menu.

![custom-domain](./custom-domain-pos.png)

This will bring up the following screen; click on Set up a custom domain.

![setup-custom-domain](./setup-custom-domain.png)

Input my existing domain `witch.work` and proceed. It will automatically adjust the DNS record settings.

![dns-record-setup](./dns-record-setup.png)

# 3. Apex Domain Configuration (Change Nameservers)

However, when deploying to an apex domain without a subdomain, additional steps are required.

Currently, there isn’t a practical subdomain in use on my site, but I still have an `/about` page created which might be used someday, so let's configure it.

According to Cloudflare documentation, I need to add my site to the Cloudflare zone and configure nameservers.

This allows Cloudflare to manage my site’s DNS records, receiving access requests and handling DNS responsibilities.

## 3.1. Preparations Before Starting

Before updating the domain nameservers, the following preparations are necessary:

1. Ownership of a domain. I have `witch.work` purchased from GoDaddy.
2. A Cloudflare account is needed, which I obviously have.
3. DNSSEC must be disabled. I confirmed this by following [GoDaddy - Add a DS record](https://ph.godaddy.com/help/add-a-ds-record-23865).

![no-dnssec](./no-dnssec.png)

With no DS records present, it seems DNSSEC is indeed disabled. All preparations are completed.

## 3.2. Adding the Site to Cloudflare

To add the site to Cloudflare, I need to create a new domain within Cloudflare and follow the procedures to activate it.

I have already done this in a [previous post](https://witch.work/posts/blog-cloudflare-proxy#32-%EC%82%AC%EC%9D%B4%ED%8A%B8-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0), so the site is properly added.

## 3.3. Checking DNS Records

Once I start using the Cloudflare nameservers, Cloudflare will become the main DNS provider for my site. This means that my DNS records on Cloudflare must be accurate for my domain to function correctly.

When I added my site to Cloudflare, it automatically added DNS records. Let’s check if this was done correctly.

In the Cloudflare dashboard, select my site (`witch.work`), navigate to the left menu, select DNS > DNS Records.

I previously checked this when I first used Cloudflare, and it was still correctly added. I confirmed that `witch.work` was linked to `witch-work.pages.dev`.

Moreover, while adding a CNAME record to an apex domain is ordinarily not permitted, Cloudflare allows [CNAME flattening](https://developers.cloudflare.com/dns/cname-flattening/), making it function properly.

When a DNS query arrives, instead of returning a CNAME record, Cloudflare finds the IP address the CNAME points to and returns that instead.

# 4. Adding the www Subdomain

Let's also make it possible to access my blog via www.witch.work. It was possible on Vercel, but it doesn’t work here yet.

I just need to add another CNAME record. The Name should be set to the desired subdomain, and the Content should be the page address deployed by Cloudflare, specifically `witch-work.pages.dev`.

![dns-manage](./dns-manage.png)

The Name shows simply as www, which is due to my site already being managed within the Cloudflare zone, automatically adding the CNAME record following www.

## 4.1. Resolving 522 Error

After doing this, accessing www.witch.work resulted in a 522 error. Notably, before adding the subdomain, accessing www.witch.work displayed a 404 error.

![522-error](./522-error.png)

Fortunately, a solution was right below the error message.

```
To ensure a custom domain is added successfully, you must go through the Add a custom domain process described above. Manually adding a custom CNAME record pointing to your Cloudflare Pages site - without first associating the domain (or subdomains) in the Cloudflare Pages dashboard - will result in your domain failing to resolve at the CNAME record address, and display a 522 error.
```

In summary, it means that adding a CNAME record before associating the subdomain with my Cloudflare page in the Cloudflare Pages Dashboard will lead to a 522 error.

Therefore, I moved to my dashboard, selected Pages from the left menu, chose my site, and went through the process of setting up a custom domain with `www.witch.work`.

As a result, the Custom domains menu displayed two domains as shown below.

![added-subdomain](./added-subdomain.png)

Once both are Active, accessing www.witch.work works normally to reach my blog.

# 5. Conclusion

Now I just need to delete the existing domain in Vercel.

# References

https://developers.cloudflare.com/pages/migrations/migrating-from-vercel/

https://developers.cloudflare.com/pages/get-started/

https://developers.cloudflare.com/pages/platform/custom-domains/

https://dev.dwer.kr/2020/04/zone-apex-root-domain-naked-domain.html

https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/

https://ph.godaddy.com/help/add-a-ds-record-23865

https://www.cloudflare.com/ko-kr/learning/dns/dns-security/