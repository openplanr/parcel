---
id: "US-001"
title: "Bound GET /orders pageSize to 1–100"
specId: "SPEC-001"
slug: "bound-orders-page-size"
schemaVersion: "1.7.0"
status: "planned"
created: "2026-10-17"
updated: "2026-10-17"
acceptanceCriteria:
  - id: "AC-001"
    text: "GET /orders?pageSize=101 responds 200 with pageSize: 100 and at most 100 items."
  - id: "AC-002"
    text: "GET /orders?pageSize=100 responds 200 with pageSize: 100."
  - id: "AC-003"
    text: "GET /orders?pageSize=1 responds 200 with pageSize: 1 and at most 1 item."
  - id: "AC-004"
    text: "GET /orders?pageSize=0 responds 400 with { \"error\": \"pageSize must be a positive integer, got 0\" }."
  - id: "AC-005"
    text: "GET /orders?pageSize=-5 responds 400."
  - id: "AC-006"
    text: "GET /orders?pageSize=abc and GET /orders?pageSize=2.5 each respond 400."
  - id: "AC-007"
    text: "GET /orders with no pageSize still uses the configured default."
  - id: "AC-008"
    text: "paginate(items, 1, 500).pageSize === 100 and paginate(items, 1, 0) throws RangeError."
  - id: "AC-009"
    text: "src/pagination.ts exports MAX_PAGE_SIZE with value 100."
---

# US-001: Bound GET /orders pageSize to 1–100

## User Story

**As an** API client listing orders through `GET /orders`,
**I want** `pageSize` clamped to at most 100 and rejected below 1 or when not an integer,
**so that** no response returns the whole store and invalid input gets a 400 instead of a malformed 200.

## Scope

- Validate then clamp `pageSize` inside `paginate()` in `src/pagination.ts`; export `MAX_PAGE_SIZE = 100`.
- Reuse the existing `RangeError` → 400 mapping in `src/server.ts` (no server change expected).
- Unit tests in `test/pagination.test.ts`, integration tests in `test/server.test.ts`.
- README `GET /orders` row documents the 1–100 range.

Out of scope (per SPEC-001): the `totalPages` rounding defect (BL-004), validating `defaultPageSize` in `loadConfig()`, an upper bound on `page`, a configurable maximum, and `GET /orders/export.csv`.

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

## Task Breakdown

- [T-001](../tasks/T-001-validate-and-clamp-page-size.md) — Tech, backend: validate and clamp `pageSize` in `paginate()`, tests, README row. Covers AC-001 – AC-009.

## Dependencies

None.

## Notes

- Observable contract change on a public endpoint: clients sending `pageSize > 100` now get 100 items and must follow `hasNext`; `pageSize=0` or non-numeric now gets 400. Declared reviewer: `api-contract-reviewer`.
- Gherkin scenarios: [US-001-gherkin.feature](US-001-gherkin.feature).
