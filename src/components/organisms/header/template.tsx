import Link from 'next/link';

import Icon from '@/components/atoms/icon';
import BlogSymbol from '@/components/molecules/blogSymbol';
import Menu from '@/components/templates/menu';
import { searchIconMap } from '@/utils/iconsURL';

import styles from './styles.module.css';

interface PropsItem{
  title: string;
  url: string;
}
/* themeChange 제대로 안되면 use client 쓰기 */
function HeaderTemplate({
  navList, children
}: React.PropsWithChildren<{
  navList: PropsItem[];
}>) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.container}>
          <BlogSymbol />
          <div className={styles.wrapper}>
            {children}
            <Menu navList={navList} />
            <Link href='/posts' className={styles.search} prefetch={false}>
              <Icon
                iconSrcMap={searchIconMap}
                imageAlt='Search button'
                width={20} 
                height={20}
                priority 
              />
            </Link> 
          </div>
        </div>
      </nav>
    </header>
  );
}

export default HeaderTemplate;