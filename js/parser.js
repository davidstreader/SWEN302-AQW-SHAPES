
var questions;

function generateASTs() {
 questions = [];
 for(var i = 0;i<selectedFile.length;i++){
   questions.push(parse(selectedFile[i].value));
 }
 console.log(questions);
}

var operators;

function precendence(token){
 switch(token){
   case '⊢': return 0;
   case '→': return 1;
   case '∨': return 2;
   case '∧': return 3;
   case '¬': return 4;
   //case '(': return 5;
   
 }  
 return 98;
}

function isDelimiter(token){
   switch(token){
   case '⊢': return true;
   case '→': return true;
   case '∨': return true;
   case '∧': return true;
   case '¬': return true;
   //case '(': return 5;
    }  
  return false;
}
function findOperator(token){
    switch(token){
        case '⊢': return 'TURNSTILE';
        case '→':return  'IMPLIES';
        case '∨':return 'OR';
        case '∧': return 'AND';
        case '¬': return 'NOT';
    }
}

function parse(str){
 return eval( str.replace(/\s+/g, '') );
}

function eval(str){
    //console.log(str);
  var root;
  var index=0;
  var prec=99;
  var highestIndex = 0;
  if(str.charAt(0) == '(' && str.charAt(str.length-1) == ')'){
    var count=0;
    for(var i=1;i<str.length-1;i++){
      if(str.charAt(i) == '('){
	count++;
      }
    }
    if(count == 0){
      return eval(str.substring(1,str.length-1)); 
    }
  }
  if(nextToken(str,0).length == str.length){
   return new Variable(str);
  }
  while(index < str.length){
    if(precendence(nextToken(str,index)) < prec){
      //console.log(nextToken(str,index) + " has prec " + precendence(nextToken(str,index)));
      prec = precendence(nextToken(str,index));
      highestIndex = index;
    }
    index+=nextToken(str,index).length;
  }
  root = new Operator(findOperator(str.charAt(highestIndex)));
  root.left = eval(str.substring(0,highestIndex));
  root.right = eval(str.substring(highestIndex+1, str.length));
  return root;
}

function nextToken(str,i){
  var index = i;
  var length = 0;
  if(str.charAt(i) == '('){
    var start = index;
    index++;
    var count = 1;
    while(index < str.length){
      if(str.charAt(index) == ')'){
	count--;
	if(count == 0){
	  return str.substring(start, index+1);
	}
      }
      else if(str.charAt(index) == '('){
	count++;
      }
      index++;
    }
    throw new SyntaxError("Missing closing bracket on " + str);
  }
  if(isDelimiter(str.charAt(index))){
   return str.charAt(index); 
  }
  while(!isDelimiter(str.charAt(index)) && index < str.length){
    length++;
    index++;
  }
  return str.substring(index-length,index);
}

var Rule = function(above, below){
  this.above = above;
  this.below = below;
}

var OV = function(value){
 this.value=value; 
}

OV.prototype.equals = function(other){
  if(!(other instanceof OV)){
  return false; 
 }
 else{
  return this.value == other.value;
 }
}

function Operator(value){
 OV.call(this,value); 
 this.left;
 this.right;
}

function Variable(value){
 OV.call(this,value); 
}

Operator.prototype = Object.create(OV.prototype);
Variable.prototype = Object.create(OV.prototype);


Operator.prototype.equals = function(other){
   if(!(other instanceof Operator)){
  return false; 
 }
 else{
  if( this.value != other.value){
   return false; 
  }
  if(!this.left.equals(other.left)){
   return false; 
  }
  return this.right.equals(other.right);
 }
}
Variable.prototype.equals = function(other){
  if(!(other instanceof Variable)){
  return false; 
 }
 else{
  return this.value == other.value;
 }
}
