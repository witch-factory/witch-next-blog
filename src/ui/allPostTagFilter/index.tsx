import AllPostTagList from '@/components/allPostTagList';
import { Locale } from '@/types/i18n';

import * as styles from './styles.css';

const tagsTitle: Record<Locale, string> = {
  ko: '태그',
  en: 'Tag',
};

function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function AllPostTagFilter({ selectedTag, lang }: { selectedTag: string, lang: Locale }) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>
        {`${tagsTitle[lang]}${selectedTag === 'all' ? '' : ` : ${capitalize(selectedTag)}`}`}
      </h2>
      <AllPostTagList selectedTag={selectedTag} lang={lang} />
    </section>
  );
}

export default AllPostTagFilter;
