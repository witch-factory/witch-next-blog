import Image from 'next/image';
import { useTheme } from 'next-themes';

import { hamburgerIconMap, cancelIconMap } from '@/utils/iconsURL';
import { getThemeName } from '@/utils/theme';

import styles from './styles.module.css';

function Toggler({ isMenuOpen, toggle }: {isMenuOpen: boolean, toggle: () => void}) {
  const { resolvedTheme } = useTheme();
  
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen ?
          cancelIconMap[getThemeName(resolvedTheme)] :
          hamburgerIconMap[getThemeName(resolvedTheme)]
        }
        alt='Menu' 
        width={20} 
        height={20} 
      />
    </button>
  );
}

export default Toggler;