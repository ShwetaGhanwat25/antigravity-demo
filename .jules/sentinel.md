## 2025-05-14 - Mass Assignment in Task Updates
**Vulnerability:** The `Task.update` function previously used a spread operator (`...data`) to merge user-provided data directly into the task object. This allowed an attacker to overwrite sensitive, read-only fields such as `id` and `createdAt` by including them in the request body.

**Learning:** Using the spread operator for updates is a common pattern that can easily lead to mass assignment vulnerabilities if not carefully controlled. In-memory models without a formal schema or ORM are particularly susceptible.

**Prevention:** Always use a whitelist of allowed fields when performing updates. Explicitly destructure only the fields that are intended to be user-configurable before applying them to the model object. Additionally, implement robust validation for all input fields, including enum checks for status and priority, to ensure data integrity.
