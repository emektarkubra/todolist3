const addTodoForm = document.querySelector("#add-todo-form");
const addTodoInput = document.querySelector("#add-todo-input");
const addButton = document.querySelector("#add-btn");
const listGroup = document.querySelector(".list-groups");
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filterInput = document.querySelector("#filter-todo-input");
const removeButton = document.querySelector("#clear-btn");


addButton.addEventListener("click", addTodo);
addTodoForm.addEventListener("submit", addTodo);
document.addEventListener("DOMContentLoaded", pageLoad);
secondCardBody.addEventListener("click", removeItem);
filterInput.addEventListener("keyup", filterTodo);
removeButton.addEventListener("click", removeAllTodos);
listGroup.addEventListener("click", editTodos);



function addTodoToUi(value) {

    let data = {
        value: value,
        checked: false,
    }

    const li = document.createElement("li");
    li.className = "list-group-item";

    const todoForm = document.createElement("form");
    todoForm.action = "#";
    todoForm.className = "item-form";

    const checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.name = "checkedInput";
    checkInput.id = "checked-input";
    checkInput.checked = false;


    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.name = "itemInput";
    textInput.id = "item-input";
    textInput.value = data.value;
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
        value: addTodoInput.value.trim(),
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
    if (addTodoInput.value.trim() === "" || addTodoInput.value === null) {
        createAlert("Please, enter a todo!", "white")
    } else {
        // adding to Ui
        addTodoToUi(addTodoInput.value.trim());

        // adding to storage
        addTodoToStorage();
    }

    addTodoInput.value = "";
    e.preventDefault();
}


function pageLoad(e) {
    // for Ui
    const todoList = JSON.parse(localStorage.getItem("todoList"));

    todoList.forEach(data => {
        addTodoToUi(data.value);

    });

    // for checked 
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

function filterTodo(e) {
    filterValue = e.target.value.toUpperCase().trim();
    const todos = document.querySelectorAll(".list-group-item");
    todos.forEach(todo => {
        todoValue = todo.children[0].children[1].value.toUpperCase().trim();
        if (todoValue.includes(filterValue)) {
            todo.setAttribute("style", "display:block");
        } else {
            todo.setAttribute("style", "display:none");
        }
    })
}

function removeAllTodos(e) {
    // remove from Ui
    const todos = document.querySelectorAll(".list-group-item");
    todos.forEach(todo => {
        todo.remove();
    })

    // remove from Storage
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList.splice(0, todoList.length);
    localStorage.setItem("todoList", JSON.stringify(todoList));

    createAlert("Removed all tasks!", "white")
}

function editTodos(e) {

    // 1.step : focusing todo input
    if (e.target.className === "fa fa-edit") {
        const todoInput = e.target.previousElementSibling;
        todoInput.removeAttribute("disabled");
        todoInput.focus();

        // 2.step- editing in Ui and Storage
        const todoList = JSON.parse(localStorage.getItem("todoList"));
        const todoForm = e.target.parentElement;
        todoList.forEach((data) => {
            if (todoInput.value == data.value) {
                let index = todoList.indexOf(data);
                todoForm.addEventListener("submit", (e) => {
                    const editedValue = e.target.children[1].value;
                    todoList[index].value = editedValue;
                    todoInput.value = editedValue;
                    todoInput.setAttribute("style", "disabled:disabled");
                    todoInput.blur();
                    localStorage.setItem("todoList", JSON.stringify(todoList));
                    e.preventDefault();
                })
            }
        })
    }


    checkedTodos(e);
}

function checkedTodos(e) {
    let todoInput = e.target.nextElementSibling;
    const todoList = JSON.parse(localStorage.getItem("todoList"));
    todoList.forEach(data => {
        if (data.value == todoInput.value) {
            let index = todoList.indexOf(data);
            if (e.target.checked) {
                todoInput.style.color = "rgb(61, 60, 60)";
                todoInput.style.textDecoration = "line-through";
                todoList[index].checked = true;
            } else {
                todoInput.style.color = "rgb(204, 194, 194)";
                todoInput.style.textDecoration = "none";
                todoList[index].checked = false;
            }
        }
    })
    localStorage.setItem("todoList", JSON.stringify(todoList));
}