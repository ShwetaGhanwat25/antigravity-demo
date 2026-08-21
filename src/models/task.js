const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

// Security: Validate enum values fast and attach status = 400 for errorHandler middleware
function validateEnums(data) {
    if (!data) return;
    if (data.status !== undefined && !Object.values(TaskStatus).includes(data.status)) {
        const err = new Error(`Invalid status: ${data.status}. Allowed values: ${Object.values(TaskStatus).join(', ')}`);
        err.status = 400;
        throw err;
    }
    if (data.priority !== undefined && !Object.values(TaskPriority).includes(data.priority)) {
        const err = new Error(`Invalid priority: ${data.priority}. Allowed values: ${Object.values(TaskPriority).join(', ')}`);
        err.status = 400;
        throw err;
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    validateEnums(data);
    const task = {
        id: uuidv4(),
        title: data ? data.title : '',
        description: (data && data.description) || '',
        status: (data && data.status) || TaskStatus.TODO,
        priority: (data && data.priority) || TaskPriority.MEDIUM,
        assignedTo: (data && data.assignedTo) || null,
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

    // Security: Whitelist allowed fields to prevent mass assignment vulnerabilities
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updates = {};
    if (data) {
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updates[field] = data[field];
            }
        }
    }

    tasks[index] = {
        ...tasks[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
