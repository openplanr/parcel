# SPRINT-001 refinement · 2026-10-17

Refine only. No sprint artifact was created; `SPRINT-001` is reserved for this note.

## Inputs

- **Capacity:** 10 engineer-days (defaulted: 1 engineer × 10 days)
- **Release cut:** none (no `.release/profile.md`); horizon defaulted to two weeks from 2026-10-17
- **Git revision:** `a4927ae` (main). `slot6/page-size-cap` at `6333377` is 2 commits ahead and carries BL-004..BL-006 and SPEC-001.
- **Previous sprint / Operate cycle:** none
- **Sources:** backlog, spec tasks, git, tests (`npm test` on `6333377`: 23/23 passed)
- **Defaulted:** capacity, horizon, focus (everything), dead items (propose close), mode (refine only)

## Items

| ID | Score | Evidence date | Stale | Blocked by | Effort | Bucket |
| --- | --- | --- | --- | --- | --- | --- |
| BL-004 | 9 | 2026-10-17 | no | none | hours | inProgress |
| T-001 | 8 | 2026-10-17 | no | none | hours | inProgress |
| BL-003 | 6 | 2026-10-17 | no | none | hours | inProgress |
| BL-006 | 5 | 2026-10-17 | no | none | hours | inProgress |
| BL-005 | 3 | 2026-10-17 | no | none | hours | inProgress |
| BL-002 | 1 | 2026-10-17 | no | none | day | planNext |
| BL-001 | 0 | 2026-10-17 | yes | none | hours | closeOrDemote |

## Refuter verdicts

- **BL-001 · evidence:** high-priority bug already fixed by 1b58281 with a test; moved to close (inProgress → closeOrDemote).
- **BL-002 · impact:** nobody is hit this month: data is demo-scale and the store keeps all orders in memory anyway; moved to plan next (inProgress → planNext).

## In progress (1.1 of 10 days)

### PR 1 · pagination: review and merge slot6/page-size-cap · 0.25d

- **T-001** Validate and clamp pageSize in paginate(): implemented in `6333377` with tests passing but not merged to main; status still `pending`.

### PR 2 · pagination and config: ceil totalPages, validate defaultPageSize · 0.5d

- **BL-004** totalPages undercounts: reproduced on `6333377`, `paginate([1,2,3],1,2)` returns `totalPages: 1, hasNext: false`. Sequenced after T-001 because both edit the totalPages line (`src/pagination.ts` main:18, branch:23).
- **BL-005** loadConfig accepts any defaultPageSize (`src/config.ts:21-22`). Operator-only; depends on T-001's `MAX_PAGE_SIZE`.

### PR 3 · orders: reject quantity below 1 · 0.25d

- **BL-003** `create()` checks customer and line count only (`src/orders.ts:42-48`); negative totals reach the CSV export.

### PR 4 · docs: fix README install command · 0.1d

- **BL-006** `npm intsall` at `README.md:12`, on main and on the branch.

## Plan next

- **BL-002** Stream the CSV export: `OrderStore` already holds every order in memory (`src/orders.ts:56`), so streaming only removes one copy. Revisit once orders are persisted.

## Blocked

None.

## Close or demote

- **BL-001** → `closed`. Delivered by commit `1b58281` (2026-10-17 16:48, before the item was filed at 16:53): `src/export.ts:5-7` quotes commas, quotes, CR and LF; `test/export.test.ts:24-27` covers a comma and a quote.
