import Image from 'next/image';
import Link from 'next/link';

import { blogConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';

import PostIntro from './intro';
import styles from './styles.module.css';

function PostCard(props: PostIntroType) {
  const { title, description, thumbnail, date, tags, url } = props;
  return (
    <Link className={styles.link} href={url}>
      <article className={styles.container}>
        {thumbnail ?
          <div>
            <Image
              className={styles.image} 
              style={{ transform: 'translate3d(0, 0, 0)' }}
              src={thumbnail[blogConfig.imageStorage] ?? thumbnail.local} 
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
        <PostIntro title={title} description={description} date={date} tags={tags} />
      </article>
    </Link>
  );
}

export default PostCard;