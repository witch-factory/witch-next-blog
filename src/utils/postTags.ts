import { PostType, getSortedPosts } from './post';

export const getAllPostTags = (): string[] => {
  const allTags = new Set<string>(getSortedPosts().map((post: PostType)=>post.tags).flat());
  return Array.from(allTags);
};
