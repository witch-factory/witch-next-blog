import Link from 'next/link';

import PostList from '@/components/templates/postList';
import ProjectList from '@/components/templates/projectList';
import { blogProjectList } from '@/config/blogProject';
import Profile from '@/ui/profile';
import ProjectCard from '@/ui/projectCard';
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
      <ProjectList>
        {blogProjectList.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </ProjectList>
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