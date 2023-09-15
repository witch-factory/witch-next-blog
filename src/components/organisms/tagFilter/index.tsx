import Link from 'next/link';

import TagList from '../../molecules/tagList';
import Title from '@/components/atoms/title';

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
      <Title heading='h2' className='title-md mb-4'>태그</Title>
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