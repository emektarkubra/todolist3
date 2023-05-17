const addTodoForm = document.querySelector("#add-todo-form");
const addTodoInput = document.querySelector("#add-todo-input");
const addButton = document.querySelector("#add-btn");
const listGroup = document.querySelector(".list-groups");
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filterInput = document.querySelector("#filter-todo-input");
const removeButton = document.querySelector("#clear-btn");
const addedItemText = document.querySelector(".num-of-added");
const editedItemText = document.querySelector(".num-of-edited");
const completedItemText = document.querySelector(".num-of-completed")

events();

function events() {
    addButton.addEventListener("click", addTodo);
    addTodoForm.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", pageLoad);
    secondCardBody.addEventListener("click", removeItem);
    filterInput.addEventListener("keyup", filterTodo);
    removeButton.addEventListener("click", removeAllTodos);
    listGroup.addEventListener("click", editTodos);
}

addedItemText.textContent = `${0} items`;
editedItemText.textContent = `${0} items`;
completedItemText.textContent = `${0} items`;
let numOfAddedItem = 0;
let numOfEditedItem = 0;
let numOfCompletedItem = 0;


function numOfAddedItemInUi() {
    numOfAddedItem++;
    addedItemText.textContent = `${numOfAddedItem} items`;
}

function numOfEditedItemInUi() {
    numOfEditedItem++;
    editedItemText.textContent = `${numOfEditedItem} items`;
}

function addNumOfAddedItemToStorage() {
    if (localStorage.getItem("numOfItem") === null) {
        let numOfItem = 1;
        localStorage.setItem("numOfItem", JSON.stringify(numOfItem));
    } else {
        let numOfItem = JSON.parse(localStorage.getItem("numOfItem"));
        numOfItem = numOfAddedItem;
        localStorage.setItem("numOfItem", JSON.stringify(numOfItem));
    }
}

function addNumOfEditedItemToStorage() {
    if (localStorage.getItem("editedItem") === null) {
        let editedItem = 1;
        localStorage.setItem("editedItem", JSON.stringify(editedItem));
    } else {
        let editedItem = JSON.parse(localStorage.getItem("editedItem"));
        editedItem++;
        localStorage.setItem("editedItem", JSON.stringify(editedItem));
    }
}

function addTodoToUi(data) {

    const li = document.createElement("li");
    li.className = "list-group-item";

    const todoForm = document.createElement("form");
    todoForm.action = "#";
    todoForm.className = "item-form";

    const checkInput = document.createElement("input");
    checkInput.type = "checkbox";
    checkInput.name = "checkedInput";
    checkInput.id = "checked-input";
    checkInput.checked = data.checked;

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.name = "itemInput";
    textInput.id = "item-input";
    textInput.value = data.value.trim();
    textInput.disabled = "disabled";

    if (data.checked) {
        textInput.style.color = "rgb(61, 60, 60)";
        textInput.style.textDecoration = "line-through";
    }

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
        createAlert("Please, enter a task!", "orangered");
    } else {
        // adding to Ui
        addTodoToUi(addTodoInput);

        // adding to number of item to Ui
        numOfAddedItemInUi();

        // adding to storage
        addTodoToStorage();

        //adding to number of item to Storage
        addNumOfAddedItemToStorage();
    }

    addTodoInput.value = "";
    e.preventDefault();
}

function pageLoad(e) {
    // for Todos
    const todoList = JSON.parse(localStorage.getItem("todoList"));

    todoList.forEach(data => {
        addTodoToUi(data);
    });

    // for number of added items
    const numOfItem = JSON.parse(localStorage.getItem("numOfItem"));
    addedItemText.textContent = `${numOfItem} items`;

    // for number of edited items
    const editedItem = JSON.parse(localStorage.getItem("editedItem"));
    editedItemText.textContent = `${editedItem} items`;

    //for number of completed items
    const completedItem = JSON.parse(localStorage.getItem("completedItem"));
    completedItemText.textContent = `${completedItem} items`;
}

function removeItem(e) {

    if (e.target.className == "fa fa-remove") {
        // remove todo from Ui
        e.target.parentElement.parentElement.remove();

        // remove todo from storage
        let todoValue = e.target.previousElementSibling.previousElementSibling.value;
        const todoList = JSON.parse(localStorage.getItem("todoList"));
        todoList.forEach((data) => {
            if (data.value == todoValue) {
                let index = todoList.indexOf(data);
                todoList.splice(index, 1);
            }
            localStorage.setItem("todoList", JSON.stringify(todoList));
        })

        // decreasing number of added items from Storage 
        let numOfItem = JSON.parse(localStorage.getItem("numOfItem"));
        numOfItem--;
        localStorage.setItem("numOfItem", JSON.stringify(numOfItem));

        // decreasing number of added items from Ui 
        numOfAddedItem--;
        addedItemText.textContent = `${numOfItem} items`;

        // decreasing number of completed items from Ui 
        if (e.target.parentElement.children[0].checked) {
            let completedItem = JSON.parse(localStorage.getItem("completedItem"));
            completedItem--;
            completedItemText.textContent = `${completedItem} items`;
            localStorage.setItem("completedItem", JSON.stringify(completedItem));
        }

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

    createAlert("Removed all tasks!", "orangered");

    // reset of number of added items in Ui 

    numOfAddedItem = 0;
    addedItemText.textContent = `${numOfAddedItem} items`;

    // reset of number of added items in Storage 
    let numOfItem = JSON.parse(localStorage.getItem("numOfItem"));
    numOfItem = 0;
    localStorage.setItem("numOfItem", JSON.stringify(numOfItem));

    // reset of number of added items in Ui
    numOfEditedItem = 0;
    editedItemText.textContent = `${numOfEditedItem} items`;

    // reset of number of added items in Storage
    let editedItem = JSON.parse(localStorage.getItem("editedItem"));
    editedItem = 0;
    localStorage.setItem("editedItem", JSON.stringify(editedItem));

    // reset of number of completed items in Ui
    numOfCompletedItem = 0;
    completedItemText.textContent = `${numOfCompletedItem} items`;

    //reset of number of completed items in Storage
    let completedItem = JSON.parse(localStorage.getItem("completedItem"));
    completedItem = 0;
    localStorage.setItem("completedItem", JSON.stringify(completedItem));

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
        numOfEditedItemInUi();
        addNumOfEditedItemToStorage();
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

                // adding number of completed items to UI and Storage
                let numOfCompletedItem = JSON.parse(localStorage.getItem("completedItem"));
                numOfCompletedItem++;
                completedItemText.textContent = `${numOfCompletedItem} items`;
                localStorage.setItem("completedItem", JSON.stringify(numOfCompletedItem));


            } else {
                todoInput.style.color = "rgb(204, 194, 194)";
                todoInput.style.textDecoration = "none";
                todoList[index].checked = false;

                // decreasing number of completed items to UI and Storage
                let numOfCompletedItem = JSON.parse(localStorage.getItem("completedItem"));
                numOfCompletedItem--;
                completedItemText.textContent = `${numOfCompletedItem} items`;
                localStorage.setItem("completedItem", JSON.stringify(numOfCompletedItem));
            }
        }
    })
    localStorage.setItem("todoList", JSON.stringify(todoList));
}