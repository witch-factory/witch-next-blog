import { Post, posts, postMetadata } from '#site/content';

export type PostType=Post & {url: string};

export const getSortedPosts = (): PostType[] => {
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }) as PostType[];
};

export const getSortedPostMetadatas = (): PostType[] => {
  return postMetadata.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }) as PostType[];
};

export const allPostNumber = postMetadata.length;

export const tagPostNumber = (tag: string) => {
  return posts.filter((post)=>post.tags.includes(tag)).length;
};

interface TagPage{
  tag: string;
  currentPage: number;
  postsPerPage: number;
}

interface Page{
  currentPage: number;
  postsPerPage: number;
}

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

function propsProperty(post: PostType) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

export const getRecentPosts = () => {
  return getSortedPostMetadatas().slice(0, 9).map((post) => propsProperty(post));
};

export const getSearchPosts = () => {
  return getSortedPostMetadatas().map((post) => propsProperty(post));
};

/* 페이지당 몇 개의 글이 보이는가 */
export const ITEMS_PER_PAGE = 10;
/* 첫 번째 페이지 */
export const FIRST_PAGE = 1;