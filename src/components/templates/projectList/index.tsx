'use client';

import { useState } from 'react';

import styles from './styles.module.css';

function ProjectList({ children }: React.PropsWithChildren<Record<never, never>>) {
  const [open, setOpen] = useState(false);

  const toggle = ()=>{
    setOpen(prev=>!prev);
  };

  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <h2 className='title-md mb-2'>프로젝트</h2>
        <button className={styles.toggle} onClick={toggle}>{open ? '접기' : '펼쳐보기'}</button>
      </div>
      <ul className={`${styles.list} ${open ? styles['list--open'] : styles['list--close']}`}>
        {children}
      </ul>
    </article>
  );
}

export default ProjectList;