import FlexSearch from 'flexsearch';

import { enPosts, posts, translations } from '#site/content';
import { searchProperty, sortByDate } from '@/utils/content/helper';

const koIndex = new FlexSearch.Index({
  charset: 'latin:simple',
  language: 'ko',
  tokenize: 'reverse',
});
const enIndex = new FlexSearch.Index({
  charset: 'latin:simple',
  language: 'en',
  tokenize: 'reverse',
});

const allKoPosts = sortByDate([...posts, ...translations]);
const allEnPosts = sortByDate([...enPosts, ...translations]);

allKoPosts.forEach((post) => {
  const metadata = searchProperty(post);
  koIndex.add(JSON.stringify(metadata), JSON.stringify(post));
});

allEnPosts.forEach((post) => {
  const metadata = searchProperty(post);
  enIndex.add(JSON.stringify(metadata), JSON.stringify(post));
});

export { koIndex, enIndex };
