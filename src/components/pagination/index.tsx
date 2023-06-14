import Link from 'next/link';

import getPaginationArray, {dotts} from '@/utils/getPaginationArray';

import styles from './styles.module.css';

export interface PaginationProps {
  totalItemNumber: number;
  currentPage: number;
  renderPageLink: (page: number) => string;
  perPage: number;
}

function Pagination({
  totalItemNumber,
  currentPage,
  renderPageLink,
  perPage = 10,
}: PaginationProps) {
  const pageArray=getPaginationArray(totalItemNumber, currentPage, perPage);
  return (
    <div className={styles.container}>
      {pageArray.map((pageNumber, i) =>
        pageNumber === dotts ? (
          <span key={i} className={styles.dotts}>
            {pageNumber}
          </span>
        ) : (
          <Link
            key={i}
            href={renderPageLink(pageNumber as number)}
            className={currentPage === pageNumber ? styles.selected : styles.item}
          >
            {pageNumber}
          </Link>
        )
      )}
    </div>
  );
}

export default Pagination;