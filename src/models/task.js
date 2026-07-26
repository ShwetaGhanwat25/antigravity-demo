const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

// 🛡️ Sentinel: Helper function to validate enum values for Status and Priority.
// We fail fast by throwing a 400 error if values do not match constraints, using strict undefined checks.
function validateEnums(status, priority) {
    if (status !== undefined) {
        const validStatuses = Object.values(TaskStatus);
        if (!validStatuses.includes(status)) {
            const err = new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
    if (priority !== undefined) {
        const validPriorities = Object.values(TaskPriority);
        if (!validPriorities.includes(priority)) {
            const err = new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
}

function create(data) {
    validateEnums(data.status, data.priority);
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

    validateEnums(data.status, data.priority);

    // 🛡️ Sentinel: Whitelist only allowed fields to protect against Mass Assignment.
    const whitelist = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updateData = {};
    for (const key of whitelist) {
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
