import Image from 'next/image';
import { useTheme } from 'next-themes';

import styles from './styles.module.css';

const hamburgerIcon: {[key: string]: string} = {
  'light':'/icons/icons8-hamburger.svg',
  'dark':'/icons/icons8-hamburger-dark.svg',
  'pink':'/icons/icons8-hamburger-pink.svg',
};

const cancelIcon: {[key: string]: string} = {
  'light':'/icons/icons8-cancel.svg',
  'dark':'/icons/icons8-cancel-dark.svg',
  'pink':'/icons/icons8-cancel-pink.svg',
};

function hamburgerIconSrc(isDark: boolean, isPink: boolean) {
  if (isDark) {
    return hamburgerIcon['dark'];
  }
  else if (isPink) {
    return hamburgerIcon['pink'];
  }
  else {
    return hamburgerIcon['light'];
  }
}

function cancelIconSrc(isDark: boolean, isPink: boolean) {
  if (isDark) {
    return cancelIcon['dark'];
  }
  else if (isPink) {
    return cancelIcon['pink'];
  }
  else {
    return cancelIcon['light'];
  }
}

function Toggler({isMenuOpen, toggle}: {isMenuOpen: boolean, toggle: () => void}) {
  const {resolvedTheme} = useTheme();

  const isDark = resolvedTheme === 'dark';
  const isPink = resolvedTheme === 'pink';
  
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIconSrc(isDark, isPink) :
          hamburgerIconSrc(isDark, isPink)
        }
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;