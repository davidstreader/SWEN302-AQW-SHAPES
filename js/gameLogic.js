/**
 * Checks if a rule can fit into an expression
 * @param ruleExp Abstract syntax tree of the rule
 * @param expression Abstract syntax tree of the expression
 * @returns {boolean} true if the rule can fit into the expression, false otherwise.
 */
function canSnap(ruleExp, expression) {
    if (ruleExp instanceof Variable) {
        return true;
    }
    if (ruleExp instanceof Operator) {
        if (!(expression instanceof Operator)) {
            return false;
        }
// check left side can snap
        if (!canSnap(ruleExp.left, expression.left)) {
            return false;
        }
// check right side can snap
        if (!canSnap(ruleExp.right, expression.right)) {
            return false;
        }
        return ruleExp.value === expression.value;
    }
    return false;
}

/**
 * Given a single variable from the rule, returns the corresponding subtree in the expression.
 * @param rule
 * @param expression
 * @param variable
 * @returns {OperValue} object representing a subtree of the given variable}
 */
function getSubtreeFromVariables(rule, expression, variable) {
    if (rule instanceof Variable) {
        if (rule.value === variable) {
            return expression;
        }
        else return undefined;
    }
    if (expression instanceof Variable) {
        return undefined;
    }
    if (expression.value !== rule.value) {
        return undefined;
    }
    var left = getSubtreeFromVariables(rule.left, expression.left, variable);
    if (left !== undefined) {
        return left;
    }
    var right = getSubtreeFromVariables(rule.right, expression.right, variable);
    if (right !== undefined) {
        return right;
    }
    return undefined;
}

/**
 * returns new expressions that goes on top after applying the rule.
 * @param rule Abstract syntax tree of the rule
 * @param expression Abstract syntax tree of the expression
 */
function getAbove(rule, expression) {
    if (!canSnap(rule.belowTree, expression)) {
        console.error("Illegal Arguments")
    }
    var dict = [];
    /*dict[""] = new Variable("");*/
    var variables = getVariables(rule.belowTree);

    for (var i = 0; i < variables.length; i++) {
        var subtree = getSubtreeFromVariables(rule.belowTree, expression, variables[i]);
        if (subtree === undefined) {
            console.error("Illegal Arguments")
        }
        dict[variables[i]] = subtree;
    }
    var aboves = [];

    for (var i = 0; i < rule.above.length; i++) {
        //    console.log(verifyOV(replaceVariablesWithSubtrees(ruleExp.aboveTree[i], dict)));
        if (rule.belowTree.left.value === "") {
            for (var j = 0; j < rule.aboveTree.length; j++) {
                if (rule.aboveTree[j].left.value !== "") {
                    aboves.push(expression.left);
                }
            }
        }
        aboves.push(replaceVariablesWithSubtrees(rule.aboveTree[i], dict));
    }
    return aboves;
}

/**
 * Goes through given tree and updates variables with subtrees as given by the mapping. This is used by getAbove function where the new expressions are made.
 * @param currentNode the tree to update
 * @param dict mapping from variable to subtrees
 * @returns {*} root of the tree with updated variables.
 */
function replaceVariablesWithSubtrees(currentNode, dict) {
    if (currentNode instanceof Variable /*|| currentNode === ""*/) {
        if(dict[currentNode.value] === undefined){
            return new Variable("T");
        }else {
            return dict[currentNode.value];
        }
    }
    var node = new Operator(currentNode.value);
    node.left = replaceVariablesWithSubtrees(currentNode.left, dict);
    node.right = replaceVariablesWithSubtrees(currentNode.right, dict);
    return node;
}

/**
 * Adapter for the findVariables expression. Returns a list of unique variables present in the expression in alphabetical order.
 * @param expression expression to find the variables from
 * @returns {Array} of variables present in the expression given in alphabetical order
 */
function getVariables(expression) {
    var variables = findVariables(expression);
// remove duplicates
    variables = removeDuplicates(variables);
// sort
    variables.sort();
    return variables;
}

/**
 * Returns the complete list of the variables in the given expression with duplicates and unsorted.
 * @param expression expression to find the variables from
 * @returns {Array} of variables present in the expression given
 */
function findVariables(expression) {
    var variables = [];
    if (expression instanceof Variable) {
        //if (expression.value !== "") {
        //for(var i = 0; i < expression.value.length; i++){
        variables.push(expression.value);
        //}
        //}
        return variables;
    }

// else expression instance of Operator
    if (typeof expression.left !== undefined) {
        variables = variables.concat(getVariables(expression.left));
    }
    if (typeof expression.right !== undefined) {
        variables = variables.concat(getVariables(expression.right));
    }

    return variables;
}

/**
 * Removes duplicates from the array
 * @param array
 * @returns {Array} new array with duplicates removed.
 */
function removeDuplicates(array) {
    var out = [];
    for (var i = 0; i < array.length; i++) {
        if (!contains(out, array[i])) {
            out.push(array[i]);
        }
    }
    return out;
}

/**
 * Checks if an object is present in the array
 * @param array the array to check
 * @param item the object to check for
 * @returns {boolean} true if item is in the array, false otherwise
 */
function contains(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === item) {
            return true;
        }
    }
    return false;
}

function getArrayAbove(rule,expression){
    var exp = getAbove(rule,expression);
    var array=[];
    for(var i=0;i<exp.length;i++){
        if(exp[i] instanceof Operator){
            if(exp[i].value === "TURNSTILE"){
                array.push(exp[i].left);
                array.push(exp[i].right);
                continue;
            }
        }
        array.push(exp[i]);
    }
    console.log(array);
    return array;
}
