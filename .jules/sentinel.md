## 2025-07-02 - [Mass Assignment Protection in Task Model]
**Vulnerability:** Task updates used a spread operator on the entire request body, allowing protected fields like `id` and `createdAt` to be overwritten by clients.
**Learning:** In-memory models without a schema-enforcing ORM are particularly vulnerable to mass assignment if updates are performed by merging objects directly.
**Prevention:** Use an explicit whitelist of allowed fields for both creation and updates, and validate enum values at the model level to ensure data integrity.
