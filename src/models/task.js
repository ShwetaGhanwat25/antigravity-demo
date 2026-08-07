const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

/**
 * 🛡️ Sentinel Security Check: Enforce strict enum validation at the model level
 * to prevent illegal state transitions or validation bypasses.
 */
function validateEnums(status, priority) {
    const validStatuses = Object.values(TaskStatus);
    const validPriorities = Object.values(TaskPriority);

    if (status !== undefined && !validStatuses.includes(status)) {
        const err = new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}`);
        err.status = 400; // Propagate error status to standard errorHandler middleware
        throw err;
    }
    if (priority !== undefined && !validPriorities.includes(priority)) {
        const err = new Error(`Invalid priority: ${priority}. Must be one of ${validPriorities.join(', ')}`);
        err.status = 400; // Propagate error status to standard errorHandler middleware
        throw err;
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    validateEnums(data.status, data.priority);
    // 🛡️ Sentinel Security Check: Explicit property assignment protects against mass assignment
    // and prevents tampering with immutable fields like id, createdAt, or updatedAt.
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

    validateEnums(data.status, data.priority);

    // 🛡️ Sentinel Security Check: Strong whitelisting strategy to prevent mass assignment on update.
    // Clients cannot overwrite ID, createdAt, or other internal fields through the request body.
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
