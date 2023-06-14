// inc부터 시작해서 length만큼의 숫자 배열을 반환하는 함수
function getPages(length: number, inc: number = 1) {
  return Array.from({ length }, (_, i) => i + inc);
}

export const dotts='...' as const;

function getPaginationArray(
  totalItemNumber: number,
  currentPage: number,
  perPage: number
): Array<number | typeof dotts> {
  const totalPages=parseInt((totalItemNumber/perPage).toString()) + (totalItemNumber%perPage?1:0);
  if (totalPages<=7) {
    return getPages(totalPages);
  }
  if (currentPage<=4) {
    return [1, 2, 3, 4, 5, dotts, totalPages-1 ,totalPages];
  }
  if (currentPage>=totalPages-3) {
    return [1, dotts, ...getPages(6, totalPages - 5)];
  }

  return [1, 
    dotts,
    ...getPages(5, currentPage - 2),
    dotts, 
    totalPages
  ];
}

export default getPaginationArray;