import Link from 'next/link';

import Title from '@/components/atoms/title';
import { projectType } from 'blog-project';

import ProjectImage from './image';
import ProjectIntro from './intro';
import styles from './styles.module.css';

function ProjectCard({ project }: {project: projectType}) {
  return (
    <Link className={styles.wrapper} href={project.url} target='_blank'>
      <article className={styles.container} >
        <div className={styles.titlebox}>
          <Title heading='h3' className='title-sm font-semibold'>{project.title}</Title>
        </div>
        <div className={styles.imagebox}>
          <ProjectImage image={project.image} />
        </div>
        <div className={styles.introbox}>
          <ProjectIntro project={project} />
        </div>
      </article>
    </Link>
  );
}

export default ProjectCard;