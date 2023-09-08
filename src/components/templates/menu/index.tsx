import MenuItem from '@/components/atoms/menuItem';

import styles from './styles.module.css';

interface PropsItem{
  title: string;
  url: string;
}

function Menu({ navList }: {navList: PropsItem[]}) {
  return (
    <ul className={styles.list} >
      {navList.map((item) => {
        return (
          <MenuItem key={item.title} title={item.title} url={item.url} />
        );
      })}
    </ul>
  );
}

export default Menu;