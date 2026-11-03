const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

// Starts the app on a random free port, runs the checks, then closes it.
async function withServer(fn) {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await fn(base);
  } finally {
    server.close();
  }
}

test('GET /health returns ok', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/health`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual((await res.json()).status, 'ok');
  });
});

test('POST then GET /api/tasks', async () => {
  await withServer(async (base) => {
    const created = await fetch(`${base}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'set up CI' }),
    });
    assert.strictEqual(created.status, 201);

    const list = await (await fetch(`${base}/api/tasks`)).json();
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].title, 'set up CI');
  });
});

test('POST /api/tasks without a title returns 400', async () => {
  await withServer(async (base) => {
    const res = await fetch(`${base}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.strictEqual(res.status, 400);
  });
});
