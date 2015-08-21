var variables = [];
function canSnap(rule, expression){
 //var variables = getVariables(expression);

}
function findVariables(expression){
 getVariables(expression);
 variables = removeDuplicates(variables);
 variables.sort();
}
function getVariables(expression){
 if(expression instanceof Variable){
  if(typeof expression.value === 'string'){
    for(var i = 0; i < expression.value.length; i++){
     variables.push(expression.value[i]);
    }
  }else variables.push(expression.value);
 }
 // else expression instance of Operator
 //var variables = [];
 else if(typeof expression.left !== undefined){
   getVariables(expression.left);
 }
 else if(typeof expression.right !== undefined){
   getVariables(expression.right);
 }
 // remove duplicates
// variables = removeDuplicates(variables);
 // sort
//variables.sort();
 //return variables;
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