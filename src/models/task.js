const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

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
    // 🛡️ Validate task status and priority enum values before creation
    validateEnums(data);

    const task = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        status: data.status !== undefined ? data.status : TaskStatus.TODO,
        priority: data.priority !== undefined ? data.priority : TaskPriority.MEDIUM,
        assignedTo: data.assignedTo !== undefined ? data.assignedTo : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    return task;
}

function update(id, data) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    // 🛡️ Mass Assignment Protection: whitelist allowed task update fields
    const whitelist = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const filteredData = {};
    for (const key of whitelist) {
        if (data[key] !== undefined) {
            filteredData[key] = data[key];
        }
    }

    // 🛡️ Validate task status and priority enum values before update
    validateEnums(filteredData);

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
