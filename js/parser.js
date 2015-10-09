var questions;
var rules = [];
loadRules();

/**
 * Loads the rules from the json file and puts them into the global rules variable. This function is called when the page is loaded.
 */
function loadRules() {
    d3.json("js/rules.json", function (error, data) {
        for (var i = 0; i < data.length; i++) {
            rules.push(generateRuleFromJSON(data[i]));
        }
        //rules = data;
    });
}

/**
 * Reads a json string containing a rule and generates a rule object from it.
 * @param data json data containing one rule
 * @returns {Rule} object that is built from the data given
 */
function generateRuleFromJSON(data) {
    var aboveArray = [];
    var aboveTreeArray = [];
    for (var i = 0; i < data.above.length; i++) {
        aboveTreeArray.push(parse(data.above[i]));
        aboveArray.push(treeToString(aboveTreeArray[i]));
    }
    var currentRule = {
        name: data.name,
        type: data.type,
        above: aboveArray,
        below: treeToString(parse(data.below)),
        belowTree: parse(data.below),
        aboveTree: aboveTreeArray
    };
    return currentRule;
}

/**
 * Generates abstract syntax trees of the questions from the selected and puts them into the global questions variable.
 */
function generateASTs() {
    questions = [];
    for (var i = 0; i < selectedFile.length; i++) {
        questions.push(parse(selectedFile[i].value));
    }
}

/**
 * Returns the precedence of the given token. Lower number means lower precedence (dealth with last)
 * @param token
 * @returns {number}
 */
function precedence(token) {
    switch (token) {
        case '⊢':
            return 0;
        case '→':
            return 1;
        case '∨':
            return 2;
        case '∧':
            return 3;
        case '¬':
            return 4;
        //case '(': return 5;

    }
    return 98;
}

/**
 * Tells is a token is a delimiter or not.
 * @param token
 * @returns {boolean} true if given token is a delimited, false otherwise
 */
function isDelimiter(token) {
    switch (token) {
        case '⊢':
            return true;
        case '→':
            return true;
        case '∨':
            return true;
        case '∧':
            return true;
        case '¬':
            return true;
        //case '(': return 5;
    }
    return false;
}


function findOperator(token) {
    switch (token) {
        case '⊢':
            return 'TURNSTILE';
        case '→':
            return 'IMPLIES';
        case '∨':
            return 'OR';
        case '∧':
            return 'AND';
        case '¬':
            return 'NOT';
    }
}

/**
 * Parses a string into an abstract syntax tree and returns it
 * @param str ASCII string containing the expression
 * @returns {*}
 */
function parse(str) {
    return eval(str.replace(/\s+/g, ''));
}

function eval(str) {
    //console.log(str);
    var root;
    var index = 0;
    var prec = 99;
    var highestIndex = 0;
    if (str.charAt(0) == '(' && str.charAt(str.length - 1) == ')') {
        var count = 0;
        for (var i = 1; i < str.length - 1; i++) {
            if (str.charAt(i) == '(') {
                count++;
            }
            if(str.charAt(i)==')' && count>0){
                count--;
            }
        }
        if (count == 0) {
            return eval(str.substring(1, str.length - 1));
        }
    }
    if (nextToken(str, 0).length == str.length) {
        return new Variable(str);
    }
    while (index < str.length) {
        if (precedence(nextToken(str, index)) < prec) {
            //console.log(nextToken(str,index) + " has prec " + precedence(nextToken(str,index)));
            prec = precedence(nextToken(str, index));
            highestIndex = index;
        }
        index += nextToken(str, index).length;
    }
    root = new Operator(findOperator(str.charAt(highestIndex)));
    root.left = eval(str.substring(0, highestIndex));
    root.right = eval(str.substring(highestIndex + 1, str.length));
    return root;
}

function nextToken(str, i) {
    var index = i;
    var length = 0;
    if (str.charAt(i) == '(') {
        var start = index;
        index++;
        var count = 1;
        while (index < str.length) {
            if (str.charAt(index) == ')') {
                count--;
                if (count == 0) {
                    return str.substring(start, index + 1);
                }
            }
            else if (str.charAt(index) == '(') {
                count++;
            }
            index++;
        }
        throw new SyntaxError("Missing closing bracket on " + str);
    }
    if (isDelimiter(str.charAt(index))) {
        return str.charAt(index);
    }
    while (!isDelimiter(str.charAt(index)) && index < str.length) {
        length++;
        index++;
    }
    return str.substring(index - length, index);
}


function treeToString(expression) {
    var list = [];
    if (expression instanceof Operator) {
        list = list.concat(treeToString(expression.left));
    }
    list.push(expression.value);
    if (expression instanceof Operator) {
        list = list.concat(treeToString(expression.right));
    }
    return list;
}
/*
var Rule = function (above, below) {
    this.above = above;
    this.below = below;
};*/

var OperValue = function (value) {
    this.value = value;
};

OperValue.prototype.equals = function (other) {
    if (!(other instanceof OperValue)) {
        return false;
    }
    else {
        return this.value == other.value;
    }
};

function Operator(value) {
    OperValue.call(this, value);
    this.left;
    this.right;
}

function Variable(value) {
    OperValue.call(this, value);
}

Operator.prototype = Object.create(OperValue.prototype);
Variable.prototype = Object.create(OperValue.prototype);


Operator.prototype.equals = function (other) {
    if (!(other instanceof Operator)) {
        return false;
    }
    else {
        if (this.value != other.value) {
            return false;
        }
        /*if (this.left !== "") {*/
            if (!this.left.equals(other.left)) {
                return false;
            }
        /*}
        if (this.right === "") {
            return false;
        }*/
        return this.right.equals(other.right);
    }
};
Variable.prototype.equals = function (other) {
    if (!(other instanceof Variable)) {
        return false;
    }
    else {
        return this.value == other.value;
    }
};

function verifyOV(OV) {
    if (OV instanceof Variable) {
        return true;
    }
    if (OV instanceof Operator) {
        return verifyOV(OV.left) && verifyOV(OV.right);
    }
    return false;
}