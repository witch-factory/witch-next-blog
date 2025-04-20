import Link from 'next/link';

import Flex from '@/containers/flex';

import * as styles from './styles.css';

type RootProps = {
  totalItemNumber: number,
  currentPage: number,
  renderPageLink: (page: number) => string,
  perPage: number,
};

type ItemProps = {
  page: number,
  isActive: boolean,
  href: string,
};

function Ellipsis() {
  return <span className={styles.dotts}>{DOTS}</span>;
}

function Item({ page, isActive, href }: ItemProps) {
  return (
    <Link href={href} className={isActive ? styles.selected : styles.item}>
      {page}
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
}: RootProps) {
  const pageArray = getPaginationArray(totalItemNumber, currentPage, perPage);
  return (
    <Flex direction="row" justify="center" align="center">
      {pageArray.map((pageNumber) => {
        if (pageNumber === DOTS) {
          return <Ellipsis key={pageNumber} />;
        }
        return (
          <Item
            key={pageNumber}
            page={pageNumber}
            isActive={pageNumber === currentPage}
            href={renderPageLink(pageNumber)}
          />
        );
      },
      )}
    </Flex>
  );
}

export default Pagination;

function getPages(length: number, start = 1): number[] {
  return Array.from({ length }, (_, i) => i + start);
}

const DOTS = '...';

function getPaginationArray(
  totalItems: number,
  currentPage: number,
  perPage: number,
): (number | typeof DOTS)[] {
  const totalPages = Math.ceil(totalItems / perPage);

  if (totalPages <= 7) {
    return getPages(totalPages);
  }
  if (currentPage <= 4) {
    return [...getPages(5), DOTS, totalPages - 1, totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, DOTS, ...getPages(6, totalPages - 5)];
  }

  return [1, DOTS, ...getPages(5, currentPage - 2), DOTS, totalPages];
}
