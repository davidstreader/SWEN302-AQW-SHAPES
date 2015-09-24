var questions;
var rules = [];
loadRules();
function loadRules() {
    d3.json("js/rules.json", function (error, data) {
        for (var i = 0; i < data.length; i++) {
            rules.push(generateRuleFromJSON(data[i]));
        }
        //rules = data;
    });
}

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

function generateASTs() {
    questions = [];
    for (var i = 0; i < selectedFile.length; i++) {
        questions.push(parse(selectedFile[i].value));
    }
}

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

var Rule = function (above, below) {
    this.above = above;
    this.below = below;
};

var OV = function (value) {
    this.value = value;
};

OV.prototype.equals = function (other) {
    if (!(other instanceof OV)) {
        return false;
    }
    else {
        return this.value == other.value;
    }
};

function Operator(value) {
    OV.call(this, value);
    this.left;
    this.right;
}

function Variable(value) {
    OV.call(this, value);
}

Operator.prototype = Object.create(OV.prototype);
Variable.prototype = Object.create(OV.prototype);


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