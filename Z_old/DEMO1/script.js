const budgetNames = []; // Array to store created budget names
const budgets = {}; // Object to store budgets with their amounts and expenses

function BdgetCreation() {
let name = document.querySelector(".js-1st-input").value;
let amount = parseFloat(document.querySelector(".js-2nd-input").value);

if (!name || isNaN(amount) || amount <= 0) {
alert("Please fill in valid budget name and amount.");
return;
}

budgetNames.push(name);
budgets[name] = { amount: amount, expenses: 0 };

let randomColor = getRandomColor();

let newBudgetDiv = document.createElement("div");
newBudgetDiv.classList.add("created-budget");
newBudgetDiv.style.border = `2px solid ${randomColor}`;
newBudgetDiv.style.color = randomColor;

newBudgetDiv.innerHTML = `
<div class = "budget-header">
 <p class="Budget-name-newdiv" data-budget-name="${name}"><strong>${name}</strong></p>
<p class="Budget-amount-newdiv"><strong>$${amount} Budgeted</strong></p>
</div>

<div class="progress-container">
    <strong>Progress:</strong>
    <div class="progress-bar-container">
        <div class="progress-bar" style="background-color: lightgray;">
            <div class="progress-fill" style="width: 0%; background-color: green;"></div>
        </div>
    </div>
    <div class ="contain">
        <div class = "budget-header">
            <p class="spent spent-first"><strong>Remaining: </strong> $${amount}</p>
        </div>
        
        <div class="button-container">
            </div>
         <button class="details-button" style="background-color: ${randomColor};" onclick="viewDetails('${name}')"><strong>View Details 💸</strong></button>

    </div>
</div>
`;

document.querySelector("#created-budgets").appendChild(newBudgetDiv);

updateCategoryDropdown();
showPopup("Budget Created!");
}


function updateCategoryDropdown() {
    const dropdown = document.querySelector("#category-select");
    dropdown.innerHTML = '<option value="" disabled selected>Select a Budget Category</option>'; 
    budgetNames.forEach((name) => {
        let option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        dropdown.appendChild(option);
    });
}
function AddExpense() {
let expenseName = document.querySelector(".st-input").value;
let expenseAmount = parseFloat(document.querySelector(".nd-input").value);
let selectedCategory = document.querySelector("#category-select").value;

if (!expenseName || isNaN(expenseAmount) || expenseAmount <= 0 || !selectedCategory) {
    alert("Please fill in valid expense details and select a category.");
    return;
}


if (!budgets[selectedCategory].expenseList) {
    budgets[selectedCategory].expenseList = [];
}
budgets[selectedCategory].expenseList.push({ name: expenseName, amount: expenseAmount });

budgets[selectedCategory].expenses += expenseAmount;

const spentAmount = budgets[selectedCategory].expenses;
const totalBudget = budgets[selectedCategory].amount;
const remainingAmount = totalBudget - spentAmount;

const budgetDiv = document.querySelector(`.created-budget .Budget-name-newdiv[data-budget-name="${selectedCategory}"]`).closest(".created-budget");

// Update spent and remaining amounts
budgetDiv.querySelector(".spent-first").textContent = `Spent: $${spentAmount}`;
budgetDiv.querySelector(".spent").textContent = `Remaining: $${remainingAmount}`;

// Update progress bar
const progressBarFill = budgetDiv.querySelector(".progress-fill");
let percentage = (spentAmount / totalBudget) * 100;
progressBarFill.style.width = `${percentage}%`;

// Change progress bar color based on percentage
if (percentage < 50) {
    progressBarFill.style.backgroundColor = "green";
} else if (percentage >= 50 && percentage < 65) {
    progressBarFill.style.backgroundColor = "yellow";
    alert(`You're halfway through your budget! in ${selectedCategory}`);
} else if(percentage >= 65 && percentage < 85){
    progressBarFill.style.backgroundColor = "yellow";
    alert(`Warning! Your budget is getting low in ${selectedCategory}`);
}else if(percentage >= 85 && percentage < 100){
    progressBarFill.style.backgroundColor = "red";
    alert(`Pay attention. You are almost out of budget! ${selectedCategory}`);
}else{
    alert(`You're over budget! ${selectedCategory}`);
}

showPopup("Expense Added!");
}
function viewDetails(budgetName) {
if (!budgets[budgetName] || !budgets[budgetName].expenseList || budgets[budgetName].expenseList.length === 0) {
alert(`No expenses recorded for ${budgetName} yet.`);
return;
}

let expenseDetails = `Expenses for ${budgetName}:\n`;
budgets[budgetName].expenseList.forEach(expense => {
expenseDetails += `- ${expense.name}: $${expense.amount}\n`;
});

alert(expenseDetails);
}



function showPopup(message) {
    const popup = document.getElementById("popup-message");
    popup.textContent = message;
    popup.classList.add("show");

    // Hide the popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000);
}

function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.querySelector("#dark-mode-toggle"); // Assuming you added this in settings
    const body = document.body;

    // Check localStorage for user preference
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
        } else {
            localStorage.setItem("darkMode", "disabled");
        }
    });
});

