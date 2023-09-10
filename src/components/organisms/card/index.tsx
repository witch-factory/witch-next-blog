import Link from 'next/link';

import IntroImage from '@/components/atoms/introImage';
import Intro from '@/components/molecules/intro';

import styles from './styles.module.css';

export interface CardProps{
  title: string;
  description: string;
  image?: {
    local: string;
    cloudinary: string;
    blurURL?: string;
  }
  date?: string;
  tags: string[];
  url: string;
}

function Card(props: CardProps) {
  const { title, description, image, date, tags, url } = props;
  return (
    <Link href={url} target='_blank'>
      <article className={styles.container}>
        {image ? 
          <IntroImage 
            imageSrc={image} 
            imageAlt={title} 
            width={300} 
            height={300} 
          /> : null}
        <Intro title={title} description={description} date={date} tags={tags} />
      </article>
    </Link>
  );
}

export default Card;