import { PostIntroType } from '@/types/components';

export function filterPostsByKeyword(posts: PostIntroType[], keyword: string) {
  if (keyword === '') return posts;
  return posts.filter((post) => {
    const titleMatched = post.title
      .toLocaleLowerCase()
      .includes(keyword.toLocaleLowerCase());
    const descriptionMatched = post.description
      .toLocaleLowerCase()
      .includes(keyword.toLocaleLowerCase());
    return titleMatched || descriptionMatched;
  });
}
