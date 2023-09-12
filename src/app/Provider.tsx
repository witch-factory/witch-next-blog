'use client';

import { ThemeProvider } from 'next-themes';

const Provider = ({ children }: React.PropsWithChildren<Record<never, never>>)=>{

  return (
    <ThemeProvider
      defaultTheme='system'
      enableSystem={true}
      value={{ dark: 'dark', light: 'light', pink: 'pink', witch: 'witch' }}
      themes={['dark', 'light', 'pink', 'witch']}
    >
      {children}
    </ThemeProvider>
  );
};

export default Provider;