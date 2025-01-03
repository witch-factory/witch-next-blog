---
title: a Tag and Security
date: "2023-06-28T00:00:00Z"
description: "Security issues associated with HTML hyperlink tag"
tags: ["study"]
---

# 1. Introduction

While researching HTML tags, I found an interesting point in the [a tag documentation](https://developer.mozilla.org/ko/docs/Web/HTML/Element/a). It states that improper use of the a tag may lead to security and privacy issues.

Using the `target="_blank"` attribute without `rel="noreferrer"` or `rel="noopener"` can make a website vulnerable to `window.opener` API exploits. However, it's unclear what this means just from this information. Let's explore further.

# 2. Overview

When the a tag includes the `target="_blank"` attribute, the link opens in a new browser context.

```html
<a href="https://www.google.com" target="_blank">Google</a>
```

However, this leads to the following issues:

1. Another page may run in the same process as the original page. Generally, browsers use different processes for each page. If a lot of JavaScript runs on the new page, it may degrade the performance of the original page.
2. The new page can use the `window.opener` property to access the window object. It could then redirect the original page to a malicious URL.

To avoid these issues, it is necessary to use the `rel="noreferrer"` or `rel="noopener"` attribute alongside `target="_blank"`.

```html
<a href="https://www.google.com" target="_blank" rel="noreferrer">Google</a>
```

But why do these problems occur? One is a performance issue, and the other is a security issue. Let's explore each in detail.

* Modern browsers are designed to prevent these problems by default.

# 3. Performance Issue

Let’s assume the a tag is used with the `target="_blank"` attribute and the above solutions are not applied.

The newly opened page via the a tag operates in a secondary browsing context. Thus, it refers back to the original browsing context as the opener browsing context.

As a result, the newly opened page may execute in the same process as the original page’s opener browsing context. If a significant amount of JavaScript runs on the newly opened page, it could negatively impact the performance of the original page.

# 4. Security Issue

Assuming the same premise, JavaScript in the newly opened page can access the original page. This is possible through the `window.opener` API, which presents a security vulnerability.

This type of attack is known as tab-nabbing.

First, a site is created to lure users, here exemplified as `https://www.fishing-site.com`.

```html
<a href="https://www.fishing-site.com" target="_blank" >Click bait</a>
```

On this site, the following JavaScript is executed:

```js
window.opener.location = 'https://www.malicious-site.com';
```

When a user navigates from the original site to `https://www.fishing-site.com` and returns to the original tab, `window.opener.location` has been changed to `https://www.malicious-site.com`.

Now the user believes they are still on the original site and may log in or perform other actions, potentially exposing their information.

Once the user's information is stolen (for example, if they logged in), they are redirected back to the original site. The user remains oblivious, thinking they have logged into the original site while actually being on `https://www.malicious-site.com`.

![tab-nabbing](./tab-nabbing.png)

Many sites require users to log in again after a while, making suspicion less likely. Additionally, when users are redirected from the malicious site back to the original site while already logged in, they may perceive it as a successful login.

Although users might notice differences in domain names or lack of organizational information, malicious sites often use similar names to the original site (e.g., a link derived from a comment on `youtube.com` might use `voutube.com`).

# 5. Solutions to Security Issues

To prevent these vulnerabilities, use the `rel="noopener"` or `rel="noreferrer"` attributes.

## 5.1. rel="noopener"

```html
<a href="https://www.google.com" target="_blank" rel="noopener">Google</a>
```

This prevents newly created browsing contexts for a, area, and form elements from accessing the document that created them. In other words, the `window.opener` of the newly opened browsing context is set to null.

However, the `Referer` HTTP header remains intact.

Currently, setting the `target="_blank"` attribute on the a tag in most modern browsers defaults to specifying `rel="noopener"`.

If you explicitly need to use `window.opener` in a new tab, `rel="opener"` can be specified.

## 5.2. rel="noreferrer"

Specifying this attribute triggers the behavior of `rel="noopener"` while additionally removing the `Referer` HTTP header.

Thus, the original site’s address included in the HTTP header when a user navigates is lost, resulting in the site being recorded as direct traffic in analytics.

However, since some older browsers may support only `rel="noreferrer"`, it is advisable to use both together, like `rel="noopener noreferrer"`.

## 5.3. Referrer Header

Using `rel="noreferrer"` can also help prevent potential security threats. While the referrer header has useful applications, it can also pose security risks.

For example, consider a password reset page with a link to another site in the footer. 

If a user accesses that linked site while resetting their password, the linked site could gather information about the user’s password reset page. This poses a potential security threat.

Similarly, if third-party images are embedded on a page, sensitive information could be leaked through the referrer being sent to that third party. While it may not always be sensitive, it could include information that users do not wish to share.

### 5.3.1. Addressing Referrer Header Issues

To resolve this issue, use the `rel="noreferrer"` attribute. This eliminates the transmission of the referrer header.

Another similar approach is to set the `referrerpolicy` attribute of HTML elements that carry sensitive information to `no-referrer`.

```html
<a href="https://www.google.com" target="_blank" referrerpolicy="no-referrer">Google</a>
```

Setting the `referrer` attribute of a `meta` tag to `no-referrer` is another strong method (it disables the referrer header across the entire document).

```html
<meta name="referrer" content="no-referrer">
```

Nonetheless, careful application design can largely avoid these problems.

Preventing the transmission of sensitive information through URLs can be achieved by using POST requests instead of GET, employing HTTPS for sites that do not transmit the referrer, and avoiding the inclusion of sensitive data in URLs.

Additionally, by ensuring that embedded third-party content does not exist on pages with sensitive information, risks of information leakage can be mitigated.

# 6. window.open

The `window.open` function, used to open new windows, shares the same vulnerabilities. Therefore, reset the opener when using this function.

```js
var ret = window.open(url, "_blank", specs, replace);
ret.opener=null;
```

# References

Referrer header: privacy and security considerations https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns

Linking to cross-origin targets is not safe https://developer.chrome.com/ko/docs/lighthouse/best-practices/external-anchors-use-rel-noopener/

What if hyperlinks cannot be trusted? https://yozm.wishket.com/magazine/detail/1586/

https://blog.jxck.io/entries/2016-06-12/noopener.html

rel=noopener https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noopener

https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/

https://security.stackexchange.com/questions/216135/xss-with-a-tag-with-target-blank

https://offbyone.tistory.com/312