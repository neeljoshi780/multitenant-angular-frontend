/**
 * PageResponse<T>
 *
 * Generic structure for paginated API responses.
 * Used for handling pageable data from backend.
 *
 * @template T Type of elements contained in the page.
 */
export interface PageResponse<T> {

  content: T[];

  pageNumber: number;

  pageSize: number;

  totalElements: number;

  totalPages: number;

  hasNext: boolean;

  hasPrevious: boolean;

}