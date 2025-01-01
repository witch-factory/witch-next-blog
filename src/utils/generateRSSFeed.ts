import { writeFileSync } from 'fs';

import { Feed } from 'feed';

import { blogConfig } from '@/config/blogConfig';
import { locales } from '@/types/i18n';

import { getSortedPosts } from './post';

// TODO: Add feed for each language
export function generateRssFeed() {
  const blogUrl = blogConfig.ko.url;

  const feed = new Feed({
    id: blogUrl,
    title: blogConfig.ko.title,
    description: blogConfig.ko.description,
    link: blogConfig.ko.url,
    feedLinks: {
      rss2: `${blogUrl}/feed.xml`,
      json: `${blogUrl}/feed.json`,
      atom: `${blogUrl}/atom.xml`,
    },
    updated: new Date(),
    copyright: '',
  });

  for (const lang of locales) {
    getSortedPosts(lang).map((post) => {
      feed.addItem({
        title: post.title,
        description: post.description,
        link: `${blogConfig[lang].url}${post.url}`,
        date: new Date(post.date),
      });
    });
  }

  writeFileSync('./public/feed.xml', feed.rss2(), { encoding: 'utf-8' });
  writeFileSync('./public/atom.xml', feed.atom1(), { encoding: 'utf-8' });
  writeFileSync('./public/feed.json', feed.json1(), { encoding: 'utf-8' });
}
