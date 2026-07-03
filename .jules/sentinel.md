## 2026-07-03 - Mass Assignment in Task Updates
**Vulnerability:** The `Task.update` function was using the spread operator to apply all fields from the request body directly to the task object, allowing users to overwrite protected fields like `id` and `createdAt`.
**Learning:** In-memory models often lack the built-in protection that some ORMs provide, making them susceptible to mass assignment if not handled carefully.
**Prevention:** Always use an explicit whitelist of allowed fields when updating models, especially when the data comes directly from user input.
