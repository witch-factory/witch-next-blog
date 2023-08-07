import Link from 'next/link';

import styles from './styles.module.css';

interface Props{
  tags: string[];
  selectedTag: string;
  makeTagURL: (tag: string) => string;
}

function TagFilter(props: Props) {
  const {tags, selectedTag, makeTagURL} = props;

  return (
    <section>
      <ul className={styles.tagList}>
        {tags.map((tag) => {
          return (
            <li
              key={tag} 
              className={tag===selectedTag ? styles.selectedTagItem : styles.tagItem}
            >
              <Link
                href={makeTagURL(tag)} 
                className={styles.tagLink}
              >
                {tag}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default TagFilter;