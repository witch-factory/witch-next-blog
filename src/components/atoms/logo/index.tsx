import Image from 'next/image';

import styles from './styles.module.css';

function Logo() {
  return (
    <Image 
      className={styles.logo} 
      src='/witch-new-hat.svg'
      alt='logo'
      width={50} 
      height={50} 
      placeholder='empty'
    />
  );
}

export default Logo;