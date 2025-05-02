const form = document.querySelector('#calculator-form');
const tipAmount = document.querySelector('#tip-amount');
const totalAmount = document.querySelector('#total-amount');
const resetBtn = document.querySelector('#reset-btn');
const inputFields = document.querySelectorAll('input');
const tipButtons = document.querySelectorAll('.tip-button');
const billError = document.querySelector('#bill-error');
const paxError = document.querySelector('#pax-error');

let billAmount = 0;
let tipPercent = 0;
let paxNumber = 0;

// Updates the result box
function updateResultView(tipAmountVal, totalAmountVal) {

    tipAmount.innerText = `$${tipAmountVal}`;
    totalAmount.innerText = `$${totalAmountVal}`;
    resetBtn.removeAttribute('disabled');
}

// Calculates Tip and Total for each person 
function calculateTipAndTotal(billAmount, tipPercent, paxNumber) {

    const billShare = Number(billAmount) / Number(paxNumber);
    const tipPerPerson = billShare * (Number(tipPercent) / 100);
    const totalPerPerson = billShare + tipPerPerson;
    return {
        tipAmount: tipPerPerson.toFixed(2),
        totalAmount: totalPerPerson.toFixed(2)
    }
}

// Checks if the input values are valid before processing it
function processInputs(billAmount, tipPercent, paxNumber) {

    if (billAmount <= 0 || tipPercent <= 0 || paxNumber <= 0) {
        return;
    }

    const { tipAmount, totalAmount } = calculateTipAndTotal(billAmount, tipPercent, paxNumber);
    updateResultView(tipAmount, totalAmount);
    removeErrors();
}

// Checks what input field is changed recently and assign it to the corresponding variable
function checkInputOrigin(e) {

    switch (e.target.id) {
        case 'bill': {
            billAmount = e.target.value;
            break;
        }
        case 'custom-tip': {
            tipPercent = e.target.value;
            break;
        }
        case 'pax': {
            paxNumber = e.target.value;
            break;
        }
    }

}

// Removes the selected button attribute
function removeSelectedTipButton() {

    const selectedTipButton = document.querySelector("[aria-checked=true]");
    if (selectedTipButton) {
        selectedTipButton.setAttribute("aria-checked", false);
    }
}

// Removes form errors (Used when reset is clicked)
function removeErrors() {

    billError.innerText = "";
    paxError.innerText = "";

    inputFields.forEach(field => {
        field.classList.remove("calculator__form__field--error");
    })
}

// Resets the calculator to its original state
function resetCalculator() {
    
    inputFields.forEach((field) => {
        field.value = "";
    });
    
    billAmount = 0;
    tipPercent = 0;
    paxNumber = 0;
    
    removeSelectedTipButton();
    clearResult();
}

// Resets the result box to its original state
function clearResult() {

    tipAmount.innerText = "$0.00";
    totalAmount.innerText = "$0.00";

    resetBtn.setAttribute("disabled", true);
}

// Validator for number inputs
const numberValidations = {
    isNegative: (val) => val < 0 && "Can't be negative",
    isEmpty: (val) => val === 0 && "Can't be zero"
}

// Adds styling and error message for input elements with invalid values
function showError(e) {

    let errorMessage;

    for (const validator in numberValidations) {
        errorMessage = numberValidations[validator](Number(e.target.value));
        if (errorMessage) {
            break;
        }
    }

    if (e.target.id === "bill") {
        billError.innerText = errorMessage || "";
    } else if (e.target.id === "pax") {
        paxError.innerText = errorMessage || "";
    }
    e.target.classList.add("calculator__form__field--error");
}

// Event handler for input elements
function handleInputChange(e) {

    checkInputOrigin(e);
    if (e.target.tagName === 'INPUT' && Number(e.target.value) > 0) {
        processInputs(billAmount, tipPercent, paxNumber);
        e.target.classList.remove("calculator__form__field--error");
    } else {
        showError(e);
        clearResult();
    }
}

// Event handler for tip grid items
function handleFormControlClick(e) {

    if (e.target.tagName === 'BUTTON') {
        
        tipPercent = e.target.dataset.value;
        removeSelectedTipButton();
        e.target.setAttribute("aria-checked", true);
        processInputs(billAmount, tipPercent, paxNumber);
    } else if (e.target.tagName === 'INPUT' && e.target.id === "custom-tip") {

        tipPercent = Number(e.target.value);
        if (tipPercent <= 0) {
            showError(e);
            clearResult();
        }
        removeSelectedTipButton();
        processInputs(billAmount, tipPercent, paxNumber);
    }
}

form.addEventListener("input", handleInputChange);
form.addEventListener("click", handleFormControlClick);
resetBtn.addEventListener("click", resetCalculator)
