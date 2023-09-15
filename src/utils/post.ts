import * as Local from 'contentlayer/source-files';

import { allDocuments, DocumentTypes } from 'contentlayer/generated';

type ImageSrc={
  local: string;
  cloudinary: string;
  blurURL?: string;
};

export type headingData={
  data: {
    hProperties: {
      title: string;
      id: string;
    }
  };
  depth: number;
  children: headingData[];
};

export type PostType=Omit<DocumentTypes, '_raw'> & { _raw: Local.RawDocumentData & {thumbnail?: ImageSrc, headingTree?: headingData[]} };

export const getSortedPosts = (): PostType[] => {
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
  const tagPosts = getSortedPosts().filter((post: PostType)=>post.tags.includes(tag));
  const pagenatedPosts = tagPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  return { pagePosts:pagenatedPosts, totalPostNumber: tagPosts.length };
};

export const getSearchPosts = () => {
  return getSortedPosts().map((post: PostType) => ({
    title: post.title,
    description: post.description,
    date: post.date,
    tags: post.tags,
    url: post.url,
  }));
};

/* 페이지당 몇 개의 글이 보이는가 */
export const ITEMS_PER_PAGE = 10;
/* 첫 번째 페이지 */
export const FIRST_PAGE = 1;