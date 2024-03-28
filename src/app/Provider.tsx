'use client';

import { ThemeProvider } from 'next-themes';

import { darkPinkTheme, darkTheme, lightTheme, pinkTheme } from '@/styles/theme.css';

// dark mode with vanilla-extract
// reference https://yong-nyong.tistory.com/93
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem={true}
      value={{
        light:lightTheme,
        dark:darkTheme,
        pink:pinkTheme,
        darkPink:darkPinkTheme,
      }}
      themes={['dark', 'light', 'pink', 'darkPink']}
    >
      {children}
    </ThemeProvider>
  );
};