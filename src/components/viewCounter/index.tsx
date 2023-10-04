import { useEffect } from 'react';

import styles from './styles.module.css';

function ViewCounter({ slug }: {slug: string}) {
  
  useEffect(() => {
    fetch(`/api/view/${slug}`, {
      method: 'POST',
    });
  }, [slug]);

  return (
    <div className={styles.counter}>
      {'조회수 회'}
    </div>
  );
}

export default ViewCounter;