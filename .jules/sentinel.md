## 2026-08-21 - Mass Assignment and Enum Validation in Task Model
**Vulnerability:** The task model allowed arbitrary properties (e.g. `id`, `createdAt`) to be overwritten and unvalidated enums for `status` and `priority` to be persisted during updates.
**Learning:** Spread updates (`{ ...tasks[index], ...data }`) in model update functions bypass input filtering if request bodies aren't sanitized at the model or controller level.
**Prevention:** Explicitly whitelist permitted fields for updates and throw early validation errors with `err.status = 400` when enums or types do not match expectations.
