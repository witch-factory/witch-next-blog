import Link from 'next/link';

import { CardProps } from '../card';
import PostList from '@/components/templates/postList';


import styles from './styles.module.css';

export interface CategoryProps{
  title: string;
  url: string;
  items: CardProps[];
}

function RecentPosts(props: CategoryProps) {
  const { title, url, items } = props;
  return (
    <section className={styles.container}>
      <Link href={url} className={styles.title}>
        <h2 className='title-md my-2'>{title}</h2>
      </Link>
      <PostList postList={items} direction='row' />
    </section>
  );
}

export default RecentPosts;