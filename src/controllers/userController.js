const User = require('../models/user');
const { isValidUUID } = require('../utils/validators');

async function getAllUsers(req, res, next) {
    try {
        const users = await User.findAll();
        res.json({ users, total: users.length });
    } catch (err) {
        next(err);
    }
}

async function getUserById(req, res, next) {
    try {
        if (!isValidUUID(req.params.id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllUsers, getUserById };
