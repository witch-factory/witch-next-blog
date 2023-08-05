import { allDocuments, DocumentTypes } from 'contentlayer/generated';

export const getSortedPosts = () => {
  return allDocuments.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

interface PageInfo{
  tag: string;
  currentPage: number;
  postsPerPage: number;
}

export const getAllPostTags = (): string[] => {
  const allTags=new Set<string>();
  getSortedPosts().forEach((post: DocumentTypes)=>{
    post.tags.forEach((tag: string)=>{
      allTags.add(tag);
    });
  });
  return Array.from(allTags);
};

export const getPostsByTag = (info: PageInfo) => {
  const { tag, currentPage, postsPerPage } = info;
  const tagPosts=getSortedPosts().filter((post: DocumentTypes)=>post.tags.includes(tag));
  const pagenatedPosts= tagPosts.slice(
    (currentPage-1)*postsPerPage,
    currentPage*postsPerPage
  );
  return {pagePosts:pagenatedPosts, totalPostNumber: tagPosts.length};
};