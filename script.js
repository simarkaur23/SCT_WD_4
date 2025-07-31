const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const progressFill = document.querySelector('.progress-fill');
const progressText = document.getElementById('progressText');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks(filter = 'All') {
    taskList.innerHTML = '';
    const filtered = tasks.filter(t => filter === 'All' || t.category === filter);
    filtered.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `${task.completed ? 'completed' : ''} priority-${task.priority.toLowerCase()}`;
        li.innerHTML = `
            <span>${task.text} <small>(${task.category})</small> <br><small>⏰ ${task.date}</small></span>
            <div>
                <button onclick="toggleComplete(${index})">✔️</button>
                <button onclick="editTask(${index})">✏️</button>
                <button onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateProgress();
}

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (!text || !taskDate.value) return alert('Please fill all fields!');
    tasks.push({
        text,
        category: categorySelect.value,
        priority: prioritySelect.value,
        date: taskDate.value,
        completed: false
    });
    taskInput.value = '';
    taskDate.value = '';
    renderTasks();
});

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

function editTask(index) {
    const newText = prompt('Edit Task:', tasks[index].text);
    if (newText) {
        tasks[index].text = newText;
        renderTasks();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

function filterTasks(category) {
    renderTasks(category);
}

function searchTasks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('#taskList li').forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(query) ? 'flex' : 'none';
    });
}

function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${percentage}% Completed`;
}

function toggleTheme() {
    document.body.classList.toggle('dark');
}

renderTasks();
