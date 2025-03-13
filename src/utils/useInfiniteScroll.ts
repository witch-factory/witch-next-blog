import { MutableRefObject, useEffect, useRef } from 'react';

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
};

// https://ha-young.github.io/2021/frontend/infinite-scroll/
function useInfiniteScroll(
  ref: MutableRefObject<Element | null>,
  callback: () => void,
) {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, defaultOptions);
    observer.current.observe(ref.current);

    return () => {
      observer.current?.disconnect();
    };
  }, [callback, ref]);
}

export { useInfiniteScroll };
