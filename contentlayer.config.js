import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import highlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import changeImageSrc from './src/plugins/change-image-src.mjs';
import headingTree from './src/plugins/heading-tree.mjs';
import makeThumbnail from './src/plugins/make-thumbnail.mjs';

const postFields = {
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
  theme: {
    light: 'github-light',
    pink: 'light-plus',
    dark: 'github-dark',
    darkPink:'github-dark',
  },
};

export default makeSource({
  contentDirPath: 'posts',
  documentTypes: [MDXPost, Post],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath, changeImageSrc, headingTree, makeThumbnail],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], rehypeKatex, highlight],
  },
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath, changeImageSrc, headingTree, makeThumbnail],
    rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions], rehypeKatex, highlight],
  },
});