## 2026-07-11 - Mass Assignment Protection in Task Model
**Vulnerability:** The `Task.update` function was using the spread operator (`...data`) to update task objects with the entire request body, allowing callers to overwrite protected fields like `id` and `createdAt`.
**Learning:** In-memory data structures without an ORM/ODM layer often miss the implicit field protection that many database libraries provide, making them particularly susceptible to mass assignment.
**Prevention:** Always implement explicit field whitelisting in update functions, especially when they directly consume request bodies or untrusted input.
