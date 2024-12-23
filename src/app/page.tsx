import Link from 'next/link';

import AllPostTagList from '@/components/allPostTagList';
import PostList from '@/ui/postList';
import Profile from '@/ui/profile';
import { getRecentPosts, getRecentTranslations } from '@/utils/post';

import * as styles from './styles.css';

// cache revalidate in 1 day
export const revalidate = 24 * 60 * 60;

async function Home() {
  const recentPosts = getRecentPosts();
  const recentTranslations = getRecentTranslations();

  // const totalViews = await redis.get<number>(['pageviews', 'projects', totalViewSlug].join(':')) ?? 0;

  return (
    <>
      <Profile />
      <section className={styles.container}>
        <div>
          <h2 className={styles.title}>최근에 작성한 글</h2>
          <AllPostTagList selectedTag='all' />
          <PostList postList={recentPosts} direction='row' />
        </div>

        <div>
          <Link href='/translations/all'>
            <h2 className={styles.title}>최근 번역</h2>
          </Link>
          
          <hr className={styles.separator} />
          <PostList postList={recentTranslations} direction='row' />
        </div>

      </section>
    </>
  );
}

export default Home;