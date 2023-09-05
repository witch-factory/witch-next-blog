import Image from 'next/image';

import styles from './styles.module.css';

function Logo() {
  return (
    <Image 
      className={styles.image} 
      src='/witch-hat.svg' 
      alt='logo' 
      width={40} 
      height={40} 
    />
  );
}

export default Logo;