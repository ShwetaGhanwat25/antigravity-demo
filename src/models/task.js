const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    // 🛡️ Sentinel: Validate status and priority enums
    const status = Object.values(TaskStatus).includes(data.status) ? data.status : TaskStatus.TODO;
    const priority = Object.values(TaskPriority).includes(data.priority) ? data.priority : TaskPriority.MEDIUM;

    const task = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        status,
        priority,
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

    // 🛡️ Sentinel: Prevent mass assignment by whitelisting allowed fields
    const { title, description, status, priority, assignedTo } = data;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined && Object.values(TaskStatus).includes(status)) updates.status = status;
    if (priority !== undefined && Object.values(TaskPriority).includes(priority)) updates.priority = priority;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;

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
