import Description from '@/components/atoms/description';
import Tag from '@/components/atoms/tag';
import { projectType } from 'blog-project';

import styles from './styles.module.css';

function ProjectIntro({ project }: {project: projectType}) {
  return (
    <div className={styles.intro}>
      <Description>{project.description}</Description>
      <ul className={styles.list}>
        {project.tags.map((tag) =>
          <Tag key={tag} size='md'>{tag}</Tag>
        )}
      </ul>
    </div>
  );
}

export default ProjectIntro;