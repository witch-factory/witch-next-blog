import Image from 'next/image';
import Link from 'next/link';

import TagList from '@/components/tagList';
import { blogConfig } from '@/config/blogConfig';
import { BlogProjectType } from '@/types/config';

import styles from './styles.module.css';

function ProjectCard({ project }: {project: BlogProjectType}) {
  return (
    <Link className={styles.wrapper} href={project.url} target='_blank'>
      <article className={styles.container} >
        <div className={styles.titlebox}>
          <h3 className='title-sm font-semibold'>{project.title}</h3>
        </div>
        <div className={styles.imagebox}>
          <div className={styles.imageContainer}>
            <Image 
              src={project.image[blogConfig.imageStorage]} 
              alt={project.title + ' 프로젝트 사진'} 
              width={300}
              height={300}
              sizes='(max-width: 768px) 150px, 300px'
              style={{ transform: 'translate3d(0, 0, 0)' }}
              placeholder={project.image.blurURL ? 'blur' : 'empty'}
              blurDataURL={project.image.blurURL}
              className={styles.image}
            />
          </div>
        </div>
        <div className={styles.introbox}>
          <p className='description my-0'>{project.description}</p>
          <TagList tags={project.tags} />
        </div>
      </article>
    </Link>
  );
}

export default ProjectCard;