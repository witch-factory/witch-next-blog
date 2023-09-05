import Link from 'next/link';

import styles from './styles.module.css';

interface Props {
  siteName: string;
  siteLink: string;
}

function IntroLink({ siteName, siteLink }: Props) {
  return (
    <Link href={siteLink} target='_blank' className={styles.link}>
      {siteName}
    </Link>
  );
}

export default IntroLink;