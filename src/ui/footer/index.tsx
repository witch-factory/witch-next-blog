import Link from 'next/link';

import { blogConfig } from '@/config/blogConfig';
import { Language } from '@/types/i18n';

import * as styles from './styles.css';

function Footer({ lang }: { lang: Language }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <h2 className="title-md mb-3">
            {blogConfig[lang].title}
          </h2>
          <p className="mb-3">
            <span>
              ©
              {' '}
              {blogConfig[lang].name}
              ,
              {' '}
            </span>
            <Link href="https://github.com/witch-factory/witch-next-blog" target="_blank"> witch-next-blog,</Link>
            <span> 2023</span>
          </p>
          <p className="mb-3">
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
