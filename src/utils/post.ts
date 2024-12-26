import {
  Post,
  posts,
  postMetadata,
  PostMetadata,
  postTags,
  translations,
  translationsMetadata,
  TranslationMetadata,
} from '#site/content';

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

export const getSortedTranslations = () => {
  return translations.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const getSortedTranslationsMetadatas = () => {
  return translationsMetadata.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const allPostNumber = postMetadata.length;
export const allTranslationNumber = translationsMetadata.length;

// 태그의 slug를 받아서 해당 태그의 글 수를 반환
export const tagPostNumber = (tagSlug: string) => {
  return postTags.filter((tagElem) => tagElem.slug === tagSlug)[0].count;
};

type Page = {
  currentPage: number;
  postsPerPage: number;
  tag?: string;
};

export const getPostsByPage = (page: Page) => {
  const { currentPage, postsPerPage, tag } = page;
  if (tag) {
    const tagPosts = getSortedPostMetadatas().filter((post) =>
      post.tags.some((postTag) => slugify(postTag) === tag)
    );
    const pagenatedPosts = tagPosts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage
    );
    return { pagePosts: pagenatedPosts, totalPostNumber: tagPosts.length };
  }

  const pagenatedPosts = getSortedPostMetadatas().slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  return { pagePosts: pagenatedPosts, totalPostNumber: posts.length };
};

export const getTranslationsByPage = (page: Omit<Page, 'tag'>) => {
  const { currentPage, postsPerPage } = page;
  const pagenatedPosts = getSortedTranslationsMetadatas().slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );
  return { pagePosts: pagenatedPosts, totalPostNumber: translations.length };
};

function propsProperty(post: PostMetadata) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

function propsPropertyTranslation(post: TranslationMetadata) {
  const { title, description, date, url } = post;
  return { title, description, date, url };
}

export const getRecentPosts = () => {
  return getSortedPostMetadatas()
    .slice(0, 6)
    .map((post) => propsProperty(post));
};

export const getRecentTranslations = () => {
  return getSortedTranslationsMetadatas()
    .slice(0, 3)
    .map((post) => propsPropertyTranslation(post));
};

export const getSearchPosts = () => {
  return getSortedPostMetadatas().map((post) => propsProperty(post));
};

export const getAllPostTags = () => {
  return postTags.filter((tag) => tag.name !== 'All');
};

// 페이지당 몇 개의 글이 보이는가
export const ITEMS_PER_PAGE = 10;
// 첫 번째 페이지
export const FIRST_PAGE = 1;
