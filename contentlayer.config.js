import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import highlight from 'rehype-highlight';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';

import changeImageSrc from './src/plugins/change-image-src.mjs';
import headingTree from './src/plugins/heading-tree.mjs';

const postFields={
  fields:{
    title:{
      type:'string',
      description:'The title of the post',
      required:true,
    },
    description: {
      type: 'string',
      description: 'The description of the post for preview and SEO',
      required: true,
    },
    date: {
      type: 'date',
      description: 'The date of the post',
      required: true,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'The tags of the post',
      required: true,
    },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
};

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.md',
  contentType:'markdown',
  ...postFields,
}));

export const MDXPost = defineDocumentType(() => ({
  name: 'MDXPost',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  ...postFields,
}));

const rehypePrettyCodeOptions = {
  theme: 'github-light',
};

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [MDXPost, Post],
  markdown: {
    remarkPlugins: [remarkGfm, changeImageSrc, headingTree],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  },
  mdx: {
    remarkPlugins: [remarkGfm, changeImageSrc, headingTree],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], highlight],
  },
});