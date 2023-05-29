import Image from 'next/image';
import Link from 'next/link';

import Intro from './intro';
import styles from './styles.module.css';

interface Props{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags: string[];
  url: string;
}

function Card(props: Props) {
  const { title, description, image, date, tags, url } = props;
  return (
    <article className={styles.container}>
      <Link className={styles.link} href={url}>
        {image ?
          <Image src={image} alt={`${title} 사진`} width={50} height={50} /> : 
          null
        }
        <Intro title={title} description={description} date={date} tags={tags} />
      </Link>
    </article>
  );
}

export default Card;