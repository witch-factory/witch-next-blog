import AllPostTagList from '@/components/allPostTagList';
import { Language } from '@/types/i18n';

import * as styles from './styles.css';

const tagsTitle: Record<Language, string> = {
  ko: '태그',
  en: 'Tags',
};

function AllPostTagFilter({ selectedTag, lang }: { selectedTag: string, lang: Language }) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{tagsTitle[lang]}</h2>
      <AllPostTagList selectedTag={selectedTag} lang={lang} />
    </section>
  );
}

export default AllPostTagFilter;
