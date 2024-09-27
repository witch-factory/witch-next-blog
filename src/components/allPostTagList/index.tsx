import Link from 'next/link';

import { postTags } from '#site/content';

import * as styles from './styles.css';

function AllPostTagList({ selectedTag }: {selectedTag: string}) {
  return (
    <ul className={styles.tagList}>
      {postTags.map((tag) => (
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