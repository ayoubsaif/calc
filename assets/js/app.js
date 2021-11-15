/**
 * @author Ayoub Saif
 */

var el = function (element) {
    if (element.charAt(0) === "#") {
        return document.querySelector(element);
    }
    return document.querySelectorAll(element);
};

// Global variables
let screen = el("#screen-input"), // Variable to control the view of the screen
    nums = el(".num"), // Variable in which listened on button events of the .num class
    ops = el(".ops"), // Variable in which listened on button events of the .ops class
    curNum = "", // variable to store the value of the number that is being written at the time
    oldNum = "", // variable to store the first number typed
    resultNum, // variable stores the result of an operation
    operator, // Variable stores the type of operator pressed
    oldNumField = el("#oldNum"), // Variable for view control of the first number of operation
    operatorField = el("#operator"); // Variable for operator view control

/**
 * @class
 * @classdesc Function to round in 2 decimals
 */
function roundDec(num) {
    return Math.round(num * 100) / 100;
}

/**
 * @class
 * @classdesc Function to assign curnum numeric value from the HTML button
 */
var setNum = function () {
    setCurrentNumber(this.getAttribute("data-num"));
};

/**
 * @class
 * @classdesc Function to assign curnum numeric value from keyboard event
 * @param {string} number 
 */
function setNumByKey(number) {
    setCurrentNumber(number);
};

/**
 * @class
 * @classdesc Function to set current number receiving string number returning concatenation of the curNum variable
 * @param {string} number Current number that we typed or pushed by button
 */
function setCurrentNumber(number) {
    if (!(number == '.' && /[.]/g.test(curNum))) {

        if (curNum == "0") {
            if (/[\.]/g.test(number)) {
                curNum = "0."
            }
            if (/[0]/g.test(number)) {
                curNum = "0";
            } else if (number != "0") {
                curNum = "";
            }
        }

        if (resultNum) {
            curNum = number;
            resultNum = "";
        }else{
            curNum += number;
        }

        if (/\d/g.test(number)){
            screen.innerHTML = getNumberPow(curNum)
        }else if( /[.]/g.test(number) ){
            screen.innerHTML = curNum;
        }
    }
}

/**
 * @class
 * @classdesc Function to return rounded number with Math.pow native function
 * @return {number} Return number formatted
 */
function getNumberPow(num) {
    const num1Digits = (num.toString().split('.')[1] || '').length;
    const baseNum = Math.pow(5, Math.max(num1Digits));

    return (num * baseNum) / baseNum;
}

/**
 * @class
 * @classdesc Assign operator from button with data-ops attribute
 */
var setOps = function () {
    setOperator(this.getAttribute("data-ops"));
}

/**
 * @class
 * @classdesc Assign operator from keyboard
 * @param {string} op Operator type (/*-+%)
 */
function setOpsByKey(op) {
    setOperator(op);
}

/**
 * @class
 * @classdesc Function to asign the operator that we send from the functions setOps and setOpsByKey
 * @param {string} op Operator type (/*-+%)
 */
function setOperator(op) {
    if (isNaN(curNum)) {return;}
    if (resultNum) {
        oldNum = resultNum;
    } else {
        oldNum = curNum;
    }
    if (/[-]/g.test(op) && (!operator && oldNum == "" || !/[-]&&[+]/g.test(operator) && oldNum != "") && curNum == "" && !resultNum) {
        curNum = "-" + curNum;
        screen.innerHTML = curNum;
    } else if (oldNum != "") {
        curNum = "0"
        if (operator) {
            operator = op;
            oldNumField.innerHTML = getNumberPow(oldNum);
            operatorField.innerHTML = operator;
            screen.innerHTML = curNum;
            screen.setAttribute("data-result", "");
        } else {
            operator = op;
            oldNumField.innerHTML = getNumberPow(oldNum);
            operatorField.innerHTML = operator;
            screen.innerHTML = curNum;
            screen.setAttribute("data-result", "");
        }
    }
}

function setResult(res) {

    resultNum = parseFloat(res)

    if (!isFinite(res)) {
        if (isNaN(res)) {
            resultNum = "ERROR";
        } else {
            resultNum = "ERR. NUM INFINITO";
        }
    }

    screen.innerHTML = resultNum;
    screen.setAttribute("data-result", resultNum);
}

/**
 * @class
 * @classdesc Function to get the result of the operation if there are not errors it will return the result on the screen
 */
var displayResult = function () {

    if (!oldNum){return;}
    const num1Digits = (oldNum.toString().split('.')[1] || '').length;
    const num2Digits = (curNum.toString().split('.')[1] || '').length;

    const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));

    switch (operator) {
        case "+":
            setResult(((oldNum * baseNum) + (curNum * baseNum)) / baseNum)
            break;
        case "-":
            setResult(((oldNum * baseNum) - (curNum * baseNum)) / baseNum)
            break;
        case "x":
            setResult(((oldNum * baseNum) * (curNum * baseNum)) / baseNum)
            break;
        case "/":
            setResult(((oldNum * baseNum) / (curNum * baseNum)) / baseNum)
            break;
        case "%":
            setResult(((oldNum * baseNum) / 100) * (curNum * baseNum) / baseNum)
            break;
        default:
            setResult(curNum)
    }

    // reset operation global values
    curNum = "";
    oldNum = "";
    operator = null;
    operatorField.innerHTML = "";
    oldNumField.innerHTML = "";
};

/**
 * @class
 * @classdesc Function to clear all values of the calculator
 */
var clearAll = function () {
    oldNum = "";
    curNum = "";
    resultNum = null;
    operatorField.innerHTML = "";
    oldNumField.innerHTML = "";
    screen.innerHTML = 0;
};

/**
 * @class
 * @classdesc Function to clear the last number typed on the screen
 */

var clearLastNum = function () {
    if (resultNum) {
        clearAll()
    } else {
        curNum = "";
    }
    screen.innerHTML = 0;
};

/**
 * @class
 * @classdesc Function to delete the last number of the current number on the screen
 */
var delLastNum = function () {
    if (curNum.length > 1) {
        curNum = curNum.slice(0, -1)
        screen.innerHTML = curNum;
    } else {
        curNum = ""
        screen.innerHTML = "0";
        clearAll()
    }
}

/**
 * @class
 * @classdesc
 */
/* KeyBoard functions*/
const body = document.querySelector('body');
body.onkeydown = function(e) {
    if (!e.metaKey) { e.preventDefault(); }
    if (e.shiftKey && e.keyCode == 53){ setOpsByKey("%") }
    else if (e.keyCode == 48 || e.keyCode == 96 ) { setNumByKey("0") }
    else if (e.keyCode == 49 || e.keyCode == 97 ) { setNumByKey("1") }
    else if (e.keyCode == 50 || e.keyCode == 98 ) { setNumByKey("2") }
    else if (e.keyCode == 51 || e.keyCode == 99 ) { setNumByKey("3") }
    else if (e.keyCode == 52 || e.keyCode == 100 ) { setNumByKey("4") }
    else if (e.keyCode == 53 || e.keyCode == 101 ) { setNumByKey("5") }
    else if (e.keyCode == 54 || e.keyCode == 102 ) { setNumByKey("6") }
    else if (e.keyCode == 55 || e.keyCode == 103 ) { setNumByKey("7") }
    else if (e.keyCode == 56 || e.keyCode == 104 ) { setNumByKey("8") }
    else if (e.keyCode == 57 || e.keyCode == 105 ) { setNumByKey("9") }
    else if (e.keyCode == 171 || e.keyCode == 107 ) { setOpsByKey("+") }
    else if (e.keyCode == 173 || e.keyCode == 109 ) { setOpsByKey("-") }
    else if (e.keyCode == 106) { setOpsByKey("x") }
    else if (e.keyCode == 111) { setOpsByKey("/") }
    else if (e.keyCode == 8) { delLastNum() }
    else if (e.keyCode == 13) { displayResult() }
    else if (e.keyCode == 188 || 
        e.keyCode == 110 || e.keyCode == 190) { setNumByKey(".") }
    else if (e.keyCode == '16' && e.keyCode == '53') {
        setOpsByKey("%")
    }
}

// Click event to display the result of the operation
el("#result").addEventListener("click", displayResult, false);

// Click event to delete the last number from the right side
el("#delLastNum").addEventListener("click", delLastNum, false);

// Click event to clear the Calculator
el("#clearAll").addEventListener("click", clearAll, false);
el("#clearCurNum").addEventListener("click", clearLastNum, false);

// add click event to number
for (var i = 0, l = nums.length; i < l; i++) {
    nums[i].addEventListener("click", setNum, false);
}
// add click event to operators
for (var i = 0, l = ops.length; i < l; i++) {
    ops[i].addEventListener("click", setOps, false);
}