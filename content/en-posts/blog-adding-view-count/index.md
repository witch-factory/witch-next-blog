---
title: Adding View Count to Blog
date: "2023-04-12T00:00:00Z"
description: "Displaying view counts on the blog"
tags: ["blog", "web"]
---

# 1. Introduction

The blog does not seem to have low view counts. According to Cloudflare's analytics, it appears to have an average of about 100 visitors daily. Therefore, I decided to create a view count tracker for the blog.

There have been numerous attempts and errors along the way. With the assistance of [fienestar](https://github.com/fienestar), I was able to add the view count simply, and I will first outline that method before recording the various attempts made.

A Chinese service called busuanzi can be used to easily add page and blog view counts.

# 2. Using busuanzi

You can follow the [guide from fienestar](https://fienestar.github.io/blog/2020/05/24/busuanzi%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%98%EC%97%AC-%EC%A0%95%EC%A0%81%EC%9D%B8-%ED%8E%98%EC%9D%B4%EC%A7%80%EC%97%90-%EC%8A%A4%ED%83%80%EC%9D%BC-%EB%B3%80%EA%B2%BD%EC%9D%B4-%EA%B0%80%EB%8A%A5%ED%95%9C-%EC%A1%B0%ED%9A%8C%EC%88%98-%EC%B6%94%EA%B0%80%ED%95%98%EA%B8%B0/) to implement it. However, a few modifications are necessary to suit my blog.

First, the following code must be added to the head or body of the site.

```html
<script async src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```

My blog has a component called `Seo`, which is embedded in every page of the blog. This `Seo` component utilizes the Helmet component from react-helmet to manage content that goes into the head tag.

Therefore, inserting the code between the Helmet components is sufficient.

```tsx
<Helmet
// Meta information for SEO is included.
// It is omitted here as it is not important.
>
  <script async src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'></script>
</Helmet>
```

## 2.1. Site View Count and Visitor Count

Site view count and visitor count can be added using the following code. The id attached to the span is important.

```html
<section style={{height:'20px'}}>
  Views: <span id = 'busuanzi_value_site_pv'></span> times <br />
  Visitors: <span id = 'busuanzi_value_site_uv'></span> people
</section>
```

This code should be added to the blog page. In my blog, I added it just below my profile in the BlogIndex component that represents the main page.

While attempting to display this view count, I thought about restructuring the blog considerably, so I have not focused on styling at this point.

## 2.2. Page View Count

The view count for an individual page can be added using the following code.

```html
<span id="busuanzi_value_page_pv"></span>
```

This was added appropriately below the article title.

The records of other attempts are noted below. I hope this knowledge will be useful when I overhaul the blog in the future.

# 1. Adding the Blog to Google Analytics

I followed the article on [adding a blog to Google Analytics](https://ha-young.github.io/2020/gatsby/Add-Google-Analytics/).

## 1.1. Account Creation

Let's create a new Google Analytics account.

![create-account](./create-account.png)

Then, set up the website property.

![attr-set](./attr-setting.png)

After filling in the business information and agreeing to the terms, complete the account creation.

## 1.2. Adding Data Streams and Tags

Next, go to the data stream menu and add a data stream for the page.

![data-stream](./create-data-stream.png)

Oh, but a warning appears stating that data collection is not activated.

![site-no-data](./site-no-data.png)

This is because you need to register the measurement ID obtained earlier. Let's install `gatsby-plugin-google-gtag`.

```
npm install gatsby-plugin-google-gtag
```

Looking into my blog's gatsby-config.ts, I found an entry related to Google Analytics.

```ts
{
  resolve: 'gatsby-plugin-google-analytics',
  options: {
    trackingId: siteMetadata.googleAnalytics,
    head: true,
    anonymize: true,
    defer: true,
  },
},
```

This is an older version of gatsby-plugin-google-gtag. However, since we switched to gtag, we need to adjust the content accordingly.

```ts
{
  resolve: "gatsby-plugin-google-gtag",
  options: {
    trackingIds: [siteMetadata.googleAnalytics],
    gtagConfig: {
      anonymize_ip: true,
    },
    pluginConfig: {
      head: true,
    },
  },
},
```

Next, add the measurement ID obtained from the earlier data stream to `siteMetadata`. In my case, it was in blog-config.ts. If you do not use such a siteMetadata, you can simply add it as a string.

## 1.3. Attempts

![node-version](./node-version-error.png)

However, a problem arose. `gatsby-plugin-google-gtag` requires Node 18 or higher. Cloudflare only supports up to Node 17. [They are beta testing Node 18 on Cloudflare](https://community.cloudflare.com/t/support-node-18-in-pages-or-allow-config/414797/4) and I am uncertain of what will happen..

As a last resort, since analytics.js will be supported until September 2023, I reluctantly decided to use it. Let's revert gatsby-config.ts to its original state..

```ts
{
  resolve: 'gatsby-plugin-google-analytics',
  options: {
    trackingId: siteMetadata.googleAnalytics,
    head: true,
    anonymize: true,
    defer: true,
  },
},
```

Next, we should remove `gatsby-plugin-google-gtag`, which was causing build errors.

```
yarn remove gatsby-plugin-google-gtag
```

However, it still does not work. What's the issue? I found that apparently, if a new account was created after GA4, then gtag must be used to register with Google Analytics. Node 18 and above do not use Cloudflare in the first place..

However, based on the articles I've read, people are using gatsby-plugin-google-gtag without any issues. What could be the reason? It dawned on me that gtag probably didn’t always require Node 18. Those users likely used a lower version of Node when they installed it. Therefore, I can simply use the older version of `gatsby-plugin-google-gtag`!

## 1.4. Re-Adding the Google Analytics Tag

Let's install an older version of `gatsby-plugin-google-gtag`. The latest version is 5.8.0, but 4.25.0 and 3.15.0 also have significant downloads. I decided to safely download the oldest version, which is 3.15.0.

```
npm install gatsby-plugin-google-gtag@3.15.0
```

Next, let's uninstall the outdated library.

```
npm uninstall gatsby-plugin-google-analytics
```

Modify the section in gatsby-config.ts that contained `gatsby-plugin-google-analytics` as follows. 

Just in case, I placed the gtag plugin information at the top of the plugins array, as someone mentioned that the Google Analytics plugin should be at the top for the tag addition to work correctly.

```ts
{
  resolve: "gatsby-plugin-google-gtag",
  options: {
    trackingIds: [siteMetadata.googleAnalytics],
    gtagConfig: {
      anonymize_ip: true,
    },
    pluginConfig: {
      head: true,
    },
  },
},
```

Now, after rebuilding, it should succeed. Let's wait a bit, and soon the Analytics page should reflect the following message!

![analytics-started](./site-analysis-started.png)

Finally..

# 2. Using the API to Retrieve View Counts

Let's use the Google Analytics API to determine the view counts of posts. I referred to [this article](https://blog.yeppyshiba.com/article/adding-view-count-in-gatsby/) for guidance.

## 2.1 Setting Up API Permissions

First, enable the [API](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries).

You will be prompted to enter a project name; after entering it and agreeing to the terms, you will be able to download a JSON file containing the private keys.

![enable-api](./enable-analytics-api.png)

![download-credentials](./download-credentials.png)

Open the downloaded JSON file and look for the `client_email` item. Then, in the Google Analytics settings screen, click the gear icon on the lower left and enter the Property > Property Access Management tab.

Next, add the `client_email` address and set the permission to Viewer.

![api-access](./api-access.png)

TODO.

# 4. Alternative Method: Using a Database

When using Google Analytics for view counts, it is said that about [10% of views may be missing](https://leerob.io/blog/real-time-post-views) due to reasons such as ad blockers. This is particularly true for technology-related blogs, as it seems that most readers of technical content use ad blockers.

Thus, I explored the option of using Firebase's database. Initially, I intended to follow [this article](https://leerob.io/blog/real-time-post-views), but it used Next.js and required an API route environment.

Upon further research, I found someone who had written about [how to obtain view counts in Gatsby using only client-side manipulation](https://dev.to/flashblaze/displaying-real-time-views-using-react-gatsby-and-firebase-283f), and I decided to follow that.

# 5. Firebase Setup

## 5.1 Creating a Firebase Project

Log in to Firebase and navigate to the console. I logged in using a Google account. Then, click on "Go to console" in the top menu.

A screen will appear to create a project; of course, let's proceed to create one.

![create-project](./create-firebase-project1.png)

I created a project called `witch-work-views`. You can link it with Google Analytics, and I just used the account I created earlier.

## 5.2 Database Configuration

Now, let's create a database to manage view counts. Click on Build > Realtime Database in the left menu.

![realtime-database-menu](./realtime-database-menu.png)

Click on "Create Database." Choose the location as the United States, and select "Start in Test Mode" for the security rules.

![db-test-mode](./db-test-mode.png)

The Realtime Database will now be created.

Next, click on the gear icon in the left menu and select "Project Settings."

![project-settingmenu](./project-setting-menu.png)

Scroll down, and you will see a menu labeled "My Apps" with a note stating that there are no apps in the project. You can select a platform to create a new project; select the web app option. It should look like an HTML tag.

![create-web-app](./create-web-app.png)

A window will open to create the app. Enter a name and proceed without checking the Firebase hosting settings. I named my app `witch-work-views-app`.

Select "Register App" in the condition shown below.

![create-app-name](./create-app-name.png)

For the step to add Firebase SDK, do not modify anything and just select "Go to Console."

Then, return to the Realtime Database created earlier and select the "Rules" menu. Currently, it is set as follows, with both read and write set to true until May 12, 2023.

![prev-db-rule](./previous-db-rule.png)

Change the rules as follows:

```json
{
  "rules": {
        "views": {
          "$page": {
                ".read": true,
                ".write": true,
                ".validate": "newData.isNumber()"
        }
      }
   }
}
```

This will allow all users to read and write view counts for all pages in the `views` database.

# 6. Gatsby Configuration

First, install Firebase and gatsby-plugin-firebase.

```
npm install firebase gatsby-plugin-firebase
```

Add the following content to gatsby-config.ts. You can copy it from the [official documentation](https://www.gatsbyjs.com/plugins/gatsby-plugin-firebase/?=firebase).

```typescript
{
  resolve: "gatsby-plugin-firebase",
  options: {
    credentials: {
      apiKey: "<YOUR_FIREBASE_API_KEY>",
      authDomain: "<YOUR_FIREBASE_AUTH_DOMAIN>",
      databaseURL: "<YOUR_FIREBASE_DATABASE_URL>",
      projectId: "<YOUR_FIREBASE_PROJECT_ID>",
      storageBucket: "<YOUR_FIREBASE_STORAGE_BUCKET>",
      messagingSenderId: "<YOUR_FIREBASE_MESSAGING_SENDER_ID>",
      appId: "<YOUR_FIREBASE_APP_ID>"
    }
  }
}
```

Since we are utilizing the Realtime Database, add `import 'firebase/database'` to gatsby-browser.ts and gatsby-ssr.tsx.

Next, navigate to Firebase console and go to project settings. Scroll down to find your apps’ firebaseConfig.

![firebase-config](./firebase-config.png)

Create a `.env` file and input the configuration values one by one. Then install dotenv.

```
npm install dotenv
```

# References

https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/

https://ha-young.github.io/2020/gatsby/Add-Google-Analytics/

https://leerob.io/blog/real-time-post-views

https://dev.to/flashblaze/displaying-real-time-views-using-react-gatsby-and-firebase-283f

https://www.gatsbyjs.com/plugins/gatsby-plugin-firebase/?=firebase

https://www.daleseo.com/js-dotenv/