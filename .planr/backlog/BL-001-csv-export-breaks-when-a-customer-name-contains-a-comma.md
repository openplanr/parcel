---
id: "BL-001"
title: "CSV export breaks when a customer name contains a comma"
priority: "high"
tags: ["export", "bug"]
status: "open"
created: "2026-10-17"
updated: "2026-10-17"
---

# BL-001: CSV export breaks when a customer name contains a comma

## Tags

- export
- bug

## Description
A customer named "Haddad, Omar" shifts every column after it in /orders/export.csv, because ordersToCsv joins raw fields with commas.

## Acceptance Criteria
- Fields containing commas, quotes or newlines are quoted per RFC 4180
- A test covers a customer name with a comma and a quote


---
_Close when done: `openplanr backlog update BL-001 --status closed`_
