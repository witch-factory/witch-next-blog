import Description from '@/components/atoms/description';
import Tag from '@/components/atoms/tag';
import Timestamp from '@/components/atoms/timestamp';
import Title from '@/components/atoms/title';

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

/* 프로젝트나 아티클의 제목, 설명, 태그를 담는 부분 */
function Intro(props: IntroProps) {
  const { title, description, date, tags } = props;
  return (
    <section className={styles.container}>
      <Title heading='h3' className='title-sm mb-3'>
        {title}
      </Title>
      <Description className='mb-3'>{description}</Description>
      {tags.length ?
        <ul className={styles.tagList}>
          {tags.map((tag: string)=>
            <Tag key={tag} size='md' className='mb-2'>{tag}</Tag>
          )}
        </ul> :
        null}
      {date ? <Timestamp date={date} /> : null}
    </section>
  );
}

export default Intro;