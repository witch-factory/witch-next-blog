---
title: Record of Struggles to Attach a Page as a Subdomain to My Domain
date: "2023-05-17T00:00:00Z"
description: "I wanted to add a subdomain to the domain I purchased, so I did some research."
tags: ["blog", "web", "tip"]
---

One day, I had the domain `witch.work`, but I wanted to have a page accessible via `abc.witch.work`. When I asked people, they told me that I could add a subdomain.

# 1. Trying to Add Records Arbitrarily

My domain, `witch.work`, is managed through Cloudflare Pages. Thus, I need to configure the subdomain in Cloudflare.

Let’s set it up without specific guidance. Select `witch.work` in the Cloudflare dashboard and go to the menu, then select DNS.

![dns-menu](./dns-menu.png)

Click "Add DNS Record", select CNAME for the type, set the name to the desired subdomain, and the content to the URL of the page to which you want to redirect. Additionally, enable the proxy.

For example, to redirect `naver.witch.work` to `https://naver.com`, you would set it up as follows.

![dns-naver](./dns-naver.png)

However, even if you set it this way, you will not view exactly the same page due to origin policies and such. Resource sharing is restricted by CORS policies.

If you want to fully redirect to another page address when accessing a specific subdomain, you must apply the page rule or redirection rule provided by Cloudflare Pages. (It's not complicated if you refer to the official documentation.)

# 2. Principles

There is a lot to discuss regarding the content of networks, but I will just cover the basic aspects.

Network communication fundamentally operates on an IP basis. Suppose you access `www.naver.com` from your home computer. In that case, your computer queries the DNS (Domain Name Server) for the IP information associated with `www.naver.com`.

When your computer sends an HTTP request to the IP received from DNS, it connects to Naver. (Many details can be summarized, but for more extensive information, please refer to [here](https://inpa.tistory.com/entry/WEB-%F0%9F%8C%90-DNS-%EA%B0%9C%EB%85%90-%EB%8F%99%EC%9E%90-%EC%99%84%EB%B2%BD-%EC%9D%B4%ED%95%B4-%E2%98%85-%EC%95%8C%EA%B8%B0-%EC%89%BD%EA%B2%8C-%EC%A0%95%EB%A6%AC) or [here](https://parksb.github.io/article/36.html)).

The most fundamental DNS record that maps domain names to IPs is the A record. If connecting to `www.naver.com` requires the IP `223.130.200.104`, it links these two.

![naver-access](./naver-access.png)

Next, we encounter the CNAME record that we set. The CNAME record is used instead of the A record when configuring a domain as an alias for another domain. This is also why it's called Canonical Name.

When DNS reaches the domain with the CNAME record, it queries again for the linked CNAME record domain to eventually obtain an A record and connect to the corresponding IP.

In the case of the CNAME record we set, we have designated `naver.witch.work` as an alias for `naver.com`, therefore it follows the DNS records linked to naver.com.

Although this incurs an additional DNS query, making it inefficient (however, DNS caching is well established these days and queries are quickly processed, so it's not hugely inefficient).

![dns-cname-a](./dns-cname-a.png)

However, as mentioned earlier, this does not lead to displaying exactly the same page.

When accessing `naver.witch.work`, it ultimately sends an HTTP request to Naver's IP, but the origin of the request remains as `naver.witch.work`.

However, Naver's server does not allow requests from this origin. Thus, due to CORS policies, requests for Naver page resources are blocked and only a partial display of the Naver page occurs.

# 3. Connecting to Vercel Page

Returning to my initial goal of creating a subdomain page, it was not simply to have a redirect address to Naver. I had a page I wanted to create, and I wanted to pre-establish the URL leading to it.

Recently, I was learning Next.js and followed a tutorial from the official documentation. I wanted to modify that page to include some content.

This page is currently deployed on Vercel following [Next.js Deployment Guide](https://nextjs.org/docs/app/building-your-application/deploying). I have deployed my page at [here](https://nextjs-example-weld.vercel.app/). Let's see if we can redirect `cs.witch.work` here.

So, as previously done, I will set the CNAME record’s name to `cs` and the content to the above address.

![cname-direct](./cname-direct.png)

But this approach won’t work! You will see an error code `DEPLOYMENT_NOT_FOUND`, indicating that the desired page is not connected.

![dep-not-found](./deployment_not_found.png)

This is due to how Vercel deployment operates. Pages deployed on Vercel are connected through an A record to the IP `76.76.21.21`. The server then checks the requested domain and sends the appropriate page.

![vercel-dns](./vercel-dns-request.png)

Thus, when accessing the newly added subdomain `cs.witch.work`, it correctly connects to the Vercel server at `76.76.21.21`. However, Vercel does not know which specific page to send for that domain. Hence the error `DEPLOYMENT_NOT_FOUND` occurs.

To resolve this, you need to register that domain with the Vercel server. Navigate to the Vercel dashboard, select the Domains menu, and click the Add button.

![vercel-domain-menu](./vercel-domain-menu.png)

After selecting your deployed project, which in my case is the `nextjs-example` project, click continue. A window appears where you can input the domain you want to add. I entered `cs.witch.work`.

![add-domain](./add-project-domain.png)

Upon completing this, the process to add the page to the Vercel server begins, and once completed, accessing `cs.witch.work` will lead to my project page.

![dns-setting-slow](./dns-setting-slow.png)

# 4. Stage 1 Improvement

However, there is no need to go through a CNAME. I can directly connect the subdomain to the Vercel server.

Although these days, DNS queries are not lengthy operations, and caching occurs effectively, significantly improving time will not be achieved.

However, it is generally advisable to avoid multiple DNS queries before reaching the page. Thus, let’s improve this.

In Cloudflare, simply set the subdomain `cs.witch.work` as an A record directly pointing to the Vercel server's IP `76.76.21.21`.

![dns-to-a](./dns-to-a-record.png)

Now, when accessing `cs.witch.work`, the connection to the same page occurs, but one DNS query will be eliminated.

![dns-setting-fast](./dns-setting-fast.png)

I have successfully linked another page to the `cs.witch.work` subdomain.

# 5. Others - Moving to a Different Domain Entirely

Doing so displays different content while keeping the same page address. The page address appears as `cs.witch.work`, but in reality, the contents from `https://nextjs-example-weld.vercel.app/` are displayed.

However, you might want to fully redirect to a completely different domain. A typical case is wanting to redirect a domain with a `www` subdomain to the apex domain (root domain). This unification of all requests to the apex domain is beneficial for SEO and view count aggregation.

For example, if you want to redirect `www.witch.work` to `witch.work`, how would you do this?

In this case, set up a redirection rule in Cloudflare, or a page rule, or establish a bulk redirect. The later options become increasingly complex.

## 5.1. Redirection Rule

First, enter the relevant page for my domain `witch.work` in the Cloudflare dashboard, then add an A record with `192.0.2.1` or an AAAA record with `100::` for the www subdomain.

Then, find the `Rules` menu on the left side of the dashboard for `witch.work` and select the sub-menu for `Redirect Rules`.

Create a redirection rule by clicking the button, naming the rule, and specifying which request should redirect to which URL.

![create-redirect-rule](./create-redirect-rule.png)

Once saved, it is complete. Now, when accessing `www.witch.work`, the connection goes to the Cloudflare server via the A record, and the server sends a response (code 301) to redirect to `witch.work` based on the set redirection rule. You are redirected to an entirely different domain.

## 5.2. Page Rules

Similar to before, access the relevant page for my domain `witch.work` in the Cloudflare dashboard and add an A or AAAA record for the www subdomain.

Next, select `Page Rules` from the sub-menu under the `Rules` menu on the left dashboard for `witch.work`.

Choose to create a page rule.

![create-page-rule](./create-page-rule.png)

Here you do the same thing. Input the URL to which you want to redirect when accessed. Since I wanted to redirect `www.witch.work` to the apex domain, I entered `www.witch.work`.

To ensure all accesses containing that domain in the URL are redirected, I used `*`. Since the action at that moment is to move the URL, I selected 'Forwarding URL' and set it as `https://witch.work/`.

![create-page-rule](./create-page-rules-redirect.png)

Now, when accessing `www.witch.work`, it will redirect to `witch.work` as expected, handled by the edge of the Cloudflare server.

## 5.3. Bulk Redirect

Accessing the relevant page for my domain `witch.work` in the Cloudflare dashboard and adding an A or AAAA record for the www subdomain is the same as before.

The next step is to find the `Redirect Rules` menu and scroll down to find the `Bulk Redirect` option.

![bulk-redirect](./bulk-redirection.png)

Choose to create a bulk redirect list, adequately fill in the name and description, then proceed.

![bulk-redirect-create](./www-to-apex-name.png)

In the next screen, choose to manually add URLs for redirecting, inputting the source URL (for my case, `www.witch.work`) and the target URL (`witch.work`). Since it's a permanent redirect to the target URL, select the status as 301.

Under parameter editing, select keep query strings, match sub-paths, and retain path suffix. Then click on `Add Redirect`, followed by the next button to generate the bulk redirect list.

Now, create a rule to implement this redirect list by going to the `Bulk Redirect` menu and choosing to create a bulk redirect rule.

![bulk-redirection-rule](./bulk-redirection-rule.png)

Select appropriately and press save and deploy.

# References

https://alwnsxo.com/entry/Vercel%EC%97%90-%EB%82%B4-%EB%8F%84%EB%A9%94%EC%9D%B8-%EC%A0%81%EC%9A%A9%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95-Next-JS-on-Vercel-with-Custom-Domain

https://www.cloudflare.com/ko-kr/learning/dns/dns-records/dns-cname-record/

https://vercel.com/docs/concepts/projects/domains/troubleshooting

https://evan-moon.github.io/2020/05/21/about-cors/

https://developers.cloudflare.com/pages/how-to/www-redirect/