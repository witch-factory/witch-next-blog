import Card, {CardProps} from '../card';

import Pagination from './pagination';
import styles from './styles.module.css';

interface Props{
  totalItemNumber: number;
  category: string;
  categoryURL: string;
  currentPage: number;
  postList: CardProps[];
  perPage: number;
}

function CategoryPagination(props: Props) {
  const {totalItemNumber, category, categoryURL, currentPage, postList, perPage}=props;
  return (
    <>
      <h2 className={styles.title}>
        {`${category} 주제 ${currentPage} 페이지`}
      </h2>
      <Pagination
        totalItemNumber={totalItemNumber}
        currentPage={currentPage}
        renderPageLink={(page: number) => `${categoryURL}/page/${page}`}
        perPage={perPage}
      />
      <ul className={styles.list}>
        {postList.map((post: CardProps) =>{
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