import Link from 'next/link';

import Logo from '@/components/atoms/logo';
import Title from '@/components/atoms/title';

import styles from './styles.module.css';

function BlogSymbol() {
  return (
    <Link href='/' aria-label='Home' className={styles.link}>
      <div className={styles.container}>
        <Logo />
        <Title heading='h1' className='title-md'>
          <span className={styles.name}>Witch</span>
          <span className={styles.url}>-Work</span>
        </Title>
      </div>
    </Link>
  );
}

export default BlogSymbol;