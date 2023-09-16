import Profile from '@/components/organisms/profile';
import ProjectCard from '@/components/organisms/projectCard';
import RecentPosts from '@/components/organisms/recentPosts';
import ProjectList from '@/components/templates/projectList';
import { getRecentPosts } from '@/utils/post';
import blogProjectList from 'blog-project';

function Home() {
  const recentPosts = getRecentPosts();

  return (
    <>
      <Profile />
      <ProjectList>
        {blogProjectList.map((project)=>
          <li key={project.title}>
            <ProjectCard key={project.title} project={project} />
          </li>
        )}
      </ProjectList>
      <RecentPosts title='최근에 작성한 글' url='/posts/all' items={recentPosts} />
    </>
  );
}

export default Home;