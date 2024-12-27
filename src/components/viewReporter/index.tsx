'use client';

import { useEffect } from 'react';

function ViewReporter({ slug }: { slug: string }) {
  useEffect(() => {
    fetch('/viewcount', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug }),
    }).catch((err: unknown) => {
      console.error('Error reporting view count', err);
    });
  }, [slug]);

  return null;
}

export default ViewReporter;
