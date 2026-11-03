const test = require('node:test');
const assert = require('node:assert');
const { createStore } = require('../src/tasks');

test('adds a task with a trimmed title', () => {
  const store = createStore();
  const task = store.add('  write my first workflow  ');
  assert.strictEqual(task.title, 'write my first workflow');
  assert.strictEqual(task.done, false);
});

test('rejects an empty title', () => {
     const store = createStore();
      assert.throws(() => store.add('   '), /title is required/);
});

test('rejects a title longer than 100 characters', () => {
  const store = createStore();
  assert.throws(() => store.add('x'.repeat(101)), /100 characters/);
});

test('marks a task as done', () => {
  const store = createStore();
  const task = store.add('push to main');
  assert.strictEqual(store.complete(task.id).done, true);
});

test('returns null when completing a missing task', () => {
  const store = createStore();
  assert.strictEqual(store.complete(999), null);
});
