import HomeButton from './homeButton';
import Menu from './menu';
import Search from './search';
import styles from './styles.module.css';
import ThemeChanger from './themeChanger';

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
          <HomeButton />
          <div className={styles.wrapper}>
            <ThemeChanger />
            <Menu navList={navList} />
            <Search />
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;