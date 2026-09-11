const Task = require('../models/task');
const { isValidUUID } = require('../utils/validators');

async function getAllTasks(req, res, next) {
    try {
        const { status, priority } = req.query;
        let tasks = Task.findAll();
        if (status) tasks = tasks.filter(t => t.status === status);
        if (priority) tasks = tasks.filter(t => t.priority === priority);
        res.json({ tasks, total: tasks.length });
    } catch (err) {
        next(err);
    }
}

async function getTaskById(req, res, next) {
    try {
        if (!isValidUUID(req.params.id)) {
            return res.status(400).json({ error: 'Invalid task ID format' });
        }
        const task = Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        next(err);
    }
}

async function createTask(req, res, next) {
    try {
        const { title, description, status, priority, assignedTo } = req.body;
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({ error: 'title is required and must be a non-empty string' });
        }
        const task = Task.create({ title: title.trim(), description, status, priority, assignedTo });
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
}

async function updateTask(req, res, next) {
    try {
        if (!isValidUUID(req.params.id)) {
            return res.status(400).json({ error: 'Invalid task ID format' });
        }
        const task = Task.update(req.params.id, req.body);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        next(err);
    }
}

async function deleteTask(req, res, next) {
    try {
        if (!isValidUUID(req.params.id)) {
            return res.status(400).json({ error: 'Invalid task ID format' });
        }
        const deleted = Task.remove(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Task not found' });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
