const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

// Helper to validate status and priority enums. Throws errors with status = 400 to fail fast and securely.
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
    // Strict undefined checks to handle optional/default values properly and prevent null/empty bypasses
    const status = data.status !== undefined ? data.status : TaskStatus.TODO;
    const priority = data.priority !== undefined ? data.priority : TaskPriority.MEDIUM;

    validateEnums(status, priority);

    // Explicitly destructure to protect against mass assignment
    const task = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        status: status,
        priority: priority,
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

    validateEnums(data.status, data.priority);

    // Whitelist only specific allowed fields to prevent mass assignment
    const updatedData = {};
    if (data.title !== undefined) updatedData.title = data.title;
    if (data.description !== undefined) updatedData.description = data.description;
    if (data.status !== undefined) updatedData.status = data.status;
    if (data.priority !== undefined) updatedData.priority = data.priority;
    if (data.assignedTo !== undefined) updatedData.assignedTo = data.assignedTo;

    tasks[index] = { ...tasks[index], ...updatedData, updatedAt: new Date().toISOString() };
    return tasks[index];
}

function remove(id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    tasks.splice(index, 1);
    return true;
}

module.exports = { findAll, findById, create, update, remove, TaskStatus, TaskPriority };
