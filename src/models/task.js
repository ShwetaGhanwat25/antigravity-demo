const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

// 🛡️ Fail fast enum validation with 400 error status
function validateEnums(status, priority) {
    if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
        const err = new Error(`Invalid status: ${status}. Must be one of: ${Object.values(TaskStatus).join(', ')}`);
        err.status = 400;
        throw err;
    }
    if (priority !== undefined && !Object.values(TaskPriority).includes(priority)) {
        const err = new Error(`Invalid priority: ${priority}. Must be one of: ${Object.values(TaskPriority).join(', ')}`);
        err.status = 400;
        throw err;
    }
}

function create(data) {
    const status = data.status !== undefined ? data.status : TaskStatus.TODO;
    const priority = data.priority !== undefined ? data.priority : TaskPriority.MEDIUM;
    validateEnums(status, priority);

    const task = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        status,
        priority,
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

    // 🛡️ Prevent Mass Assignment by whitelisting allowed fields
    const allowed = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const safeData = {};
    for (const key of allowed) {
        if (data[key] !== undefined) safeData[key] = data[key];
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
