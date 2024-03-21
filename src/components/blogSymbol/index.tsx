import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.css';

function BlogSymbol() {
  return (
    <Link href='/' aria-label='Home' className={styles.link}>
      <div className={styles.container}>
        <Image 
          className={styles.logo} 
          src='/witch-new-hat.svg'
          alt='logo'
          width={50} 
          height={50} 
          placeholder='empty'
        />
        <h1 className='title-md'>
          <span className={styles.name}>Witch</span>
          <span className={styles.url}>-Work</span>
        </h1>
      </div>
    </Link>
  );
}

export default BlogSymbol;