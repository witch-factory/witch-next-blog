import Link from 'next/link';

import PostList from '@/ui/postList';
import Profile from '@/ui/profile';
import { getRecentPosts } from '@/utils/post';

import * as styles from './styles.css';

// cache revalidate in 1 day
export const revalidate = 24 * 60 * 60;

async function Home() {
  const recentPosts = getRecentPosts();

  // const totalViews = await redis.get<number>(['pageviews', 'projects', totalViewSlug].join(':')) ?? 0;

  return (
    <>
      <Profile />
      <section className={styles.container}>
        <h2 className={styles.title}>최근에 작성한 글</h2>
        <PostList postList={recentPosts} direction='row' />
      </section>
    </>
  );
}

export default Home;