import { describe, expect, it } from "vitest";
import { MAX_PAGE_SIZE, paginate } from "../src/pagination.ts";

const ids = Array.from({ length: 40 }, (_, i) => i + 1);
const many = Array.from({ length: 250 }, (_, i) => i + 1);

describe("paginate", () => {
  it("returns the first page", () => {
    const page = paginate(ids, 1, 10);
    expect(page.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(page.totalItems).toBe(40);
    expect(page.totalPages).toBe(4);
    expect(page.hasNext).toBe(true);
  });

  it("returns the last page with no next page", () => {
    const page = paginate(ids, 4, 10);
    expect(page.items).toEqual([31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
    expect(page.hasNext).toBe(false);
  });

  it("rejects page 0", () => {
    expect(() => paginate(ids, 0, 10)).toThrow(RangeError);
  });

  it("caps page size at 100", () => {
    expect(MAX_PAGE_SIZE).toBe(100);
  });

  it("clamps a page size above the maximum", () => {
    for (const pageSize of [101, 500]) {
      const page = paginate(many, 1, pageSize);
      expect(page.pageSize).toBe(100);
      expect(page.items).toHaveLength(100);
    }
  });

  it("accepts a page size at the maximum", () => {
    const page = paginate(many, 1, 100);
    expect(page.pageSize).toBe(100);
    expect(page.items).toHaveLength(100);
  });

  it("rejects a page size that is not a positive integer", () => {
    for (const pageSize of [0, -5, Number.NaN, 2.5]) {
      expect(() => paginate(ids, 1, pageSize)).toThrow(RangeError);
    }
  });
});
