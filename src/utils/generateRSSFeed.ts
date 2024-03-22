import { writeFileSync } from 'fs';

import { Feed } from 'feed';

import { blogConfig } from '@/config/blogConfig';

import { getSortedPosts } from './post';

export default function generateRssFeed() {
  const blogUrl = blogConfig.url;

  const feed = new Feed({
    id: blogUrl,
    title: blogConfig.title,
    description: blogConfig.description,
    link: blogConfig.url,
    feedLinks: {
      rss2: `${blogUrl}/feed.xml`,
      json: `${blogUrl}/feed.json`,
      atom: `${blogUrl}/atom.xml`,
    },
    updated: new Date(),
    copyright: '',
  });

  getSortedPosts().map((post) => {
    feed.addItem({
      title: post.title,
      description: post.description,
      link: `${blogUrl}${post.url}`,
      date: new Date(post.date),
    });
  });
  
  writeFileSync('./public/feed.xml', feed.rss2(), { encoding: 'utf-8' });
  writeFileSync('./public/atom.xml', feed.atom1(), { encoding: 'utf-8' });
  writeFileSync('./public/feed.json', feed.json1(), { encoding: 'utf-8' });
}
