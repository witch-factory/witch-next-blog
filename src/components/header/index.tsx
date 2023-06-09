import HomeButton from './homeButton';
import Menu from './menu';
import styles from './styles.module.css';
import ThemeChanger from './themeChanger';


interface PropsItem{
  title: string;
  url: string;
}

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
          </div>

        </div>
      </nav>
    </header>
  );
}

export default Header;