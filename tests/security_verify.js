const Task = require('../src/models/task');
const assert = require('assert');

async function testMassAssignment() {
    console.log('Running testMassAssignment...');
    const task = Task.create({ title: 'Original Task' });
    const originalId = task.id;
    const originalCreatedAt = task.createdAt;

    // Attempt to update restricted fields
    const updatedTask = Task.update(originalId, {
        id: 'new-id',
        createdAt: '2000-01-01T00:00:00.000Z',
        title: 'Updated Task'
    });

    assert.strictEqual(updatedTask.id, originalId, 'ID should not be updatable');
    assert.strictEqual(updatedTask.createdAt, originalCreatedAt, 'createdAt should not be updatable');
    assert.strictEqual(updatedTask.title, 'Updated Task', 'title should be updatable');
    console.log('✅ testMassAssignment passed');
}

async function testEnumValidation() {
    console.log('Running testEnumValidation...');
    const task = Task.create({ title: 'Enum Test' });

    // Test create with invalid status
    try {
        Task.create({ title: 'Invalid Status', status: 'invalid' });
        assert.fail('Should have thrown error for invalid status in create');
    } catch (err) {
        assert.ok(err.message.includes('Invalid status'), 'Error message should mention invalid status');
    }

    // Test update with invalid priority
    try {
        Task.update(task.id, { priority: 'super-high' });
        assert.fail('Should have thrown error for invalid priority in update');
    } catch (err) {
        assert.ok(err.message.includes('Invalid priority'), 'Error message should mention invalid priority');
    }

    console.log('✅ testEnumValidation passed');
}

async function runTests() {
    try {
        await testMassAssignment();
        await testEnumValidation();
        console.log('\nAll security verification tests passed! 🛡️');
    } catch (err) {
        console.error('\nTests failed:');
        console.error(err);
        process.exit(1);
    }
}

runTests();
