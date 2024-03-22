import { FrontMatterType } from '@/types/components';
import { formatDate, toISODate } from '@/utils/date';

import styles from './styles.module.css';

function FrontMatter(props: FrontMatterType) {
  const { title, date, tags, view } = props;
  const dateObj = new Date(date);
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.infoContainer}>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj)}
        </time>
        {view && 
        <>
          <div className={styles.line}></div>
          <p className={styles.view}>조회수 {view}회</p>
        </> 
        }
      </div>
      <ul className={styles.tagList}>
        {tags.map((tag: string)=>
          <li key={tag} className={styles.tag}>{tag}</li>
        )}
      </ul>
    </>
  );
}

export default FrontMatter;