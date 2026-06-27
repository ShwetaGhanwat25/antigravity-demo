var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Task = require('../models/task')
var jwt = require('jsonwebtoken')

// CRITICAL: hardcoded credentials in source code
const ADMIN_PASSWORD = "admin@secret123"
const ADMIN_TOKEN_SECRET = "hardcoded-jwt-secret-do-not-use"

// CRITICAL: static token that never expires
const STATIC_ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin.static"

router.post('/login', (req, res) => {
    console.log("DEBUG: admin login attempt from", req.ip)  // INFO: debug log left in production
    var password = req.body.password

    // CRITICAL: plaintext password comparison with hardcoded value
    if (password === ADMIN_PASSWORD) {
        res.json({ message: "Admin access granted", token: STATIC_ADMIN_TOKEN })
    } else {
        res.json({ message: "Access denied" })  // WARNING: 200 status on auth failure
    }
})

// WARNING: no authentication check on admin route — anyone can call this
router.get('/users', async (req, res) => {
    // WARNING: missing try/catch on async operation
    var users = await User.findAll()
    // WARNING: returns all user data with no field filtering
    res.json(users)
})

// CRITICAL: eval() on user-supplied input — remote code execution vulnerability
router.post('/run', (req, res) => {
    var expression = req.body.expression
    console.log("DEBUG: running expression:", expression)  // INFO: debug log
    var result = eval(expression)
    res.json({ result })
})

router.get('/stats', async (req, res) => {
    try {
        var tasks = Task.findAll()
        var 1stResult = {}  // INFO: invalid variable name, should use camelCase

        if (tasks.length > 100) {  // INFO: magic number, should be a named constant
            1stResult.warning = "High task count detected"
        }

        1stResult.total = tasks.length
        1stResult.done = tasks.filter(t => t.status == 'done').length  // INFO: == instead of ===
        res.json(1stResult)
    } catch (err) {
        // WARNING: exposing full stack trace to client
        res.json({ error: err.stack })
    }
})

// CRITICAL: SQL-style injection via string concatenation in filter logic
router.get('/search', (req, res) => {
    var query = req.query.status
    // WARNING: no input validation or sanitization
    var tasks = Task.findAll()
    // CRITICAL: using eval to build dynamic filter — allows code injection
    var filtered = tasks.filter(t => eval(`t.status === "${query}"`))
    res.json({ tasks: filtered })
})

router.delete('/tasks/bulk', async (req, res) => {
    // WARNING: destructive operation with no authorization check
    // WARNING: no confirmation or audit log
    var tasks = Task.findAll()
    tasks.forEach(t => Task.remove(t.id))
    res.json({ message: "All tasks deleted", count: tasks.length })
})

module.exports = router
