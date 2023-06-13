import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { searchIcon, searchIconDark, searchIconPink } from '@/utils/iconsURL';

import styles from './styles.module.css';

const searchIconMap: {[key: string]: string}={
  'light':searchIcon,
  'dark':searchIconDark,
  'pink':searchIconPink,
};

function searchIconSrc(isDark: boolean, isPink: boolean) {
  if (isDark) {
    return searchIconMap['dark'];
  }
  else if (isPink) {
    return searchIconMap['pink'];
  }
  else {
    return searchIconMap['light'];
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
        height={32} 
        priority
      />
    </Link> 
  );
};

export default Search;