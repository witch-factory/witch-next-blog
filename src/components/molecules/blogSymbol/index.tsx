import Link from 'next/link';

import Logo from '@/components/atoms/logo';
import Title from '@/components/atoms/title';
import blogConfig from 'blog-config';

import styles from './styles.module.css';

function BlogSymbol() {
  return (
    <Link href='/' aria-label='Home' className={styles.link}>
      <div className={styles.container}>
        <Logo />
        <Title heading='h1' size='md'>
          {blogConfig.title}
        </Title>
      </div>
    </Link>
  );
}

export default BlogSymbol;