const modal = document.getElementById("modal");
const expression = document.getElementById("expression");
const output = document.getElementById("output");

const info = () => modal.style.visibility = "visible";
const closeModal = () => modal.style.visibility = "hidden";

const generateQuadruples = () => { output.value = generateQuadruplesFromExpression(expression.value); }
const generateTriples = () => { output.value = generateTriplesFromExpression(expression.value); }
const generateCode = () => { output.value = generate3AddressCode(expression.value); }

function generate3AddressCode(expression) {
    let code = "";
    let tempCount = 0;
    let tempStack = [];
    let operatorStack = [];
    let precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    };
    let assignmentTarget;

    function generateTemp() {
        let temp = "t" + tempCount;
        tempCount++;
        return temp;
    }

    function generateCodeFromStack() {
        let operator = operatorStack.pop();
        let temp2 = tempStack.pop();
        let temp1 = tempStack.pop();
        let temp = generateTemp();
        code += temp + " = " + temp1 + " " + operator + " " + temp2 + "\n";
        tempStack.push(temp);
    }

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if (/[a-zA-Z]/.test(char)) {
            if (!assignmentTarget) {
                assignmentTarget = char;
            } else {
                tempStack.push(char);
            }
        } else if (/\d/.test(char)) {
            let temp = generateTemp();
            code += temp + " = " + char + "\n";
            tempStack.push(temp);
        } else if (/[+\-*/]/.test(char)) {
            while (operatorStack.length > 0 && precedence[char] <= precedence[operatorStack[operatorStack.length - 1]]) {
                generateCodeFromStack();
            }
            operatorStack.push(char);
        } else if (char === "(") {
            operatorStack.push(char);
        } else if (char === ")") {
            while (operatorStack[operatorStack.length - 1] !== "(") {
                generateCodeFromStack();
            }
            operatorStack.pop();
        }
    }

    while (operatorStack.length > 0) {
        generateCodeFromStack();
    }

    if (assignmentTarget) {
        let rhs = tempStack.pop();
        code = assignmentTarget + " = " + rhs + "\n" + code;
    }

    return code;
}

function generateQuadruplesFromExpression(expression) {
    let quadruples = "";
    let tempCount = 0;
    let quadrupleStack = [];
    let operatorStack = [];
    let precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    };
    let currentTemp;

    function generateTemp() {
        let temp = "t" + tempCount;
        tempCount++;
        return temp;
    }

    function generateQuadruple(operator, operand1, operand2, result) {
        quadruples += "(" + operator + ", " + operand1 + ", " + operand2 + ", " + result + ")\n";
    }

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if (/[a-zA-Z]/.test(char)) {
            quadrupleStack.push(char);
        } else if (/\d/.test(char)) {
            currentTemp = generateTemp();
            quadrupleStack.push(currentTemp);
            quadruples += "(=, " + char + ", , " + currentTemp + ")\n";
        } else if (/[+\-*/]/.test(char)) {
            while (operatorStack.length > 0 && precedence[char] <= precedence[operatorStack[operatorStack.length - 1]]) {
                let operator = operatorStack.pop();
                let operand2 = quadrupleStack.pop();
                let operand1 = quadrupleStack.pop();
                let result = generateTemp();
                generateQuadruple(operator, operand1, operand2, result);
                quadrupleStack.push(result);
            }
            operatorStack.push(char);
        } else if (char === "(") {
            operatorStack.push(char);
        } else if (char === ")") {
            while (operatorStack[operatorStack.length - 1] !== "(") {
                let operator = operatorStack.pop();
                let operand2 = quadrupleStack.pop();
                let operand1 = quadrupleStack.pop();
                let result = generateTemp();
                generateQuadruple(operator, operand1, operand2, result);
                quadrupleStack.push(result);
            }
            operatorStack.pop();
        }
    }

    while (operatorStack.length > 0) {
        let operator = operatorStack.pop();
        let operand2 = quadrupleStack.pop();
        let operand1 = quadrupleStack.pop();
        let result = generateTemp();
        generateQuadruple(operator, operand1, operand2, result);
        quadrupleStack.push(result);
    }

    return quadruples;
}

function generateTriplesFromExpression(expression) {
    let triples = "";
    let tempCount = 0;
    let tripleStack = [];
    let operatorStack = [];
    let precedence = {
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    };
    let currentTemp;

    function generateTemp() {
        let temp = "t" + tempCount;
        tempCount++;
        return temp;
    }

    function generateTriple(operator, operand1, operand2, result) {
        triples += "[" + operator + ", " + operand1 + ", " + operand2 + ", " + result + "]\n";
    }

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if (/[a-zA-Z]/.test(char)) {
            tripleStack.push(char);
        } else if (/\d/.test(char)) {
            currentTemp = generateTemp();
            tripleStack.push(currentTemp);
            triples += "(=, " + char + ", , " + currentTemp + ")\n";
        } else if (/[+\-*/]/.test(char)) {
            while (operatorStack.length > 0 && precedence[char] <= precedence[operatorStack[operatorStack.length - 1]]) {
                let operator = operatorStack.pop();
                let operand2 = tripleStack.pop();
                let operand1 = tripleStack.pop();
                let result = generateTemp();
                generateTriple(operator, operand1, operand2, result);
                tripleStack.push(result);
            }
            operatorStack.push(char);
        } else if (char === "(") {
            operatorStack.push(char);
        } else if (char === ")") {
            while (operatorStack[operatorStack.length - 1] !== "(") {
                let operator = operatorStack.pop();
                let operand2 = tripleStack.pop();
                let operand1 = tripleStack.pop();
                let result = generateTemp();
                generateTriple(operator, operand1, operand2, result);
                tripleStack.push(result);
            }
            operatorStack.pop();
        }
    }

    while (operatorStack.length > 0) {
        let operator = operatorStack.pop();
        let operand2 = tripleStack.pop();
        let operand1 = tripleStack.pop();
        let result = generateTemp();
        generateTriple(operator, operand1, operand2, result);
        tripleStack.push(result);
    }

    return triples;
}