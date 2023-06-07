import { useEffect } from 'react';
import useSWR from 'swr';

function ViewCounter({slug}: {slug: string}) {
  const {data}=useSWR(`/api/view?slug=${slug}`);
  
  useEffect(() => {
    fetch(`/api/view?slug=${slug}`, {
      method: 'POST',
    });
  }, [slug]);

  return <div>{`조회수 ${data.data.view_count}회`}</div>;
}

export default ViewCounter;