const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

// 🛡️ Security Check: Validate enums using strict undefined checks
// to prevent null, empty string, or malicious bypasses.
function validateEnums(status, priority) {
    if (status !== undefined) {
        const allowedStatuses = Object.values(TaskStatus);
        if (!allowedStatuses.includes(status)) {
            const err = new Error(`Invalid status: ${status}. Must be one of: ${allowedStatuses.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
    if (priority !== undefined) {
        const allowedPriorities = Object.values(TaskPriority);
        if (!allowedPriorities.includes(priority)) {
            const err = new Error(`Invalid priority: ${priority}. Must be one of: ${allowedPriorities.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    validateEnums(data.status, data.priority);
    const task = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        status: data.status || TaskStatus.TODO,
        priority: data.priority || TaskPriority.MEDIUM,
        assignedTo: data.assignedTo || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
}

function update(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    validateEnums(data.status, data.priority);

    // 🛡️ Security Check: Whitelist allowed fields to prevent Mass Assignment
    const whitelisted = {};
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];
    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            whitelisted[field] = data[field];
        }
    }

    tasks[index] = { ...tasks[index], ...whitelisted, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
