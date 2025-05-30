import { Post, Translation } from '#site/content';
import { blogConfig, blogLocalConfig } from '@/config/blogConfig';
import { i18n, Locale } from '@/constants/i18n';
import Flex from '@/containers/flex';
import Giscus from '@/features/giscus';
import ViewReporter from '@/features/viewReporter';
import { TocEntry } from '@/types/components';
import Badge from '@/ui/badge';
import Heading from '@/ui/heading';
import Text from '@/ui/text';
import { formatDate, toISODate } from '@/utils/core/date';

import * as styles from './styles.css';

type Props = {
  lang: Locale,
  post: Post | Translation,
  children: React.ReactNode,
};

function TOC({ nodes }: { nodes: TocEntry[] }) {
  return (
    <ul className={styles.list}>
      {nodes.map((node: TocEntry) => (
        <li key={node.url}>
          <a
            className={styles.link}
            href={node.url}
          >
            {node.title}
          </a>
          {node.items.length > 0 && <TOC nodes={node.items} />}
        </li>
      ))}
    </ul>
  );
}

function PostFrame({
  lang,
  post,
  children,
}: Props) {
  const { title, date } = post;
  const dateObj = new Date(date);
  return (
    <>
      <ViewReporter slug={post.slug} />
      <Flex gap="lg" direction="column">
        <Heading as="h1" size="xl">
          {title}
        </Heading>
        <time className={styles.time} dateTime={toISODate(dateObj)}>
          {formatDate(dateObj, lang)}
        </time>
        {'tags' in post && (
          <Flex gap="sm" direction="row" wrap="wrap">
            {post.tags.map((tag: string) => (
              <Badge key={tag} as="span" size="md" radius="sm">
                {tag}
              </Badge>
            ))}
          </Flex>
        )}
        <section>
          <Text as="span" size="xl" weight="bold">
            {lang === 'ko' ? '목차' : 'Table of Contents'}
          </Text>
          <TOC nodes={post.headingTree} />
        </section>
        {lang !== i18n.defaultLocale && (
          <aside
            className={styles.notice}
            aria-labelledby="translation-notice-title"
            role="note"
          >
            <h3>
              ⚠️ Notice
            </h3>
            <p>
              This article may not be properly translated. If you notice any mistakes or unclear parts, please don&apos;t hesitate to reach out to me in English via my email
              {' '}
              <a
                style={{
                  textDecoration: 'underline',
                }}
                href={`mailto:${blogConfig.email}`}
              >
                {blogConfig.email}
              </a>
              .
            </p>
          </aside>
        )}
      </Flex>
      {children}
      {blogLocalConfig[lang].comment.type === 'giscus' ? <Giscus lang={lang} /> : null}
    </>
  );
}

export default PostFrame;
