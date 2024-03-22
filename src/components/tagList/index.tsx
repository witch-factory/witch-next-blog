import { TagListType } from '@/types/components';

import styles from './styles.module.css';

function TagList({ tags }: TagListType) {
  return (
    <ul className={styles.tagList}>
      {tags.map((tag)=>
        <li key={tag} className={styles.tag}>{tag}</li>
      )}
    </ul>
  );
}

export default TagList;