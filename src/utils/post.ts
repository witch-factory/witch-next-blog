import { allDocuments } from 'contentlayer/generated';

export const getSortedPosts = () => {
  return allDocuments.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};
