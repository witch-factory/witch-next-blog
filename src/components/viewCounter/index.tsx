import { useEffect } from 'react';
import useSWR from 'swr';

import styles from './styles.module.css';

function ViewCounter({slug}: {slug: string}) {
  const {data}=useSWR(`/api/view?slug=${slug}`);
  
  useEffect(() => {
    console.log(data);
    fetch(`/api/view?slug=${slug}`, {
      method: 'POST',
    });
  }, [slug]);

  return (
    <div className={styles.counter}>
      {`조회수 ${data.data.view_count}회`}
    </div>
  );
}

export default ViewCounter;