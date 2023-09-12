'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';

import GoogleAnalytics from '@/components/GoogleAnalytics';
import * as ga from '@/lib/ga';

const Provider = ({ children }: React.PropsWithChildren<Record<never, never>>)=>{
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url);
    };

    const url = `${pathname}?${searchParams}`;

    handleRouteChange(url);
  }, [pathname, searchParams]);

  return (
    <ThemeProvider
      defaultTheme='system'
      enableSystem={true}
      value={{ dark: 'dark', light: 'light', pink: 'pink', witch: 'witch' }}
      themes={['dark', 'light', 'pink', 'witch']}
    >
      {children}
      <GoogleAnalytics />
    </ThemeProvider>
  );
};

export default Provider;