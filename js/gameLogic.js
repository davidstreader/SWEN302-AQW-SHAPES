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
 * returns new expressions that goes on top after applying the rule.
 * @param ruleExp Abstract syntax tree of the rule
 * @param expression Abstract syntax tree of the expression
 */
function getAbove(ruleExp, expression) {
    if(!canSnap(ruleExp.belowTree,expression)){
        console.error("Illegal Arguments")
    }
    var dict = [];
    var variables = getVariables(ruleExp.belowTree);
    for (var i = 0; i < variables.length; i++) {
        var subtree = getSubtreeFromVariable(rule.belowTree, expression, variables[i]);
        if (subtree === undefined) {
            console.error("Illegal Arguments")
        }
        dict[variables[i]] = subtree;
    }
    //var
}

/**
 *
 * @param rule
 * @param expression
 * @param variable
 * @returns {*}
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
        if (expression.value !== "") {
            //for(var i = 0; i < expression.value.length; i++){
            variables.push(expression.value);
            //}
        }
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