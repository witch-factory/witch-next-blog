import Link from 'next/link';

import PostList from '@/ui/postList';
import Profile from '@/ui/profile';
import { getRecentPosts } from '@/utils/post';

import styles from './styles.module.css';


// cache revalidate in 1 day
export const revalidate = 24 * 60 * 60;

async function Home() {
  const recentPosts = getRecentPosts();

  // const totalViews = await redis.get<number>(['pageviews', 'projects', totalViewSlug].join(':')) ?? 0;

  return (
    <>
      <Profile />
      {/* <ProjectList projectList={blogProjectList} /> */}
      {/* <ViewCounter view={totalViews} /> */}

      <section className={styles.container}>
        <Link href='/posts/all' className={styles.title}>
          <h2 className='title-md my-2'>최근에 작성한 글</h2>
        </Link>
        <PostList postList={recentPosts} direction='row' />
      </section>
    </>
  );
}

export default Home;