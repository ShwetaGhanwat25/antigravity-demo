# Sentinel's Journal - Critical Security Learnings

This journal records critical security vulnerabilities, patterns, and learnings discovered in this codebase.

## 2026-07-05 - [Mass Assignment and Missing Enum Validation in Tasks]
**Vulnerability:** The `Task.update` method allowed for mass assignment, enabling callers to overwrite internal fields like `id` and `createdAt`. Additionally, `status` and `priority` fields lacked validation against their respective enums.
**Learning:** In-memory models often lack the implicit schema protection provided by databases, making explicit field whitelisting and input validation essential.
**Prevention:** Always whitelist allowed fields during updates and validate enum values at the model level to ensure data integrity and prevent unauthorized field modification.
