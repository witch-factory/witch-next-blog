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
        <div className={styles.container}>
          <HomeButton />
          <Menu navList={navList} />
        </div>
      </nav>
    </header>
  );
}

export default Header;