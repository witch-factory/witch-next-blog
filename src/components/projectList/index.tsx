import { projectType } from 'blog-project';
import projectList from 'blog-project';

import Project from './project';
import styles from './styles.module.css';

function ProjectList() {
  return (
    <article>
      <h2 className={styles.title}>프로젝트</h2>
      <ul className={styles.list}>
        {projectList.map((project: projectType) => {
          return (
            <li key={project.title}>
              <Project project={project} />
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default ProjectList;