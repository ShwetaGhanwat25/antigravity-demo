# Sentinel Journal - Security Learnings

## 2026-08-31 - IDOR in Task Modification Endpoints
**Vulnerability:** Insecure Direct Object Reference (IDOR) in `PUT /api/tasks/:id` and `DELETE /api/tasks/:id` where any authenticated user could modify or delete tasks assigned to other users.
**Learning:** The application authenticated requests using JWT middleware but lacked resource-level authorization checks in controller functions.
**Prevention:** Always verify resource ownership or explicit authorization permissions (e.g. `task.assignedTo === req.user.userId`) before performing update or delete operations on user-associated resources.
