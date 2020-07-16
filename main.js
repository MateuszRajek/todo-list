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
        if (item.startsWith('todos-id-')) {
            latestId++;
        }
};

function createListElement(text) {
    const listElement = document.createElement('li');
    listElement.classList.add('list-element');
    const checkboxIcon = document.createElement('i');
    checkboxIcon.className = 'far fa-circle checkbox-circle-icon';
    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-ban cancel-circle-icon';
    const completedIcon = document.createElement('i');
    completedIcon.className = 'far fa-check-circle completed-task-circle-icon switcher';
    const listInput = document.createElement('p');
    listInput.className = 'list-element-content-paragraph';
    listInput.textContent = text;
    textContentInput.value = '';
    listElement.appendChild(checkboxIcon);
    listElement.appendChild(listInput);
    listElement.appendChild(deleteIcon);
    return listElement;
};

function addListElement() {
    const li = createListElement(textContentInput.value);
    ulList.appendChild(li);
    const name = li.textContent;
    li.id = `todos-id-${latestId}`;
    latestId++;
    localStorage.setItem(li.id, name);
};

function formListElementsFromLocalStorage() {
    for (let item in localStorage) {
        if (localStorage.hasOwnProperty(item)) {
            const li = createListElement(localStorage[item]);
            li.id = item;
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

    ulList.addEventListener('click', function (event) {
        if (event.target.classList.contains('cancel-circle-icon')) {
            event.target.parentElement.classList.add('slideout-before-remove')
            setTimeout(() => {
                event.target.parentElement.remove();
                localStorage.removeItem(event.target.parentElement.id)
            }, 500);
        } else if (event.target.classList.contains('checkbox-circle-icon')) {
            event.target.className = 'far fa-check-circle completed-task-circle-icon';
            event.target.nextSibling.classList.add('task-done');
        } else if (event.target.classList.contains('completed-task-circle-icon')) {
            event.target.className = 'far fa-circle checkbox-circle-icon';
            event.target.nextSibling.classList.remove('task-done');
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
    oldText.innerText = modalInput.value;
    event.target.parentElement.remove();
};

document.addEventListener('DOMContentLoaded', main);