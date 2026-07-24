const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function validateEnums(data) {
    if (data.status !== undefined) {
        const allowedStatuses = Object.values(TaskStatus);
        if (!allowedStatuses.includes(data.status)) {
            const err = new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
    if (data.priority !== undefined) {
        const allowedPriorities = Object.values(TaskPriority);
        if (!allowedPriorities.includes(data.priority)) {
            const err = new Error(`Invalid priority. Allowed values: ${allowedPriorities.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
}

function create(data) {
    const cleaned = {};
    const whitelist = ['title', 'description', 'status', 'priority', 'assignedTo'];
    for (const key of whitelist) {
        if (data[key] !== undefined) {
            cleaned[key] = data[key];
        }
    }
    validateEnums(cleaned);
    const task = {
        id: uuidv4(),
        title: cleaned.title,
        description: cleaned.description || '',
        status: cleaned.status || TaskStatus.TODO,
        priority: cleaned.priority || TaskPriority.MEDIUM,
        assignedTo: cleaned.assignedTo || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
}

function update(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    const cleaned = {};
    const whitelist = ['title', 'description', 'status', 'priority', 'assignedTo'];
    for (const key of whitelist) {
        if (data[key] !== undefined) {
            cleaned[key] = data[key];
        }
    }
    validateEnums(cleaned);
    tasks[index] = { ...tasks[index], ...cleaned, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
