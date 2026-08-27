## 2026-08-27 - PR Review Bot Model Fallback & Email Validation
**Vulnerability:** Registration endpoint lacked email format validation and PR review bot crashed on missing Groq LLM model.
**Learning:** External API services (like Groq LLMs used by bot/reviewer.py) can change or deprecate model identifiers, causing CI failures on security PR submissions.
**Prevention:** Always implement graceful error handling and fallback models for external LLM calls, and validate all input strings (e.g. email formats) at entry points using utility validators.
