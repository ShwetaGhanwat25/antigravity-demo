const { v4: uuidv4 } = require('uuid');

const tasks = [];

const TaskStatus = { TODO: 'todo', IN_PROGRESS: 'in_progress', DONE: 'done' };
const TaskPriority = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };

function findAll() { return tasks; }

function findById(id) { return tasks.find(t => t.id === id) || null; }

function create(data) {
    // 🛡️ Sentinel: Enforce valid status and priority on creation
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

    // 🛡️ Sentinel: Mass assignment protection. Only allow specific fields to be updated.
    const allowedFields = ['title', 'description', 'status', 'priority', 'assignedTo'];
    const filteredData = {};

    Object.keys(data).forEach(key => {
        if (allowedFields.includes(key)) {
            // Validate status if it's being updated
            if (key === 'status' && !Object.values(TaskStatus).includes(data[key])) {
                return; // Skip invalid status
            }
            // Validate priority if it's being updated
            if (key === 'priority' && !Object.values(TaskPriority).includes(data[key])) {
                return; // Skip invalid priority
            }
            filteredData[key] = data[key];
        }
    });

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
