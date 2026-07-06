# Sentinel Security Journal

## 2026-07-06 - [Mass Assignment in Task Updates]
**Vulnerability:** The `update` function in `src/models/task.js` used the spread operator on unvalidated user input (`...data`), allowing users to overwrite sensitive internal fields like `id` and `createdAt`, or inject arbitrary fields.
**Learning:** In-memory model implementations often lack the built-in protection that some ORMs provide, making them particularly susceptible to mass assignment if input isn't strictly whitelisted.
**Prevention:** Always use field whitelisting and strict enum validation when updating model data.
