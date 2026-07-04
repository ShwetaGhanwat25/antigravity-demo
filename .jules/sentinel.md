# Sentinel's Journal - Critical Security Learnings

## 2026-07-04 - Mass Assignment in Task Updates
**Vulnerability:** The `Task.update` method used the spread operator `{ ...task, ...data }` to update task objects. This allowed clients to overwrite protected internal fields like `id`, `createdAt`, and `updatedAt` if they included them in the request body. Additionally, it lacked validation for enum-like fields such as `status` and `priority`.

**Learning:** Using spread operators or `Object.assign` directly on user-provided input when updating internal state is dangerous. It bypasses intended object structures and can lead to integrity issues.

**Prevention:** Always use an explicit whitelist of allowed fields when performing updates. Validate all enum values and business logic constraints before applying changes to the model state.
