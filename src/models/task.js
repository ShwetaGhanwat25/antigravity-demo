const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

/**
 * 🛡️ Sentinel: Validate that status and priority match allowed enum values.
 * Throws an Error if validation fails to ensure "Fail Fast" security pattern.
 */
function validateEnums(status, priority) {
    if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
        throw new Error(`Invalid status: ${status}. Allowed values: ${Object.values(TaskStatus).join(', ')}`);
    }
    if (priority !== undefined && !Object.values(TaskPriority).includes(priority)) {
        throw new Error(`Invalid priority: ${priority}. Allowed values: ${Object.values(TaskPriority).join(', ')}`);
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
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

    validateEnums(data.status, data.priority);

    // 🛡️ Sentinel: Whitelist allowed fields to prevent mass assignment of sensitive metadata (e.g., id, createdAt).
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const updates = {};
    allowedFields.forEach(field => {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    });

    tasks[index] = {
        ...tasks[index],
        ...updates,
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
