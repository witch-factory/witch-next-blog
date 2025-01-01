import Link from 'next/link';

import { postTags } from '#site/content';
import { Language } from '@/types/i18n';

import * as styles from './styles.css';

function AllPostTagList({ selectedTag, lang }: { selectedTag: string, lang: Language }) {
  return (
    <ul className={styles.tagList}>
      {postTags.map((tag) => (
        <li
          key={tag.slug}
          className={tag.slug === selectedTag ? styles.selectedTagItem : styles.tagItem}
        >
          <Link
            href={`${lang === 'ko' ? '' : `/${lang}`}${tag.url}`}
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
