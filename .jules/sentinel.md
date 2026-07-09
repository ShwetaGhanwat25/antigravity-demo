## 2026-07-09 - Mass Assignment in Task Model
**Vulnerability:** The `Task.update` function was using the spread operator (`...data`) on the request body, allowing users to overwrite sensitive, internal fields like `id` and `createdAt`.
**Learning:** In-memory model implementations often lack the built-in protections provided by modern ORMs against mass assignment. Explicitly whitelisting allowed fields in the model layer is a robust defense-in-depth strategy.
**Prevention:** Always whitelist allowed fields when updating objects from user-provided data. Use destructuring or a utility function to extract only the properties that are intended to be mutable.
