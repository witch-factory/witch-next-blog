import Image from 'next/image';

import { projectType } from 'blog-project';

import ProjectIntro from './intro';
import styles from './styles.module.css';

function Project({project}: {project: projectType}) {
  return (
    <article className={styles.container}>
      <Image 
        className={styles.image}
        src={project.image} 
        alt={project.title}
        width={80}
        height={80}
      />
      <ProjectIntro project={project} />
    </article>
  );
}

export default Project;