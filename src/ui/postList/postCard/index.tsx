import Image from 'next/image';
import Link from 'next/link';

import TagList from '@/components/tagList';
import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { PostIntroType } from '@/types/components';
import { formatDate, toISODate } from '@/utils/date';

import * as styles from './styles.css';

const vercelOGURL = `${blogLocalConfig.ko.url}/api/og?title=`;
const vercelEnOGURL = `${blogLocalConfig.en.url}/api/og?title=`;

function PostThumbnail({ title, thumbnail }: { title: string, thumbnail: PostIntroType['thumbnail'] }) {
  const thumbnailURL = thumbnail?.[blogConfig.imageStorage] ?? thumbnail?.local;
  if (!thumbnail || !thumbnailURL) {
    return null;
  }
  return (
    <div>
      <Image
        className={styles.image}
        style={{ transform: 'translate3d(0, 0, 0)' }}
        src={thumbnailURL}
        unoptimized={thumbnailURL.startsWith(vercelOGURL) || thumbnailURL.startsWith(vercelEnOGURL)}
        alt={`${title} 사진`}
        width={200}
        height={200}
        sizes="200px"
        placeholder={'blurURL' in thumbnail ? 'blur' : 'empty'}
        blurDataURL={thumbnail.blurURL}
      />
    </div>
  );
}

function PostCard(props: PostIntroType) {
  const { title, description, thumbnail, date, tags, url } = props;
  const dateObj = new Date(date);

  return (
    <Link className={styles.link} href={url}>
      <article className={styles.container}>
        <PostThumbnail title={title} thumbnail={thumbnail} />
        <section className={styles.introContainer}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          {tags?.length
            ? <TagList tags={tags} />
            : null}
          <time dateTime={toISODate(dateObj)}>{formatDate(dateObj)}</time>
        </section>
      </article>
    </Link>
  );
}

export default PostCard;
