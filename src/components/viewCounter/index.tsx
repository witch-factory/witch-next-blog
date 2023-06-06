import { useEffect } from 'react';
import useSWR from 'swr';

function ViewCounter({slug}: {slug: string}) {
  const {data:view_count}=useSWR(`/api/view?slug=${slug}`);

  useEffect(() => {
    fetch(`/api/view?slug=${slug}`, {
      method: 'POST',
    });
  }, [slug]);

  return <div>{`조회수 ${view_count}회`}</div>;
}

export default ViewCounter;