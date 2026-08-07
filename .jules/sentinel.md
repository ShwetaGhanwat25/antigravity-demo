## 2026-08-07 - [Task Model Mass Assignment and Validation Bypass]
**Vulnerability:** Mass assignment vulnerability on tasks allowed clients to overwrite internal and read-only metadata fields such as `id` and `createdAt` during task updates, and bypass status or priority options because of insufficient validation logic in model updates.
**Learning:** Performing mass assignment protection and strict type/enum checks at the model level (or schema validation level) is critical to prevent malicious or accidental metadata modification and to ensure data integrity across the application.
**Prevention:** Always whitelist update fields and validate optional enum properties strictly by checking for exact undefined states rather than using loose truthy or falsy checks.
