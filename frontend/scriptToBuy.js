if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
}

const inputBox = document.getElementById("input-box");
const addButton = document.getElementById("add-btn");
const listContainer = document.getElementById("list-container");

function addTask() {
    const taskText = inputBox.value.trim();

    if (taskText === '') {
        alert("You must write something!");
        return;
    }

    let li = document.createElement("li");
    li.textContent = taskText;

    let span = document.createElement("span");
    span.innerHTML = "\u00D7"; 
    span.classList.add("delete-btn");

    li.appendChild(span);
    listContainer.appendChild(li);
    
    inputBox.value = ""; // Clear input after adding
    saveData();
}

addButton.addEventListener("click", addTask);

inputBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked"); 
    } else if (e.target.classList.contains("delete-btn")) {
        e.target.parentElement.remove(); // Delete task
    }
    saveData();
});

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
    window.dispatchEvent(new Event("storage")); // Notify other pages (dashboard) about the update
}


// Load tasks from localStorage
function showTask() {
    listContainer.innerHTML = localStorage.getItem("data") || "";
}

// Load saved tasks on page load
showTask();

document.getElementById("add-btn").addEventListener("click", function() {
    let inputBox = document.getElementById("input-box");
    let listContainer = document.getElementById("list-container");

    if (inputBox.value.trim() !== "") {
        let li = document.createElement("li");
        li.textContent = inputBox.value;
        listContainer.appendChild(li);
        inputBox.value = ""; // Clear input after adding
    }
});
