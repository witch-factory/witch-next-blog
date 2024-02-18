import Profile from '@/components/organisms/profile';
import RecentPosts from '@/components/organisms/recentPosts';
import { getRecentPosts } from '@/utils/post';

async function Home() {
  const recentPosts = getRecentPosts();

  return (
    <>
      <Profile />
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