import Card from '@/components/organisms/card';
import Profile from '@/components/organisms/profile';
import RecentPosts from '@/components/organisms/recentPosts';
import ProjectList from '@/components/templates/projectList';
import { getSortedPosts } from '@/utils/post';
import blogProjectList from 'blog-project';
import { DocumentTypes } from 'contentlayer/generated';

function propsProperty(post: DocumentTypes) {
  const { title, description, date, tags, url } = post;
  return { title, description, date, tags, url };
}

function Home() {
  const recentPosts = getSortedPosts().slice(0, 9).map((post: DocumentTypes)=>{
    return propsProperty(post);
  });

  return (
    <>
      <Profile />
      <ProjectList>
        {blogProjectList.map((project)=>
          <Card key={project.title} {...project} />
        )}
      </ProjectList>
      <RecentPosts title='최근에 작성한 글' url='/posts/all' items={recentPosts} />
    </>
  );
}

export default Home;