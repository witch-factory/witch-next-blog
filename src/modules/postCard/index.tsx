import Image from 'next/image';
import Link from 'next/link';

import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import List from '@/containers/list';
import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';
import Badge from '@/ui/badge';
import Heading from '@/ui/heading';
import Text from '@/ui/text';
import { formatDate, toISODate } from '@/utils/date';

import * as styles from './styles.css';

const vercelOGURL = `${blogLocalConfig.ko.url}/api/og?title=`;
const vercelEnOGURL = `${blogLocalConfig.en.url}/api/og?title=`;

function PostThumbnail({ title, thumbnail }: { title: string, thumbnail: PostIntroType['thumbnail'] }) {
  const url = thumbnail?.[blogConfig.imageStorage] ?? thumbnail?.local;
  if (!thumbnail || !url) {
    return null;
  }
  return (
    <div>
      <Image
        className={styles.image}
        style={{ transform: 'translate3d(0, 0, 0)' }}
        src={url}
        unoptimized={url.startsWith(vercelOGURL) || url.startsWith(vercelEnOGURL)}
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

function PostCard(props: PostIntroType & { lang: Locale }) {
  const { title, description, thumbnail, date, tags, url, lang } = props;
  const dateObj = new Date(date);
  const postUrl = `/${lang}${url}`;

  return (
    <Link className={styles.link} href={postUrl}>
      <article className={styles.container}>
        <PostThumbnail title={title} thumbnail={thumbnail} />
        <section className={styles.introContainer}>
          <Heading as="h3" size="sm">
            {title}
          </Heading>
          <Text as="p" size="md">
            {description}
          </Text>
          {tags?.length
            ? (
                <List direction="row" gap="sm">
                  {tags.map((tag) => (
                    <List.Item key={tag}>
                      <Badge as="span" size="sm" radius="sm">
                        {tag}
                      </Badge>
                    </List.Item>
                  ),
                  )}
                </List>
              )
            : null}
          <time dateTime={toISODate(dateObj)}>{formatDate(dateObj, lang)}</time>
        </section>
      </article>
    </Link>
  );
}

export default PostCard;
