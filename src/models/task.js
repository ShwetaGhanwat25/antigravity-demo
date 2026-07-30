const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

// 🛡️ Sentinel: Fail-fast enum validation with status code 400 for Express error handler integration
function validateEnums(data) {
    if (data.status !== undefined) {
        if (!Object.values(TaskStatus).includes(data.status)) {
            const err = new Error(`Invalid status value: ${data.status}`);
            err.status = 400;
            throw err;
        }
    }
    if (data.priority !== undefined) {
        if (!Object.values(TaskPriority).includes(data.priority)) {
            const err = new Error(`Invalid priority value: ${data.priority}`);
            err.status = 400;
            throw err;
        }
    }
}

function create(data) {
    // 🛡️ Sentinel: Validate status and priority enums if provided
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

    // 🛡️ Sentinel: Validate status and priority enums if provided
    validateEnums(data);

    // 🛡️ Sentinel: Protect against mass assignment by whitelisting fields
    const allowed = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updateData = {};
    for (const key of allowed) {
        if (data[key] !== undefined) {
            updateData[key] = data[key];
        }
    }

    tasks[index] = { ...tasks[index], ...updateData, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
