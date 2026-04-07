'use client';

import { useEffect } from 'react';

import { Locale } from '@/constants/i18n';

function ViewReporter({ lang, slug }: { lang: Locale, slug: string }) {
  useEffect(() => {
    fetch(`/${lang}/api/viewcount`, {
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    }).catch((err: unknown) => {
      console.error('Error reporting view count', err);
    });
  }, [lang, slug]);

  return null;
}

export default ViewReporter;
