import Image from 'next/image';
import Link from 'next/link';

import Intro from '@/components/molecules/intro';
import blogConfig from 'blog-config';

import styles from './styles.module.css';

export interface CardProps{
  title: string;
  description: string;
  image?: {
    local: string;
    cloudinary: string;
    blurURL?: string;
  }
  date: string;
  tags: string[];
  url: string;
}

function Card(props: CardProps) {
  const { title, description, image, date, tags, url } = props;
  return (
    <Link className={styles.link} href={url}>
      <article className={styles.container}>
        {image ?
          <div>
            <Image 
              className={styles.image} 
              style={{ transform: 'translate3d(0, 0, 0)' }}
              src={image[blogConfig.imageStorage] ?? image['local']} 
              alt={`${title} 사진`} 
              width={200} 
              height={200}
              sizes='200px'
              placeholder={'blurURL' in image ? 'blur' : 'empty'}
              blurDataURL={image.blurURL}
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