/**
 * Checks if a rule can fit into an expression
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
 * Adapter for the findVariables expression. Returns a list of unique variables present in the expression in alphabetical order.
 */
function getVariables(expression){
 var varis = findVariables(expression); 
  // remove duplicates
 varis = removeDuplicates(varis);
 // sort
 varis.sort();
return varis;
}

/**
 * Returns the complete list of the variables in the given expression with duplicates and unsorted.
 */
function findVariables(expression){
   var variables = [];
 if(expression instanceof Variable){
  if(expression.value !== ""){
    //for(var i = 0; i < expression.value.length; i++){
     variables.push(expression.value);
    //}
  }
  return variables;
 }
 
 // else expression instance of Operator
 if(typeof expression.left !== undefined){
   variables = variables.concat(getVariables(expression.left));
 }
 if(typeof expression.right !== undefined){
   variables = variables.concat(getVariables(expression.right));
 }

 return variables;
}

function removeDuplicates(array){
 var out = [];
for(var i=0;i<array.length;i++){
 if(!contains(out, array[i])){
  out.push(array[i]);
 }
}
return out;
}

function contains(array, item){
 for(var i =0;i<array.length;i++){
  if(array[i] === item){
   return true; 
  }
 }
 return false;
}