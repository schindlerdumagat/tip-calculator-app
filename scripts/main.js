const tipAmount = document.querySelector('#tip-amount');
const totalAmount = document.querySelector('#total-amount');
const resetBtn = document.querySelector('#reset-btn');
const inputFields = document.querySelectorAll('input');
const billError = document.querySelector('#bill-error');
const paxError = document.querySelector('#pax-error');
const customTipInput = document.querySelector('#custom-tip');
const billInput = document.querySelector('#bill');
const paxInput = document.querySelector('#pax');
const tipGrid = document.querySelector('.calculator__form__tip-grid');

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
    customTipInput.classList.remove("custom-field--selected", "custom-field--error");
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

// Event handler for input changes
function handleInput(e) {

    const targetInputId = e.target.id;

    if (targetInputId == "bill") {
        billAmount = Number(e.target.value);
    } else if (targetInputId == "custom-tip") {
        tipPercent = Number(e.target.value);
    } else if (targetInputId == "pax") {
        e.target.value = e.target.value.replace(/[^0-9-]/g, '').replace(/^(-?)(\d*).*$/, '$1$2'); // Does not allow decimal numbers
        paxNumber = Number(e.target.value);
    }

    if (Number(e.target.value) > 0) {
        processInputs(billAmount, tipPercent, paxNumber);
        e.target.classList.remove("calculator__form__field--error");

        if (targetInputId == "custom-tip") {
            customTipInput.classList.add("custom-field--selected");
            customTipInput.classList.remove("custom-field--error");
        }

    } else {
        showError(e);
        clearResult();

        if (targetInputId == "custom-tip") {
            customTipInput.classList.add("custom-field--error");
            customTipInput.classList.remove("custom-field--selected");
        }
    }

}

// Event handler for tip buttons
function handleTipButtonClick(e) {

    if (e.target.tagName === 'BUTTON') {
        
        tipPercent = e.target.dataset.value;
        removeSelectedTipButton();
        e.target.setAttribute("aria-checked", true);
        customTipInput.classList.remove("custom-field--selected", "custom-field--error");
        processInputs(billAmount, tipPercent, paxNumber);
    } 
}

// Event handler for selecting custom tip
function handleCustomTipSelect(e) {

    tipPercent = Number(e.target.value);
    if (tipPercent <= 0) {
        showError(e);
        clearResult();
        customTipInput.classList.add("custom-field--error");
        customTipInput.classList.remove("custom-field--selected");
    } else {
        customTipInput.classList.add("custom-field--selected");
        customTipInput.classList.remove("custom-field--error");
    }
    
    removeSelectedTipButton();
    processInputs(billAmount, tipPercent, paxNumber);

}

billInput.addEventListener("input", handleInput);
customTipInput.addEventListener("input", handleInput);
paxInput.addEventListener("input", handleInput);
tipGrid.addEventListener("click", handleTipButtonClick);
resetBtn.addEventListener("click", resetCalculator);
customTipInput.addEventListener("click", handleCustomTipSelect);
