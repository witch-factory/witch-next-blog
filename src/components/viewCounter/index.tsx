'use client';

import { useEffect } from 'react';

import styles from './styles.module.css';

function ViewCounter({ slug }: {slug: string}) {
  
  useEffect(() => {
    fetch('/viewcount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    });
  }, [slug]);

  return (
    <div className={styles.counter}>
      {'조회수 회'}
    </div>
  );
}

export default ViewCounter;