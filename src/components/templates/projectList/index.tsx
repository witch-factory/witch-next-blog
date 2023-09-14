'use client';

import { useState } from 'react';

import Title from '@/components/atoms/title';

import styles from './styles.module.css';

function ProjectList({ children }: React.PropsWithChildren<Record<never, never>>) {
  const [open, setOpen] = useState(false);

  const toggle = ()=>{
    setOpen(prev=>!prev);
  };

  return (
    <article className={styles.container}>
      <div className={styles.header}>
        <Title heading='h2' className='title-md'>프로젝트</Title>
        <button className={styles.toggle} onClick={toggle}>{open ? '접기' : '펼쳐보기'}</button>
      </div>
      <ul className={`${styles.list} ${open ? styles['list--open'] : styles['list--close']}`}>
        {children}
      </ul>
    </article>
  );
}

export default ProjectList;