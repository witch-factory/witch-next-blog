'use client';

import Link from 'next/link';

import Icon from '@/components/atoms/icon';
import BlogSymbol from '@/components/molecules/blogSymbol';
import ThemeChanger from '@/components/molecules/themeChanger';
import Menu from '@/components/templates/menu';
import { searchIconMap } from '@/utils/iconsURL';

import styles from './styles.module.css';

interface PropsItem{
  title: string;
  url: string;
}
/* themeChange 제대로 안되면 use client 쓰기 */
function Header({
  navList
}: {
  navList: PropsItem[];
}) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <BlogSymbol />
          <div className={styles.wrapper}>
            <ThemeChanger />
            <Menu navList={navList} />
            <Link href='/posts' className={styles.search}>
              <Icon iconSrcMap={searchIconMap} imageAlt='Search' priority />
            </Link> 
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;