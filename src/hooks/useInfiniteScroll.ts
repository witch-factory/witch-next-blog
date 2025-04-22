import { RefObject, useCallback, useEffect, useRef } from 'react';

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};

function useInfiniteScroll(
  callback: () => void,
) {
  const observer = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const memoizedCallback = useCallback(() => {
    if (typeof callback === 'function') {
      callback();
    }
  }, [callback]);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        memoizedCallback();
      }
    }, defaultOptions);

    const currentTarget = targetRef.current;

    if (currentTarget) {
      observer.current.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.current?.unobserve(currentTarget);
      }

      observer.current?.disconnect();
    };
  }, [memoizedCallback]);

  return { ref: targetRef as RefObject<HTMLDivElement> };
}

export { useInfiniteScroll };
