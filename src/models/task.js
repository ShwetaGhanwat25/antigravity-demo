const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

// Security Fix: Prevent mass assignment and enforce enum validation (Fail Fast)
function validateAndExtractTaskData(data) {
    const allowedStatuses = Object.values(TaskStatus);
    const allowedPriorities = Object.values(TaskPriority);

    // Strict undefined checks prevent bypass using null or empty string
    if (data.status !== undefined && !allowedStatuses.includes(data.status)) {
        const err = new Error(`Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
        err.status = 400;
        throw err;
    }
    if (data.priority !== undefined && !allowedPriorities.includes(data.priority)) {
        const err = new Error(`Invalid priority. Allowed values: ${allowedPriorities.join(', ')}`);
        err.status = 400;
        throw err;
    }

    // Whitelist allowed fields to prevent mass assignment of sensitive properties (like id, createdAt, updatedAt)
    const extracted = {};
    const whitelist = ['title', 'description', 'status', 'priority', 'assignedTo'];
    for (const key of whitelist) {
        if (data[key] !== undefined) {
            extracted[key] = data[key];
        }
    }
    return extracted;
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    const cleanData = validateAndExtractTaskData(data);
    const task = {
        id: uuidv4(),
        title: cleanData.title,
        description: cleanData.description || '',
        status: cleanData.status || TaskStatus.TODO,
        priority: cleanData.priority || TaskPriority.MEDIUM,
        assignedTo: cleanData.assignedTo || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
}

function update(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    const cleanData = validateAndExtractTaskData(data);
    tasks[index] = { ...tasks[index], ...cleanData, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
