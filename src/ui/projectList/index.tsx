import { BlogProjectType } from '@/types/config';

import ProjectCard from './projectCard';
import ProjectListTemplate from './template';

function ProjectList({ projectList }: { projectList: BlogProjectType[] }) {
  return (
    <ProjectListTemplate>
      {projectList.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
    </ProjectListTemplate>
  );
}

export default ProjectList;
