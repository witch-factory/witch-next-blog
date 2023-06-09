import { useEffect } from 'react';
import useSWR from 'swr';

import styles from './styles.module.css';

const fetcher = async (input: RequestInfo) => {
  const res: Response = await fetch(input);
  return await res.json();
};

function ViewCounter({slug}: {slug: string}) {
  const {data}=useSWR(`/api/view/${slug}`, fetcher);
  
  useEffect(() => {
    fetch(`/api/view/${slug}`, {
      method: 'POST',
    });
  }, [slug]);

  return (
    <div className={styles.counter}>
      {`조회수 ${data?.view_count??'---'}회`}
    </div>
  );
}

export default ViewCounter;