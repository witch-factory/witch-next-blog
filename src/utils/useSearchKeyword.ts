import queryString from 'query-string';
import { useEffect, useState } from 'react';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function useSearchKeyword(): [string, string, (s: string) => void] {
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 300);

  const onPopState = () => {
    const parsed = queryString.parse(location.search);
    setKeyword(parsed.keyword?.toString() || '');
  };
  
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    const {search}=parsed;
    if (search) {
      setKeyword(search.toString());
    }
    window.addEventListener('popstate', onPopState);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    const parsed = queryString.parse(location.search);

    if (debouncedKeyword===parsed.search) return;

    parsed.search = debouncedKeyword;

    const nextURL=queryString.stringifyUrl({
      url: location.pathname,
      query: parsed,
    }, {
      skipEmptyString: true,
      skipNull: true,
    });

    history.pushState(parsed, '', nextURL);
  }, [debouncedKeyword]);

  return [keyword, debouncedKeyword, setKeyword];
}

export default useSearchKeyword;