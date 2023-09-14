'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import Icon from '@/components/atoms/icon';
import { ThemeType, getThemeName } from '@/utils/theme';

import styles from './styles.module.css';

const SunIconMap: Record<ThemeType, string> = {
  light: '/icons/icons8-sun.png',
  dark: '/icons/icons8-sun-dark.png',
  pink: '/icons/icons8-sun-dark.png',
  witch: '/icons/icons8-sun-dark.png',
};

const MoonIconMap: Record<ThemeType, string> = {
  light: '/icons/icons8-moon.png',
  dark: '/icons/icons8-moon-dark.png',
  pink: '/icons/icons8-moon-dark.png',
  witch: '/icons/icons8-moon-dark.png',
};

function ThemeChanger() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(()=>{setMounted(true);}, []);

  const isDark = getThemeName(theme) === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      title='Toggles light & dark'
      aria-label='Toggles light & dark'
      aria-live='polite'
    >
      <div className={`${styles.theme} ${isDark ? styles.light : styles.selected}`}>
        <Icon iconSrcMap={SunIconMap} imageAlt='Light mode icon' />
      </div>
      <div className={`${styles.theme} ${isDark ? styles.selected : styles.dark}`}>
        <Icon iconSrcMap={MoonIconMap} imageAlt='Dark mode icon' />
      </div>
    </button>
  );
}

export default ThemeChanger;