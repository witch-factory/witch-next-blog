import Link from 'next/link';

import IntroImage from '@/components/atoms/introImage';
import Tag from '@/components/atoms/tag';
import TagList from '@/components/templates/tagList';
import { projectType } from 'blog-project';

import styles from './styles.module.css';


function ProjectCard({ project }: {project: projectType}) {
  return (
    <Link className={styles.wrapper} href={project.url} target='_blank'>
      <article className={styles.container} >
        <div className={styles.titlebox}>
          <h3 className='title-sm font-semibold'>{project.title}</h3>
        </div>
        <div className={styles.imagebox}>
          <IntroImage
            imageSrc={project.image}
            imageAlt={project.title + ' 프로젝트 사진'}
            width={300}
            height={300}
            sizes='(max-width: 768px) 150px, 300px'
            placeholder={project.image.blurURL ? 'blur' : 'empty'}
            blurDataURL={project.image.blurURL} />
        </div>
        <div className={styles.introbox}>
          <p className='description my-0'>{project.description}</p>
          <TagList>
            {project.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </TagList>
        </div>
      </article>
    </Link>
  );
}

export default ProjectCard;