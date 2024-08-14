document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('#task-filters button');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    
    flatpickr("#task-due-date", {
        dateFormat: "d/m/Y",
        locale: "pt"
    });

    
    renderTasks();

    
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskAction);
    filterButtons.forEach(button => {
        button.addEventListener('click', applyFilter);
    });

    function addTask(e) {
        e.preventDefault();

        const title = document.getElementById('task-title').value;
        const category = document.getElementById('task-category').value;
        const priority = document.getElementById('task-priority').value;
        const dueDate = document.getElementById('task-due-date').value;

        const newTask = {
            id: Date.now(),
            title,
            category,
            priority,
            dueDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    }

    function renderTasks(filteredTasks = tasks) {
        taskList.innerHTML = '';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span class="task-title">${task.title}</span>
                <span class="task-category">${task.category}</span>
                <span class="task-priority ${task.priority}">${task.priority}</span>
                <span class="task-due-date">${task.dueDate}</span>
                <div class="task-actions">
                    <button class="complete-btn" data-id="${task.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="edit-btn" data-id="${task.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    function handleTaskAction(e) {
        const taskId = parseInt(e.target.closest('button').dataset.id);
        
        if (e.target.closest('.complete-btn')) {
            toggleTaskComplete(taskId);
        } else if (e.target.closest('.edit-btn')) {
            editTask(taskId);
        } else if (e.target.closest('.delete-btn')) {
            deleteTask(taskId);
        }
    }

    function toggleTaskComplete(id) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }

    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-category').value = task.category;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-due-date').value = task.dueDate;

            
            deleteTask(id);
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function applyFilter(e) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        const filter = e.target.id;
        let filteredTasks;

        switch (filter) {
            case 'filter-active':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'filter-completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = tasks;
        }

        renderTasks(filteredTasks);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});