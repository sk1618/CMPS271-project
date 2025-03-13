const selectElement = document.querySelectorAll("select");
const convertButton= document.querySelector("button");
let resultElement = document.querySelector(".result");
let inputValue = document.querySelector(".number");

const url = "https://api.frankfurter.app/currencies";

//fetch available currencies
fetch(url)
.then(response => response.json())
.then(data =>{
    let currencies = Object.entries(data);
    currencies.forEach((currency) =>{
            let curencyCode = currency[0]; // USD,EUR ... 
            console.log(curencyCode);
            // from
            let optionElement1 = document.createElement("option");
            optionElement1.text = curencyCode;
            optionElement1.value = curencyCode;
            //to
            let optionElement2 = document.createElement("option");
            optionElement2.text = curencyCode;
            optionElement2.value = curencyCode;
            //append options
            selectElement[0].appendChild(optionElement1);
            selectElement[1].appendChild(optionElement2);
    })
})

function convert() {
    if(amount>0 && from != to){
        // convert currency
        const host = 'api.frankfurter.app';
        fetch(`https://${host}/latest?amount=${amount}&from=${from}&to=${to}`)
        .then(resp => resp.json())
        .then((data) => {
            resultElement.value = Object.values(data.rates)[0];
        });
    }
    else{
        alert("Error");
    }
}

convertButton.addEventListener("click" , convert);
inputValue.addEventListener("input" , (e) =>{
    let value = e.target.value;
    amount = value;
})

// get from
document.querySelector(".left-box select").addEventListener("change" , (e) =>{
    from = e.target.value;
})

// get to
document.querySelector(".right-box select").addEventListener("change" , (e) =>{
    to = e.target.value;
})
document.addEventListener("DOMContentLoaded", () => {
    // Check if Dark Mode was enabled
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
});
