import { useState } from 'react';

import { projectType } from 'blog-project';
import projectList from 'blog-project';

import Project from './project';
import styles from './styles.module.css';

function ProjectList() {
  const [open, setOpen] = useState(false);

  const toggle = ()=>{
    setOpen(prev=>!prev);
  };

  return (
    <article>
      <div className={styles.header}>
        <h2 className={styles.title}>프로젝트</h2>
        <button className={styles.toggle} onClick={toggle}>{open?'접기':'펼쳐보기'}</button>
      </div>
      <ul className={`${styles.list} ${open?styles['list--open']:styles['list--close']}`}>
        {projectList.map((project: projectType) => {
          return (
            <li key={project.title}>
              <Project project={project} />
            </li>
          );
        })}
      </ul>
    </article>
  );
}

export default ProjectList;