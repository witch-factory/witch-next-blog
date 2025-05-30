import Image from 'next/image';
import Link from 'next/link';

import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { Locale } from '@/constants/i18n';
import Flex from '@/containers/flex';
import { PostIntroType } from '@/types/components';
import Badge from '@/ui/badge';
import Heading from '@/ui/heading';
import Text from '@/ui/text';
import { formatDate, toISODate } from '@/utils/core/date';

import * as styles from './styles.css';

const vercelOGURL = `${blogLocalConfig.ko.url}/api/og?title=`;
const vercelEnOGURL = `${blogLocalConfig.en.url}/api/og?title=`;

function PostCard(props: PostIntroType & { lang: Locale }) {
  const { title, description, thumbnail, date, tags, url, lang } = props;
  const dateObj = new Date(date);
  const postUrl = `/${lang}${url}`;

  const imageUrl = thumbnail?.[blogConfig.imageStorage] ?? thumbnail?.local;
  const showImage = thumbnail && imageUrl;

  return (
    <Link className={styles.link} href={postUrl}>
      <article className={styles.container}>
        {showImage && (
          <div>
            <Image
              className={styles.image}
              style={{ transform: 'translate3d(0, 0, 0)' }}
              src={imageUrl}
              unoptimized={imageUrl.startsWith(vercelOGURL) || imageUrl.startsWith(vercelEnOGURL)}
              alt={`${title} 사진`}
              width={200}
              height={200}
              sizes="200px"
              placeholder={'blurURL' in thumbnail ? 'blur' : 'empty'}
              blurDataURL={thumbnail.blurURL}
            />
          </div>
        )}
        <section className={styles.introContainer}>
          <Heading as="h3" size="sm">
            {title}
          </Heading>
          <Text as="p" size="md">
            {description}
          </Text>
          {tags?.length
            ? (
                <Flex direction="row" gap="sm">
                  {tags.map((tag) => (
                    <Badge key={tag} as="span" size="sm" radius="sm">
                      {tag}
                    </Badge>
                  ))}
                </Flex>
              )
            : null}
          <time dateTime={toISODate(dateObj)}>{formatDate(dateObj, lang)}</time>
        </section>
      </article>
    </Link>
  );
}

export default PostCard;
