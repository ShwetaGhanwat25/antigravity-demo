const { v4: uuidv4 } = require('uuid');
const { sanitizeString } = require('../utils/validators');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function validateEnums(status, priority) {
    if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
        const err = new Error(`Invalid status: ${status}`);
        err.status = 400;
        throw err;
    }
    if (priority !== undefined && !Object.values(TaskPriority).includes(priority)) {
        const err = new Error(`Invalid priority: ${priority}`);
        err.status = 400;
        throw err;
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    validateEnums(data.status, data.priority);
    const task = {
        id: uuidv4(),
        title: sanitizeString(data.title),
        description: data.description ? sanitizeString(data.description) : '',
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

    // Security: Mass assignment protection by whitelisting allowed update fields
    const updates = {};
    if (data.title !== undefined) updates.title = sanitizeString(data.title);
    if (data.description !== undefined) updates.description = sanitizeString(data.description);
    if (data.status !== undefined) updates.status = data.status;
    if (data.priority !== undefined) updates.priority = data.priority;
    if (data.assignedTo !== undefined) updates.assignedTo = data.assignedTo;

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
