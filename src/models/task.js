const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

// 🛡️ Security Validation Helper: Throw 400 validation error if enums are invalid (Fail Fast)
function validateEnums(status, priority) {
    if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
        const err = new Error('Invalid task status');
        err.status = 400;
        throw err;
    }
    if (priority !== undefined && !Object.values(TaskPriority).includes(priority)) {
        const err = new Error('Invalid task priority');
        err.status = 400;
        throw err;
    }
}

function create(data) {
    // 🛡️ Security Check: Validate enums before object creation
    validateEnums(data.status, data.priority);

    // 🛡️ Mass Assignment Protection: Only accept safe user-controllable fields
    const task = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        status: data.status !== undefined ? data.status : TaskStatus.TODO,
        priority: data.priority !== undefined ? data.priority : TaskPriority.MEDIUM,
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

    // 🛡️ Security Check: Validate enums before update
    validateEnums(data.status, data.priority);

    // 🛡️ Mass Assignment Protection: Only merge whitelisted fields
    const whitelist = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updates = {};
    for (const key of whitelist) {
        if (data[key] !== undefined) {
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
