const Task = require('./src/models/task');
const assert = require('assert');

async function test() {
    console.log('Running security fix verification...');

    // 1. Create a task
    const task = Task.create({ title: 'Test Task', status: 'todo', priority: 'medium' });
    const originalId = task.id;
    const originalCreatedAt = task.createdAt;
    console.log(`Task created with ID: ${originalId}`);

    // 2. Attempt mass assignment attack via update
    console.log('Attempting to overwrite id and createdAt...');
    const maliciousData = {
        id: 'hacked-id',
        createdAt: '2000-01-01T00:00:00.000Z',
        status: 'done'
    };

    const updatedTask = Task.update(originalId, maliciousData);

    assert.strictEqual(updatedTask.id, originalId, 'ID should NOT have been changed');
    assert.strictEqual(updatedTask.createdAt, originalCreatedAt, 'createdAt should NOT have been changed');
    assert.strictEqual(updatedTask.status, 'done', 'Status SHOULD have been updated');
    console.log('✅ Mass assignment attempt blocked successfully.');

    // 3. Test invalid enum validation
    console.log('Testing invalid status validation...');
    try {
        Task.update(originalId, { status: 'invalid-status' });
        assert.fail('Should have thrown an error for invalid status');
    } catch (err) {
        assert.ok(err.message.includes('Invalid status'), 'Error message should mention invalid status');
        console.log('✅ Invalid status rejected.');
    }

    console.log('Testing invalid priority validation...');
    try {
        Task.create({ title: 'Bad Task', priority: 'ultra-high' });
        assert.fail('Should have thrown an error for invalid priority');
    } catch (err) {
        assert.ok(err.message.includes('Invalid priority'), 'Error message should mention invalid priority');
        console.log('✅ Invalid priority rejected.');
    }

    console.log('All verifications passed! 🛡️');
}

test().catch(err => {
    console.error('Verification failed ❌');
    console.error(err);
    process.exit(1);
});
