import Image from 'next/image';
import Link from 'next/link';

import Flex from '@/containers/flex';
import List from '@/containers/list';
import SearchIcon from '@/icons/searchIcon';
import { BlogCategoryType } from '@/types/config';
import { Locale } from '@/types/i18n';

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

function Menu({ blogCategoryList }: { blogCategoryList: BlogCategoryType[] }) {
  return (
    <List direction="row" gap="none">
      {blogCategoryList.map((item) => {
        return (
          <List.Item key={item.title} className={styles.item}>
            <Link href={item.url} className={styles.link} aria-label={item.title}>
              {item.title}
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
}

/* themeChange 제대로 안되면 use client 쓰기 */
function HeaderTemplate({
  lang,
  blogCategoryList, children,
}: React.PropsWithChildren<{
  lang: Locale,
  blogCategoryList: BlogCategoryType[],
}>) {
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
              <h1 className={styles.blogTitle}>
                Witch-Work
              </h1>
            </div>
          </Link>
          <Flex direction="row" gap="none" align="center">
            {children}
            <Menu blogCategoryList={blogCategoryList} />
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
