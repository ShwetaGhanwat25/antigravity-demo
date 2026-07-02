const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    // 🛡️ Sentinel: Validate status and priority enums
    if (data.status && !Object.values(TaskStatus).includes(data.status)) {
        throw new Error(`Invalid status: ${data.status}`);
    }
    if (data.priority && !Object.values(TaskPriority).includes(data.priority)) {
        throw new Error(`Invalid priority: ${data.priority}`);
    }

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

    // 🛡️ Sentinel: Whitelist allowed fields to prevent mass assignment (e.g. overwriting id or createdAt)
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updates = {};

    for (const key of allowedUpdates) {
        if (data[key] !== undefined) {
            // 🛡️ Sentinel: Validate enums if they are being updated
            if (key === 'status' && !Object.values(TaskStatus).includes(data[key])) {
                throw new Error(`Invalid status: ${data[key]}`);
            }
            if (key === 'priority' && !Object.values(TaskPriority).includes(data[key])) {
                throw new Error(`Invalid priority: ${data[key]}`);
            }
            updates[key] = data[key];
        }
    }

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
