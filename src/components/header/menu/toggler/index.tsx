import Image from 'next/image';
import { useTheme } from 'next-themes';

import { getThemeName } from '@/utils/getThemeName';
import { hamburgerIconMap, cancelIconMap } from '@/utils/iconsURL';

import styles from './styles.module.css';

function Toggler({isMenuOpen, toggle}: {isMenuOpen: boolean, toggle: () => void}) {
  const {resolvedTheme} = useTheme();
  
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIconMap[getThemeName(resolvedTheme)] :
          hamburgerIconMap[getThemeName(resolvedTheme)]
        }
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;