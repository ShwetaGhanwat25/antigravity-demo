## 2026-06-29 - [Mass Assignment and Privilege Escalation]
**Vulnerability:** User registration and Task updates allowed arbitrary fields to be set/overwritten (e.g., `role: 'admin'`, `id`, `createdAt`).
**Learning:** Spread operators and direct object assignments in models without strict schema validation or whitelisting are prone to mass assignment.
**Prevention:** Always use explicit whitelists for fields that can be set by user input, and hardcode sensitive default values (like roles) instead of relying on input.
