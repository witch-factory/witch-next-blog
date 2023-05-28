import Link from 'next/link';

import styles from './styles.module.css';

interface PropsItem{
  title: string;
  url: string;
}

function Dropdown({navList, isMenuOpen}: {navList: PropsItem[], isMenuOpen: boolean}) {
  return (
    <ul className={`${styles.list} ${isMenuOpen?styles['list--active']:styles['list--inactive']}`}>
      {navList.map((item) => {
        return (
          <li key={item.title} className={styles.item}>
            <Link
              href={item.url} 
              aria-label={item.title} 
              className={styles.link}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default Dropdown;