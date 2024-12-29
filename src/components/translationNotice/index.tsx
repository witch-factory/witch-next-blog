import { blogConfig } from '@/config/blogConfig';
import { Language } from '@/types/i18n';

import * as styles from './styles.css';

type Props = {
  lang: Language,
};

const content = {
  en: {
    title: '⚠️ Notice',
    message: `This article has been translated by AI(gpt-4o-mini) and may contain inaccuracies. I can communicate in English, so please contact me via ${blogConfig.email} if needed.`,
  },
} as const;

function TranslationNotice({ lang }: Props) {
  if (lang === 'ko') {
    return null;
  }
  return (
    <aside
      className={styles.container}
      aria-labelledby="translation-notice-title"
      role="note"
    >
      <h3>
        {content[lang].title}
      </h3>
      <p>
        {content[lang].message}
      </p>
    </aside>
  );
}

export default TranslationNotice;
