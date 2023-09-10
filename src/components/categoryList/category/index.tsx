import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import PostList from '../../postList';
import Title from '../../title';
import { linkIconMap } from '@/utils/iconsURL';
import { getThemeName } from '@/utils/theme';
import { CardProps }  from 'src/components/card';

import styles from './styles.module.css';


export interface CategoryProps{
  title: string;
  url: string;
  items: CardProps[];
}

function Category(props: CategoryProps) {
  const { resolvedTheme } = useTheme();

  return (
    <section className={styles.container}>
      <Link href={props.url} className={styles.title}>
        <Title title={props.title} />
        <Image 
          src={linkIconMap[getThemeName(resolvedTheme)]} 
          alt='Link' 
          width={20} 
          height={20} 
          priority
          className={styles.linkImage}
        />
      </Link>
      <PostList postList={props.items} direction='row' />
    </section>
  );
}

export default Category;