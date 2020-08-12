const taskToAddBtn = document.querySelector('.task-to-add-btn');
const ulList = document.querySelector('.list');
const textContentInput = document.getElementById('task-to-do');
let latestId = 1;


function main() {
    events();
    formListElementsFromLocalStorage();
    setId();
};

function setId() {
    for (let item in localStorage)
        if (item.startsWith('todos')) {
            latestId++;
        }
};

function addTodosToLocalStorage(id, currentStatus, textContent) {
    const todos = {
        'id': id,
        'task-status': currentStatus,
        'content': textContent
    }

    localStorage.setItem(`todos-${id}`, JSON.stringify(todos));
    // const itemsFromLocalStorage = localStorage.getItem(todos)
    // console.log('itemsFromLocalStorage: ', JSON.parse(itemsFromLocalStorage))
}

function createListElement(text, status) {
    const listElement = document.createElement('li');
    listElement.classList.add('list-element');
    const checkboxIcon = document.createElement('i');
    checkboxIcon.className = 'far fa-circle checkbox-circle-icon';
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-ban cancel-circle-icon';
    const completedIcon = document.createElement('i');
    completedIcon.className = 'far fa-check-circle completed-task-circle-icon';
    const listInput = document.createElement('p');
    listInput.className = 'list-element-content-paragraph';
    listInput.textContent = text;
    textContentInput.value = '';

    listElement.appendChild(status === 'completed' ? (completedIcon) : checkboxIcon);
    listElement.appendChild(listInput);
    listElement.appendChild(deleteIcon);
    return listElement;
};

function addListElement() {
    const li = createListElement(textContentInput.value);
    ulList.appendChild(li);
    const name = li.textContent;
    li.id = latestId
    latestId++;
    const status = 'processing';
    addTodosToLocalStorage(li.id, status, name)
};

function formListElementsFromLocalStorage() {

    for (let item in localStorage) {
        if (localStorage.hasOwnProperty(item) && item.startsWith('todos')) {
            const itemsFromLocalStorage = localStorage.getItem(item)
            const todo = JSON.parse(itemsFromLocalStorage)
            const status = todo['task-status'];
            const li = createListElement(todo.content, status);
            li.id = todo.id;
            ulList.appendChild(li);
        }
    }
};

function events() {
    taskToAddBtn.addEventListener('click', function () {
        if (textContentInput.value !== '') {
            addListElement();
        } else alert(`"what do you need to do" field is empty!!!`.toUpperCase());
    });
    textContentInput.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 && textContentInput.value !== '') {
            addListElement();
        } else if (event.keyCode === 13 && textContentInput.value === '') {
            alert(`"what do you need to do" field is empty!!!`.toUpperCase());
        };
    });

    function TaskCircleChanger(taskStatus) {
        const task = event.target.closest('li');
        const paragraph = event.target.nextSibling;
        let content = paragraph.innerText;
        console.log(content)
        const status = taskStatus;
        addTodosToLocalStorage(task.id, status, content)
    }

    ulList.addEventListener('click', function (event) {

        if (event.target.classList.contains('cancel-circle-icon')) {
            event.target.parentElement.classList.add('slideout-before-remove')
            setTimeout(() => {
                event.target.parentElement.remove();
                const id = event.target.parentElement.id
                localStorage.removeItem(`todos-${id}`)
                console.log(event.target.parentElement.id)
            }, 500);
        } else if (event.target.classList.contains('checkbox-circle-icon')) {
            event.target.className = 'far fa-check-circle completed-task-circle-icon';
            event.target.nextSibling.classList.add('task-done');
            const status = 'completed';
            TaskCircleChanger(status)
        } else if (event.target.classList.contains('completed-task-circle-icon')) {
            event.target.className = 'far fa-circle checkbox-circle-icon';
            event.target.nextSibling.classList.remove('task-done');
            const status = 'processing-edited';
            TaskCircleChanger(status)
        } else if (event.target.classList.contains('save-changes-button')) {
            closeEditTaskModal(event);
        };
    })

    ulList.addEventListener('dblclick', editTask);
};

function createModal() {
    const modal = document.createElement('p');
    modal.classList.add('paragraph-editable-modal');
    const modalInput = document.createElement('input');
    modalInput.classList.add('edit-task-input');
    const modalText = event.target.textContent;
    modalInput.value = modalText;
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'save';
    saveBtn.classList.add('save-changes-button');
    modal.appendChild(modalInput);
    modal.appendChild(saveBtn);
    return modal;
};

function editTask(event) {
    if (event.target.classList.contains('task-done')) {
        alert('this task is completed!!!'.toUpperCase());
    } else if (event.target.tagName.toLowerCase() === 'p') {
        const modal = createModal();
        event.target.appendChild(modal);
    }
};

function closeEditTaskModal(event) {
    const oldText = event.target.closest('.list-element-content-paragraph');
    const modalInput = event.target.parentElement.querySelector('input');
    const status = 'processing-edited';
    const id = event.target.closest('li').id;
    oldText.innerText = modalInput.value;
    console.log(id, oldText)
    addTodosToLocalStorage(id, status, modalInput.value)
    event.target.parentElement.remove();
};

document.addEventListener('DOMContentLoaded', main);