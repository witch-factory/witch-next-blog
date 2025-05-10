export const sliceByPage = <T>(data: T[], page: number, itemsPerPage: number) =>
  data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
