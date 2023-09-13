import Profile from '@/components/organisms/profile';
import ProjectCard from '@/components/organisms/projectCard';
import RecentPosts from '@/components/organisms/recentPosts';
import ProjectList from '@/components/templates/projectList';
import { PostType, getSortedPosts } from '@/utils/post';
import blogProjectList from 'blog-project';

function propsProperty(post: PostType) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

function Home() {
  const recentPosts = getSortedPosts().slice(0, 9).map((post: PostType)=>{
    return propsProperty(post);
  });

  return (
    <>
      <Profile />
      <ProjectList>
        {blogProjectList.map((project)=>
          <ProjectCard key={project.title} project={project} />
        )}
      </ProjectList>
      <RecentPosts title='최근에 작성한 글' url='/posts/all' items={recentPosts} />
    </>
  );
}

export default Home;