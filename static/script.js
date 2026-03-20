document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('add-task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');

    let tasks = [];

    // Fetch initial tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch('/api/tasks');
            tasks = await response.json();
            renderTasks();
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Add new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (!title) return;

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, completed: false })
            });
            const newTask = await response.json();
            tasks.push(newTask);
            taskInput.value = '';
            renderTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    // Toggle completion status
    const toggleTask = async (id, currentStatus) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: task.title, completed: !currentStatus })
            });
            const updatedTask = await response.json();
            tasks = tasks.map(t => t.id === id ? updatedTask : t);
            renderTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Edit task inline
    const prepareEditTask = (id) => {
        tasks = tasks.map(t => t.id === id ? { ...t, isEditing: true } : { ...t, isEditing: false });
        renderTasks();
    };

    const saveEditTask = async (id, newTitle) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        if (!newTitle.trim()) {
            cancelEditTask(id);
            return;
        }

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle.trim(), completed: task.completed })
            });
            const updatedTask = await response.json();
            updatedTask.isEditing = false;
            tasks = tasks.map(t => t.id === id ? updatedTask : t);
            renderTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const cancelEditTask = (id) => {
        tasks = tasks.map(t => t.id === id ? { ...t, isEditing: false } : t);
        renderTasks();
    };

    // Render tasks to DOM
    const renderTasks = () => {
        taskList.innerHTML = '';
        
        let remaining = 0;

        tasks.forEach(task => {
            if (!task.completed) remaining++;

            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            if (task.isEditing) {
                li.innerHTML = `
                    <div class="checkbox" onclick="window.toggleTask(${task.id}, ${task.completed})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <input type="text" class="edit-input" value="${escapeHTML(task.title)}" onblur="window.saveEditTask(${task.id}, this.value)" onkeydown="if(event.key === 'Enter') this.blur(); if(event.key === 'Escape') window.cancelEditTask(${task.id});">
                    <button class="delete-btn" onclick="window.deleteTask(${task.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                `;
            } else {
                li.innerHTML = `
                    <div class="checkbox" onclick="window.toggleTask(${task.id}, ${task.completed})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span class="task-text">${escapeHTML(task.title)}</span>
                    <button class="edit-btn" onclick="window.prepareEditTask(${task.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                    </button>
                    <button class="delete-btn" onclick="window.deleteTask(${task.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                `;
            }
            
            taskList.appendChild(li);
        });

        taskCounter.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} remaining`;

        const editInput = document.querySelector('.edit-input');
        if (editInput) {
            editInput.focus();
            const val = editInput.value;
            editInput.value = '';
            editInput.value = val;
        }
    };

    // Helper to escape HTML and prevent XSS
    const escapeHTML = (str) => {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    };

    // Expose functions to global window object for inline onclick handlers
    window.toggleTask = toggleTask;
    window.deleteTask = deleteTask;
    window.prepareEditTask = prepareEditTask;
    window.saveEditTask = saveEditTask;
    window.cancelEditTask = cancelEditTask;

    // Initial load
    fetchTasks();
});
