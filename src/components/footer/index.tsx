import Image from 'next/image';
import Link from 'next/link';

import blogConfig from 'blog-config';

import styles from './styles.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
      © {blogConfig.name}, Built with NextJS, 2023
      </p>
      <Link href='https://github.com/witch-factory' className={styles.github}>
        <Image src='/github-mark.png' alt='Github' width={32} height={32} />
      </Link>
    </footer>
  );
}

export default Footer;