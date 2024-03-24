import Link from 'next/link';

import { PaginationType } from '@/types/components';
import { getPaginationArray, dotts } from '@/utils/getPaginationArray';

import styles from './styles.module.css';

function PageLink({ currentPage, pageNumber, renderPageLink }: {
  currentPage: number,
  pageNumber: number | typeof dotts,
  renderPageLink: (page: number) => string
}) {
  if (pageNumber === dotts) {
    return <span className={styles.dotts}>{pageNumber}</span>;
  }
  return (
    <Link href={renderPageLink(pageNumber)} className={currentPage === pageNumber ? styles.selected : styles.item}>
      {pageNumber}
    </Link>
  );
}

function Pagination({
  totalItemNumber,
  currentPage,
  renderPageLink,
  perPage = 10,
}: PaginationType) {
  const pageArray = getPaginationArray(totalItemNumber, currentPage, perPage);
  return (
    <div className={styles.container}>
      {pageArray.map((pageNumber) =>
        <PageLink
          key={pageNumber}
          currentPage={currentPage}
          pageNumber={pageNumber}
          renderPageLink={renderPageLink}
        />
      )}
    </div>
  );
}

export default Pagination;