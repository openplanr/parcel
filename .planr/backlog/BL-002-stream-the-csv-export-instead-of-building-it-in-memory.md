---
id: "BL-002"
title: "Stream the CSV export instead of building it in memory"
priority: "medium"
tags: ["export", "performance"]
status: "open"
created: "2026-10-17"
updated: "2026-10-17"
---

# BL-002: Stream the CSV export instead of building it in memory

## Tags

- export
- performance

## Description
ordersToCsv builds the whole file as one string before /orders/export.csv sends it. Fine for the demo data, but memory grows with every order.

## Acceptance Criteria
- The export route writes rows to the response as they are produced
- Output is byte-identical to the current CSV for the same orders


---
_Close when done: `openplanr backlog update BL-002 --status closed`_
