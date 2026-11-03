function createStore() {
  const tasks = [];
  let nextId = 1;

  return {
    list() {
      return tasks;
    },

    add(title) {
      if (typeof title !== 'string' || title.trim() === '') {
        throw new Error('title is required');
      }
      if (title.length > 100) {
        throw new Error('title must be 100 characters or fewer');
      }
      const task = { id: nextId++, title: title.trim(), done: false };
      tasks.push(task);
      return task;
    },

    complete(id) {
      const task = tasks.find((t) => t.id === id);
      if (!task) return null;
      task.done = true;
      return task;
    },
  };
}

module.exports = { createStore };
