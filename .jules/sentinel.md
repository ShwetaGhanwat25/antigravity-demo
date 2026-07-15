## 2026-07-15 - [HIGH] Mass Assignment in Task Model
**Vulnerability:** The `update` function in `src/models/task.js` used the spread operator (`...data`) on untrusted user input, allowing callers to overwrite sensitive fields such as `id` and `createdAt`.
**Learning:** Using spread operators or `Object.assign` directly with request bodies in model update functions creates a mass assignment vulnerability. This is common in "in-memory" or flexible schema implementations where field whitelisting isn't enforced by a database ORM.
**Prevention:** Always use an explicit whitelist of allowed fields when performing updates. Destructure allowed fields from the input data and only apply those to the model instance.
