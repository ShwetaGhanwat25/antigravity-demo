## 2026-08-03 - Task Model Mass Assignment & Enum Validation Gap
**Vulnerability:** Updating tasks allowed overwriting arbitrary properties such as `id` or `createdAt`, and invalid status/priority enum values were stored without validation.
**Learning:** The model's `update` method used un-sanitized object spreading (`...data`) directly into the task record.
**Prevention:** Always whitelist updated fields in model functions and fail fast with `err.status = 400` when validating enum fields.
