import { DocumentTypes } from 'contentlayer/generated';

import { getSortedPosts } from './post';

export const getAllPostTags = (): string[] => {
  const allTags=new Set<string>();
  getSortedPosts().forEach((post: DocumentTypes)=>{
    post.tags.forEach((tag: string)=>{
      allTags.add(tag);
    });
  });
  return Array.from(allTags);
};

export const makeTagURL=(tag: string): string=>{
  if (tag==='All') {
    return '/posts/tag';
  }
  else {
    return `/posts/tag/${tag}`;
  }
};