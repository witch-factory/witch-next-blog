import { Redis } from '@upstash/redis';


import Profile from '@/components/organisms/profile';
import RecentPosts from '@/components/organisms/recentPosts';
import ViewReporter from '@/components/viewReporter';
import { getRecentPosts } from '@/utils/post';

const redis = Redis.fromEnv();

// cache revaildate time
export const revalidate = 60;

const homeSlug = 'witch-blog-homepage';

async function Home() {
  const recentPosts = getRecentPosts();

  const views = await redis.get<number>(['pageviews', 'projects', homeSlug].join(':')) ?? 0;

  return (
    <>
      <Profile />
      <h1>{views ?? ''}</h1>
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