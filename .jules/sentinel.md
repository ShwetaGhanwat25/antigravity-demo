# Sentinel Security Journal

This journal records critical security learnings specific to this codebase.

## 2026-07-14 - Mass Assignment in Task Model
**Vulnerability:** Protected fields like `id` and `createdAt` could be overwritten via the `update` function in `src/models/task.js` because it used the spread operator on the entire `data` object from the request body.
**Learning:** Using `...data` without whitelisting allowed fields is a dangerous pattern in model update functions.
**Prevention:** Always whitelist allowed fields when performing updates from user-provided data.
