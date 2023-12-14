import Link from 'next/link';

import Copyright from '@/components/atoms/copyright';
import Title from '@/components/atoms/title';
import blogConfig from 'blog-config';

import styles from './styles.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <Title heading='h1' className='title-md mb-3'>
            {blogConfig.title}
          </Title>
          <Copyright className='mb-3' name={blogConfig.name} url='https://github.com/witch-factory/witch-next-blog' />
          <p className='mb-3'>
            <span>Profile image by <Link target='_blank' href='https://github.com/FairyGina'>Gina Kim</Link></span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;