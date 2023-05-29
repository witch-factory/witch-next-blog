import { projectType } from 'blog-project';
import projectList from 'blog-project';

import Item from './item';
import styles from './styles.module.css';

function ProjectList() {
  return (
    <article>
      <h2>프로젝트</h2>
      <ul className={styles.list}>
        {projectList.map((project: projectType, index: number) => {
          return (
            <li key={index}>
              <Item project={project} />
            </li>
          );
        })
        }
      </ul>
    </article>
  );
}

export default ProjectList;