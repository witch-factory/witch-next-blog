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

function Toggler({isMenuOpen, toggle}: {isMenuOpen: boolean, toggle: () => void}) {
  const {theme} = useTheme();
  
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIcon[theme || 'light'] :
          hamburgerIcon[theme || 'light']
        }
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;