import Link from 'next/link';

import Title from '../title';


import styles from './styles.module.css';

interface Props{
  tags: string[];
  selectedTag: string;
  makeTagURL: (tag: string) => string;
}

function TagFilter(props: Props) {
  const {tags, selectedTag, makeTagURL} = props;

  return (
    <section className={styles.container}>
      <Title title={'태그 목록'} />
      <ul className={styles.tagList}>
        {tags.map((tag) => (
          <li key={tag} className={tag===selectedTag?styles.selectedTagItem : styles.tagItem}>
            <Link href={makeTagURL(tag)} className={styles.tagLink}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
      
    </section>
  );
}

export default TagFilter;