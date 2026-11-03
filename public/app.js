const list = document.getElementById('tasks');
const form = document.getElementById('new-task');
const input = document.getElementById('title');

async function load() {
  const tasks = await (await fetch('/api/tasks')).json();
  list.innerHTML = '';
  for (const task of tasks) {
    const li = document.createElement('li');
    li.textContent = task.title;
    if (task.done) li.className = 'done';
    li.onclick = async () => {
      await fetch(`/api/tasks/${task.id}/done`, { method: 'PATCH' });
      load();
    };
    list.appendChild(li);
  }
}

form.onsubmit = async (event) => {
  event.preventDefault();
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value }),
  });
  input.value = '';
  load();
};

fetch('/health')
  .then((res) => res.json())
  .then((info) => {
    document.getElementById('version').textContent = `version: ${info.version}`;
  });

load();
