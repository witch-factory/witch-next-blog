import { Redis } from '@upstash/redis';

import { totalViewSlug } from '../layout';
import Profile from '@/components/organisms/profile';
import RecentPosts from '@/components/organisms/recentPosts';
import ViewCounter from '@/components/viewCounter';
import { getRecentPosts } from '@/utils/post';

const redis = Redis.fromEnv();

// cache revalidate time
export const revalidate = 60;

async function Home() {
  const recentPosts = getRecentPosts();

  const totalViews = await redis.get<number>(['pageviews', 'projects', totalViewSlug].join(':')) ?? 0;

  return (
    <>
      <Profile />
      <ViewCounter view={totalViews} />
      {/*<ProjectList>
        {blogProjectList.map((project)=>
          <li key={project.title}>
            <ProjectCard key={project.title} project={project} />
          </li>
        )}
        </ProjectList>*/}
      <RecentPosts title='최근에 작성한 글' url='/posts/all' items={recentPosts} />
    </>
  );
}

export default Home;