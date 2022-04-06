const addTaskButton = document.querySelector('.add-task-button');
const addTaskInput = document.querySelector('.description-task');
const todosWrapper = document.querySelector('.tasks-wrapper');
const taskLengthLimit = document.querySelector('.task-length-limit');

const activeTasksCount = document.querySelector('.active-tasks-count');
const completedTasksCount = document.querySelector('.completed-tasks-count');

let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));

let todoItemElems = [];

fillHtmlList();

addTaskInput.addEventListener('keyup', () => {
    taskLengthLimit.innerHTML = `${addTaskInput.value.length} из 60`
    if(addTaskInput.value.length === 0) {
        taskLengthLimit.innerHTML = 'Не более 60 символов';
    }
    if(addTaskInput.value.length > 60) {
        taskLengthLimit.innerHTML += '. Превышен лимит длины';
        taskLengthLimit.classList.add('over-limit');
        addTaskButton.setAttribute('disabled', true);
    } else {
        taskLengthLimit.classList.remove('over-limit');
        addTaskButton.removeAttribute('disabled');
    }
})

addTaskButton.addEventListener('click', () => {
    tasks.push(new Task(addTaskInput.value));
    reloadData();
    addTaskInput.value = '';
    taskLengthLimit.innerHTML = 'Не более 60 символов';
})

function Task(description) {
    this.description = description;
    this.completed = false;
}

function updateLocal() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function fillHtmlList() {
    todosWrapper.innerHTML = '';
    if(tasks.length > 0) {
        filterTasks();
        tasks.forEach((item, index) => {
            todosWrapper.innerHTML += createTemplate(item, index);
        });
        todoItemElems = document.querySelectorAll('.task-item');
    } else {
        todosWrapper.innerHTML = 'Задач нет';
    }
}

function createTemplate(task, index) {
    return `
        <div class="task-item ${task.completed ? 'checked' : ''}">
            <div onclick="completeTask(${index})" class="description">${task.description}</div>
            <button onclick="deleteTask(${index})" class="btn-delete">DEL</button>
        </div>
    `
}

function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;
    if(tasks[index].completed) {
        todoItemElems[index].classList.add('checked');
    } else {
        todoItemElems[index].classList.remove('checked');
    }
    reloadData();
}

function deleteTask(index) {
    todoItemElems[index].classList.add('deletion')
    setTimeout(() => {
        tasks.splice(index, 1);
        reloadData();
        filterTasks();
    }, 600);
}

function filterTasks() {
    const activeTasks = tasks.filter(item => item.completed == false);
    const completedTasks = tasks.filter(item => item.completed == true);
    tasks = [...activeTasks,...completedTasks];
    showTasksCount(activeTasks, completedTasks);
}

function showTasksCount(active, completed) {
    activeTasksCount.innerHTML = `Активных задач: ${active.length}`;
    completedTasksCount.innerHTML = `Завершенных задач: ${completed.length}`;
}

function reloadData() {
    updateLocal();
    fillHtmlList();
}
