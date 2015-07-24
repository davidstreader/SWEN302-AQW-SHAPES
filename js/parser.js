"use strict";
var operator = {and: "^", or: "v" , implies: "⇒", negation : "¬", turnStyle:"├"};
var variable = {A:"A", B:"B", C:"C", X:"X", Y:"Y"};
function loadFile() {

}

function generateAST() {

}

function test() {
	/*d3.text("js/logic_rules.txt",function(data) {
		console.log(data);
	});*/
	d3.json("js/rules.json", function (error, data){ // load all data
	for(var i = 0; i < data.length; i++){
	
	}
		console.log(data);
	});
}
