import { MutableRefObject, useEffect } from 'react';

import { useIntersectionObserver } from '@/utils/useIntersectionObserver';

function useInfiniteScroll (
  ref: MutableRefObject<Element | null>,
  callback: () => void
) {
  /* 뷰포트와 ref의 intersection observe */
  const shouldLoadMore = useIntersectionObserver(ref, { threshold: 0.0 });

  useEffect(() => {
    if (shouldLoadMore) {
      callback();
    }
  }, [shouldLoadMore, callback]);
};

export { useInfiniteScroll };