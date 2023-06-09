import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { createRef, useEffect } from 'react';

import blogConfig from 'blog-config';

const sendMessage = (message: Record<string, unknown>) => {
  const iframe: HTMLIFrameElement | null = document.querySelector(
    'iframe.giscus-frame',
  );
  iframe?.contentWindow?.postMessage({ giscus: message }, 'https://giscus.app');
};

function Giscus() {
  const ref=createRef<HTMLDivElement>();
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme==='dark' ? 'dark' : 'light';
  const router = useRouter();

  useEffect(() => {
    const script = document.createElement('script');
    if (blogConfig.comment?.type !== 'giscus') {
      return;
    }
    const config = {
      'data-repo': blogConfig.comment.repo,
      'data-repo-id': blogConfig.comment.repoId,
      'data-category': blogConfig.comment.category,
      'data-category-id': blogConfig.comment.categoryId,
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': theme,
      'data-lang': blogConfig.comment.lang ?? 'en',
      'data-loading': blogConfig.comment.lazy ? 'lazy' : undefined,
      src: 'https://giscus.app/client.js',
      crossOrigin: 'anonymous',
      async: true,
    };

    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, `${value}`);
    });
    /* 혹시 있을 자식들을 제거 */
    ref.current?.childNodes.forEach((children) => {
      ref.current?.removeChild(children);
    });

    ref.current?.appendChild(script);

    return () => {
      ref.current?.childNodes.forEach((children) => {
        ref.current?.removeChild(children);
      });
    };
  }, []);

  useEffect(() => {
    sendMessage({
      setConfig: {
        theme: theme,
      },
    });
  }, [theme]);

  useEffect(() => {
    sendMessage({ setConfig: { term: router.asPath } });
  }, [router.asPath]);

  if (blogConfig.comment?.type !== 'giscus') {
    return null;
  }
  return (
    <div className='giscus' ref={ref} />
  );
}

export default Giscus;