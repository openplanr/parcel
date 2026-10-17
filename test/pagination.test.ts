import { describe, expect, it } from "vitest";
import { paginate } from "../src/pagination.ts";

const ids = Array.from({ length: 40 }, (_, i) => i + 1);

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
});
