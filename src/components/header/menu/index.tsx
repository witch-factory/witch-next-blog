
import { useState } from 'react';

import Dropdown from './dropdown';
import styles from './styles.module.css';
import Toggler from './toggler';


interface PropsItem{
  title: string;
  url: string;
}


function Menu({navList}: {navList: PropsItem[]}) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <Toggler isMenuOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
      <Dropdown navList={navList} isMenuOpen={isMenuOpen} />
    </div>
  );
}

export default Menu;