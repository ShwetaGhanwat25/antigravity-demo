const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function validateEnums(data) {
    if (data.status !== undefined && !Object.values(TaskStatus).includes(data.status)) {
        const error = new Error(`Invalid status: ${data.status}`);
        error.status = 400;
        throw error;
    }
    if (data.priority !== undefined && !Object.values(TaskPriority).includes(data.priority)) {
        const error = new Error(`Invalid priority: ${data.priority}`);
        error.status = 400;
        throw error;
    }
}

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
    const whitelist = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updatedFields = {};
    for (const key of whitelist) {
        if (data[key] !== undefined) {
            updatedFields[key] = data[key];
        }
    }
    tasks[index] = { ...tasks[index], ...updatedFields, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
