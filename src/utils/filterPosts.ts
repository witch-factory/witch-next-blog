import { CardProps } from '@/components/card';

function filterPostsByKeyword(posts: CardProps[], keyword: string) {
  if (keyword==='') return posts;
  return posts.filter((post: CardProps) => {
    const titleMatched = post.title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase());
    const descriptionMatched = post.description.toLocaleLowerCase().includes(keyword.toLocaleLowerCase());
    /*const tagsMatched = post.tags.some((tag: string) => tag.toLowerCase().includes(keyword.toLowerCase()));*/
    return titleMatched || descriptionMatched;
  });
}

export default filterPostsByKeyword;