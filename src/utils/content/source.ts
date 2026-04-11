import { createTagSlug } from '@/utils/core/string';
import {
  allEnPosts,
  allPosts,
  allTranslations,
  type EnPost as CCEnPost,
  type Post as CCPost,
  type Translation as CCTranslation,
} from 'content-collections';

export type Post = CCPost;
export type EnPost = CCEnPost;
export type Translation = CCTranslation;

export type PostMetadata = Pick<Post, 'title' | 'date' | 'description' | 'slug' | 'url' | 'thumbnail' | 'tags'>;
export type EnPostMetadata = Pick<EnPost, 'title' | 'date' | 'description' | 'slug' | 'url' | 'thumbnail' | 'tags'>;
export type TranslationMetadata = Pick<Translation, 'title' | 'date' | 'description' | 'slug' | 'url' | 'thumbnail'>;

export type Tag = {
  name: string,
  slug: string,
  count: number,
  url: string,
};

export const posts: Post[] = allPosts;
export const enPosts: EnPost[] = allEnPosts;
export const translations: Translation[] = allTranslations;

export const postMetadata: PostMetadata[] = posts.map((post) => ({
  title: post.title,
  date: post.date,
  description: post.description,
  slug: post.slug,
  url: post.url,
  thumbnail: post.thumbnail,
  tags: post.tags,
}));

export const enPostMetadata: EnPostMetadata[] = enPosts.map((post) => ({
  title: post.title,
  date: post.date,
  description: post.description,
  slug: post.slug,
  url: post.url,
  thumbnail: post.thumbnail,
  tags: post.tags,
}));

export const translationsMetadata: TranslationMetadata[] = translations.map((post) => ({
  title: post.title,
  date: post.date,
  description: post.description,
  slug: post.slug,
  url: post.url,
  thumbnail: post.thumbnail,
}));

function generateTags(
  metadata: PostMetadata[] | EnPostMetadata[],
  locale: 'ko' | 'en',
): Tag[] {
  const allTags = new Set<string>(metadata.flatMap((post) => post.tags));
  const baseUrl = `/${locale}/posts/tag`;

  return [
    {
      name: 'All',
      slug: 'all',
      count: metadata.length,
      url: `${baseUrl}/all`,
    },
    ...Array.from(allTags).map((tag) => {
      const slug = createTagSlug(tag);

      return {
        name: tag,
        slug,
        count: metadata.filter((post) => post.tags.includes(tag)).length,
        url: `${baseUrl}/${slug}`,
      };
    }),
  ];
}

export const postTags: Tag[] = generateTags(postMetadata, 'ko');
export const enPostTags: Tag[] = generateTags(enPostMetadata, 'en');

export const stats = {
  posts: postMetadata.length,
  enPosts: enPostMetadata.length,
  translations: translationsMetadata.length,
};
