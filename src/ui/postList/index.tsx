import PostCard from '@/modules/postCard';
import { PostIntroType } from '@/types/components';
import { Locale } from '@/types/i18n';

import { postList, PostListVariants } from './styles.css';

type PostListProps = {
  lang: Locale,
  posts: PostIntroType[],
} & PostListVariants;

function PostList({
  lang,
  posts,
  direction,
}: PostListProps) {
  return (
    <ul className={postList({ direction })}>
      {posts.map((post: PostIntroType) => {
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
