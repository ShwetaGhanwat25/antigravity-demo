const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function validateEnums(status, priority) {
    if (status !== undefined && !Object.values(TaskStatus).includes(status)) {
        throw new Error(`Invalid status: ${status}`);
    }
    if (priority !== undefined && !Object.values(TaskPriority).includes(priority)) {
        throw new Error(`Invalid priority: ${priority}`);
    }
}

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    // 🛡️ Sentinel: Validate status and priority enums
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

    // 🛡️ Sentinel: Whitelist allowed fields to prevent mass assignment
    const { title, description, status, priority, assignedTo } = data;

    // 🛡️ Sentinel: Validate status and priority enums
    validateEnums(status, priority);

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

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
