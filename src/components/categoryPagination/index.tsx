import Card from '../card';

import Pagination from './pagination';
import styles from './styles.module.css';

export interface PostMetaData{
  title: string;
  description: string;
  image?: string;
  date: string;
  tags: string[];
  url: string;
}

interface Props{
  totalItemNumber: number;
  category: string;
  categoryURL: string;
  currentPage: number;
  postList: PostMetaData[];
  perPage: number;
}

function CategoryPagination(props: Props) {
  const {totalItemNumber, category, categoryURL, currentPage, postList, perPage}=props;
  return (
    <>
      <h1 className={styles.title}>
        {`${category} 주제 ${currentPage} 페이지`}
      </h1>
      <Pagination
        totalItemNumber={totalItemNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${categoryURL}/page/${page}`}
        perPage={perPage}
      />
      <ul className={styles.list}>
        {postList.map((post: PostMetaData) =>{
          return (
            <li key={post.url}>
              <Card {...post} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default CategoryPagination;