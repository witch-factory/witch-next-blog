import { RefObject, useState, useEffect, useRef } from 'react';

function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  options: IntersectionObserverInit = {},
) {
  const [element, setElement] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setElement(elementRef.current);
  }, [elementRef]);

  useEffect(() => {
    if (!element) {
      return;
    }
    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { ...options },
    );
    observer.current.observe(element);

    return () => {
      observer.current?.disconnect();
    };
  }, [element, options]);

  return isIntersecting;
}

export { useIntersectionObserver };
