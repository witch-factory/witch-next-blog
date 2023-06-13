import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { getThemeName } from '@/utils/getThemeName';
import { searchIconMap } from '@/utils/iconsURL';

import styles from './styles.module.css';

const Search = () => {
  const {resolvedTheme} = useTheme();

  return (
    <Link href='/posts' className={styles.search}>
      <Image 
        src={searchIconMap[getThemeName(resolvedTheme)]} 
        alt='Search' 
        width={32} 
        height={32} 
        priority
      />
    </Link> 
  );
};

export default Search;