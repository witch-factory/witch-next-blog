import Image from 'next/image';
import Link from 'next/link';

import { blogCategory } from '@/config/blogCategory';
import { Locale } from '@/constants/i18n';
import Flex from '@/containers/flex';
import SearchIcon from '@/icons/searchIcon';

import * as styles from './styles.css';

const searchLink = {
  ko: {
    title: '검색 페이지 링크',
    url: '/ko/search',
  },
  en: {
    title: 'Search Page Link',
    url: '/en/search',
  },
} as const satisfies Record<Locale, { title: string, url: string }>;

/* themeChange 제대로 안되면 use client 쓰기 */
/* nav에 ul 없이 링크 넣기 논쟁 https://css-tricks.com/navigation-in-lists-to-be-or-not-to-be/ */
function HeaderTemplate({
  lang,
  children,
}: {
  lang: Locale,
  children: React.ReactNode,
}) {
  const homeURL = `/${lang}`;

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <Link href={homeURL} aria-label="Home" className={styles.linkContainer}>
            <div className={styles.logoContainer}>
              <Image
                className={styles.logo}
                src="/witch-new-hat.svg"
                alt="logo"
                width={50}
                height={50}
                placeholder="empty"
              />
              <h2 className={styles.blogTitle}>
                Witch-Work
              </h2>
            </div>
          </Link>
          <Flex direction="row" gap="none" align="center">
            {children}
            {blogCategory[lang].map((item) => {
              return (
                <Link key={item.title} href={item.url} className={styles.link} aria-label={item.title}>
                  {item.title}
                </Link>
              );
            })}
            <Link href={searchLink[lang].url} prefetch={false} className={styles.search} aria-label={searchLink[lang].title}>
              <SearchIcon />
            </Link>
          </Flex>
        </div>
      </nav>
    </header>
  );
}

export default HeaderTemplate;
