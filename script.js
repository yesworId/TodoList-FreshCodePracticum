const STORAGE_KEY = 'todoNotebookTasks';

let tasks = [];

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      tasks = JSON.parse(stored);
      if (!Array.isArray(tasks)) tasks = [];
    } catch (e) {
      console.error('Не вдалося розпарсити tasks з localStorage', e);
      tasks = [];
    }
  } else {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;

  if (task.completed) {
    li.classList.add('completed');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    toggleTaskCompleted(task.id);
  });

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = task.text;

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.innerHTML = '&times;';
  delBtn.title = 'Видалити';
  delBtn.addEventListener('click', () => {
    deleteTask(task.id);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);

  return li;
}

function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Список завдань порожній.';
    emptyMsg.style.opacity = '0.6';
    taskList.appendChild(emptyMsg);
    return;
  }

  tasks.forEach(task => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  });
}

function addTask(text) {
  const trimmed = text.trim();
  if (trimmed === '') return;
  const newTask = {
    id: Date.now().toString(),
    text: trimmed,
    completed: false
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleTaskCompleted(taskId) {
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx !== -1) {
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value;
  addTask(text);
  taskInput.value = '';
});

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  renderTasks();
});