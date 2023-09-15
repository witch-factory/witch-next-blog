import Link from 'next/link';

import { CardProps } from '../card';
import Title from '@/components/atoms/title';
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
        <Title heading='h2' className='title-md my-2'>{title}</Title>
      </Link>
      <PostList postList={items} direction='row' />
    </section>
  );
}

export default RecentPosts;