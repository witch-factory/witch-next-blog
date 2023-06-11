import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import styles from './styles.module.css';

const searchIcon: {[key: string]: string}={
  'light':'/icons/icons8-search.svg',
  'dark':'/icons/icons8-search-dark.svg',
  'pink':'/icons/icons8-search-pink.svg',
};

function searchIconSrc(isDark: boolean, isPink: boolean) {
  if (isDark) {
    return searchIcon['dark'];
  }
  else if (isPink) {
    return searchIcon['pink'];
  }
  else {
    return searchIcon['light'];
  }
}

const Search = () => {
  const {resolvedTheme} = useTheme();

  const isDark = resolvedTheme === 'dark';
  const isPink = resolvedTheme === 'pink';

  return (
    <Link href='/posts' className={styles.search}>
      <Image 
        src={searchIconSrc(isDark, isPink)} 
        alt='Search' 
        width={32} 
        height={50} 
        priority
      />
    </Link> 
  );
};

export default Search;