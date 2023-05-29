import Link from 'next/link';

import { projectType } from 'blog-project';

import styles from './styles.module.css';

function ProjectIntro({project}: {project: projectType}) {
  return (
    <div className={styles.intro}>
      <div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
      </div>
      <div>
        <ul className={styles.list}>
          {project.url.map((url,) =>
            <li key={url.link}>
              <Link 
                className={styles.link} 
                href={url.link} 
                target='_blank'
              >
                {`${url.title} Link`}
              </Link>
            </li>
          )}
        </ul>
        <ul className={styles.list}>
          {project.techStack.map((tech) =>
            <li key={tech} className={styles.tech}>{tech}</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ProjectIntro;