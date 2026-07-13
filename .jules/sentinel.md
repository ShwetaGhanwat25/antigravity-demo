## 2026-07-13 - Mass Assignment in Task Model
**Vulnerability:** Sensitive metadata fields like `id` and `createdAt` could be overwritten via the task update API endpoint.
**Learning:** The model's `update` function used a spread operator (`...data`) to apply incoming request data directly to the internal state, allowing any field to be modified if included in the JSON payload.
**Prevention:** Always use explicit field whitelisting when updating models from user-provided input. Additionally, implement strict enum validation for state-related fields (like status and priority) to ensure the application remains in a valid state.
