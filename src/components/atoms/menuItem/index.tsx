import Link from 'next/link';

import styles from './styles.module.css';

function MenuItem({ children, title, url }: React.PropsWithChildren<{
  title: string;
  url: string;
}>) {
  return (
    <li className={styles.item}>
      <Link
        href={url} 
        aria-label={title} 
        className={styles.link}
      >
        {children}
      </Link>
    </li>
  );

}

export default MenuItem;