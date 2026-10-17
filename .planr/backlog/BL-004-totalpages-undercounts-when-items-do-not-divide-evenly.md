---
id: "BL-004"
title: "totalPages undercounts when items do not divide evenly by pageSize"
priority: "high"
tags: ["pagination", "bug"]
status: "open"
created: "2026-10-17"
updated: "2026-10-17"
---

# BL-004: totalPages undercounts when items do not divide evenly by pageSize

## Tags

- pagination
- bug

## Description
paginate() computes totalPages with Math.floor (src/pagination.ts:18), so 3 orders at pageSize 2 report totalPages 1 and hasNext false on page 1, hiding the third order from clients that follow hasNext. Existing tests only use 40 items at pageSize 10, which divides evenly. Found while reading the code for SPEC-001; not reproduced by a test yet.

## Acceptance Criteria
- totalPages uses Math.ceil, so 3 items at pageSize 2 give totalPages 2 and hasNext true on page 1
- A test covers an item count that is not a multiple of pageSize


---
_Close when done: `openplanr backlog update BL-004 --status closed`_
