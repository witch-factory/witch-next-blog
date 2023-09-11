import { allDocuments, DocumentTypes } from 'contentlayer/generated';

export const getSortedPosts = () => {
  return allDocuments.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
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
  return { pagePosts:pagenatedPosts, totalPostNumber: allDocuments.length };
};

export const getPostsByPageAndTag = (tagPage: TagPage) => {
  const { tag, currentPage, postsPerPage } = tagPage;
  const tagPosts = getSortedPosts().filter((post: DocumentTypes)=>post.tags.includes(tag));
  const pagenatedPosts = tagPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  return { pagePosts:pagenatedPosts, totalPostNumber: tagPosts.length };
};

export const getSearchPosts = () => {
  return getSortedPosts().map((post: DocumentTypes) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
};