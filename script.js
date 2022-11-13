const operators = ["+", "-", "*", "/"];

const liveResultDiv = document.getElementById("liveResult");
const inputAreaDiv = document.getElementById("inputArea");
const inputButtons = document.querySelectorAll(".num-btn, .operator");
const calculateBtn = document.getElementById("calculateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

let stack = [];


function add(a, b) {
    return a + b;
}


function subtract(a, b) {
    return a - b;
}


function multiply(a, b) {
    return a * b;
}


function divide(a, b) {
    return a / b;
}


function operate(a, b, operator) {
    switch (operator) {
        case "+":
            return add(a, b)
        case "-":
            return subtract(a, b)
        case "*":
            return multiply(a, b)
        case "/":
            return divide(a, b)
        default:
            return "Unknown Operator"
    }
}

inputButtons.forEach(function (element) {
    element.addEventListener("click", function () {
        handleNumButtonClick(element);
    });
});


calculateBtn.addEventListener("click", showResult);

deleteBtn.addEventListener("click", deleteNumber);

clearAllBtn.addEventListener("click", clearAll);


function handleNumButtonClick(element) {
    let input = element.textContent;
    if (input === ".") {
        if (!shouldAllowDot()) {
            return false;
        }
    }

    if (!isNaN(input)) {
        stack.push(parseFloat(input));
    } else {
        stack.push(input);
    }

    let lastResult = calculateResult(stack);
    updateScreen(lastResult);
}


function calculateResult(arr) {
    if (arr.length === 0) {
        return 0;
    }
    if (!arr.some(value => operators.includes(value))) {
        return parseFloat(arr.join(""));
    }

    let operatorIndex = arr.findIndex(value => operators.includes(value));
    let firstNum = parseFloat(arr.slice(0, operatorIndex).join(""));
    let secondNum = calculateResult(arr.slice(operatorIndex + 1));
    let currentOperator = arr[operatorIndex];

    return operate(firstNum, secondNum, currentOperator);
}


function parseResult(result) {
    if (result === 0 && !stack.some(value => operators.includes(value))) {
        return "";
    } else {
        return result.toString();
    }
}

function updateScreen(result) {
    let inputText = stack.join("");
    inputAreaDiv.textContent = inputText;

    let resultText = parseResult(result);

    if (!(inputText === resultText)) {
        liveResultDiv.textContent = resultText;
    }
}


function showResult() {
    let finalResult = calculateResult(stack);
    inputAreaDiv.textContent = finalResult;
    liveResultDiv.textContent = "";
    addResultToStack(finalResult);
}


function addResultToStack(result) {
    let numbers = result.toString().split("");
    stack = [];
    numbers.forEach(function (value) {
        if (value === ".") {
            stack.push(".");
        } else {
            stack.push(parseFloat(value));
        }
    });
}


function deleteNumber() {
    stack.pop();
    let lastResult = calculateResult(stack);
    updateScreen(lastResult);
}


function clearAll() {
    stack = [];
    inputAreaDiv.textContent = "";
    liveResultDiv.textContent = "";
}


function shouldAllowDot() {
    if (!stack.includes(".")) {
        return true;
    }

    let lastOperatorIndex = stack.length - stack.slice().reverse().findIndex(value => operators.includes(value)) - 1;

    if (lastOperatorIndex !== -1 && stack.slice(lastOperatorIndex).includes(".")) {
        return false;
    }
}
