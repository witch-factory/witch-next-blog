import Link from 'next/link';

import { PaginationType } from '@/types/components';
import { getPaginationArray, dotts } from '@/utils/getPaginationArray';

import * as styles from './styles.css';

function PageLink({ currentPage, pageNumber, renderPageLink }: {
  currentPage: number,
  pageNumber: number | typeof dotts,
  renderPageLink: (page: number) => string,
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

// 관심사 분리 리팩토링
// https://github.com/radix-ui/primitives/discussions/831
// https://velog.io/@stu442/%EB%A0%88%EA%B3%A0%EB%A1%9C-%EB%B0%B0%EC%9B%8C%EB%B3%B4%EB%8A%94-Compound-Components-Pattern
function Pagination({
  totalItemNumber,
  currentPage,
  renderPageLink,
  perPage = 10,
}: PaginationType) {
  const pageArray = getPaginationArray(totalItemNumber, currentPage, perPage);
  return (
    <div className={styles.container}>
      {pageArray.map((pageNumber) => (
        <PageLink
          key={pageNumber}
          currentPage={currentPage}
          pageNumber={pageNumber}
          renderPageLink={renderPageLink}
        />
      ),
      )}
    </div>
  );
}

export default Pagination;
