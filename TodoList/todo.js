const addTodoForm = document.querySelector("#add-todo-form");
const todoInput = document.querySelector("#add-todo-input");
const addButton = document.querySelector("#add-btn");
const listGroup = document.querySelector(".list-groups");
const secondCardBody = document.querySelectorAll(".card-body")[1];


addButton.addEventListener("click", addTodo);
addTodoForm.addEventListener("submit", addTodo);
document.addEventListener("DOMContentLoaded", pageLoad);
secondCardBody.addEventListener("click", removeItem);



function addTodoToUi(value) {
    const li = document.createElement("li");
    li.className = "list-group-item";

    const todoForm = document.createElement("form");
    todoForm.action = "#";
    todoForm.className = "item-form";

    const checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.name = "checkedInput";
    checkInput.id = "checked-input";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.name = "itemInput";
    textInput.id = "item-input";
    textInput.value = value;
    textInput.disabled = "disabled";

    const editIcon = document.createElement("i");
    editIcon.className = "fa fa-edit";

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa fa-remove";

    const list = listGroup.appendChild(li).appendChild(todoForm);
    list.appendChild(checkInput);
    list.appendChild(textInput);
    list.appendChild(editIcon);
    list.appendChild(deleteIcon);
}

function addTodoToStorage() {
    let data = {
        value: todoInput.value.trim(),
        checked: false
    }
    if (localStorage.getItem("todoList") === null) {
        let todoList = [];
        todoList.push(data);
        localStorage.setItem("todoList", JSON.stringify(todoList));
    } else {
        let todoList = JSON.parse(localStorage.getItem("todoList"));
        todoList.push(data);
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }
}

function createAlert(message, color) {
    const alertBox = document.querySelector("#alert");
    alertBox.textContent = message;
    alertBox.style.color = color;

    setTimeout(() => {
        alertBox.textContent = "";
    }, 1500);
}

function addTodo(e) {
    if (todoInput.value.trim() === "" || todoInput.value === null) {
        createAlert("Please, enter a todo!", "green")
    } else {
        // adding to Ui
        addTodoToUi(todoInput.value.trim());

        // adding to storage
        addTodoToStorage();
    }

    todoInput.value = "";
    e.preventDefault();
}


function pageLoad(e) {
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList.forEach(data => {
        addTodoToUi(data.value);
    });
}

function removeItem(e) {

    if (e.target.className == "fa fa-remove") {
        // remove from Ui
        e.target.parentElement.parentElement.remove();

        // remove from storage
        let todoValue = e.target.previousElementSibling.previousElementSibling.value;
        const todoList = JSON.parse(localStorage.getItem("todoList"));
        todoList.forEach((data) => {
            if (data.value == todoValue) {
                let index = todoList.indexOf(data);
                todoList.splice(index, 1);
            }
            localStorage.setItem("todoList", JSON.stringify(todoList));
        })
    }
}