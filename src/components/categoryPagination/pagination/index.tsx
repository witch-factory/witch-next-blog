import Link from 'next/link';

export interface PaginationProps {
  totalItemNumber: number;
  currentPage: number;
  renderPageLink: (page: number) => string;
  perPage: number;
}

export const dotts='...';

// inc부터 시작해서 length만큼의 숫자 배열을 반환하는 함수
function getPages(length: number, inc: number = 1) {
  return Array.from({ length }, (_, i) => i + inc);
}

function getPaginationArray(
  totalItemNumber: number,
  currentPage: number,
  perPage: number
) {
  const totalPages=(totalItemNumber/perPage) + (totalItemNumber%perPage ? 1 : 0);

  if (totalPages<=5) {
    return getPages(totalPages);
  }
  if (currentPage<=3) {
    return [1, 2, 3, 4, dotts, totalPages];
  }
  if (currentPage>=totalPages-2) {
    return [1, dotts, ...getPages(4, totalPages - 3)];
  }

  return [1, 
    dotts, 
    currentPage - 1, 
    currentPage, 
    currentPage + 1, 
    dotts, 
    totalPages
  ];
}

function Pagination({
  totalItemNumber,
  currentPage,
  renderPageLink,
  perPage = 10,
}: PaginationProps) {
  const pageArray=getPaginationArray(totalItemNumber, currentPage, perPage);
  return (
    <div>
      {pageArray.map((pageNumber, i) =>
        pageNumber === dotts ? (
          <span
            key={i}
          >
            {pageNumber}
          </span>
        ) : (
          <Link
            key={i}
            href={renderPageLink(pageNumber as number)}
            className={`${
              pageNumber === currentPage ? 'text-success-dark' : 'text-black'
            } px-4 py-2 mx-1 rounded-full text-sm font-semibold no-underline`}
          >
            {pageNumber}
          </Link>
        )
      )}
    </div>
  );
}

export default Pagination;