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

/* 프로젝트나 아티클의 제목, 설명, 태그를 담는 부분 */
function Intro(props: IntroProps) {
  const { title, description, date, tags } = props;
  return (
    <>
      <Title heading='h3' size='sm'>
        {title}
      </Title>
      <Description>{description}</Description>
      {tags.length ?
        <ul className={styles.tagList}>
          {tags.map((tag: string)=>
            <Tag key={tag} size='md'>{tag}</Tag>
          )}
        </ul> :
        null}
      {date ? <Timestamp date={date} /> : null}
    </>
  );
}

export default Intro;