import Image from 'next/image';
import Link from 'next/link';

import blogConfig from 'blog-config';

import Intro from './intro';
import styles from './styles.module.css';

export interface CardProps{
  title: string;
  description: string;
  thumbnail?: {
    local: string;
    cloudinary: string;
    blurURL?: string;
  }
  date: string;
  tags: string[];
  url: string;
}

function Card(props: CardProps) {
  const { title, description, thumbnail, date, tags, url } = props;
  return (
    <Link className={styles.link} href={url}>
      <article className={styles.container}>
        {thumbnail ?
          <div>
            <Image 
              className={styles.image} 
              style={{ transform: 'translate3d(0, 0, 0)' }}
              src={thumbnail[blogConfig.imageStorage]} 
              alt={`${title} 사진`} 
              width={200} 
              height={200}
              sizes='200px'
              placeholder={'blurURL' in thumbnail ? 'blur' : 'empty'}
              blurDataURL={thumbnail.blurURL}
            />
          </div>
          :
          null
        }
        <Intro title={title} description={description} date={date} tags={tags} />
      </article>
    </Link>
  );
}

export default Card;