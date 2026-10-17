---
id: "SPEC-001"
title: "Cap pageSize on GET /orders and reject values below 1"
slug: "cap-orders-page-size"
schemaVersion: "1.7.0"
specificationContract: "professional-specification@1.0.0"
status: "shaped"
priority: "P2"
created: "2026-10-17"
updated: "2026-10-17"
ui_files: []
tech_dependencies: []
review_specialists:
  - "api-contract-reviewer"
---

# SPEC-001: Cap pageSize on GET /orders and reject values below 1

## Context & Goal

`GET /orders` passes the `pageSize` query parameter straight into `paginate()` (`src/server.ts:24`, `src/pagination.ts:13`) with no bounds. A caller can request `pageSize=1000000` and receive the whole store in one response, and `pageSize=0` or a negative value produces a nonsensical page (`totalPages` becomes `Infinity` or negative) with status 200. `page` is already validated as a positive integer and rejected with 400 (`src/pagination.ts:14`).

Goal: bound every page to at most 100 orders and reject a `pageSize` below 1 with 400, using the same validation path `page` already uses.

## Audience

**Primary:** API clients that list orders through `GET /orders`.

**Affected:**
- Operators who set `defaultPageSize` in `config.local.json`
- Maintainers of `src/pagination.ts` and its callers

## Outcome & Measurement

**Statement:** No `GET /orders` response contains more than 100 items, and an invalid `pageSize` gets a 400 instead of a malformed 200.

**Measure:** Integration tests in `test/server.test.ts` and unit tests in `test/pagination.test.ts`.

**Target:** All acceptance criteria below pass under `npm test`; `npm run typecheck` is clean.

**Timeframe:** Next release of order-service (currently 0.3.0).

## Functional Requirements

- `src/pagination.ts` exports `MAX_PAGE_SIZE = 100`.
- When the effective `pageSize` is an integer greater than 100, `GET /orders` responds 200, returns at most 100 items, and reports `"pageSize": 100` in the body; `totalPages` and `hasNext` are computed from 100.
- When `pageSize` is an integer below 1, `GET /orders` responds 400 with body `{ "error": "pageSize must be a positive integer, got <value>" }`.
- When `pageSize` is not an integer (for example `abc`, `2.5`, or empty `pageSize=`), `GET /orders` responds 400 with the same error shape.
- An omitted `pageSize` keeps using the configured `defaultPageSize`; that default is subject to the same cap.
- The bound and the validation are enforced inside `paginate()`, which throws `RangeError`; the existing `RangeError` → 400 mapping in `src/server.ts` is reused.

## Business Rules

- Above the maximum, the request is clamped, not rejected: 101 and 10000 both behave as 100.
- Below the minimum, or non-integer, the request is rejected: no clamping up to 1.
- The cap is fixed in code at 100. It is not configurable.

## Constraints

- No new dependencies; Node ≥ 22.6, TypeScript sources run directly.
- The response shape of `Page<T>` (`src/pagination.ts:1`) does not change.
- Error message wording mirrors the existing `page` message so clients see one convention.

## Evidence Expectations

- `npm test` passes with new cases in `test/pagination.test.ts` and `test/server.test.ts`.
- `npm run typecheck` passes.
- Manual check: `curl 'localhost:3000/orders?pageSize=500'` returns `"pageSize":100`; `curl -i 'localhost:3000/orders?pageSize=0'` returns `400`.

## Failure Modes

- A client currently relying on `pageSize > 100` to fetch everything now receives only 100 items; it must follow `hasNext`. The body's `pageSize: 100` signals the clamp.
- A client sending `pageSize=0` or a non-numeric value that previously got 200 now gets 400.
- An operator with `defaultPageSize > 100` in `config.local.json` silently gets 100 per page; with `defaultPageSize < 1` every un-parameterised `GET /orders` returns 400.

## Rollback

Revert the change to `src/pagination.ts` and its tests. No data, schema or configuration migration is involved.

## Scope Boundaries

### In Scope

- `paginate()` validation and clamping of `pageSize` in `src/pagination.ts`.
- Tests in `test/pagination.test.ts` and `test/server.test.ts`.
- README endpoint row for `GET /orders` documenting the 1–100 range.

### Out of Scope

- The `totalPages` rounding defect in `paginate()` (tracked as BL-004).
- Validating `defaultPageSize` when `loadConfig()` reads `config.local.json`.
- An upper bound on `page`.
- Making the maximum configurable.
- `GET /orders/export.csv`, which is not paginated.

## Acceptance Criteria

- **AC-001:** `GET /orders?pageSize=101` responds 200 with `pageSize: 100` and at most 100 items.
- **AC-002:** `GET /orders?pageSize=100` responds 200 with `pageSize: 100`.
- **AC-003:** `GET /orders?pageSize=1` responds 200 with `pageSize: 1` and at most 1 item.
- **AC-004:** `GET /orders?pageSize=0` responds 400 with `{ "error": "pageSize must be a positive integer, got 0" }`.
- **AC-005:** `GET /orders?pageSize=-5` responds 400.
- **AC-006:** `GET /orders?pageSize=abc` and `GET /orders?pageSize=2.5` each respond 400.
- **AC-007:** `GET /orders` with no `pageSize` still uses the configured default (existing test stays green).
- **AC-008:** `paginate(items, 1, 500).pageSize === 100` and `paginate(items, 1, 0)` throws `RangeError`, covered in `test/pagination.test.ts`.
- **AC-009:** `src/pagination.ts` exports `MAX_PAGE_SIZE` with value `100`.

## Declared Risk Specialists

- `api-contract-reviewer`: the change alters observable responses of a public endpoint (clamping and new 400 cases).

## Notes for Decomposition

- One backend task is enough: add `MAX_PAGE_SIZE`, validate then clamp `pageSize` at the top of `paginate()` next to the `page` check, add tests, update the README row.
- Validate before clamping so `NaN` and non-integers are rejected rather than clamped.
- The server test store has 3 orders and `defaultPageSize` 2; AC-001/AC-002 are best asserted on the reported `pageSize`, with item count covered by the unit test over a larger array.
