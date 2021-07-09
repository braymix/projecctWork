export interface PageableDto<T> {
    totalCount: number;
    resultsPerPage: number;
    pages: number;
    currentPage: number;
    data: T;
}