import Link from 'next/link';

import TagList from '@/components/templates/tagList';

import styles from './styles.module.css';

interface Props{
  tags: string[];
  selectedTag: string;
  makeTagURL: (tag: string) => string;
}

function TagFilter(props: Props) {
  const { tags, selectedTag, makeTagURL } = props;

  return (
    <section className={styles.container}>
      <h2 className='title-md mb-4'>태그</h2>
      <TagList gap='lg'>
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
      </TagList>
    </section>
  );
}

export default TagFilter;