const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    // Validate status and priority
    if (data.status && !Object.values(TaskStatus).includes(data.status)) {
        throw new Error('Invalid status value');
    }
    if (data.priority && !Object.values(TaskPriority).includes(data.priority)) {
        throw new Error('Invalid priority value');
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

    // 🛡️ Sentinel: Whitelist allowed fields to prevent mass assignment
    const updates = {};
    const allowed = ['title', 'description', 'status', 'priority', 'assignedTo'];

    allowed.forEach(field => {
        if (data[field] !== undefined) {
            // Validate status and priority enums if being updated
            if (field === 'status' && !Object.values(TaskStatus).includes(data[field])) {
                throw new Error('Invalid status value');
            }
            if (field === 'priority' && !Object.values(TaskPriority).includes(data[field])) {
                throw new Error('Invalid priority value');
            }

            updates[field] = data[field];
        }
    });

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
