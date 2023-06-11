import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import styles from './styles.module.css';

const searchIcon: {[key: string]: string}={
  'light':'/icons/icons8-search.svg',
  'dark':'/icons/icons8-search-dark.svg',
  'pink':'/icons/icons8-search-pink.svg',
};

const Search = () => {
  const { theme } = useTheme();

  return (
    <Link href='/posts' className={styles.search}>
      <Image 
        src={searchIcon[theme || 'light']} 
        alt='Search' 
        width={32} 
        height={50} 
        priority
      />
    </Link> 
  );
};

export default Search;