import Image from 'next/image';
import Link from 'next/link';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

function HomeButton() {
  return (
    <Link href='/' aria-label='Home' className={styles.link}>
      <div className={styles.container}>
        <Image src='/witch-hat.svg' alt='logo' width={40} height={40} />
        {blogConfig.title}
      </div>
    </Link>
  );
}

export default HomeButton;