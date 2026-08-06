const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

const ALLOWED_UPDATE_FIELDS = ['title', 'description', 'status', 'priority', 'assignedTo'];

// 🛡️ Sentinel: Fail-fast validation of enums
function validateEnums(data) {
    if (data.status !== undefined) {
        if (!Object.values(TaskStatus).includes(data.status)) {
            const err = new Error(`Invalid status: ${data.status}`);
            err.status = 400;
            throw err;
        }
    }
    if (data.priority !== undefined) {
        if (!Object.values(TaskPriority).includes(data.priority)) {
            const err = new Error(`Invalid priority: ${data.priority}`);
            err.status = 400;
            throw err;
        }
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

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

    // 🛡️ Sentinel: Protect against mass assignment by filtering allowed fields
    const filteredData = {};
    for (const key of ALLOWED_UPDATE_FIELDS) {
        if (data[key] !== undefined) {
            filteredData[key] = data[key];
        }
    }

    tasks[index] = { ...tasks[index], ...filteredData, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
