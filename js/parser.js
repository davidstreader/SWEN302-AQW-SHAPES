"use strict";
var operator = {and: "^", or: "v" , implies: "⇒", negation : "¬", turnStyle:"├"};
var variable = {A:"A", B:"B", C:"C", X:"X", Y:"Y"};
function loadFile() {

}

function generateAST() {

}

function test(){
// console.log( parse(""));
}

var Rule = function(above, below){
  this.above = above;
  this.below = below;
}

var Expression = function(ovs){
 this.ovs=ovs; 
}

Expression.prototype.equals = function(other){
 if(!(other instanceof Expression)){
  return false; 
 }
 else if(other.ovs.length != this.ovs.length){
   return false;
 }
 else{
  var i;
  for(i=0; i < this.ovs.length; i++){
   if(!this.ovs[i].equals(other.ovs[i])){
    return false; 
   }
  }
  return true;
 }
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
  return this.value == other.value;
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
