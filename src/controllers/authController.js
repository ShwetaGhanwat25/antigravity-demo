const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { isValidEmail } = require('../utils/validators');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '24h';

async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email, and password are required' });
        }
        // 🛡️ Sentinel: Validate email format to prevent invalid registration entries.
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'invalid email format' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'password must be at least 8 characters' });
        }
        const existing = await User.findByEmail(email);
        if (existing) {
            return res.status(409).json({ error: 'email already registered' });
        }
        const user = await User.create({ name, email, password });
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        res.status(201).json({ user, token });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }
        const user = await User.findByEmail(email);
        if (!user || !(await User.validatePassword(user, password))) {
            return res.status(401).json({ error: 'invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
    } catch (err) {
        next(err);
    }
}

module.exports = { register, login };
