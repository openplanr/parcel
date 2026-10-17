# SPRINT-001 refinement · 2026-10-17

Refine-only run. No sprint selection was made; the sprint body is unchanged.

## Inputs

- **Capacity:** 10 engineer-days (default: 1 engineer × 10 days)
- **Release cut:** none (no `.release/profile.md`)
- **Git revision:** `a4927ae` (main)
- **Previous sprint:** none
- **Operate cycle:** none
- **Sources:** backlog, git, code, tests
- **Defaulted:** capacity, horizon, focus, dead-item handling
- **Notes:** openplanr CLI calls were not approved in this session, so these files were written by hand and not validated by the CLI. No quick tasks or spec tasks exist. No tracker connected.

## Items

| ID | Score | Evidence date | Stale? | Blocked by | Effort | Bucket |
| --- | --- | --- | --- | --- | --- | --- |
| BL-003 | 6 | 2026-10-17 | no | — | hours | planNext |
| BL-002 | 2 | 2026-10-17 | no | — | day | planNext |
| BL-001 | 0 | 2026-10-17 | yes | — | hours | closeOrDemote |

## Refuter verdicts

None. No item was placed in progress, so the lenses had no picks to refute.

## In progress

None (refine-only).

## Plan next

- **BL-003** Reject zero or negative quantities when creating an order · hours. Real: `src/orders.ts:42-58` validates only customer and line count. Highest-scoring open item and the first pick when a sprint is selected. Consider non-integer quantities in the same check.
- **BL-002** Stream the CSV export instead of building it in memory · day. Real: `src/export.ts:14-24`, `src/server.ts:37-43`. Low impact: `OrderStore` already holds every order in memory, so the CSV string at most doubles a small footprint at current scale.

## Blocked

None.

## Close or demote

- **BL-001** CSV export breaks when a customer name contains a comma → `closed`. Premise false on main: commit `1b58281` quotes fields per RFC 4180 (`src/export.ts:5-7`), and `test/export.test.ts:24-27` covers a name with a comma and a quote. Vitest 12/12 passing on 2026-10-17.
