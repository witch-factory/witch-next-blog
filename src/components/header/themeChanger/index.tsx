import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import styles from './styles.module.css';

function ThemeIcon({isDark}: {isDark: boolean}) {
  if (!isDark) {
    return (
      <Image 
        src='/light-mode.svg'
        alt='라이트모드 아이콘'
        width={50}
        height={40}
        priority
      />
    );
  }
  else {
    return (
      <Image 
        src='/dark-mode.svg'
        alt='다크모드 아이콘'
        width={50}
        height={40}
        priority
      />
    );
  }
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
      <ThemeIcon isDark={isDark} />
    </button>
  );
};

export default ThemeChanger;