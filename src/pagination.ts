export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}

export const DEFAULT_PAGE_SIZE = 20;

/** Returns one 1-based page of `items`. */
export function paginate<T>(items: readonly T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Page<T> {
  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError(`page must be a positive integer, got ${page}`);
  }
  const start = (page - 1) * pageSize;
  const totalPages = Math.floor(items.length / pageSize);
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    totalItems: items.length,
    totalPages,
    hasNext: page < totalPages,
  };
}
