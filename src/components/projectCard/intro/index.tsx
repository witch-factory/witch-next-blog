import { projectType } from 'blog-project';

import styles from './styles.module.css';

function ProjectIntro({ project }: {project: projectType}) {
  return (
    <div className={styles.intro}>
      <p className={styles.description}>{project.description}</p>
      <ul className={styles.list}>
        {project.tags.map((tag) =>
          <li key={tag} className={styles.tech}>{tag}</li>
        )}
      </ul>
    </div>
  );
}

export default ProjectIntro;