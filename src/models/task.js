const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

// 🛡️ Security Helper: Fail fast by validating enums and throwing 400 status errors.
function validateEnums(status, priority) {
    if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
        const err = new Error(`Invalid status: ${status}`);
        err.status = 400;
        throw err;
    }
    if (priority !== undefined && !Object.values(TaskPriority).includes(priority)) {
        const err = new Error(`Invalid priority: ${priority}`);
        err.status = 400;
        throw err;
    }
}

function create(data) {
    // 🛡️ Validate input enums to ensure domain data integrity
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

    // 🛡️ Mass Assignment Protection: whitelist only allowed fields for updates
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updateData = {};
    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            updateData[key] = data[key];
        }
    }

    validateEnums(updateData.status, updateData.priority);

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
