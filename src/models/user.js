const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const users = [];

async function findAll() {
    return users.map(({ password, ...u }) => u);
}

async function findById(id) {
    const user = users.find(u => u.id === id);
    if (!user) return null;
    const { password, ...safe } = user;
    return safe;
}

async function findByEmail(email) {
    return users.find(u => u.email === email) || null;
}

async function create(data) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        password: hashed,
        role: data.role || 'member',
        createdAt: new Date().toISOString(),
    };
    users.push(user);
    const { password, ...safe } = user;
    return safe;
}

async function validatePassword(user, plain) {
    return bcrypt.compare(plain, user.password);
}

module.exports = { findAll, findById, findByEmail, create, validatePassword };
