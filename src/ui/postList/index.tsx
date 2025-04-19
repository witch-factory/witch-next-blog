import PostCard from '@/composites/postCard';
import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';

import * as styles from './styles.css';

function PostList({
  lang,
  postList,
  direction = 'column',
}: {
  lang: Locale,
  postList: PostIntroType[],
  direction?: 'row' | 'column',
}) {
  return (
    <ul className={`${styles.postList} ${direction === 'row' ? styles.row : styles.column}`}>
      {postList.map((post: PostIntroType) => {
        return (
          <li key={post.url}>
            <PostCard lang={lang} {...post} />
          </li>
        );
      })}
    </ul>
  );
}

export default PostList;
