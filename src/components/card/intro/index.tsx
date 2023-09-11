import { toISODate, formatDate } from '@/utils/date';

import styles from './styles.module.css';

interface Props{
  title: string;
  description: string;
  date: string;
  tags: string[];
}

function Intro(props: Props) {
  const { title, description, date, tags } = props;
  const dateObj = new Date(date);
  return (
    <section className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {tags.length ?
        <ul className={styles.tagList}>
          {tags.map((tag: string)=>
            <li key={tag} className={styles.tag}>{tag}</li>
          )}
        </ul> :
        null}
      <time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</time>
    </section>
  );
}

export default Intro;