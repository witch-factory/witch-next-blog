'use client';

import { useTheme } from 'next-themes';

import { getThemeName } from '@/utils/theme';

import PinkIcon from './pinkIcon';
import SunAndMoonIcon from './sunAndMoon';
import styles from './theme.module.css';

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const isDark = getThemeName(theme) === 'dark' || getThemeName(theme) === 'darkPink';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');
  const togglePinkTheme = () => setTheme(isDark ? 'darkPink' : 'pink');

  return (
    <div className={styles.container}>
      <button 
        className={styles.themeToggle} 
        title='Toggle Light & Dark' 
        aria-label='auto'
        aria-live='polite'
        onClick={toggleTheme}
      >
        <SunAndMoonIcon />
      </button>
      <button className={styles.pinkThemeToggle} onClick={togglePinkTheme}>
        <PinkIcon />
      </button>

    </div>

  );
}

export default ThemeSwitch;