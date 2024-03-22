import TagList from '@/components/tagList';
import { toISODate, formatDate } from '@/utils/date';

import styles from './styles.module.css';


export interface IntroProps{
  title: string;
  description: string;
  tags: string[];
  date?: string;
}

// function EyeIcon() {
//   return (
//     <svg
//       className={styles.eye}
//       xmlns='http://www.w3.org/2000/svg' 
//       viewBox='0 0 24 24' 
//       fill='none' 
//       stroke='currentColor' 
//       strokeWidth='2' 
//       strokeLinecap='round' 
//       strokeLinejoin='round'
//     >
//       <circle cx='12' cy='12' r='3'/>
//       <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'/>
//     </svg>
//   );
// }


function Timestamp({ date }: { date: string }) {
  const dateObj = new Date(date);
  return (
    <time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</time>
  );
}


/* 프로젝트나 아티클의 제목, 설명, 태그를 담는 부분 */
function Intro(props: IntroProps) {
  const { title, description, date, tags } = props;
  return (
    <section className={styles.container}>
      <h3 className='title-sm mb-3'>{title}</h3>
      <p className='description mb-3'>{description}</p>
      {tags.length ?
        <TagList tags={tags} /> :
        null}
      {date ? <Timestamp date={date} />
        : null}
    </section>
  );
}

export default Intro;