## 2026-07-14 - Mass Assignment and Schema Overwrite in Memory Store
**Vulnerability:** Mass assignment in model update operations allowing clients to overwrite system metadata fields (e.g. `id`, `createdAt`, `updatedAt`) and bypass authentication/integrity boundaries.
**Learning:** Overwriting memory-store models with unfiltered request bodies `...data` bypasses validation and pollutes model entities with sensitive attributes. Strict property-level whitelisting at the model layer prevents metadata corruption.
**Prevention:** Whitelist permitted attributes explicitly when performing creates or updates, and strictly validate enums and optional properties using strict `undefined` checks.
