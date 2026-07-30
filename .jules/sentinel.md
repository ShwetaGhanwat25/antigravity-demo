# Sentinel Security Journal

## 2026-07-30 - Mass Assignment and Missing Enum Validation in Task Updates
**Vulnerability:** Mass Assignment vulnerability in task update model where unvalidated user input was directly spread onto the task record, allowing sensitive metadata fields like `id`, `createdAt`, or `updatedAt` to be modified or overwritten. Additionally, missing enum validation allowed invalid/arbitrary `status` and `priority` values to be persisted.
**Learning:** The model's `update` function directly performed an object spread of `data` over the target task object without filtering or whitelisting permitted fields. Optional fields lacked input verification, permitting null/empty/arbitrary strings to bypass constraints.
**Prevention:** Always whitelist update fields at the model layer and enforce strict `!== undefined` checks when validating optional enum parameters. Fail fast by throwing errors with custom `status = 400` properties to seamlessly integration with global error-handling middlewares.
