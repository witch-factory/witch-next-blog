import Image from 'next/image';
import Link from 'next/link';

import { toISODate, formatDate } from '@/utils/date';

import styles from './styles.module.css';


interface Props{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags?: string[];
  url: string;
}

function Card(props: Props) {
  const { title, description, image, date, tags, url } = props;
  const dateObj = new Date(date);
  return (
    <article className={styles.container}>
      <Link href={url}>
        {image ? 
          <Image src={image} alt={`${title} 사진`} width={50} height={50} /> : 
          null
        }
        <h3>{title}</h3>
        <p>{description}</p>
        <time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</time>
        {
          tags?<ul>{tags.map((tag: string)=><li key={tag}>{tag}</li>)}</ul>:null
        }
      </Link>
    </article>
  );
}

export default Card;