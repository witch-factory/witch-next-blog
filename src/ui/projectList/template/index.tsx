'use client';

import { useState } from 'react';

import styles from './styles.module.css';

function ProjectListTemplate({ children }: {children: React.ReactNode}) {
  const [open, setOpen] = useState(false);

  const toggle = ()=>{
    setOpen(prev=>!prev);
  };

  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>프로젝트</h2>
        <button 
          className={styles.toggle} 
          onClick={toggle}
          aria-expanded={open}
        >
          {open ? '접기' : '펼쳐보기'}
        </button>
      </div>
      <ul className={`${styles.list} ${open ? styles.listOpen : styles.listClose}`}>
        {children}
      </ul>
    </article>
  );
}

export default ProjectListTemplate;