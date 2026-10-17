export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
}

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

/** Returns one 1-based page of `items`; a `pageSize` above `MAX_PAGE_SIZE` is clamped to it. */
export function paginate<T>(items: readonly T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Page<T> {
  if (!Number.isInteger(page) || page < 1) {
    throw new RangeError(`page must be a positive integer, got ${page}`);
  }
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError(`pageSize must be a positive integer, got ${pageSize}`);
  }
  const size = Math.min(pageSize, MAX_PAGE_SIZE);
  const start = (page - 1) * size;
  const totalPages = Math.floor(items.length / size);
  return {
    items: items.slice(start, start + size),
    page,
    pageSize: size,
    totalItems: items.length,
    totalPages,
    hasNext: page < totalPages,
  };
}
