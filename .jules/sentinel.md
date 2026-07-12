# Sentinel Security Journal

## 2026-07-12 - Mass Assignment and Incomplete Enum Validation
**Vulnerability:** Mass assignment in task updates allowed overwriting sensitive metadata like `id` and `createdAt`. Additionally, enum validation was bypassable using `null` due to loose falsy checks.
**Learning:** Spread operators without whitelisting are dangerous for updates. Validation must use strict `undefined` checks to prevent `null` or empty strings from bypassing enum constraints while still being applied to the model.
**Prevention:** Always whitelist fields for updates and use `!== undefined` for optional field validation in models.
