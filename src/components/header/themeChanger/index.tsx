import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import styles from './styles.module.css';

function LightIcon({isDark}: {isDark: boolean}) {
  return (
    <div className={`${styles.theme} ${isDark?styles.light:styles.selected}`}>
      {isDark?
        <Image
          src='/icons/icons8-sun-dark.png'
          alt='Light mode icon in Dark mode'
          width={20}
          height={20}
        />:
        <Image
          src='/icons/icons8-sun.png'
          alt='Light mode icon in Light mode'
          width={20}
          height={20}
        />
      }
    </div>
  );
}

function DarkIcon({isDark}: {isDark: boolean}) {
  return (
    <div className={`${styles.theme} ${isDark?styles.selected:styles.dark}`}>
      {isDark?
        <Image
          src='/icons/icons8-moon-dark.png'
          alt='Dark mode icon in Dark mode'
          width={20}
          height={20}
        />:
        <Image
          src='/icons/icons8-moon.png'
          alt='Dark mode icon in Light mode'
          width={20}
          height={20}
        />
      }
    </div>
  );
}

const ThemeChanger = () => {
  const [mounted, setMounted]=useState<boolean>(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button
      onClick={toggleTheme}
      className={styles.button}
      aria-label='theme toggle button'
      aria-pressed={isDark}
    >
      <LightIcon isDark={isDark} />
      <DarkIcon isDark={isDark} />
    </button>
  );
};

export default ThemeChanger;