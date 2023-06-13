import Image from 'next/image';
import { useTheme } from 'next-themes';

import {
  hamburgerIcon,
  hamburgerIconDark,
  hamburgerIconPink,

  cancelIcon,
  cancelIconDark,
  cancelIconPink,
} from '@/utils/iconsURL';

import styles from './styles.module.css';

const hamburgerIconMap: {[key: string]: string} = {
  'light':hamburgerIcon,
  'dark':hamburgerIconDark,
  'pink':hamburgerIconPink,
};

const cancelIconMap: {[key: string]: string} = {
  'light':cancelIcon,
  'dark':cancelIconDark,
  'pink':cancelIconPink,
};

function hamburgerIconSrc(isDark: boolean, isPink: boolean) {
  if (isDark) {
    return hamburgerIconMap['dark'];
  }
  else if (isPink) {
    return hamburgerIconMap['pink'];
  }
  else {
    return hamburgerIconMap['light'];
  }
}

function cancelIconSrc(isDark: boolean, isPink: boolean) {
  if (isDark) {
    return cancelIconMap['dark'];
  }
  else if (isPink) {
    return cancelIconMap['pink'];
  }
  else {
    return cancelIconMap['light'];
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