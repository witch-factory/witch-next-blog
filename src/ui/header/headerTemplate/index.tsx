import Link from 'next/link';

import BlogSymbol from '@/components/blogSymbol';
import { BlogCategoryType } from '@/types/config';
import SearchIcon from '@/ui/header/searchIcon';

import * as styles from './styles.css';

function MenuItem({ children, title, url }: React.PropsWithChildren<BlogCategoryType>) {
  return (
    <li className={styles.item}>
      <Link
        href={url}
        aria-label={title} 
        className={styles.link}
      >
        {children}
      </Link>
    </li>
  );

}

function Menu({ blogCategoryList }: {blogCategoryList: BlogCategoryType[]}) {
  return (
    <ul className={styles.list} >
      {blogCategoryList.map((item) => {
        return (
          <MenuItem key={item.title} title={item.title} url={item.url} >
            {item.title}
          </MenuItem>
        );
      })}
    </ul>
  );
}

/* themeChange 제대로 안되면 use client 쓰기 */
function HeaderTemplate({
  blogCategoryList, children
}: React.PropsWithChildren<{
  blogCategoryList: BlogCategoryType[];
}>) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <BlogSymbol />
          <div className={styles.wrapper}>
            {children}
            <Menu blogCategoryList={blogCategoryList} />
            <Link href='/posts' prefetch={false} className={styles.search} aria-label='검색 페이지 링크'>
              <SearchIcon />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderTemplate;