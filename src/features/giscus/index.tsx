'use client';

import { useTheme } from 'next-themes';
import { createRef, useEffect } from 'react';

import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';
import { getThemeName } from '@/utils/content/theme';

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

function Giscus({ lang }: { lang: Locale }) {
  const ref = createRef<HTMLDivElement>();
  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement('script');
    if (blogConfig.comment.type !== 'giscus') {
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
      'data-lang': blogLocalConfig[lang].comment.lang ?? 'en',
      'data-loading': blogConfig.comment.lazy ? 'lazy' : undefined,
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
  }, [ref, theme, lang]);

  useEffect(() => {
    sendMessage({
      setConfig: {
        theme: giscusTheme(theme),
      },
    });
  }, [theme]);

  if (blogConfig.comment.type !== 'giscus') {
    return null;
  }
  return (
    <div className="giscus" ref={ref} />
  );
}

export default Giscus;
