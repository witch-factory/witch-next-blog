import Image from 'next/image';
import Link from 'next/link';

import { Language } from '@/types/i18n';

import * as styles from './styles.css';

function BlogSymbol({ lang }: { lang: Language }) {
  const homeURL = lang === 'ko' ? '/' : `/${lang}`;

  return (
    <Link href={homeURL} aria-label="Home" className={styles.linkContainer}>
      <div className={styles.container}>
        <Image
          className={styles.logo}
          src="/witch-new-hat.svg"
          alt="logo"
          width={50}
          height={50}
          placeholder="empty"
        />
        <h1 className={styles.title}>
          <span>Witch-Work</span>
        </h1>
      </div>
    </Link>
  );
}

export default BlogSymbol;
