'use client';

import { useTheme } from 'next-themes';

import { getThemeName } from '@/utils/theme';

import LightDarkToggle from './lightDarkToggle';
import PinkToggle from './pinkToggle';
import styles from './styles.module.css';

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  const isDarkOrPink = getThemeName(theme) === 'dark' || getThemeName(theme) === 'pink';
  const toggleTheme = () => setTheme(isDarkOrPink ? 'light' : 'dark');
  const togglePinkTheme = () => setTheme(isDarkOrPink ? 'darkPink' : 'pink');

  return (
    <div className={styles.container}>
      <LightDarkToggle toggleClick={toggleTheme} />
      <PinkToggle toggleClick={togglePinkTheme} />
    </div>
  );
}

export default ThemeSwitch;