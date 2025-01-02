import Link from 'next/link';

import BlogSymbol from '@/components/blogSymbol';
import { BlogCategoryType } from '@/types/config';
import { Language } from '@/types/i18n';
import SearchIcon from '@/ui/header/searchIcon';

import * as styles from './styles.css';

const searchLink = {
  ko: {
    title: '검색 페이지 링크',
    url: '/posts',
  },
  en: {
    title: 'Search Page Link',
    url: '/en/posts',
  },
} as const satisfies Record<Language, { title: string, url: string }>;

function Menu({ blogCategoryList }: { blogCategoryList: BlogCategoryType[] }) {
  return (
    <ul className={styles.list}>
      {blogCategoryList.map((item) => {
        return (
          <li key={item.title} className={styles.item}>
            <Link href={item.url} className={styles.link} aria-label={item.title}>
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* themeChange 제대로 안되면 use client 쓰기 */
function HeaderTemplate({
  lang,
  blogCategoryList, children,
}: React.PropsWithChildren<{
  lang: Language,
  blogCategoryList: BlogCategoryType[],
}>) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <BlogSymbol />
          <div className={styles.wrapper}>
            {children}
            <Menu blogCategoryList={blogCategoryList} />
            <Link href={searchLink[lang].url} prefetch={false} className={styles.search} aria-label={searchLink[lang].title}>
              <SearchIcon />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderTemplate;
