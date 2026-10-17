---
id: "BL-005"
title: "loadConfig accepts any defaultPageSize without validation"
priority: "low"
tags: ["config", "validation"]
status: "open"
created: "2026-10-17"
updated: "2026-10-17"
---

# BL-005: loadConfig accepts any defaultPageSize without validation

## Tags

- config
- validation

## Description
loadConfig() spreads parsed `config.local.json` over defaults with no checks (src/config.ts:21-22), so `defaultPageSize` can be 0, negative, fractional, or a string. After SPEC-001 lands, a `defaultPageSize` below 1 makes every `GET /orders` without `pageSize` return 400 at request time instead of failing at startup; a value above 100 is silently clamped. Explicitly out of scope for SPEC-001. Not reproduced by a test.

## Acceptance Criteria
- loadConfig() throws at startup with a message naming the key and value when `defaultPageSize` is not an integer from 1 to 100
- A test in test/ covers an invalid `defaultPageSize`

---
_Close when done: `openplanr backlog update BL-005 --status closed`_
