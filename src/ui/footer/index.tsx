import Link from 'next/link';

import { blogConfig } from '@/config/blogConfig';

import styles from './styles.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <h1 className='title-md mb-3'>
            {blogConfig.title}
          </h1>
          <p className='mb-3'>
            <span>© {blogConfig.name}, </span>
            <Link href='https://github.com/witch-factory/witch-next-blog' target='_blank'> witch-next-blog,</Link>
            <span> 2023</span>
          </p>
          <p className='mb-3'>
            <span>Profile image by <Link target='_blank' href='https://github.com/FairyGina'>Gina Kim</Link></span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;