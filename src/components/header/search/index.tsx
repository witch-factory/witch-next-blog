import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { searchIconMap } from '@/utils/iconsURL';
import { getThemeName } from '@/utils/theme';

import styles from './styles.module.css';

const Search = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Link href='/posts' className={styles.search}>
      <Image 
        src={searchIconMap[getThemeName(resolvedTheme)]} 
        alt='Search' 
        width={20} 
        height={20} 
        priority
      />
    </Link> 
  );
};

export default Search;