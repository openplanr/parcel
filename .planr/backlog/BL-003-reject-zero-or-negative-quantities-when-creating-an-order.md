---
id: "BL-003"
title: "Reject zero or negative quantities when creating an order"
priority: "medium"
tags: ["orders", "validation"]
status: "open"
created: "2026-10-17"
updated: "2026-10-17"
---

# BL-003: Reject zero or negative quantities when creating an order

## Tags

- orders
- validation

## Description
OrderStore.create accepts a line with quantity 0 or -2, which produces an order with a zero or negative total.

## Acceptance Criteria
- create throws OrderValidationError for a quantity below 1
- A test covers 0 and a negative quantity


---
_Close when done: `openplanr backlog update BL-003 --status closed`_
