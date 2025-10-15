(() => {
  const STORAGE_KEY = 'simple_todo_v1';
  const input = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const listEl = document.getElementById('todo-list');
  const filters = document.querySelectorAll('.filters button');
  const clearBtn = document.getElementById('clear-completed');
  const countEl = document.getElementById('count');

  let todos = [];
  let currentFilter = 'all';

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    todos = raw ? JSON.parse(raw) : [];
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return false;
    todos.unshift({ id: uid(), text: trimmed, done: false });
    save();
    render();
    return true;
  }

  function toggleTodo(id) {
    const t = todos.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    save();
    render();
  }

  function removeTodo(id) {
    todos = todos.filter(x => x.id !== id);
    save();
    render();
  }

  function clearCompleted() {
    todos = todos.filter(x => !x.done);
    save();
    render();
  }

  function filtered() {
    if (currentFilter === 'active') return todos.filter(t => !t.done);
    if (currentFilter === 'completed') return todos.filter(t => t.done);
    return todos;
  }

  function updateCount(){
    const left = todos.filter(t => !t.done).length;
    countEl.textContent = `${left} item${left !== 1 ? 's' : ''} left`;
  }

  function render() {
    listEl.innerHTML = '';
    const items = filtered();
    if (items.length === 0) {
      listEl.innerHTML = '<li class="item"><label style="color:#94a3b8">No tasks</label></li>';
      updateCount();
      return;
    }
    for (const t of items) {
      const li = document.createElement('li');
      li.className = 'item' + (t.done ? ' completed' : '');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.done;
      cb.addEventListener('change', () => toggleTodo(t.id));

      const label = document.createElement('label');
      label.textContent = t.text;

      const del = document.createElement('button');
      del.className = 'delete';
      del.textContent = '🗑';
      del.addEventListener('click', () => removeTodo(t.id));

      li.append(cb, label, del);
      listEl.append(li);
    }
    updateCount();
  }

  addBtn.addEventListener('click', () => {
    if (addTodo(input.value)) input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && addTodo(input.value)) input.value = '';
  });

  filters.forEach(b => {
    b.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      currentFilter = b.dataset.filter;
      render();
    });
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('完了済みをすべて削除しますか？')) clearCompleted();
  });

  load();
  render();
})();
