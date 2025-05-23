import { writeFileSync } from 'fs';

import { Feed } from 'feed';

import { blogLocalConfig } from '@/config/blogConfig';
import { i18n } from '@/constants/i18n';
import { getSortedPosts } from '@/utils/content/post';

// TODO: Add feed for each language
export function generateRssFeed() {
  const blogUrl = blogLocalConfig.ko.url;

  const feed = new Feed({
    id: blogUrl,
    title: blogLocalConfig.ko.title,
    description: blogLocalConfig.ko.description,
    link: blogLocalConfig.ko.url,
    feedLinks: {
      rss2: `${blogUrl}/feed.xml`,
      json: `${blogUrl}/feed.json`,
      atom: `${blogUrl}/atom.xml`,
    },
    updated: new Date(),
    copyright: '',
  });

  for (const lang of i18n.locales) {
    getSortedPosts(lang).map((post) => {
      feed.addItem({
        title: post.title,
        description: post.description,
        link: `${blogLocalConfig[lang].url}${post.url}`,
        date: new Date(post.date),
      });
    });
  }

  writeFileSync('./public/feed.xml', feed.rss2(), { encoding: 'utf-8' });
  writeFileSync('./public/atom.xml', feed.atom1(), { encoding: 'utf-8' });
  writeFileSync('./public/feed.json', feed.json1(), { encoding: 'utf-8' });
}
