---
id: "BL-006"
title: "README install command is misspelled as npm intsall"
priority: "low"
tags: ["docs"]
status: "open"
created: "2026-10-17"
updated: "2026-10-17"
---

# BL-006: README install command is misspelled as npm intsall

## Tags

- docs

## Description
The "Run it" block in README.md (README.md:12) says `npm intsall`. Copying it does not install dependencies, because npm has no `intsall` command. The exact npm error text has not been checked. The fix is to change it to `npm install`.

## Acceptance Criteria
- README.md "Run it" block reads `npm install`

---
_Close when done: `openplanr backlog update BL-006 --status closed`_
