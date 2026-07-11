const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
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

    // 🛡️ Sentinel: Mass assignment protection - only allow updating specific fields
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const filteredData = {};

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            // Validation for enums
            if (field === 'status' && !Object.values(TaskStatus).includes(data[field])) {
                throw new Error(`Invalid status: ${data[field]}`);
            }
            if (field === 'priority' && !Object.values(TaskPriority).includes(data[field])) {
                throw new Error(`Invalid priority: ${data[field]}`);
            }
            filteredData[field] = data[field];
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
