import Link from 'next/link';

import AllPostTagList from '@/components/allPostTagList';
import { Language, locales } from '@/types/i18n';
import PostList from '@/ui/postList';
import Profile from '@/ui/profile';
import { getRecentPosts, getRecentTranslations } from '@/utils/content/postMetadata';

import * as styles from './styles.css';

// cache revalidate in 1 day
export const revalidate = 24 * 60 * 60;

type Props = {
  params: { lang: Language },
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
} as const satisfies Record<Language, object>;

function Home({ params }: Props) {
  const { lang } = params;

  const recentPosts = getRecentPosts(lang);
  const recentTranslations = getRecentTranslations();

  // const totalViews = await redis.get<number>(['pageviews', 'projects', totalViewSlug].join(':')) ?? 0;

  return (
    <>
      <Profile lang={lang} />
      <section className={styles.container}>
        <div>
          <h2 className={styles.title}>{titles[lang].recentPosts}</h2>
          <AllPostTagList selectedTag="all" lang={lang} />
          <PostList postList={recentPosts} direction="row" />
        </div>

        <div>
          <Link href="/translations/all">
            <h2 className={styles.title}>{titles[lang].recentTranslations}</h2>
          </Link>
          <hr className={styles.separator} />
          <PostList postList={recentTranslations} direction="row" />
        </div>

      </section>
    </>
  );
}

export default Home;

export function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}
