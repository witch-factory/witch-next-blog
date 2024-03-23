import fs from 'fs';

import highlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkMath from 'remark-math';
import { defineConfig, defineCollection, s } from 'velite';

import { blogConfig } from '@/config/blogConfig';
import { uploadThumbnail } from '@/utils/cloudinary';
import getBase64ImageUrl from '@/utils/generateBlurPlaceholder';
import generateRssFeed from '@/utils/generateRSSFeed';

import { makeThumbnail } from './src/plugins/thumbnailUtil';
// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.

// remark는 이걸 통해서 markdown을 변환할 때 쓰인다. 따라서 그전에 썸네일을 빼놔야 하는데...
const posts = defineCollection({
  name: 'Post', // collection type name
  pattern: '**/*.md', // content files glob pattern
  schema: s
    .object({
      slug: s.path(), // auto generate slug from file path
      title: s.string().max(99), // Zod primitive type
      // slug: s.path(), // auto generate slug from file path
      date: s.string().datetime(), // date type
      description: s.string().max(200), // string type
      tags: s.array(s.string()), // array of string
      html:s.markdown({
        gfm:true,
      }), // transform markdown to html
      excerpt:s.excerpt(), // extract excerpt from markdown
      headingTree:s.toc(),
      metadata:s.metadata(),
      // 썸네일을 일단 만들고...
      thumbnail:s.object({
        local:s.string(),
        cloudinary:s.string().optional(),
        blurURL:s.string().optional(),
      }).optional(),
    })
    // more additional fields (computed fields)
    .transform(async (data, { meta }) => {
      if (!meta.mdast) return data;
      const thumbnail = await makeThumbnail(meta, data.title, data.headingTree, data.slug);
      return ({ ...data, url: `/posts/${data.slug}`, thumbnail });
    })
});

const postMetadata = defineCollection({
  name: 'Post', // collection type name
  pattern: '**/*.md', // content files glob pattern
  schema: s
    .object({
      slug: s.path(), // auto generate slug from file path
      title: s.string().max(99), // Zod primitive type
      // slug: s.path(), // auto generate slug from file path
      date: s.string().datetime(), // date type
      description: s.string().max(200), // string type
      tags: s.array(s.string()), // array of string
    })
    .transform((data) => {
      return ({ ...data, url: `/posts/${data.slug}` });
    })
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
    clean:true
  },
  markdown:{
    remarkPlugins:[remarkMath],
    rehypePlugins:[
      [rehypePrettyCode, rehypePrettyCodeOptions], 
      rehypeKatex, 
      highlight
    ]
  },
  prepare: async ({ posts:postsData }) => {
    await generateRssFeed();
    if (blogConfig.imageStorage === 'local') {return;}
    
    const updatedPosts = await Promise.all(postsData.map(async (post) => {
      // 썸네일이 없는 경우, 현재 post 객체를 그대로 반환합니다.
      if (!post.thumbnail) return post;

      try {
        const results = await uploadThumbnail(post.thumbnail.local);
        post.thumbnail.cloudinary = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_300,f_auto/${results.public_id}`;
        post.thumbnail.blurURL = await getBase64ImageUrl(post.thumbnail.cloudinary);
      } catch (e) {
        console.error(e);
      }
      return post; // 수정된 post 객체를 반환합니다.
    }));

    postsData = updatedPosts;
  },
  collections: { posts, postMetadata },
});