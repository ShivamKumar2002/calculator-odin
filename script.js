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
        handleInput(element.textContent);
    });
});


calculateBtn.addEventListener("click", showResult);

deleteBtn.addEventListener("click", deleteNumber);

clearAllBtn.addEventListener("click", clearAll);


function handleInput(input) {
    if (input === ".") {
        if (!shouldAllowDot()) {
            return false;
        }
    }

    if (stack.length === 0) {
        if (operators.includes(input) && input !== "-" && input !== "+") {
            return false;
        }
    }

    if (operators.includes(input) && operators.includes(stack.at(-1))) {
        stack.pop();
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

    let reversedArr = arr.slice().reverse();

    let operatorIndex = arr.length - reversedArr.findIndex(value => operators.includes(value)) - 1;

    let firstPart = calculateResult(arr.slice(0, operatorIndex));

    if (operators.includes(reversedArr[0])) {
        return firstPart;
    }

    let secondPart = parseFloat(arr.slice(operatorIndex + 1).join(""));

    let currentOperator = arr[operatorIndex];

    return operate(firstPart, secondPart, currentOperator);
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
        updateLiveResult(resultText);
    }
}


function showResult() {
    let finalResult = calculateResult(stack);
    inputAreaDiv.textContent = finalResult;
    updateLiveResult("");
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

    updateLiveResult("");
}


function shouldAllowDot() {
    if (!stack.includes(".")) {
        return true;
    }

    if (stack.at(-1) === ".") {
        return false;
    }

    let lastOperatorIndex = stack.length - stack.slice().reverse().findIndex(value => operators.includes(value)) - 1;

    return lastOperatorIndex === -1 || !stack.slice(lastOperatorIndex + 1).includes(".");
}


document.addEventListener("keydown", function (e) {
    e.preventDefault();

    if (e.key === " ") {
        return false;
    }

    if (!isNaN(e.key) || operators.includes(e.key) || e.key === ".") {
        handleInput(e.key);
    } else if (e.key === "Backspace" || e.key === "Delete") {
        deleteNumber();
    } else if (e.key === "Enter") {
        showResult();
    }

    return false;
});


function updateLiveResult(content) {
    if (content === "NaN") {
        liveResultDiv.textContent = "";
    } else {
        liveResultDiv.textContent = content;
    }
}
