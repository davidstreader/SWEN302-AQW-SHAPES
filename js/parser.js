"use strict";
// having fun looking at liam's face

function loadFile() {

}

function generateAST() {

}

function test() {
	d3.text("js/logic_rules.txt",function(data) {
		
	//	console.log(data);
	});
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
