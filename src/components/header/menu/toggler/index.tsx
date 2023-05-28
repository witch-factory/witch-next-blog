import Image from 'next/image';

import styles from './styles.module.css';

function Toggler({isMenuOpen, toggle}: {isMenuOpen: boolean, toggle: () => void}) {
  return (
    <button className={styles.button} onClick={toggle}>
      <Image
        src={isMenuOpen?'/cancel-32x32.svg':'/hamburger-32x32.svg'} 
        alt='Menu' 
        width={32} 
        height={32} 
      />
    </button>
  );
}

export default Toggler;