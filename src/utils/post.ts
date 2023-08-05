import { allDocuments, DocumentTypes } from 'contentlayer/generated';

export const getSortedPosts = () => {
  return allDocuments.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

interface PageInfo{
  category: string;
  currentPage: number;
  postsPerPage: number;
}

export const getCategoryPosts = (info: PageInfo) => {
  const { category, currentPage, postsPerPage } = info;
  const allDocumentsInCategory = getSortedPosts().filter((post: DocumentTypes)=>
    post._raw.flattenedPath.startsWith(category));

  const pagenatedPosts= allDocumentsInCategory.slice(
    (currentPage-1)*postsPerPage, 
    currentPage*postsPerPage
  );

  return {pagePosts:pagenatedPosts, totalPostNumber: allDocumentsInCategory.length};
};

export const getAllPostTags = (): string[] => {
  const allTags=new Set<string>();
  getSortedPosts().forEach((post: DocumentTypes)=>{
    post.tags.forEach((tag: string)=>{
      allTags.add(tag);
    });
  });
  return Array.from(allTags);
};

export const getPostsByTag = (tag: string) => {
  return getSortedPosts().filter((post: DocumentTypes)=>post.tags.includes(tag));
};