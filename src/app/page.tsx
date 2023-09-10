import Card from '@/components/organisms/card';
import Profile from '@/components/organisms/profile';
import ProjectList from '@/components/templates/projectList';
import blogProjectList from 'blog-project';

function Home() {
  return (
    <>
      <Profile />
      <ProjectList>
        {blogProjectList.map((project)=>
          <Card key={project.title} {...project} />
        )}
      </ProjectList>
    </>
  );
}

export default Home;