import TagList from '@/components/tagList';
import { PostIntroType } from '@/types/components';
import { toISODate, formatDate } from '@/utils/date';

import styles from './styles.module.css';

function Timestamp({ date }: { date: string }) {
  const dateObj = new Date(date);
  return (
    <time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</time>
  );
}

/* 프로젝트나 아티클의 제목, 설명, 태그를 담는 부분 */
function PostIntro(props: Omit<PostIntroType, 'image' | 'url'>) {
  const { title, description, date, tags } = props;
  return (
    <section className={styles.container}>
      <h3 className='title-sm mb-3'>{title}</h3>
      <p className='description mb-3'>{description}</p>
      {tags.length ?
        <TagList tags={tags} /> :
        null}
      <Timestamp date={date} />
    </section>
  );
}

export default PostIntro;