import { TagListType } from '@/types/components';

import * as styles from './styles.css';

function TagList({ tags }: TagListType) {
  return (
    <ul className={styles.tagList}>
      {tags.map((tag) =>
        <li key={tag} className={styles.tag}>{tag}</li>,
      )}
    </ul>
  );
}

export default TagList;
