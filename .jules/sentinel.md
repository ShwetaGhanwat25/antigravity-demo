# Sentinel Security Journal

## 2026-07-27 - Task Model Mass Assignment & Missing Validation
**Vulnerability:** The task model's update function dynamically merged the incoming request body (`req.body`) directly into the task storage array without whitelisting allowed properties. This allowed mass assignment of sensitive/read-only metadata fields (such as `id`, `createdAt`, `updatedAt`). Additionally, there was no validation for optional enum fields like `status` or `priority`, allowing arbitrary and invalid data strings to be stored.
**Learning:** Mass assignment vulnerabilities occur when a framework or custom ORM/model merges request payloads directly without explicit field filtering. Lack of input validation for custom status/priority enums bypasses expected business rules and state machine constraints.
**Prevention:** Always implement a strict whitelist of fields allowed to be updated in models/controllers. Implement 'fail fast' enum validations that raise a validation error with a custom `status = 400` property so that middleware handles the error appropriately rather than silently ignoring it or returning a 500 error.
