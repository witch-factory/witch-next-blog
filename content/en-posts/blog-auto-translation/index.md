---
title: Adding Automatic Translation Functionality to a Blog
date: "2024-12-25T00:00:00Z"
description: "Exploring how to add automatic translation to blog posts"
tags: ["blog"]
---

# 1. Introduction

As I have been running my blog, I have developed a desire to provide content targeting an audience around the world. Writing in Korean, I felt that the language barrier inevitably limited the number of people who could access my posts.

Therefore, I aim to create a separate section for translated posts and add an automatic translation feature. Given the excellent translation capabilities of ChatGPT, I plan to leverage its services for this task.

# 2. Using the Translation API

First, you can create an API key on the [OpenAI developer platform dashboard](https://platform.openai.com/api-keys). This key can be used to send requests to ChatGPT remotely.

Using this GPT API incurs fees separate from ChatGPT Plus, which can be checked in the Organization - Billing section of the OpenAI platform profile. I have charged $10 in credits.

## 2.1. Executing the API

Since my blog project uses pnpm as a package manager, let’s install the JS/TS OpenAI SDK.

```bash
pnpm add openai
```

Next, we need to add the following example code to the project. I placed it at the root of the project. The basic structure is derived from the [OpenAI Developer quickstart document](https://platform.openai.com/docs/quickstart?language-preference=javascript).

```javascript
// example.mjs
import OpenAI from 'openai';

const OPENAPI_API_KEY = 'Please insert your API key here';

const openai = new OpenAI({
  apiKey: OPENAPI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'You are a friendly and playful assistant.' },
    {
      role: 'user',
      content: 'Please greet me!',
    },
  ],
});

console.log(completion.choices[0].message);
```

The `system` role specifies how GPT should behave. For example, you could designate it as "You are a professional translator." The `user` role is generally used for the person asking questions of GPT. There is also an `assistant` role, which is used to convey background knowledge needed to execute commands.

By running this basic code and executing `node example.mjs` in the terminal, ChatGPT generates a response. Each execution produces variations, but a typical response might look like this:

```js
{
  role: 'assistant',
  content: 'Hello! 😊 How is your day going? Are you having a good time?',
  refusal: null
}
```

## 2.2. Refining the API Code

Now, let’s refine the prompt and fetch specific documents for translation.

# 3. Automation

If you want to automate translation upon deployment, GitHub Actions is a suitable tool. I was initially inclined to use GitHub Actions after being impressed by the article on [improving code review culture with GitHub Actions](https://toss.tech/article/25431) from the Toss tech blog.

However, the basic flow I need right now is as follows:

- I write a blog post.
- A translated version of the post is created before deployment.
- The translated post is deployed along with the original.

To achieve this, GitHub Actions is unnecessary since it is not required to translate each post anew every time (to conserve ChatGPT credits as well).

Therefore, I can write a script that performs the following actions as a prebuild script, or I could even add translation script execution to the `build` script.

- Check if each Korean-written post has already been translated.
  - Korean posts are located in the `content/posts` directory, while translated posts reside in language-specific directories such as `content/en-posts` or `content/jp-posts` (which I might consider later).
- If there is no translated post, use the ChatGPT API for translation.

Whether I build locally and push to GitHub or develop in dev mode and deploy—since Vercel builds the project before deployment, the prebuild script will ensure translated posts are generated and deployed.

# References

OpenAI platform Developer quickstart

https://platform.openai.com/docs/quickstart

Creating a Translator Using ChatGPT to Translate Korean to English

https://velog.io/@janequeen/gpt-%EB%B2%88%EC%97%AD%EA%B8%B0