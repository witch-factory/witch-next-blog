import { FrontMatterType } from '@/types/components';
import { formatDate, toISODate } from '@/utils/date';

import * as styles from './styles.css';

function FrontMatter(props: FrontMatterType) {
  const { title, date, tags } = props;
  const dateObj = new Date(date);
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <time className={styles.time} dateTime={toISODate(dateObj)}>
        {formatDate(dateObj)}
      </time>
      {tags && <ul className={styles.tagList}>
        {tags.map((tag: string)=>
          <li key={tag} className={styles.tag}>{tag}</li>
        )}
      </ul>}
    </>
  );
}

export default FrontMatter;