import { PostIntroType } from '@/types/components';
import PostCard from '@/ui/postList/postCard';

import * as styles from './styles.css';

function PostList({
  postList,
  direction = 'column',
}: {
  postList: PostIntroType[], 
  direction?: 'row'|'column'
}) {
  return (
    <ul className={`${styles.postList} ${direction === 'row' ? styles.row : styles.column}`}>
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