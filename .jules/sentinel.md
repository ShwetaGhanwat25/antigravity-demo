## 2026-07-07 - [Mass Assignment in In-Memory Models]
**Vulnerability:** The `update` function in models was using object spread `...data` to apply updates, allowing any field (including `id` and `createdAt`) to be overwritten by user-provided input.
**Learning:** Simple in-memory model implementations often lack the built-in mass assignment protections found in mature ORMs (like Sequelize or Mongoose), making explicit whitelisting mandatory.
**Prevention:** Implement strict field whitelisting in all model update methods and validate enum values at the model level to ensure data integrity and prevent unauthorized metadata modification.
