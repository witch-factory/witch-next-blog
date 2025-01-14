import FlexSearch from 'flexsearch';

import { enPosts, posts } from '#site/content';

const koIndex = new FlexSearch.Index('performance');
const enIndex = new FlexSearch.Index('performance');

posts.forEach((post) => {
  koIndex.add(post.title, JSON.stringify(post));
});

enPosts.forEach((post) => {
  enIndex.add(post.title, JSON.stringify(post));
});

export { koIndex, enIndex };
