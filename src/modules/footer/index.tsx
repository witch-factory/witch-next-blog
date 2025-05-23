import Link from 'next/link';

import { blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';
import Heading from '@/ui/heading';
import Text from '@/ui/text';

import * as styles from './styles.css';

function Footer({ lang }: { lang: Locale }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <Heading as="h2" size="md">
            {blogLocalConfig[lang].title}
          </Heading>
          <Text as="p" size="md">
            ©&nbsp;
            {blogLocalConfig[lang].name}
            ,&nbsp;
            <Link href="https://github.com/witch-factory/witch-next-blog" target="_blank">witch-next-blog,</Link>
            &nbsp;2023
          </Text>
          <Text as="p" size="md">
            Profile image by&nbsp;
            <Link target="_blank" href="https://github.com/FairyGina">Gina Kim</Link>
          </Text>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
