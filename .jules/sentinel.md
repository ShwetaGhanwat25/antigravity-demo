# Sentinel Security Journal

## 2026-07-21 - Mass Assignment and Parameter Validation in Task Model
**Vulnerability:** Mass assignment vulnerability in task update model where sensitive fields like `id`, `createdAt`, or `updatedAt` could be overwritten by untrusted input. Additionally, status and priority enum fields were not validated.
**Learning:** Models using raw object destructuring/merging (e.g., `{ ...task, ...data }`) are susceptible to parameter pollution and mass assignment unless explicitly whitelisted. Furthermore, optional validation logic must use strict `undefined` checks (`!== undefined`) to prevent invalid values such as empty strings or `null` from bypassing checks.
**Prevention:** Always restrict update payloads by copying only allowed fields, and perform fail-fast validation by throwing specific validation errors with a `status = 400` property so express middleware can return clear error feedback.
