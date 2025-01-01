'use client';

import { useTheme } from 'next-themes';
import { createRef, useEffect } from 'react';

import { blogConfig } from '@/config/blogConfig';
import { Language } from '@/types/i18n';
import { getThemeName } from '@/utils/theme';

const sendMessage = (message: Record<string, unknown>) => {
  const iframe: HTMLIFrameElement | null = document.querySelector(
    'iframe.giscus-frame',
  );
  iframe?.contentWindow?.postMessage({ giscus: message }, 'https://giscus.app');
};

const giscusTheme = (theme: string | undefined) => {
  const curTheme = getThemeName(theme);
  if (curTheme === 'light' || curTheme === 'pink') {
    return 'light';
  }
  return 'dark';
};

function Giscus({ lang }: { lang: Language }) {
  const ref = createRef<HTMLDivElement>();
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement('script');
    if (blogConfig[lang].comment.type !== 'giscus') {
      return;
    }
    const config = {
      'data-repo': blogConfig[lang].comment.repo,
      'data-repo-id': blogConfig[lang].comment.repoId,
      'data-category': blogConfig[lang].comment.category,
      'data-category-id': blogConfig[lang].comment.categoryId,
      'data-mapping': 'pathname',
      'data-strict': '0',
      'data-reactions-enabled': '1',
      'data-emit-metadata': '0',
      'data-input-position': 'bottom',
      'data-theme': theme,
      'data-lang': blogConfig[lang].comment.lang ?? 'en',
      'data-loading': blogConfig[lang].comment.lazy ? 'lazy' : undefined,
      'src': 'https://giscus.app/client.js',
      'crossOrigin': 'anonymous',
      'async': true,
    };

    Object.entries(config).forEach(([key, value]) => {
      script.setAttribute(key, `${value}`);
    });
    /* 혹시 있을 자식들을 제거 */
    const currentRef = ref.current;
    currentRef?.childNodes.forEach((children) => {
      currentRef.removeChild(children);
    });

    currentRef?.appendChild(script);

    return () => {
      currentRef?.childNodes.forEach((children) => {
        currentRef.removeChild(children);
      });
    };
  }, [ref, theme]);

  useEffect(() => {
    sendMessage({
      setConfig: {
        theme: giscusTheme(theme),
      },
    });
  }, [theme]);

  if (blogConfig[lang].comment.type !== 'giscus') {
    return null;
  }
  return (
    <div className="giscus" ref={ref} />
  );
}

export default Giscus;
