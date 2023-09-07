import Dropdown from './dropdown';
import styles from './styles.module.css';

interface PropsItem{
  title: string;
  url: string;
}

function Menu({ navList }: {navList: PropsItem[]}) {
  return (
    <div className={styles.container}>
      <Dropdown navList={navList} />
    </div>
  );
}

export default Menu;