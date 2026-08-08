const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

const ALLOWED_FIELDS = ['title', 'description', 'status', 'priority', 'assignedTo'];

function validateEnums(data) {
    if (data.status !== undefined) {
        const validStatuses = Object.values(TaskStatus);
        if (!validStatuses.includes(data.status)) {
            const err = new Error(`Invalid status: ${data.status}. Allowed values are: ${validStatuses.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
    if (data.priority !== undefined) {
        const validPriorities = Object.values(TaskPriority);
        if (!validPriorities.includes(data.priority)) {
            const err = new Error(`Invalid priority: ${data.priority}. Allowed values are: ${validPriorities.join(', ')}`);
            err.status = 400;
            throw err;
        }
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    // Strict input validation
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

    // Strict input validation for updates
    validateEnums(data);

    // Filter incoming data against the whitelist to protect against mass assignment
    const filteredData = {};
    for (const key of ALLOWED_FIELDS) {
        if (data[key] !== undefined) {
            filteredData[key] = data[key];
        }
    }

    tasks[index] = {
        ...tasks[index],
        ...filteredData,
        updatedAt: new Date().toISOString()
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
