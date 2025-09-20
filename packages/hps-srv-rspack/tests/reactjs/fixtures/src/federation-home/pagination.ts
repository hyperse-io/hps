export interface IPagingResult<T> {
  total: number;
  rows: T[];
}

export const pagingResponseHandel = <T>(
  pagingData: IPagingResult<T>
): IPagingResult<T> => {
  return {
    rows: pagingData.rows ? pagingData.rows : [],
    total: pagingData.total,
  };
};
