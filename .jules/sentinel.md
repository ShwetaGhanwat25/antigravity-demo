# Sentinel Security Journal

## 2026-08-14 - Mass Assignment and Task Enum Validation Vulnerabilities
**Vulnerability:** Models in this codebase allowed arbitrary fields to be updated in memory (e.g., in `src/models/task.js` update function) via a spread operator on user-supplied request bodies, enabling mass assignment attacks to overwrite sensitive metadata (like `id` or `createdAt`). Furthermore, task status and priority enums were not validated on creation or updates, allowing invalid/malicious states to persist.
**Learning:** Spread operators (e.g., `{ ...task, ...data }`) are dangerous when applied to raw user input without strict whitelisting. Trusting that client-side input validation or router level middlewares would sanitize fields is not defense-in-depth; models must always protect their own integrity.
**Prevention:** Explicitly whitelist permitted update fields (e.g., `['title', 'description', 'status', 'priority', 'assignedTo']`) inside model functions, and throw strict 400 status errors immediately upon invalid enum values or payload formats (Fail Fast principle).
