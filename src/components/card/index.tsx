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
    <Link className={styles.link} href={url}>
      <article className={styles.container}>
        {image ?
          <Image className={styles.image} src={image} alt={`${image} 사진`} width={100} height={100} /> : 
          null
        }
        <Intro title={title} description={description} date={date} tags={tags} />
      </article>
    </Link>
  );
}

export default Card;