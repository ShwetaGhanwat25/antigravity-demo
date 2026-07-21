const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

// ✅ GOOD: Fail Fast input validation of status and priority enums.
// Using strict undefined check to ensure null/empty values don't bypass validation if sent.
// Throws Error with status = 400 so the custom errorHandler exposes the validation message.
function validateEnums(data) {
    if (data.status !== undefined) {
        const validStatuses = Object.values(TaskStatus);
        if (!validStatuses.includes(data.status)) {
            const err = new Error(`Invalid status: ${data.status}. Must be one of ${validStatuses.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
    if (data.priority !== undefined) {
        const validPriorities = Object.values(TaskPriority);
        if (!validPriorities.includes(data.priority)) {
            const err = new Error(`Invalid priority: ${data.priority}. Must be one of ${validPriorities.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    validateEnums(data);
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

// ✅ GOOD: Mass Assignment protection.
// Explicitly whitelists the allowed fields that can be updated.
// This prevents attackers from overwriting sensitive fields like id, createdAt, etc.
function update(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    validateEnums(data);

    const whitelist = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const safeData = {};
    for (const key of whitelist) {
        if (data[key] !== undefined) {
            safeData[key] = data[key];
        }
    }

    tasks[index] = { ...tasks[index], ...safeData, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
