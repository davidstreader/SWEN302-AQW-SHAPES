
function canSnap(rule, expression){
  var variables = getVariables(expression);
  
}

function getVariables(expression){
 if(expression instanceof Variable){
  return expression.value; 
 }
 // else expression instance of Operator
 var variables = [];
 if(typeof expression.left !== undefined){
   variables.push(getVariables(expression.left));
 }
 if(typeof expression.right !== undefined){
  variables.push(getVariables(expression.right)); 
 }
 // remove duplicates
 variables = removeDuplicates(variables);
 // sort
 variables.sort();
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