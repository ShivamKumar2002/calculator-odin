const operators = ["+", "-", "*", "/"];

const liveResultDiv = document.getElementById("liveResult");
const inputAreaDiv = document.getElementById("inputArea");
const inputButtons = document.querySelectorAll(".num-btn, .operator");


let lastResult = "";
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

function handleNumButtonClick(element) {
    let input = element.textContent;

    if (!isNaN(input)) {
        stack.push(parseInt(input));
    } else {
        stack.push(input);
    }

    lastResult = calculateResult(stack);
    updateScreen(lastResult);
}

function calculateResult(arr) {
    if (arr.length === 0) {
        return 0;
    }
    if (!arr.some(value => operators.includes(value))) {
        return parseInt(arr.join(""));
    }

    let operatorIndex = arr.findIndex(value => operators.includes(value));
    let firstNum = parseInt(arr.slice(0, operatorIndex).join(""));
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