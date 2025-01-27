import { FrontMatterType } from '@/types/components';
import { Locale } from '@/types/i18n';
import { formatDate, toISODate } from '@/utils/date';

import * as styles from './styles.css';

function FrontMatter(props: FrontMatterType & { lang: Locale }) {
  const { title, date, tags, lang } = props;
  const dateObj = new Date(date);
  return (
    <>
      <h1 className={styles.title}>{title}</h1>
      <time className={styles.time} dateTime={toISODate(dateObj)}>
        {formatDate(dateObj, lang)}
      </time>
      {tags && (
        <ul className={styles.tagList}>
          {tags.map((tag: string) =>
            <li key={tag} className={styles.tag}>{tag}</li>,
          )}
        </ul>
      )}
    </>
  );
}

export default FrontMatter;
