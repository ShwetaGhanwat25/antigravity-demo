const { v4: uuidv4 } = require('uuid');
const { sanitizeString } = require('../utils/validators');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    // 🛡️ Sentinel: Sanitize user input to prevent Stored XSS / injection attacks
    const title = typeof data.title === 'string' ? sanitizeString(data.title) : data.title;
    const description = typeof data.description === 'string' ? sanitizeString(data.description) : (data.description || '');

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

    const updatedData = { ...data };
    // 🛡️ Sentinel: Sanitize user input during update to prevent Stored XSS / injection attacks
    if (typeof updatedData.title === 'string') {
        updatedData.title = sanitizeString(updatedData.title);
    }
    if (typeof updatedData.description === 'string') {
        updatedData.description = sanitizeString(updatedData.description);
    }

    tasks[index] = { ...tasks[index], ...updatedData, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
