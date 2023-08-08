import { DocumentTypes } from 'contentlayer/generated';

import { getSortedPosts } from './post';

export const getAllPostTags = (): string[] => {
  const allTags=new Set<string>(getSortedPosts().map((post: DocumentTypes)=>post.tags).flat());
  return Array.from(allTags);
};
