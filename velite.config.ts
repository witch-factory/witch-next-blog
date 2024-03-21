import { Node } from 'unist-util-visit/lib';
import { defineConfig, defineCollection, s } from 'velite';

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
      html:s.markdown(), // transform markdown to html
      excerpt:s.excerpt(), // extract excerpt from markdown
      headingTree:s.toc(),
      metadata:s.metadata(),
      // 썸네일을 일단 만들고...
    })
    // more additional fields (computed fields)
    .transform(async (data, { meta }) => {
      if (!meta.mdast) return data;
      const thumbnail = await makeThumbnail(meta, data.title, data.headingTree, data.slug);
      console.log(thumbnail);
      return ({ ...data, permalink: `/posts/${data.slug}`, thumbnail });
    })

});

export default defineConfig({
  root:'content',
  output:{
    data:'.velite',
    assets:'public/static',
    base:'/static/',
    clean:true
  },
  collections: { posts },
});