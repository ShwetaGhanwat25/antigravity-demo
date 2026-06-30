const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
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

    // 🛡️ Sentinel: Explicitly whitelist fields to prevent mass assignment
    // This prevents attackers from overwriting protected fields like 'id' or 'createdAt'
    const updates = {};
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];

    allowedFields.forEach(field => {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    });

    // Validate status and priority values if they are being updated
    if (updates.status && !Object.values(TaskStatus).includes(updates.status)) {
        delete updates.status;
    }
    if (updates.priority && !Object.values(TaskPriority).includes(updates.priority)) {
        delete updates.priority;
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
