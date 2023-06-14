import Card, {CardProps} from '../card';

import styles from './styles.module.css';

function PostList(props: {postList: CardProps[]}) {
  return (
    <ul className={styles.list}>
      {props.postList.map((post: CardProps) =>{
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