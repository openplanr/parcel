---
id: "T-001"
title: "Validate and clamp pageSize in paginate()"
storyId: "US-001"
specId: "SPEC-001"
slug: "validate-and-clamp-page-size"
schemaVersion: "1.7.0"
type: "Tech"
agent: "backend"
status: "pending"
created: "2026-10-17"
updated: "2026-10-17"
rationale: "One coherent backend change: the bound and validation live in paginate() and reach HTTP through the existing RangeError → 400 mapping, so unit and integration tests verify it together."
dependsOn: []
preserve:
  - "src/server.ts"
  - "src/config.ts"
  - "src/export.ts"
reviewRisks:
  - "api-contract"
browserSurfaces: []
acceptanceRefs:
  - "AC-001"
  - "AC-002"
  - "AC-003"
  - "AC-004"
  - "AC-005"
  - "AC-006"
  - "AC-007"
  - "AC-008"
  - "AC-009"
---

# T-001: Validate and clamp pageSize in paginate()

## Objective

Make `paginate()` reject a `pageSize` that is not an integer ≥ 1 with `RangeError`, and clamp any larger value to `MAX_PAGE_SIZE = 100`, so `GET /orders` returns 400 for invalid input and never more than 100 items.

## Files

### Create

None.

### Modify

- `src/pagination.ts` — export `MAX_PAGE_SIZE = 100`; validate then clamp `pageSize` next to the existing `page` check (`src/pagination.ts:14`).
- `test/pagination.test.ts` — unit cases for clamp, boundary, and rejection.
- `test/server.test.ts` — integration cases for AC-001 – AC-007.
- `README.md` — `GET /orders` row (`README.md:23`) documents `pageSize` range 1–100, values above 100 clamped.

### Preserve (do not touch)

- `src/server.ts` — the `RangeError` → 400 mapping (`src/server.ts:27-31`) is reused as is.
- `src/config.ts` — `defaultPageSize` validation is out of scope.
- `src/export.ts` and `GET /orders/export.csv` — not paginated.
- The `totalPages` computation (`src/pagination.ts:18`) — rounding defect is BL-004, not this task.
- The `Page<T>` interface shape (`src/pagination.ts:1-8`).

## Technical Spec

1. Add `export const MAX_PAGE_SIZE = 100;` beside `DEFAULT_PAGE_SIZE`.
2. At the top of `paginate()`, after the `page` check, add:
   - `if (!Number.isInteger(pageSize) || pageSize < 1) throw new RangeError(\`pageSize must be a positive integer, got ${pageSize}\`);`
   - Validate **before** clamping so `NaN` (`abc`) and `2.5` are rejected, not clamped.
3. Compute an effective size `Math.min(pageSize, MAX_PAGE_SIZE)` and use it for `start`, `slice`, `totalPages`, and the returned `pageSize`.
4. Server input: `Number("abc")` → `NaN`, `Number("2.5")` → `2.5`, `Number("")` (`pageSize=`) → `0`; all reach the new check and map to 400 via the existing catch. An omitted `pageSize` falls back to `defaultPageSize`, which is subject to the same rule.
5. Error wording mirrors the `page` message exactly (`<name> must be a positive integer, got <value>`).

## Test Requirements

Unit — `test/pagination.test.ts` (use an array of more than 100 items for clamp cases):

- **AC-008:** `paginate(items, 1, 500).pageSize === 100` and `.items.length === 100`; `paginate(items, 1, 0)` throws `RangeError`.
- **AC-009:** `import { MAX_PAGE_SIZE }` and assert it equals `100`.
- **AC-001 (item bound):** `paginate(items, 1, 101).items.length === 100` and `.pageSize === 100`.
- **AC-006 (unit):** `paginate(items, 1, NaN)` and `paginate(items, 1, 2.5)` throw `RangeError`.

Integration — `test/server.test.ts` (store of 3 orders, `defaultPageSize` 2):

- **AC-001:** `GET /orders?pageSize=101` → status 200, `body.pageSize === 100`, `body.items.length <= 100`.
- **AC-002:** `GET /orders?pageSize=100` → status 200, `body.pageSize === 100`.
- **AC-003:** `GET /orders?pageSize=1` → status 200, `body.pageSize === 1`, `body.items.length === 1`.
- **AC-004:** `GET /orders?pageSize=0` → status 400, body deep-equals `{ error: "pageSize must be a positive integer, got 0" }`.
- **AC-005:** `GET /orders?pageSize=-5` → status 400.
- **AC-006:** `GET /orders?pageSize=abc` and `GET /orders?pageSize=2.5` → each status 400.
- **AC-007:** existing "returns the first page using the default page size" test passes unchanged (2 items).

## Definition of Done

- `npm test` passes, including the new cases above.
- `npm run typecheck` is clean.
- Manual: `curl 'localhost:3000/orders?pageSize=500'` shows `"pageSize":100`; `curl -i 'localhost:3000/orders?pageSize=0'` shows `400`.
- README `GET /orders` row states the 1–100 range and the clamp.
- No change to `src/server.ts`, `Page<T>`, or `totalPages` rounding.
