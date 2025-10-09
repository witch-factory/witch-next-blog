---
title: Creating a Next.js Blog That Can Be Viewed in English
date: "2025-01-19T00:00:00Z"
description: "Let's create an English version of the blog and enable AI to translate and maintain the content."
tags: ["blog", "web"]
---

# Introduction

While running my blog, I often thought about wanting to provide my content to more people around the world. The barrier of language meant that my writings could only reach a limited audience, which was disappointing. Therefore, I decided to create an English version of my blog to provide the articles I worked hard on in English as well.

However, translating each article by myself would be practically difficult, so I decided to let ChatGPT handle it. With the recent advancements in the GPT API, the quality of translations has improved, and I thought I could use it to process the translation tasks quickly.

# 1. Using the ChatGPT API

You can easily get started by checking the [Developer quickstart documentation on the OpenAI platform](https://platform.openai.com/docs/quickstart). There are also many good articles online about how to use the OpenAI API.

## 1.1. Running the API

To use the OpenAI API, you need an API key. You can [create an API key on the dashboard of the OpenAI developer platform](https://platform.openai.com/api-keys), which will be used when sending requests to GPT remotely.

The cost of using the API is separate from the ChatGPT Plus subscription. You will be charged based on usage, and can check this in the Organization - Billing section of your OpenAI profile. I have charged $10 of credit.

For the gpt-4o-mini model I will be using, it costs about $0.15 per million tokens. For Korean, one token seems to be roughly equivalent to one word or 2-3 characters. Thus, approximately $10 should be sufficient for translating the articles on my blog. If you want to know how many tokens a single article might use, you can check with the [Tokenizer](https://platform.openai.com/tokenizer).

Once you have obtained the API key, let's execute the API. Since I use pnpm, I will install the JS/TS OpenAI SDK. I will install this as a development dependency since I intend to run the translation script manually.

```bash
pnpm add -D openai
```

Now, I will add an example code for the translation script, naming the file `translate.mjs` and placing it in the project root.

```javascript
// translate.mjs
import OpenAI from 'openai';

const OPENAI_API_KEY = 'Insert your API key here';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'You are a friendly and playful assistant.' },
    {
      role: 'user',
      content: 'Say hello to me!',
    },
  ],
});

console.log(completion.choices[0].message);
```

The role of the system specifies how GPT should behave. For example, it could be stated as "You are a professional translator." The user is typically the person asking questions to GPT, while the assistant is used to convey prior knowledge necessary to perform commands.

After writing this sample code to test the API, running `node translate.mjs` in the terminal will generate a response from ChatGPT. The answers varied slightly with each execution but looked something like this:

```js
{
  role: 'assistant',
  content: 'Hello! 😊 How is your day going? Are you having a good time?',
  refusal: null
}
```

## 1.2. Writing the Translation Script

Now that I can execute the API, let's use it for translation. I wrote a prompt for translation and will fetch documents to translate and save them.

First, I wrote down the prompt to deliver to GPT. Since I am not great at prompt engineering, I asked ChatGPT to help me formulate a suitable prompt. After making a few adjustments, I settled on this: you are a professional translator who translates Korean technical documents accurately and appropriately, without providing additional explanations or context.

```javascript
const systemPrompt = 'You are an expert technical translator. Your goal is to translate the given Korean technical documents into professional and accurate English. Ensure the translation is concise and formal, suitable for professional audiences. Provide only the translation without additional explanation or context.';
```

Using this prompt, I created a function to translate files into English. It reads the `inputFile` from the provided path, translates it, and writes the translated content to `outputFile`. If the specified `outputFile` path does not exist, it will create that path.

I also checked if the `inputFile` exists. However, since I will be using this function when I already have the path to existing files, I omitted this part.

```js
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// ...

// Function to translate a file into English
const translateFileToEnglish = async (inputFile, outputFile) => {
  const inputContent = readFileSync(inputFile, 'utf-8');
  const outputDir = path.dirname(outputFile);
  
  // Create the directory for the result file if it does not exist
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  try {
    const completion = await openai.chat.completions.create({
      // Use the relatively lightweight mini model
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: inputContent },
      ],
    });

    const translatedContent = completion.choices[0].message.content;

    // Write the translated content to outputFile
    writeFileSync(outputFile, translatedContent);
  }
  catch (error) {
    console.error('Failed to translate:', error);
  }
};
```

## 1.3. Fetching and Translating Files

My blog articles are stored in `content/posts`. I will translate all articles in this directory and save them in a new location. The translated articles will be saved in `content/en-posts`.

Since using the API consumes tokens, it is better to skip translation if the translated files already exist. Thus, I will write a function that performs the following actions:

- For the Korean articles in the `content/posts` directory, check if a translated version of the article exists
  - Check if there is a folder with the same name in the `content/en-posts` directory
- If the translated file does not exist, use the ChatGPT API to translate

To do this, I utilized functions from the `fs` module to read the directories and process the translation for each file.

```js
// translate.mjs
const translateAllFiles = async () => {
  const inputDir = path.join(__dirname, 'content', 'posts');
  const outputDir = path.join(__dirname, 'content', 'en-posts');

  const posts = readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  // Process all articles in the content/posts directory
  for (const post of posts) {
    const inputFile = path.join(inputDir, post, 'index.md');
    const outputFile = path.join(outputDir, post, 'index.md');

    if (!existsSync(inputFile)) {
      console.warn(`Source file not found: ${inputFile}`);
      continue;
    }

    // Skip if the translated file already exists
    if (existsSync(outputFile)) {
      console.log(`Translation already exists: ${outputFile}`);
      continue;
    }

    await translateFileToEnglish(inputFile, outputFile);
  }
};
```

Let's also add code to execute this function.

```js
// translate.mjs
translateAllFiles().then(() => {
  console.log('Translation process completed.');
}).catch((error) => {
  console.error('An error occurred during the translation process:', error);
});
```

Running `node translate.mjs` in the terminal will initiate the translation, and upon completion, the translated files will be generated and saved in `content/en-posts`. You can also confirm that the function successfully skips the translation for files that already exist.

## 1.4. Improvement - Parallel Processing and API Limit Handling

However, since the code written above uses `await` for each iteration of the for loop, the translation of one article completes and then the next translation starts afterward. This might suffice for a handful of articles, but if there are many, the time taken will increase significantly.

If each article's translation does not need to be done in order, I can send multiple API requests at once. Although there are various methods, I chose to create each translation task as a Promise and execute them all at once using `Promise.all`. Thus, I revised the `translateAllFiles` function as follows.

```js
const translateAllFiles = async () => {
  const posts = readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const translationPromises = posts.map(async (post) => {
    const inputFile = path.join(inputDir, post, 'index.md');
    const outputFile = path.join(outputDir, post, 'index.md');

    if (!existsSync(inputFile)) {
      console.warn(`Source file not found: ${inputFile}`);
      return Promise.resolve(); // Skip missing files
    }

    if (existsSync(outputFile)) {
      console.log(`Translation already exists: ${outputFile}`);
      return Promise.resolve(); // Skip already translated files
      // Manual management will be required for new translations
    }

    return translateFileToEnglish(inputFile, outputFile);
  });

  const results = await Promise.all(translationPromises);
};
```

Though the Promises containing each translation task are executed as they are created, this still allows for sending multiple requests simultaneously.

However, when translating many articles simultaneously, some API requests occasionally fail due to rate limits that OpenAI imposes. In my case, I am on OpenAI's tier 1, which supports "200,000 tokens per minute" for the gpt-4o-mini model. Given that the articles take around 5,000 to 10,000 tokens each, it becomes easy to hit the limit with so many requests.

The overall token limits can be found in the [OpenAI Rate limits](https://platform.openai.com/docs/guides/rate-limits).

To handle such cases, there are various potential strategies. However, since concurrency control is not the main focus of this article, I opted to process requests in batches and introduce delays between those batches. Given that article lengths can vary (some being 5,000 tokens while others might approach 30,000), I decided to process them in plenty of time by batching them in groups of 10.

The function I wrote to process translation tasks in batches is as follows:

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Function to handle asynchronous tasks in batches with delays
 * @param {Array<Function>} tasks - Array of functions returning Promises for asynchronous tasks
 * @param {number} batchSize - Number of tasks to execute at once
 * @param {number} delayMs - Delay between batches (in milliseconds)
 */
const processInBatches = async (tasks, batchSize, delayMs) => {
  const results = [];
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(tasks.length / batchSize)}...`);

    // Execute all tasks in the batch
    const batchResult = await Promise.allSettled(batch.map((task) => task()));
    results.push(...batchResult);

    // Add a delay if this is not the last batch
    if (i + batchSize < tasks.length) {
      console.log(`Waiting for ${delayMs / 1000} seconds before next batch...`);
      await delay(delayMs);
    }
  }
  return results;
};
```

Then, I modified the `translateAllFiles` function to utilize this batch processing function. In this case, I ensured that `translationPromises` array contains functions that will return Promises for executing translation tasks, rather than the Promises themselves. This way, I can prevent them from being executed immediately upon creation.

The code below batches translation tasks in groups of 10 with a 10-second interval between batches:

```js
const translateAllFiles = async () => {
  const inputDir = path.join(__dirname, 'content', 'posts');
  const outputDir = path.join(__dirname, 'content', 'en-posts');

  const posts = readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const translationPromises = posts.map((post) => {
    const inputFile = path.join(inputDir, post, 'index.md');
    const outputFile = path.join(outputDir, post, 'index.md');

    if (!existsSync(inputFile)) {
      console.warn(`Source file not found: ${inputFile}`);
      return null; // Skip missing files
    }

    if (existsSync(outputFile)) {
      console.log(`Translation already exists: ${outputFile}`);
      return null; // Skip already translated files
      // Manual management will be required for new translations
    }

    // Wrap it in an anonymous function to avoid immediate execution
    return () => translateFileToEnglish(inputFile, outputFile);
  }).filter(Boolean);

  // Process translation tasks in batches with a 10-second interval
  const results = await processInBatches(translationPromises, 10, 10000);
};
```

Notably, it took around $0.50 to translate approximately 210 articles. This equates to roughly 15,000 tokens per article on average. Considering that English articles have far greater readership compared to Korean content, I deem this cost to be reasonable.

# 2. Creating an English Blog

Now that the translated files have been generated, they need to be applied to the blog. I manage markdown articles in my blog using a library called [velite](https://witch.work/posts/velite-library-introduction). This means I will simply create another schema to handle English articles, just like I did for Korean articles.

Therefore, I focused on allowing the entire blog to support different languages, not just on saving and managing translated posts.

## 2.1. Creating English Pages

Since AI translation can work with any language, it could also be done in Japanese, Chinese, etc. However, I decided to focus on English for now, creating both Korean and English pages.

First, I made a dynamic route by creating a `[lang]` folder at the top of the `app` directory. I then moved all existing pages into the `[lang]` folder. All components within the pages and layout files in the `[lang]` folder will receive a `lang` prop which corresponds to the language code.

I used `generateStaticParams` to create dynamic paths for the available languages.

```js
// src/[lang]/layout.tsx
export function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}
```

Furthermore, I amended all page components so that the content displayed corresponds to the `lang` prop. Additionally, I modified other functions to operate according to the selected language. For example, the homepage was modified as follows. 

The current operational code in this blog remains largely the same. Many functions and components take `lang` as props or arguments and operate accordingly, while headings in sections utilize a `content` object to show different texts based on the `lang` argument.

While many multilingual libraries allow this via a `t` function, given that there is not too much content in different languages, I implemented this directly for now.

```tsx
type Props = {
  params: { lang: "ko" | "en" };,
};

const content = {
  ko: {
    recentPosts: '최근에 작성한 글',
    recentTranslations: '최근 번역',
  },
  en: {
    recentPosts: 'Recent Posts',
    recentTranslations: 'Recent Translations',
  },
} as const satisfies Record<Language, object>;

function Home({ params }: Props) {
  const { lang } = params;

  const recentPosts = getRecentPosts(lang);
  const recentTranslations = getRecentTranslations();

  return (
    <>
      <Profile lang={lang} />
      <section className={styles.container}>
        <div>
          <h2 className={styles.title}>{content[lang].recentPosts}</h2>
          <AllPostTagList selectedTag="all" lang={lang} />
          <PostList postList={recentPosts} direction="row" />
        </div>
        {/* Middle part omitted */}
      </section>
    </>
  );
}

export default Home;

export function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}
```

## 2.2. Setting the Default Route to Korean

Having changed multiple pages and functions to be language-oriented, users can now access the Korean and English pages respectively through the `/ko` and `/en` routes.

However, existing users familiar with my blog might want to access the original `/` route, i.e., `https://witch.work/`. Therefore, I decided that this default route should display Korean content.

Technically, content negotiation within HTTP should be used to check the user's language settings and provide content accordingly. However, handling multilingual content involves many considerations, and this exceeds the original intent of simply creating a blog that can be viewed in English.

For now, I simply opted to set the default language to Korean and allow users to select their preferred language. True i18n handling may be addressed later as an opportunity arises.

In any case, I decided that accessing the base path should always show the Korean page. Hence, I rewrite the URL to redirect users to the default locale (Korean) if they access the path without language information. This task is done using Next.js middleware, which is written in `src/middleware.ts`.

```ts
export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;

  // Search for locale in the URL path
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    // Pass if the path already contains a locale
    return NextResponse.next();
  }

  // Rewrite to show content of the default locale if the path does not have a locale
  request.nextUrl.pathname = `/${i18n.defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}
```

The `i18n` object used here is defined as follows. You can see that the `defaultLocale` is set to Korean.

```ts
export const i18n = {
  defaultLocale: 'ko',
  locales: ['ko', 'en'],
} as const;
```

## 2.3. Language Switcher UI

Let’s create a UI that allows users to change to English. This requires creating a language switch button that redirects to the corresponding language page upon clicking. As Next.js does not support accessing the current path within server components, this needs to be a client component.

Since the Korean pages do not include language indicators in their paths (like `/ko`, `/en`), I designed the language switch button accordingly. Utilizing the `usePathname` hook to determine the current path and the `useRouter` hook to create a function for switching to another language, I made sure to ignore the scenario where the selected language is the same as the existing language.

Design-wise, this is not critical, so I will only include the logic excluding CSS.

```tsx
// src/components/LanguageSwitcher.tsx
export default function LanguageSwitcher({ lang }: { lang: Language }) {
  const pathname = usePathname(); // Current path
  const router = useRouter();
  // Language switch
  const toggleLanguage = (newLang: Language) => {
    if (lang === newLang) return; // Do nothing if it is the same language

    const pathSegments = pathname.split('/').filter(Boolean); // Split path by '/' and remove blanks
    const currentLangIndex = locales.includes(pathSegments[0] as Language) ? 0 : -1;

    // When there is no language in the path
    if (currentLangIndex === -1) {
      const newPath = newLang === i18n.defaultLocale ? pathname : `/${newLang}${pathname}`;
      router.push(newPath);
      return;
    }

    // If there is a language, replace it with the new language
    pathSegments[currentLangIndex] = newLang === i18n.defaultLocale ? '' : newLang;
    const newPath = `/${pathSegments.filter(Boolean).join('/')}`;
    router.push(newPath);
  };

  return (
    <nav className={styles.container}>
      {locales.map((locale) => (
        <button className={`${styles.button} ${locale === lang ? styles.activeButton : ''}`} key={locale} onClick={() => { toggleLanguage(locale); }}>
          {content[locale].flag}
          {' '}
          {content[locale].label}
        </button>
      ))}
    </nav>
  );
}
```

## 2.4. Inserting Translation Notice

I have generated translated versions using AI for each article. Switching between Korean and English pages is now possible. However, despite advances in AI translation, complete trust cannot be assumed. Moreover, I cannot personally review each translated article, so I decided to insert a notice for any international readers that might arise.

I created a component called `TranslationNotice`, which is displayed only if the current language is not the default locale. The notice states: "This article has been translated by AI and may contain inaccuracies. I can communicate in English, so please contact me via email if needed."

```tsx
function TranslationNotice({ lang }: Props) {
  // Do not display for the default locale
  if (lang === i18n.defaultLocale) {
    return null;
  }
  return (
    <aside
      className={styles.container}
      aria-labelledby="translation-notice-title"
      role="note"
    >
      <h3>
        ⚠️ Notice
      </h3>
      <p>
        This article has been translated by AI(gpt-4o-mini) and may contain inaccuracies. I can communicate in English, so please contact me via
        {' '}
        <a
          style={{
            textDecoration: 'underline',
          }}
          href={`mailto:${blogConfig.en.email}`}
        >
          {blogConfig.en.email}
        </a>
        {' '}
        if needed.
      </p>
    </aside>
  );
}
```

This notice component is embedded just below the table of contents on English article pages. There were also numerous tedious tasks to adjust countless existing functions to work based on language, but detailing each one is unnecessary. For specifics, you can refer to [the repository of my blog](https://github.com/witch-factory/witch-next-blog).

## 2.5. Solving Image Path Issues

Upon completing this, translated files will be generated in the `content/en-posts` directory. Modifying the settings of velite will allow the English page for each article to be generated correctly; however, an issue arose where images did not display correctly.

The issue stems from this: my blog is made using Next.js, which requires placing media such as images in the `public` directory and referencing them with absolute paths in this framework. Conversely, the images within my markdown articles are often referenced with relative paths like `./image.png`, while the original images are stored under `content/posts`.

Thus, the [velite library provides an option called `markdown.copyLinkedFiles`](https://velite.js.org/reference/config#markdown-copylinkedfiles) that creates copies of files referenced with relative paths during the transformation of markdown files.

However, complications arise when it comes to multilingual support. While it might be reasonable to create additional copies for each new language added, doing so would be inefficient given that images abound. It is advisable to only store the original images within `content/posts` and reference those in the translated files.

So how can this be achieved? By writing a remark plugin that changes the paths of images used in the translated articles. Given the current directory structure, where original articles and images lie within the `content/posts` directory while the translated files lie in the `content/en-posts` directory, we can construct paths this way:

```
content
├── posts
│   ├── article1
│   │   ├── index.md
│   │   ├── image11.png  # Original images used in each article
│   │   ├── image12.png  
│   ├── article2
│   │   ├── index.md
│   │   ├── image21.png
│   │   ├── ...  
├── en-posts
│   ├── article1  
│   │   ├── index.md # Translated article folder containing no images
│   ├── article2
│   │   ├── index.md
```

This means we need to update image paths in markdown articles in the `en-posts` directory from `./path` to `../../posts/path`. This can be done via the remark plugin used during markdown transformation. I utilized the `path` module’s `path.dirname` and `path.basename` to ascertain the current file's directory and filename, thus accomplishing the task to modify image paths.

[Previously, I created a custom remark plugin to change image paths while making my blog, from which I drew inspiration to create this.](https://witch.work/posts/blog-remake-4#32-remark-%ED%94%8C%EB%9F%AC%EA%B7%B8%EC%9D%B8-%EB%A7%8C%EB%93%A4%EA%B8%B0) The code is as follows:

```js 
import path from 'path';

import { Root } from 'mdast';
import { VFile } from 'vfile';
import { visit } from 'unist-util-visit';

export default function remarkImagePath() {
  return function (tree: Root, file: VFile) {
    const articleSlugPath = path.basename(path.dirname(file.path));
    const updatedDir = `../../posts`;

    visit(tree, 'image', (imageNode) => {
      const fileName = imageNode.url.replace('./', '');
      const updatedPath = `${updatedDir}/${articleSlugPath}/${fileName}`;
      imageNode.url = updatedPath;
    });
  };
}
```

Currently, my blog features an image associated with each article that serves as a thumbnail for article listings and open graph images. While generating the URLs for these thumbnails, I transformed the relative URLs into absolute paths, which must also be done for the translated articles.

Thus, I created a function to appropriately convert thumbnail relative paths for languages other than Korean.

```js
// Update image paths for each language
function updateImagePathForLanguage(imageURL: string, meta: ZodMeta, lang: Language): string {
  if (lang === 'ko') return imageURL;

  const articleSlugPath = path.basename(path.dirname(meta.path));
  const updatedDir = `../../posts`;
  const fileName = imageURL.replace('./', '');

  return `${updatedDir}/${articleSlugPath}/${fileName}`;
}
```

Utilizing this function, I altered the logic used to create the thumbnail as follows.

```
* Previous Logic *
Extract the relative path of the thumbnail image -> Change relative path to absolute path -> Associate the thumbnail with the article

* New Logic *
Extract the relative path of the thumbnail image -> Convert the relative path of the thumbnail image according to the language (updateImagePathForLanguage) -> Change the relative path to absolute path -> Associate the thumbnail with the article
```

However, some thumbnails were displaying incorrectly. In cases where articles lacked images for thumbnails, I had been using the `vercel/og` library to generate thumbnail images based on the article's title; however, these auto-generated thumbnails did not display correctly on the blog pages.

For automatically generated thumbnails, the URLs would appear as `https://witch.work/api/og?title=Title`. When displaying thumbnail images on the blog, I would use Next.js’s `<Image>` component, which automatically optimizes the image source, potentially resulting in issues during this process.

Thus, I leveraged the unoptimized option of the `<Image>` component, ensuring that when the thumbnail URL starts with specific patterns, the image source optimization would be disabled. I made sure to apply this to English URLs as well.

```js
const vercelOGURL = `${blogConfig.ko.url}/api/og?title=`;
const vercelEnOGURL = `${blogConfig.en.url}/api/og?title=`;

function PostThumbnail({ title, thumbnail }: { title: string, thumbnail: PostIntroType['thumbnail'] }) {
  const thumbnailURL = thumbnail?.[blogConfig.ko.imageStorage] ?? thumbnail?.local;
  if (!thumbnail || !thumbnailURL) {
    return null;
  }
  return (
    <div>
      <Image
        className={styles.image}
        style={{ transform: 'translate3d(0, 0, 0)' }}
        src={thumbnailURL}
        unoptimized={thumbnailURL.startsWith(vercelOGURL) || thumbnailURL.startsWith(vercelEnOGURL)}
        alt={`${title} thumbnail`}
        width={200}
        height={200}
        sizes="200px"
        placeholder={'blurURL' in thumbnail ? 'blur' : 'empty'}
        blurDataURL={thumbnail.blurURL}
      />
    </div>
  );
}
```

This ensures that thumbnail images generated using `vercel/og` display correctly on the blog.

# 3. Detecting Article Changes and Sending Notifications

I have created scripts to handle the translation, established English versions of pages, and modified most components to operate based on language settings. Media like images now display correctly as well.

However, a problem remains. Currently, the logic simply skips translations if a translated article file exists for the corresponding Korean article. But what if I discover errors in an article or finish writing an article that was previously incomplete? Logically, I need to update the content of the translated article as well. However, presently, this is only checked against the existence of the translation file.

It would not be efficient to translate all articles every single time. This would lead to redundant operations and the cost incurred using the OpenAI API.

Using GitHub Actions to automatically detect changes in Git, translating only those changed files, is one option that comes to mind. Yet this method has its shortcomings.

I find that in writing blog articles, minor edits can occur repeatedly, with dozens of adjustments emerging for a single article. Translating each of those minor adjustments would be wasteful.

Moreover, frequent odd translations generated by the AI, such as incorrect special characters (like `:`) finding their way into titles, leads to concerns over translation accuracy. I've experimented with adjusting prompts multiple times, but the results have not been consistently satisfactory.

Taking these considerations into account, I concluded that I must exercise some control in order to efficiently use API requests and ensure formatting is adhered to in translations.

Thus, I decided that whenever changes are detected in articles, I want to be notified via email of which articles were modified. I would then assess if these changes warrant a re-translation. If I determine a fresh translation is required, I can delete the existing translation of the article and run the script again for translation, allowing for a quick review.

Inspired by the Toss Technology Blog's article on [Improving Code Review Culture with GitHub Actions](https://toss.tech/article/25431), I chose to automate this process using GitHub Actions. This will involve gathering information regarding altered files in Git and sending myself an email detailing those changes.

## 3.1. Fetching Git Changes

To implement my idea, I first need functions that retrieve information on modified articles from Git. I created a file called `mailer.mjs` and wrote a function that fetches the changes for a specific directory by comparing the current commit with the previous one.

```js
function getGitDiff(directory) {
  try {
    // Check for changes between the previous commit and the current commit
    const gitStatus = execSync(`git diff --name-status HEAD^ HEAD ${directory}`).toString();
    return gitStatus;
  }
  catch (error) {
    console.error(error);
  }
}
```

This approach allows me to ascertain which files have been changed. However, I want more granular information about the titles and simple summaries of these modified files. Therefore, I rewritten the function to receive the changed files as input (`diffOutput`) and read the initial lines that correspond to their front matter.

In the following logic, when files are added or modified (status is not `A` or `D`), I read a few lines from the files to capture their `content`. The `readFileLines` function uses streams to extract the front matter from markdown files, and its functionality can be found in the [mailer.mjs file](https://github.com/witch-factory/witch-next-blog/blob/main/mailer.mjs).

```js
async function getChangedFilesContent(diffOutput) {
  const fileChanges = diffOutput.split('\n').map((line) => {
    const [status, filePath] = line.trim().split('\t');
    return { status, filePath };
  });

  const fileContents = await Promise.all(
    fileChanges.map(async ({ status, filePath }) => {
      // Ignore if not a .md file
      if (filePath && !filePath.endsWith('.md')) {
        return null;
      }
      switch (status) {
        case 'D':
          return { status, filePath, content: null };
        case 'A':
        case 'M':
          if (fs.existsSync(filePath)) {
            const content = (await readFileLines(filePath)).split('\n').slice(1);
            return { status, filePath, content };
          }
          else {
            console.warn(`File not found: ${filePath}`);
            return null;
          }
      }
    },
    ));

  return fileContents.filter(Boolean);
}
```

## 3.2. Sending the Email

I used the `nodemailer` library to send the email notifications. I mainly referred to the article about [Sending Gmail with nodemailer (+ fixing security issues)](https://www.cckn.dev/dev/2000-9-nodemailer/) for this task.

The function `sendEmail` is structured to accept the changes gathered from `getChangedFilesContent`, allowing me to compose the email notification.

```js
async function sendMail(changedFiles) {
  if (!changedFiles || changedFiles.length === 0) {
    console.log('No changed files found.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: 'My Email',
    to: 'My Email',
    // Email subject
    subject: `${new Date().toLocaleDateString('ko-KR')} Blog Article Change Notification`,
  };

  const emailContent = `
      ${changedFiles
      .map(
        ({ status, filePath, content }) => {
          // Omitted the email content creation part since it's too lengthy
          // For details refer to https://github.com/witch-factory/witch-next-blog/blob/main/mailer.mjs
        },
      )}
  `;

  try {
    let info = await transporter.sendMail({
      ...mailOptions,
      html: emailContent,
    });
    console.log('Message sent: %s', info.messageId);
  }
  catch (error) {
    console.error(error);
  }
}
```

The script for sending the email is as follows. It checks for modifications within `content/posts`, retrieves the modified files’ content, formats that content, and then sends an email notification.

```js
(async () => {
  const targetDirectory = 'content/posts';
  const gitDiff = getGitDiff(targetDirectory);

  if (!gitDiff) {
    console.log('No changed files found.');
    return;
  }

  const changedFiles = await getChangedFilesContent(gitDiff, targetDirectory);

  await sendMail(changedFiles);
})();
```

Executing this with `node mailer.mjs` may lead to a security-related error message from Gmail. This can be resolved by generating an app password, referencing the section titled [Mail Security Issues with Gmail](https://www.cckn.dev/dev/2000-9-nodemailer/#gmail-%EB%B3%B4%EC%95%88-%EA%B4%80%EB%A0%A8-%EC%97%90%EB%9F%AC-%EB%A9%94%EC%84%B8%EC%A7%80) in the previously noted article.

## 3.3. Sending Emails via GitHub Actions

Now I will set this up in GitHub Actions. The goal is to trigger emails whenever modifications are made in the `content/posts` directory through a push or pull request, utilizing `mailer.mjs`.

```yml
name: Send Mail on Content Change

on:
  push:
    branches: 
      - main
    paths:
      - 'content/posts/**'
  pull_request:
    branches:
      - main
    paths:
      - 'content/posts/**'

jobs:
  alarm_change:
    runs-on: ubuntu-latest

    steps:
      # 1. Clone the repository
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9
          run_install: false

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run email script
        env:
          MAIL_USER: ${{ secrets.MAIL_USER }}
          MAIL_PASS: ${{ secrets.MAIL_PASS }}
        run: node ./mailer.mjs
```

In the `actions/checkout@v4`, setting `fetch-depth` to 2 ensures that both the latest and previous commits are fetched. The `getGitDiff` function relies on Git commands to compare these two commits to identify altered files, necessitating at least two commits to be available. If `fetch-depth` is not set, only the latest commit gets brought in, making it impossible to determine changes.

After saving this GitHub Actions file and pushing to GitHub, ensuring all the required environment variables such as `MAIL_USER`, `MAIL_PASS`, etc., are set, editing a file in the `content/posts` directory should send an alert email successfully. From there, I can manually run the translation script once I assess the necessary adjustments.

![Blog Article Change Notification Email](./mail-alarm.png)

# Conclusion

I wrote scripts utilizing AI to manage translation tasks and made the necessary modifications in the blog's code to use the translated files effectively. Throughout this process, I was careful to optimize for translation costs. I also encountered and resolved detailed matters like image path issues, while implementing notifications whenever articles requiring translation are changed.

Although I aimed to perfect the automation of all tasks, it became clear that maintaining personal control often led to simpler solutions. Rather than striving for full code simplification, having GitHub Actions notify me allowed for much easier management when I could handle tasks manually, especially since refining prompts required considerable time without promising results.

Ultimately, this process has enabled my blog to support both Korean and English. While I did not delve into aspects like SEO for English posts, such as improving sitemap coverage and file metadata since I focused primarily on the question of maintaining an English version of the blog, I have also ensured that the code is adaptable for supporting additional languages in the future. Moving forward, HTTP content negotiation for better i18n support or enhancing prompt engineering for higher-quality translations is advisable. I intend to continue improvements to enable my blog to reach a wider audience globally. 

# References

- Using the ChatGPT API

OpenAI Platform Developer Quickstart

https://platform.openai.com/docs/quickstart

Building a Translator with ChatGPT for Korean to English Translation

https://velog.io/@janequeen/gpt-%EB%B2%88%EC%97%AD%EA%B8%B0

Design Guide for GPT for GitLab Technical Documentation Translation

https://insight.infograb.net/blog/2024/03/27/gpt-gitlabdocs/

GitHub Actions: ambiguous argument 'main': unknown revision or path not in the working tree

https://stackoverflow.com/questions/78276709/github-actions-ambiguous-argument-main-unknown-revision-or-path-not-in-the-w

- Creating an English Blog

Next.js documentation on Internationalization

https://nextjs.org/docs/app/building-your-application/routing/internationalization

- Sending Emails

Sending Emails using nodemailer to Google, Naver, Daum Kakao

https://bloodstrawberry.tistory.com/1327

Sending Emails via GitHub Actions on Push Events

https://bloodstrawberry.tistory.com/1331

Sending Gmail Using nodemailer (+ Fixing Security Issues)

https://www.cckn.dev/dev/2000-9-nodemailer/

Summary of Using GitHub Actions

https://zzsza.github.io/development/2020/06/06/github-action/