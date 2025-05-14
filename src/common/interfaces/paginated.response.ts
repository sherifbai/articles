interface PaginatedResponse<T> {
  data: T[];
  totalPage: number;
  totalDocs: number;
}
