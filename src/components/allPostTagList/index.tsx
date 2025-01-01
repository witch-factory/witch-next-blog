import Link from 'next/link';

import { enPostTags, postTags } from '#site/content';
import { Language } from '@/types/i18n';

import * as styles from './styles.css';

const tagsMap = {
  ko: postTags,
  en: enPostTags,
};

function AllPostTagList({ selectedTag, lang }: { selectedTag: string, lang: Language }) {
  return (
    <ul className={styles.tagList}>
      {tagsMap[lang].map((tag) => (
        <li
          key={tag.slug}
          className={tag.slug === selectedTag ? styles.selectedTagItem : styles.tagItem}
        >
          <Link
            href={tag.url}
            className={styles.tagLink}
          >
            {tag.name}
            <span className={styles.tagPostCount}>
              {` (${tag.count})`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default AllPostTagList;
