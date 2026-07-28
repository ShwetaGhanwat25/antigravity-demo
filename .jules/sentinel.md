# Sentinel Security Journal

## 2026-07-28 - Mass Assignment and Insecure Enum Validation in Tasks
**Vulnerability:** The Task model allowed mass assignment in its update operations, permitting arbitrary modification of read-only metadata fields such as `id` and `createdAt`. Additionally, there was a complete absence of enum validation for the `status` and `priority` fields in both task creation and updates.
**Learning:** When inputs are passed as a raw request body to data-merging update operations (e.g. `tasks[index] = { ...tasks[index], ...data }`), it creates severe security risks. Furthermore, if validation is bypassed for empty or null strings, or not structured with a 'Fail Fast' strategy, invalid/corrupt data can enter the state, causing data integrity issues and potential server errors.
**Prevention:** Always restrict update inputs via strict whitelisting. Use robust model-level schema validation. Prefer a 'Fail Fast' approach by throwing clear, structured errors with standard HTTP-associated status codes (like `status = 400`) that can be safely returned to clients without exposing internal details.
