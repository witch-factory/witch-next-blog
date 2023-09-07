import Link from 'next/link';

import styles from './styles.module.css';

interface Props{
  name: string;
  url: string;
}

function Copyright({ name, url }: Props) {
  return (
    <p className={styles.copyright}>
    © {name},
      <Link href={url} target='_blank'> witch-next-blog</Link>, 
    2023
    </p>
  );
}

export default Copyright;