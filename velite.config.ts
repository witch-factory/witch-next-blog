import fs from 'fs';

import highlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMath from 'remark-math';
import { defineConfig, defineCollection, s, defineSchema, z } from 'velite';

import remarkHeadingTree from '@/plugins/heading-tree';
import { ThumbnailType, TocEntry } from '@/types/components';
import { uploadThumbnail } from '@/utils/cloudinary';
import { getBase64ImageUrl } from '@/utils/generateBlurPlaceholder';
import { generateRssFeed } from '@/utils/generateRSSFeed';
import { generateHeadingTree } from '@/utils/meta/generateHeadingTree';
import { slugify } from '@/utils/post';

import { generateThumbnailURL } from './src/utils/meta/generateThumbnail';

const headingTree = defineSchema(()=>
  s.custom().transform<TocEntry[]>((data, { meta }) => {
    if (!meta.mdast) return [];
    return generateHeadingTree(meta.mdast);
  }));

const articleMetadataObject = s.object({
  slug: s.path(),
  title: s.string().max(99),
  date: s.string().datetime(),
  description: s.string().max(200),
  tags: s.array(s.string()),
  thumbnail: s.object({
    local: s.string(),
    cloud: s.string().optional(),
    blurURL: s.string().optional(),
  }).optional(),
});

const articleMetadataSchema = defineSchema(()=>
  articleMetadataObject
    // transform을 거친 타입은 동기 함수일 경우 타입에 포함됨
    .transform((data) => ({ ...data, url: `/${data.slug}` }))
);

const articleSchema = defineSchema(()=>
  articleMetadataObject
    .extend({
      html: s.markdown({
        gfm: true,
      }),
      headingTree: headingTree(),
    })
    .transform((data) => ({ ...data, url: `/${data.slug}` }))
    .transform(async (data, { meta }) => {
      if (!meta.mdast) return data;
      const localThumbnailURL = await generateThumbnailURL(meta, data.title);
      const thumbnail: ThumbnailType = {
        local: localThumbnailURL
      };
      return ({ ...data, thumbnail });
    })
);

// remark는 이걸 통해서 markdown을 변환할 때 쓰인다. 따라서 그전에 썸네일을 빼놔야 하는데...
// TODO: 이제 slug에 post/를 붙이지 않아도 된다. 따라서 url을 따로 처리할지 생각해 보자
const posts = defineCollection({
  name: 'Post', // collection type name
  pattern: 'posts/**/*.md', // content files glob pattern
  schema: articleSchema()
});

const postMetadata = defineCollection({
  name: 'PostMetadata', // collection type name
  pattern: 'posts/**/*.md', // content files glob pattern
  schema: articleMetadataSchema()
});

const postTags = defineCollection({
  name:'Tag',
  pattern:[],
  schema:s.object({
    name:s.string(),
    slug:s.slug('global', ['all']),
    count:s.number()
  })
    .transform((data) => ({ ...data, url: `/${data.slug}` }))
});

const translations = defineCollection({
  name: 'Translation',
  pattern: 'translations/**/*.md',
  schema: articleSchema()
});

const translationsMetadata = defineCollection({
  name: 'TranslationMetadata',
  pattern: 'translations/**/*.md',
  schema: articleMetadataSchema()
});

const darkPinkTheme = JSON.parse(fs.readFileSync('./public/themes/dark-pink-theme.json', 'utf8'));

const rehypePrettyCodeOptions = {
  theme: {
    light: 'github-light',
    pink: 'light-plus',
    dark: 'github-dark',
    darkPink: darkPinkTheme,
  },
};

export default defineConfig({
  root:'content',
  output:{
    data:'.velite',
    assets:'public/static',
    base:'/static/',
    name:'[name]-[hash:8].[ext]',
    clean:true
  },
  markdown:{
    remarkPlugins:[remarkMath, remarkHeadingTree],
    rehypePlugins:[
      [rehypePrettyCode, rehypePrettyCodeOptions],
      rehypeKatex,
      highlight
    ]
  },
  prepare:(collections) => {
    const { posts:postsData } = collections;
    const allTagsFromPosts = new Set<string>(postsData.flatMap((post) => post.tags));
    const tagsData = Array.from(allTagsFromPosts).map((tag) => {
      return {
        name: tag,
        slug: slugify(tag),
        count: postsData.filter((post) => post.tags.includes(tag)).length,
        url: `/posts/tag/${slugify(tag)}`,
      };
    });
    collections.postTags = [
      {
        name: 'All',
        slug: 'all',
        count: postsData.length,
        url: '/posts/all',
      },
      ...tagsData,
    ];
  },
  // after the output assets are generated
  // upload the thumbnail to cloudinary
  complete: async ({ posts:postsData, postMetadata, translations, translationsMetadata }) => {
    await generateRssFeed();
    const { updatedData:updatedPosts, updatedMeta:updatedPostMetadata } = await completeThumbnail(postsData, postMetadata);
    const { updatedData:updatedTranslations, updatedMeta:updatedTranslationsMetadata } = await completeThumbnail(translations, translationsMetadata);

    fs.writeFileSync('.velite/posts.json', JSON.stringify(updatedPosts, null, 2));
    fs.writeFileSync('.velite/postMetadata.json', JSON.stringify(updatedPostMetadata, null, 2));

    fs.writeFileSync('.velite/translations.json', JSON.stringify(updatedTranslations, null, 2));
    fs.writeFileSync('.velite/translationsMetadata.json', JSON.stringify(updatedTranslationsMetadata, null, 2));
  },
  collections: { posts, postMetadata, postTags, translations, translationsMetadata },
});

type Data = z.infer<typeof articleMetadataObject>;

async function completeThumbnail<T extends Data, TMeta extends Data>(data: T[], meta: TMeta[]) {
  const thumbnailMap = new Map<string, ThumbnailType>();

  const updatedData = await Promise.all(data.map(async (item) => {
    if (!item.thumbnail) return item;
    try {
      if (item.thumbnail.local.startsWith('/')) {
        const results = await uploadThumbnail(item.thumbnail.local);
        item.thumbnail.cloud = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_300,f_auto/${results.public_id}`;
        item.thumbnail.blurURL = await getBase64ImageUrl(item.thumbnail.cloud);
        thumbnailMap.set(item.slug, item.thumbnail);
      }
      else {
        item.thumbnail.cloud = item.thumbnail.local;
        thumbnailMap.set(item.slug, item.thumbnail);
      }
    } catch (e) {
      console.error(e);
    }
    return item;
  }));

  const updatedMeta = meta.map((item) => {
    const thumbnail = thumbnailMap.get(item.slug);
    if (!thumbnail) return item;
    return { ...item, thumbnail };
  });

  return { updatedData, updatedMeta };
}