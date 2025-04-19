import Link from 'next/link';

import { blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/types/i18n';

import * as styles from './styles.css';

function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <h2 className={styles.title}>
            {blogLocalConfig[lang].title}
          </h2>
          <p className={styles.paragraph}>
            <span>
              ©
              {' '}
              {blogLocalConfig[lang].name}
              ,
              {' '}
            </span>
            <Link href="https://github.com/witch-factory/witch-next-blog" target="_blank"> witch-next-blog,</Link>
            <span> 2023</span>
          </p>
          <p className={styles.paragraph}>
            <span>
              Profile image by
              {' '}
              <Link target="_blank" href="https://github.com/FairyGina">Gina Kim</Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
