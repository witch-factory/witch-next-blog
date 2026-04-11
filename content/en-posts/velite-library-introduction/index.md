---
title: Discovering Velite for Easy Management of Static Content
date: "2024-04-13T00:00:00Z"
description: "Velite, a replacement for Contentlayer that provides a content abstraction layer"
tags: ["blog", "front", "react"]
---

![Thumbnail](./velite-thumbnail.png)

# Discovery of Velite

In my blog, I used a library called Contentlayer to handle blog posts written in Markdown. [However, Contentlayer is no longer maintained.](https://github.com/contentlayerdev/contentlayer/issues/429) The issues linked as well as others indicate that the original maintainer is involved with Prisma. It is also noted that Vercel has ceased sponsorship of Contentlayer. Given the lack of funding and manpower, it appeared that future maintenance would be challenging.

A comment from another maintainer on [April 2, 2024](https://github.com/contentlayerdev/contentlayer/issues/651#issuecomment-2030335434) mentioned discussions about the future direction. However, the maintainers seemed to be busy with other open-source projects that have more users than Contentlayer. Therefore, I was not confident about the active maintenance of Contentlayer going forward.

For these reasons, I decided to search for a library to replace Contentlayer's role in my blog. I considered the following criteria:

- Provide an abstraction library that handles content in Markdown along with types
- Maintain the format of previously used content
- Well maintained (better if I can contribute)

Among the options, I found a library called Velite, which I have been using in my blog and have been quite satisfied with, so I would like to introduce it. Although it is still in beta, since Contentlayer was also in beta, I believe trying out Velite would not be a bad idea.

**This article is based on version 0.1.0-beta.14 of Velite. There may be breaking changes in future library updates.**

# 1. Introduction

The core of Velite is to create an abstraction layer for content, making it easy to read files containing JSON, Markdown, YAML, etc., and allowing validation through types. In other words, it simplifies the manipulation of content data without requiring the direct construction of a content management system (CMS). It also enables the extraction and conversion of additional information from the content.

Velite extracts metadata such as titles and brief descriptions, and it utilizes the schema from the [Zod](https://zod.dev/) library for type and validity checks.

# 2. Basic Usage

For a beta version, the [official documentation](https://velite.js.org/) is quite user-friendly. Therefore, I will briefly cover the basic usage outlined in the official documentation.

Assuming that you have installed Velite using npm, yarn, pnpm, etc.

## 2.1. Define a Collection

Velite allows you to define how the content will be represented through collections. Use the `defineCollection` function to configure the collection.

When defining the content format, you use an object called `s`, which extends Zod's `z`, providing custom schemas like `s.slug()`, `s.markdown()`, etc.

For a blog post, the collection can be defined as follows. This collection is a slightly edited version of what is defined in my actual blog. It includes the file path, post title, post date, tags, and converts the Markdown into an HTML document string. Even without knowing Zod, you can roughly understand the limitations placed on each schema.

```ts
// Define the collection in the velite.config.ts file
import { defineCollection, s } from "velite";

const blogPost = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s.object({
    slug: s.path(),
    title: s.string().max(99),
    date: s.string().datetime(),
    tags: s.array(s.string()),
    html: s.markdown({
      gfm: true,
    }),
    thumbnail: s.image(),
  }),
});
```

You can also observe the `name` and `pattern` properties, where `name` refers to the type name of the collection, and `pattern` indicates that content matching this pattern will be recognized and converted in this collection.

As such, when converting this collection with Velite, all `*.md` files in the `content/posts/` directory (note that this path may change if the content root directory is set differently in the configuration file explained later) will be converted according to this collection, and the data type of these files will be named `Post`.

You can find the type defined in the generated `.velite/index.d.ts` file, which will be named `Post`.

```ts
export declare const blogPost: Post[]
```

For reference, `defineCollection` and the `Collection` type used there are defined as follows:

```ts
// velite repository src/types.ts
export const defineCollection = <T extends Collection>(collection: T): T => collection

interface Collection {
  name: string
  pattern: string | string[]
  single?: boolean
  schema: Schema
}
```

The unused `single` property indicates whether the collection holds only a single data item. If this property is true, the collection will have only one element. This can be used for cases like site metadata, but is not common, so the default is false and can be omitted.

## 2.2. Define Configuration

[Velite Configuration Documentation](https://velite.js.org/reference/config)

Velite transforms content into a form that can be easily used in applications. It reads the `velite.config.ts` file in the project root to reference configurations. This configuration can be defined as an object through the `defineConfig` function in `velite.config.ts`.

By exporting the configuration object defined with this function using `export default`, Velite automatically uses this configuration during content transformation.

```ts
// velite.config.ts
import { defineConfig } from "velite";

export default defineConfig({
  root: "content", // Directory where the content data is located. Default is content
  output: {
    // Settings for where to store transformed data
    // All default values except clean (default is false)
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:8].[ext]",
    clean: true,
  },
  // Collections to transform
  collections: [blogPost],
  // Configuration for remark and rehype plugins used for transforming md and mdx
  // GitHub Flavored Markdown is enabled by default.
  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
  prepare: ({ blogPost }) => {
    // Additional processing for transformed content
    // Processing occurs before the content is written to files
    // Modifications, additional data generation, etc. are possible
    // The prepare and complete methods are described in #4.
  },
  complete: ({ blogPost }) => {
    // Processing after content transformation and file generation is complete
    // Additional tasks such as uploading images to CDN and distributing result files
  },
});
```

## 2.3. Define the Type for the Configuration Object

The types for the `defineConfig` function and the `UserConfig` used here are defined as follows:

```ts
// velite repository src/types.ts
export const defineConfig = <T extends Collections>(config: UserConfig<T>): UserConfig<T> => config

export interface UserConfig<T extends Collections = Collections>
  extends Partial<PluginConfig> {
  root?: string;
  output?: Partial<Output>;
  collections: T;
  loaders?: Loader[];
  markdown?: MarkdownOptions;
  mdx?: MdxOptions;
  prepare?: (data: Result<T>) => Promisable<void | false>;
  complete?: (data: Result<T>) => Promisable<void>;
}
```

Since there is a separate type for defining the configuration object, you can directly define and export the configuration object using the `UserConfig` type instead of using the `defineConfig` function.

```ts
// velite.config.ts
import { UserConfig } from 'velite'

const config: UserConfig = {
  // ...
}

export default config;
```

However, according to the official documentation, using `defineConfig` provides better type inference, so it is recommended to use `defineConfig`.

## 2.4. Transforming Content and Usage

Having defined the collection in the `velite.config.ts` file and the configuration object, you can now transform content with Velite. Running the following command in your project's terminal will transform the content located in the specified content path (default is the `content` folder) and save it in the output path defined in the configuration file.

```bash
# It works well using npx, yarn, etc., depending on the package manager.
pnpm velite
```

The transformed data will be saved in the output path specified in the configuration object under `output.data`. The default value for this is `.velite` in the project root. For convenient usage, configure a path alias. Aliases can be configured in `tsconfig.json`. The Velite official documentation recommends using `#site/content` as an alias.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "#site/content": ["./.velite"]
    }
  }
}
```

Now, the application can import and use the transformed data. For the `blogPost` collection transformed above, it can be imported as follows. The imported `blogPost` will have the array type of `Post` as defined in the collection.

```ts
// blogPost is of type Post[]
// You can use this blogPost to render or manipulate the transformed data of the blog posts
import { blogPost } from "#site/content";
```

For how to use Velite with Next.js, refer to the official [Integration with Next.js](https://velite.js.org/guide/with-nextjs) documentation. This configuration is essential for using Velite with Next.js.

# 3. Defining Properties Using Transform

In the Velite configuration file, you defined how content should be transformed using `defineCollection`. The `defineConfig` was used to set up settings for the content transformation process: from which folder to fetch content, where to place the transformation results, which plugins to use for Markdown conversion, and much more. The rest of the content transformation is handled by Velite, allowing us to use it with types.

Just transforming the content by defining its format is already quite useful. However, Velite allows for more operations, such as defining additional or custom properties using the data generated according to the schema.

## 3.1. Defining Additional Properties Using Transformed Data

The `s` object that Velite supports for data schema utilizes all the features of Zod. The content transformation within Velite also uses Zod’s `.safeParseAsync`. Therefore, the method `.transform()` used for transforming schema data is naturally supported as well. With this method, new or custom values can be created using the values of the previously defined data schema.

The `.transform()` method attached to `defineCollection()` receives `data` as its first argument, which represents the data transformed according to the collection. If you return new data within this callback, it will be used as the new transformed result data. For example, if you want to add a `url` property to the previously created `blogPost` collection using the `slug`, you can do it as follows:

```ts
const blogPost = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s
    .object({
      slug: s.path(),
      // ... omitted ...
    })
    .transform((data) => ({
      ...data,
      url: `/posts/${data.slug}`,
    })),
});
```

If the callback passed to `.transform()` is an asynchronous function, the properties added by `.transform()` will not be included in the schema type. This limitation arises not from Velite but rather from the compile-time constraints of types. If properties added in an asynchronous `.transform()` callback need to be included in the schema type, they must be added as optional. This way, while validation won’t occur at parse time, the type will include the optional property.

```ts
const blogPost = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s
    .object({
      // ...
      url: s.string().optional(),
    })
    .transform(async (data) => ({
      ...data,
      url: `/posts/${data.slug}`,
    })),
});
```

Alternatively, you can process parts that can be handled synchronously separately from those that must be processed asynchronously through two separate `.transform()` calls. This allows additional properties processed synchronously to be added naturally to the type, while only those needing to be processed asynchronously will be marked as optional. Below is a slight edit of the actual code used in my blog.

```ts
const blogPost = defineCollection({
  name: "Post",
  pattern: "posts/**/*.md",
  schema: s
    .object({
      slug: s.path(),
      // ... omitted ...
      thumbnailURL: s.string().optional(),
    })
    .transform((data) => ({
      ...data,
      url: `/posts/${data.slug}`,
    }))
    .transform(async (data, { meta }) => {
      if (!meta.mdast) return data;
      const thumbnailURL = await generateThumbnailURL(meta, data.title, data.headingTree, data.slug);
      return ({ ...data, thumbnailURL });
    })
});
```

## 3.2. Defining Additional Properties Using Metadata

The callback function received by the `.transform()` method also gets a second argument which is an object containing a `meta` property. This property holds metadata related to the content transformation, such as `meta.plain`, which extracts plain text from the content.

In terms of typing, the previously discussed `transform` method is defined in the `ZodType` class. Following the type for the callback function for the `transform` method, the object passed in as the second argument has a `meta` property of type `ZodMeta`. Thus, `meta` can be represented in the following form:

```ts
// Official documentation link https://velite.js.org/reference/types#velitefile
interface ZodMeta extends File {}

class VeliteFile extends VFile {
  get records(): unknown
  get content(): string | undefined
  get mdast(): Root | undefined
  get hast(): Nodes | undefined
  get plain(): string | undefined
  static get(path: string): File | undefined
  static async create({ path, config }: { path: string; config: Config }): Promise<File>
}
```

You can create new schemas using `meta`.

```ts
const posts = defineCollection({
  schema: s.object({
    // ...
    example: s.custom().transform((data, { meta }) => {
      // Create a new property using the metadata in meta
    }),
  }),
});
```

### 3.2.1. Creating Custom Schemas

For instance, suppose you want to extract a specific number of characters from the start of the content for use in page metadata. The `ZodMeta` shown earlier allows you to use the `meta.plain` getter to fetch just the text body from the content. You can create a custom schema that extracts a substring of this `plain` string of a specified length (e.g., 100 characters).

```ts
const posts = defineCollection({
  schema: s.object({
    // ...
    excerpt: s.custom().transform((data, { meta }) => {
      const { plain } = meta;
      return plain.slice(0, 100);
    }),
  }),
});
```

This functionality is already supported by Velite through the `s.excerpt({ length: number })` schema. This was a simple example of utilizing properties from `meta` for explanation purposes.

A more useful example would be using the `meta.mdast` to traverse the Markdown AST and create a specific property. The `mdast` metadata refers to the AST generated by parsing the Markdown.

For example, you can directly create a TOC (Table of Contents) tree by traversing the `mdast`. While Velite supports `s.toc()`, customizing certain features like handling duplicate elements and adding `id` attributes to HTML elements may be more difficult. If you have specific TOC logic in mind, implementing it manually can be an advantage.

```ts
const posts = defineCollection({
  // ...
  schema: s
    .object({
      // ...
      headingTree: s.custom().transform((data, { meta }) => {
        if (!meta.mdast) return [];
        return generateHeadingTree(meta.mdast);
      }),
    })
})

// generateHeadingTree is defined similarly in another file
export function generateHeadingTree(tree: Mdast) {
  const headingID: Record<string, number> = {};
  const output: TocEntry[] = [];
  const depthMap = {};
  // Traverse the mdast for the toc using unist-util-visit
  visit(tree, 'heading', (node: Heading) => {
    processHeadingNode(node, output, depthMap, headingID);
  });
  return output;
}
```

You can also [use `defineSchema` to separate custom schemas with type inference.](https://velite.js.org/guide/custom-schema) This way, just like `s.slug()` or `s.markdown()`, you can utilize `headingTree()` as a schema in the collection.

```ts
import { defineSchema, s } from 'velite'

const headingTree = defineSchema(() =>
  s.custom().transform<TocEntry[]>((data, { meta }) => {
    if (!meta.mdast) return [];
    return generateHeadingTree(meta.mdast);
  })
);
```

### 3.2.2. Creating Additional Properties

The `.transform()` method can also be used when creating custom schemas as it is intended for transforming the results from parsing content with the schema.

However, beyond using it as an element of the schema object, you can also use it directly within the schema object of the Velite setting. This allows you to apply additional validity checks or create extra properties using the transformed result data alongside the metadata. 

In my blog, each post has a featured image, which serves as both the thumbnail for the post list and the Open Graph image. You can utilize the `transform` method to create a property for this image. If images are present in the post, you can use the first one; otherwise, you can generate an image using the `canvas` using the post’s title, TOC, and slug. This requires access to both `meta.mdast` and content transformation results. Hence, it matches the previously mentioned utility perfectly.

The following code is a slightly edited version of the actual code utilized for generating thumbnails in my blog. This demonstrates how to apply a transform to a schema object to create additional properties from transformed content results.

```ts
// velite.config.ts
const posts = defineCollection({
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      // ...
      thumbnail: s.object({
        local: s.string(),
      }).optional(),
    })
    .transform(async (data, { meta }) => {
      const thumbnail: ThumbnailType = {
        local: await generateThumbnailURL(meta.mdast, data.title, data.headingTree, data.slug);
      };
      return ({ ...data, url: `/posts/${data.slug}`, thumbnail });
    })
});

// Traversing mdast to extract all images
function extractImgSrc(mdast: Mdast) {
  const images: string[] = [];
  visit(mdast, 'image', (node)=>{
    images.push(node.url);
  });
  return images;
}

export async function generateThumbnailURL(meta: ZodMeta, title: string, headingTree: TocEntry[], filePath: string) {
  const images = extractImgSrc(meta.mdast);
  if (images.length > 0) {
    // Use the first image in the post as the featured image
    const imageURL = images[0];
    return isRelativePath(imageURL) ?
      processImageForThumbnail(imageURL, meta.mdast, filePath) :
      imageURL;
  }
  else {
    // Generate thumbnail directly
    return createThumbnail(title, headingTree, filePath);
  }
}
```

# 4. Additional Tasks After Content Transformation

The configuration object in `velite.config.ts` provides two methods: 

- `prepare`: A method for performing extra tasks before writing the transformed data to the JSON files.
- `complete`: A method for performing necessary tasks after content transformation and document generation.

## 4.1. Prepare

The `prepare` method of the configuration object allows for tasks necessary before writing the transformed data to files. For example, you can modify, filter, or add missing properties to the data.

The object containing the transformed data is passed as an argument. For instance, earlier, we transformed data using the `blogPost` collection, and this transformed data is directly passed to the `prepare` method. The data returned from `prepare` will be used as the actual transformed data.

A typical example of utilizing `prepare` is when a document has a `draft` property indicating whether it is still being written; you can exclude such documents from the transformation results. This example is also illustrated in the official documentation.

```ts
const posts = defineCollection({
  schema: s
    .object({
      // ...
      draft: s.boolean().optional(),
    }),
  collections: { blogPost },
  prepare: ({ blogPost }) => {
    // Exclude documents where draft is true from the transformation data
    blogPost = blogPost.filter((post) => !post.draft);
  }
});
```

Alternatively, if there are tags in the posts, you can extract all tags and write the results to the transformed data.

## 4.2. Complete

The `complete` method of the configuration object allows you to perform necessary tasks after the entire content transformation and data writing to files are completed. This could involve uploading transformed data to a CDN or distributing the resulting files. Just like `prepare`, the transformed data is passed as an object to this method.

At this point, since the content transformation and result file writing are already complete, modifying the transformed result is not straightforward unless you manipulate it directly with file functions like `fs.writeFile`. Instead, you can perform tasks like uploading the transformed results to an OSS or images to a CDN.

```ts
const posts = defineCollection({
  schema: s
    .object({
      // ...
      thumbnail: s.object({
        // Local path for thumbnail URL
        local: s.string(),
      }).optional(),
    }),
  collections: { blogPost },
  complete: async ({ blogPost }) => {
    // Upload each post's thumbnail image to CDN
    await Promise.all(
      blogPost.map(async (post) => {
        if (post.thumbnail) {
          await uploadThumbnailToCDN(post.thumbnail.local);
        }
      })
    );
  }
});
```

# 5. Overall Evaluation of Velite

Velite is in beta but functions quite well considering that most of its functionality has been developed by a single person. There are indeed areas where it falls short, such as type validation for properties created through `transform` or performance issues. **However, Velite is under active development.** The custom schema feature using `defineSchema` that was discussed earlier was added only a few days before this writing. Moreover, compared to other content transformation libraries, its code is relatively simple, making customization and contributions feel easier.

However, there are still many aspects that are not formalized, leading to high freedom in customization but also making it difficult to customize without understanding the internal code. Especially when intervening in the transformation process, it’s not easy to know how far the content transformation has progressed (whether images have been moved to `/public`, whether TOC has been structured, whether content parsing is complete) or exactly what information is available. A grasp of Zod is also necessary to utilize `safeParseAsync` for content transformation.

What does the future hold for Velite? Quite honestly, it is uncertain. Velite is primarily developed by a single individual, and if Contentlayer suddenly backs up with capital, it could quickly be overshadowed. However, at this moment, Velite is quite usable and shows sufficient advantages compared to other content transformation libraries. I may even be able to contribute to creating more advantages. For now, it seems fair to evaluate that Velite is usable now and likely to improve further.

# 6. Comparison

## 6.1. Contentlayer

Both Velite and Contentlayer provide an abstraction layer and types for managing content like Markdown, MDX, and YAML. As an abstraction layer, they are framework-independent, allowing use with any framework, including Next.js and Vue. Both are in beta, indicating that breaking changes may occur.

In terms of functionality, I believe Velite has a slight edge. The active development and maintenance of Velite at this point is another advantage.

For instance, [when using Contentlayer with Next.js, static files such as images couldn’t be accessed via relative paths, which required writing a separate plugin to move static files to `/public`.](https://witch.work/posts/blog-remake-4) On the other hand, Velite automatically moves static files to `/public` using the [markdown.copyLinkedFiles](https://velite.js.org/reference/config#markdown-copylinkedfiles) setting. Additionally, custom operations using `mdast` or `hast` can be done more easily in Velite, which is clearly documented in the official documentation.

Furthermore, while Contentlayer required that all content of Markdown files be included in the transformed data, Velite defines the content within its schema. Thus, if only metadata from the Markdown files is needed (for instance, to display a list of posts or for title search functionality), you can extract just those metadata to create a new collection, resulting in a leaner page data structure. In summary, Velite offers more features and higher flexibility.

Conversely, Contentlayer’s strength lies in its stability. Though it is a beta version, many updates, examples, and contributors have been established, and there are even explanations available in Korean. A well-known example utilizing [shadcn/ui used Contentlayer.](https://github.com/shadcn-ui/taxonomy)

This stability also becomes apparent when customizing content transformations. As mentioned earlier, accurately customizing to exact specifications in Velite can be tricky. Contentlayer, however, clearly defines what can be done at each stage of transformation, such as instantiating a `VFile`. This lends insight into what information is accessible and what actions can be performed during the transformation process. Thus, while it may have lower freedom, it provides a more solid grounding for customization.

## 6.2. @next/mdx

The [Next.js official docs also introduced a way to transform Markdown using the `@next/mdx` library.](https://nextjs.org/docs/app/building-your-application/configuring/mdx) Since it is introduced in the Next.js official documentation and belongs to Vercel's repository, it won’t suddenly stop being maintained like Contentlayer.

However, there are naturally downsides.

First, while Contentlayer and Velite allowed for managing posts in directories like `/posts` or `/content` at the project root, when using `@next/mdx`, all posts must be placed in the Next.js `app/` directory. This can be somewhat remedied using the `next-mdx-remote` library. However, RSC support is still unstable, and it is not ideal to use `next-mdx-remote`, which is meant for fetching content data remotely, for retrieving files from another local path.

Additionally, customizing documents as desired is challenging with this library. In contrast to Contentlayer and Velite, which convert the contents of `.md` files to HTML strings for users to customize, `@next/mdx` treats `.md` or `.mdx` files as a single page, making customization relatively difficult.

Styling each component also poses a challenge compared to what was easily achievable through CSS in Contentlayer, necessitating the creation of custom components in a `mdx-components.tsx` file. Overall, it appears to have significantly lower freedom and is heavily tied to Next.js.

## 6.3. Marked

The marked library used in the [blog reorganization - 4. Implementing a Markdown converter using marked](https://blog.itcode.dev/posts/2021/10/28/nextjs-reorganization-4) was also an option. This library parses the given Markdown and converts it into HTML.

In this process, it can customize styling and formatting using the renderer and tokenizer APIs. The customization freedom seems quite robust. However, given that this library only provides simple transformations, additional code must be written to reproduce functionalities offered by the other libraries. Another downside is that it requires a separate HTML file as the output, rather than managing `.md` files. Compatibility with existing plugins and components that use remark and rehype is also lacking.

Looking through the mentioned blog posts, the output of the marked library doesn't seem bad, and its performance seems acceptable based on the official documentation. However, since the blog ultimately uses the transformed results and the current build times aren't extensive, I found it difficult to identify special advantages compared to existing libraries with which the blog had better compatibility. 

# References

[Why Working with Content is Hard for Developers](https://contentlayer.dev/blog/working-with-content-is-hard-for-developers)

[Official Velite Documentation](https://velite.js.org/)

[NextJS 14 Markdown Blog: TypeScript, Tailwind, shadcn/ui, MDX, Velite Video](https://www.youtube.com/watch?v=tSI98g3PDyE)

[Data Transformation with Zod for Input and Output](https://www.daleseo.com/zod-transformation/)

[Blog Reorganization - 4. Implementing a Markdown Converter Using Marked](https://blog.itcode.dev/posts/2021/10/28/nextjs-reorganization-4)

[NextJS Official Documentation, Markdown and MDX](https://nextjs.org/docs/app/building-your-application/configuring/mdx)