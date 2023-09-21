'use client';

import { useTheme } from 'next-themes';

import { getThemeName } from '@/utils/theme';

import SunAndMoonIcon from './icon';
import styles from './theme.module.css';

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const isDark = getThemeName(theme) === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button 
      className={styles.themeToggle} 
      title='Toggle Light & Dark' 
      aria-label='auto'
      aria-live='polite'
      onClick={toggleTheme}
    >
      <SunAndMoonIcon />
    </button>
  );
}

export default ThemeSwitch;