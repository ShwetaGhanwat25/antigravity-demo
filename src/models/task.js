const { v4: uuidv4 } = require('uuid');
const { sanitizeString } = require('../utils/validators');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function validateEnums(s, p) {
    if (s !== undefined && !Object.values(TaskStatus).includes(s)) {
        const err = new Error(`Invalid status: ${s}`); err.status = 400; throw err;
    }
    if (p !== undefined && !Object.values(TaskPriority).includes(p)) {
        const err = new Error(`Invalid priority: ${p}`); err.status = 400; throw err;
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    validateEnums(data.status, data.priority);
    const task = {
        id: uuidv4(),
        title: typeof data.title === 'string' ? sanitizeString(data.title) : data.title,
        description: typeof data.description === 'string' ? sanitizeString(data.description) : '',
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
    const safe = {};
    for (const k of ['title', 'description', 'status', 'priority', 'assignedTo']) {
        if (data[k] !== undefined) {
            safe[k] = typeof data[k] === 'string' ? sanitizeString(data[k]) : data[k];
        }
    }
    tasks[index] = { ...tasks[index], ...safe, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
