'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: React.PropsWithChildren<Record<never, never>>) {
  return (
    <ThemeProvider
      defaultTheme='system'
      enableSystem={true}
      value={{ dark: 'dark', light: 'light', pink: 'pink', darkPink: 'darkPink' }}
      themes={['dark', 'light', 'pink', 'darkPink']}
    >
      {children}
    </ThemeProvider>
  );
};