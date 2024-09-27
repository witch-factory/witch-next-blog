import { Post, posts, postMetadata, PostMetadata } from '#site/content';

export const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

export const getSortedPosts = () => {
  return posts.sort((a: Post, b: Post) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const getSortedPostMetadatas = () => {
  return postMetadata.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const allPostNumber = postMetadata.length;

export const tagPostNumber = (tag: string) => {
  return posts.filter((post)=>post.tags.includes(tag)).length;
};

type Page = {
  currentPage: number;
  postsPerPage: number;
};

type TagPage = Page & { tag: string };

export const getPostsByPage = (page: Page) => {
  const { currentPage, postsPerPage } = page;
  const pagenatedPosts = getSortedPosts().slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  return { pagePosts:pagenatedPosts, totalPostNumber: posts.length };
};

export const getPostsByPageAndTag = (tagPage: TagPage) => {
  const { tag, currentPage, postsPerPage } = tagPage;
  const tagPosts = getSortedPosts().filter((post)=>post.tags.includes(tag));
  const pagenatedPosts = tagPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  return { pagePosts:pagenatedPosts, totalPostNumber: tagPosts.length };
};

function propsProperty(post: PostMetadata) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

export const getRecentPosts = () => {
  return getSortedPostMetadatas().slice(0, 9).map((post) => propsProperty(post));
};

export const getSearchPosts = () => {
  return getSortedPostMetadatas().map((post) => propsProperty(post));
};

export const getAllPostTags = () => {
  const allTags = new Set<string>(getSortedPosts().map((post)=>post.tags).flat());
  return Array.from(allTags);
};

// 페이지당 몇 개의 글이 보이는가
export const ITEMS_PER_PAGE = 10;
// 첫 번째 페이지 
export const FIRST_PAGE = 1;