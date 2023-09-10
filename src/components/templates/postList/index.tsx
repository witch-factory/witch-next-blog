import Card, { CardProps } from '@/components/organisms/card';

import styles from './styles.module.css';

function PostList({
  postList,
  direction = 'column',
}: {
  postList: CardProps[], 
  direction?: 'row'|'column'
}) {
  return (
    <ul className={`${styles.list} ${styles[direction]}`}>
      {postList.map((post: CardProps) =>{
        return (
          <li key={post.url}>
            <Card {...post} />
          </li>
        );
      })}
    </ul>
  );
}

export default PostList;