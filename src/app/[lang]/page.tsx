import Link from 'next/link';

import { enPostTags, postTags } from '#site/content';
import * as pageStyles from '@/app/[lang]/styles.css';
import { blogLocalConfig } from '@/config/blogConfig';
import { i18n, Locale } from '@/constants/i18n';
import Flex from '@/containers/flex';
import PostCard from '@/modules/postCard';
import Profile from '@/modules/profile';
import TagGroup from '@/modules/tagGroup';
import { themeColor } from '@/styles/theme.css';
import Heading from '@/ui/heading';
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': blogLocalConfig[lang].title,
    'url': blogLocalConfig[lang].url,
    'description': blogLocalConfig[lang].description,
    'publisher': {
      '@type': 'Person',
      'name': blogLocalConfig[lang].name,
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': blogLocalConfig[lang].url,
    },
    'blogPost': recentPosts.slice(0, 3).map((post) => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'description': post.description,
      'url': blogLocalConfig[lang].url + post.url,
      'datePublished': post.date,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Flex direction="column" gap="xl">
        <Profile lang={lang} />
        <TagGroup selectedTagSlug="all" title={titles[lang].recentPosts} tags={tagsMap[lang]} />
        <ul className={pageStyles.postGallery}>
          {recentPosts.map((post) => (
            <li key={post.url}>
              <PostCard lang={lang} {...post} />
            </li>
          ))}
        </ul>

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
          <ul className={pageStyles.postGallery}>
            {recentTranslations.map((post) => (
              <li key={post.url}>
                <PostCard lang={lang} {...post} />
              </li>
            ))}
          </ul>
        </div>
      </Flex>
    </>
  );
}

export default Home;

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({
    lang,
  }));
}
