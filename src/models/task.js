const { v4: uuidv4 } = require('uuid');
const { sanitizeString } = require('../utils/validators');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function validateEnums(status, priority) {
    if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
        const err = new Error(`Invalid status: ${status}. Allowed values: ${Object.values(TaskStatus).join(', ')}`);
        err.status = 400;
        throw err;
    }
    if (priority !== undefined && !Object.values(TaskPriority).includes(priority)) {
        const err = new Error(`Invalid priority: ${priority}. Allowed values: ${Object.values(TaskPriority).join(', ')}`);
        err.status = 400;
        throw err;
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    validateEnums(data.status, data.priority);
    const title = typeof data.title === 'string' ? sanitizeString(data.title) : String(data.title || '');
    const description = typeof data.description === 'string' ? sanitizeString(data.description) : String(data.description || '');
    const task = {
        id: uuidv4(),
        title,
        description,
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

    // Security: Whitelist allowed update fields to prevent mass assignment (e.g. overwriting id or createdAt)
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updates = {};

    allowedFields.forEach(field => {
        if (data[field] !== undefined) {
            if (field === 'title' || field === 'description') {
                updates[field] = sanitizeString(String(data[field]));
            } else {
                updates[field] = data[field];
            }
        }
    });

    tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
