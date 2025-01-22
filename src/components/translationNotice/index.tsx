import { blogConfig } from '@/config/blogConfig';
import { i18n, Locale } from '@/types/i18n';

import * as styles from './styles.css';

type Props = {
  lang: Locale,
};

function TranslationNotice({ lang }: Props) {
  if (lang === i18n.defaultLocale) {
    return null;
  }
  return (
    <aside
      className={styles.container}
      aria-labelledby="translation-notice-title"
      role="note"
    >
      <h3>
        ⚠️ Notice
      </h3>
      <p>
        This article has been translated by AI(gpt-4o-mini) and may contain inaccuracies. I can communicate in English, so please contact me via
        {' '}
        <a
          style={{
            textDecoration: 'underline',
          }}
          href={`mailto:${blogConfig.en.email}`}
        >
          {blogConfig.en.email}
        </a>
        {' '}
        if needed.
      </p>
    </aside>
  );
}

export default TranslationNotice;
