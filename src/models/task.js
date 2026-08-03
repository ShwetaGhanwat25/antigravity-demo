const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function validateEnums(data) {
    // 🛡️ Sentinel: Validate status and priority enums to prevent invalid input state.
    if (data.status !== undefined && !Object.values(TaskStatus).includes(data.status)) {
        const err = new Error('Invalid status value');
        err.status = 400;
        throw err;
    }
    if (data.priority !== undefined && !Object.values(TaskPriority).includes(data.priority)) {
        const err = new Error('Invalid priority value');
        err.status = 400;
        throw err;
    }
}

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

function update(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    validateEnums(data);

    // 🛡️ Sentinel: Mitigate mass assignment vulnerability by whitelisting fields.
    const allowed = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const sanitized = {};
    for (const key of allowed) {
        if (data[key] !== undefined) {
            sanitized[key] = data[key];
        }
    }

    tasks[index] = { ...tasks[index], ...sanitized, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
