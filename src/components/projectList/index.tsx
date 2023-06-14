import { useState } from 'react';

import Title from '../title';
import ProjectCard from '@/components/projectCard';
import { projectType } from 'blog-project';
import projectList from 'blog-project';

import styles from './styles.module.css';

function ProjectList() {
  const [open, setOpen] = useState(false);

  const toggle = ()=>{
    setOpen(prev=>!prev);
  };

  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <Title title='프로젝트' />
        <button className={styles.toggle} onClick={toggle}>{open?'접기':'펼쳐보기'}</button>
      </div>
      <ul className={`${styles.list} ${open?styles['list--open']:styles['list--close']}`}>
        {projectList.map((project: projectType) => {
          return (
            <li key={project.title}>
              <ProjectCard project={project} />
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default ProjectList;