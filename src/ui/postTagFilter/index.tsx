import Link from 'next/link';

import { PostTagFilterType } from '@/types/components';

import * as styles from './styles.css';

function PostTagFilter(props: PostTagFilterType) {
  const { tags, selectedTag, makeTagURL } = props;

  return (
    <section className={styles.container}>
      <h2 className='title-md mb-4'>태그</h2>
      <ul className={styles.tagList}>
        {tags.map((tag) => (
          <li 
            key={tag} 
            className={tag === selectedTag ? styles.selectedTagItem : styles.tagItem}
          >
            <Link 
              href={makeTagURL(tag)} 
              className={styles.tagLink}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default PostTagFilter;