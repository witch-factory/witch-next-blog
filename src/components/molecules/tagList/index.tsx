import Tag from '@/components/atoms/tag';

import styles from './styles.module.css';

function TagList({ tags }: {tags: string[]}) {
  return (
    <ul className={styles.tagList}>
      {tags.map((tag) =>
        <Tag key={tag} size='md'>{tag}</Tag>
      )}
    </ul>
  );
}

export default TagList;