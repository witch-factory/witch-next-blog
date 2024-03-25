import { PostIntroType } from '@/types/components';
import PostCard from '@/ui/postList/postCard';

import styles from './styles.module.css';

function PostList({
  postList,
  direction = 'column',
}: {
  postList: PostIntroType[], 
  direction?: 'row'|'column'
}) {
  return (
    <ul className={`${styles.list} ${styles[direction]}`}>
      {postList.map((post: PostIntroType) =>{
        return (
          <li key={post.url}>
            <PostCard {...post} />
          </li>
        );
      })}
    </ul>
  );
}

export default PostList;