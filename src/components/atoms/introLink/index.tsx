import Link from 'next/link';

import styles from './styles.module.css';

interface Props {
  siteLink: string;
}

function IntroLink({ siteLink, children }: React.PropsWithChildren<Props>) {
  return (
    <Link href={siteLink} target='_blank' className={styles.link}>
      {children}
    </Link>
  );
}

export default IntroLink;