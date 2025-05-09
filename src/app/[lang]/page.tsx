import Link from 'next/link';

import { enPostTags, postTags } from '#site/content';
import Flex from '@/containers/flex';
import Profile from '@/modules/profile';
import TagGroup from '@/modules/tagGroup';
import { themeColor } from '@/styles/theme.css';
import { i18n, Locale } from '@/types/i18n';
import Heading from '@/ui/heading';
import PostList from '@/ui/postList';
import { getRecentPosts, getRecentTranslations } from '@/utils/content/postMetadata';

// cache revalidate in 1 day, 24 * 60 * 60 seconds
export const revalidate = 86400;

type Props = {
  params: Promise<{ lang: Locale }>,
};

const titles = {
  ko: {
    recentPosts: '최근에 작성한 글',
    recentTranslations: '최근 번역',
  },
  en: {
    recentPosts: 'Recent Posts',
    recentTranslations: 'Recent Translations',
  },
} as const satisfies Record<Locale, object>;

const tagsMap = {
  ko: postTags,
  en: enPostTags,
};

async function Home({ params }: Props) {
  const { lang } = await params;

  const recentPosts = getRecentPosts(lang);
  const recentTranslations = getRecentTranslations();

  // const totalViews = await redis.get<number>(['pageviews', 'projects', totalViewSlug].join(':')) ?? 0;

  return (
    <Flex direction="column" gap="xl">
      <Profile lang={lang} />
      <TagGroup selectedTagSlug="all" title={titles[lang].recentPosts} tags={tagsMap[lang]} />
      <PostList lang={lang} posts={recentPosts} direction="row" />

      <div>
        <Link href="/translations/all">
          <Heading as="h2" size="md">
            {titles[lang].recentTranslations}
          </Heading>
        </Link>
        <hr style={{
          border: 'none',
          width: '100%',
          height: '1px',
          backgroundColor: themeColor.headerBorderColor,
          margin: '1rem 0',
        }}
        />
        <PostList lang={lang} posts={recentTranslations} direction="row" />
      </div>
    </Flex>
  );
}

export default Home;

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({
    lang,
  }));
}
