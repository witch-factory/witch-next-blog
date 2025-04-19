import { enPostTags, postTags } from '#site/content';
import TagGroup from '@/composites/tagGroup';
import { Locale } from '@/types/i18n';

import * as styles from './styles.css';

const tagsTitle: Record<Locale, string> = {
  ko: '태그',
  en: 'Tag',
};

const tagsMap = {
  ko: postTags,
  en: enPostTags,
};

function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function AllPostTagFilter({ selectedTag, lang }: { selectedTag: string, lang: Locale }) {
  return (
    <section className={styles.container}>
      <TagGroup title={`${tagsTitle[lang]}${selectedTag === 'all' ? '' : ` : ${capitalize(selectedTag)}`}`} selectedTagSlug={selectedTag} tags={tagsMap[lang]} />
    </section>
  );
}

export default AllPostTagFilter;
