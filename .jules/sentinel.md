## 2026-06-30 - [Mass Assignment Protection in Task Model]
**Vulnerability:** Mass assignment allowed updating protected fields like `id` and `createdAt` in tasks.
**Learning:** Spread operators on raw request data directly into model updates create easy-to-miss security gaps.
**Prevention:** Always use explicit whitelisting for update operations in models or controllers.
