import HomeButton from './homeButton';
import Menu from './menu';
import styles from './styles.module.css';

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
      <nav className={styles.header__nav}>
        <HomeButton />
        <Menu navList={navList} />
      </nav>
    </header>
  );
}

export default Header;