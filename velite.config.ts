import { defineConfig, defineCollection, s } from 'velite';

// `s` is extended from Zod with some custom schemas,
// you can also import re-exported `z` from `velite` if you don't need these extension schemas.


const posts = defineCollection({
  name: 'Post', // collection type name
  pattern: 'posts/**/*.md', // content files glob pattern
  schema: s
    .object({
      slug: s.path(), // auto generate slug from file path
      title: s.string().max(99), // Zod primitive type
      // slug: s.path(), // auto generate slug from file path
      date: s.string().datetime(), // date type
      description: s.string().max(200), // string type
      tags: s.array(s.string()), // array of string
      body:s.markdown() // transform markdown to html
    })
    // more additional fields (computed fields)
    .transform(data => ({ ...data, permalink: `/blog/${data.slug}` }))

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