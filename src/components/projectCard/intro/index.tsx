import { projectType } from 'blog-project';

import styles from './styles.module.css';

function ProjectIntro({project}: {project: projectType}) {
  return (
    <div className={styles.intro}>
      <p className={styles.description}>{project.description}</p>
      <ul className={styles.list}>
        {project.techStack.map((tech) =>
          <li key={tech} className={styles.tech}>{tech}</li>
        )}
      </ul>
    </div>
  );
}

export default ProjectIntro;