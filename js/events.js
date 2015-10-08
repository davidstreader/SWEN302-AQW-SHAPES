// =================================================================================
// Author: Claire Sun & Jacky Chang
// Contains: Event handlers for most GUI elements, including:
// - Button actions
// =================================================================================

var resetButton = document.getElementById("resetButton");
var showHideButton = document.getElementById("showHideButton");
var viewAnswerButton = document.getElementById("viewAnswerButton");
var hintButton = document.getElementById("hintButton");
var zoomInButton = document.getElementById("zoomInButton");
var uploadButton = document.getElementById("zoomOutButton");
var imageBin = document.getElementById("imageBin");
var canvasGameArea = document.getElementById("canvasGameArea");
var canvasSvg = document.getElementById("gameAreaPanel");
var arrowLeft = document.getElementById("leftButton");
var arrowRight = document.getElementById("rightButton");
var rulesPanelSvg = document.getElementById("rulesPanelSvg");
//resize rule panel and game area panel to fit the screen
reSizePanelHeight();

var inputFile = $("#uploadFile");
var fileName = null;
var selectedFile = [];
var currentQuestionIndex = 0;
var rulesIntroPanelHeight = 0;
var rulesElimPanelHeight = 0;
document.getElementById("gameAreaPanel").style.height = window.innerHeight;
// Function for input file button
inputFile.change(function () {
	var file, reader, slashIndex;

	if (this.files.length > 0) {
		file = this.files[0];
		fileName = file.name;
		selectedFile = [];
		slashIndex = fileName.lastIndexOf(".");

		if (fileName.substring(slashIndex) === ".json") {
			d3.json("js/"+ fileName, function (error, data){
				selectedFile = data;
				generateASTs();
				createShape(questions, 0);
				reset();

			});
		} else {
			alert("json file only!")
		}
	}
});

// reset button - clear all shapes on game area panel
// and create current question shape
resetButton.addEventListener("click", function(){
	reset();
});

// allow specific shape resize and whole canvas resize
var sizeFactor = 0;
zoomInButton.addEventListener("click", function(){
//	if (sizeFactor > 3) return;
	if(c.shapes==null) return;
	if (selectedShape !== undefined){
		selectedShape.scale(1/0.7);
	} else {
		for(var i = 0; i<c.shapes.length; i++){
			c.shapes[i].scale(1/0.7)
		}
	}

	c.valid = false;
	c.draw();
	sizeFactor++;
});

//allow specific shape resize and whole canvas resize
zoomOutButton.addEventListener("click", function(){
	if(c.shapes==null) return;
//	if (sizeFactor < -3) return;
	if (selectedShape !== undefined){
		selectedShape.scale(0.7);
	} else {
		for(var i = 0; i<c.shapes.length; i++){
			c.shapes[i].scale(0.7)
		}
	}

	c.valid = false;
	c.draw();
	sizeFactor--;
});
// remove button - remove selected shape
imageBin.addEventListener("click", function(){

	var obj = c.shapes[c.shapes.length-1];
	if(!obj.isQuestion) {
		c.shapes.splice(c.shapes.indexOf(obj), 1);
		c.valid = false;
		c.draw();
	}
});

// previous question - decrease currentQuestionIndex 
// remove the current question and add new question shape
arrowLeft.addEventListener("click", function(){
	if(questions==null){
		window.alert("Input questions before play!");
	}
	else{
		currentQuestionIndex--;
		if(currentQuestionIndex<0){
			currentQuestionIndex  = 0;
		}
		reset();
	}
});

//previous question - increase currentQuestionIndex 
//remove the current question and add new question shape
arrowRight.addEventListener("click", function(){
	if(questions==null){
		window.alert("Input questions before play!");
	}
	else{
		currentQuestionIndex ++;
		if(currentQuestionIndex>questions.length-1){
			currentQuestionIndex = questions.length-1;
		}
		reset();
	}
});

window.onresize = function(){
	//	resize rule panel and game area panel to fit the screen when resize the screen
	reSizePanelHeight();	
	canvasGameArea.width = canvasSvg.clientWidth;
	canvasGameArea.height = canvasSvg.clientHeight;
	$("#canvasRules").parent().css('height', rulesPanelSvg.clientHeight);
	$("#canvasElimination").parent().css('height', rulesPanelSvg.clientHeight);

	c.clear();
	c.valid = false;
	c.draw();
};

// clear game area panel shapes
// if question json file loaded then create new question shape with current Question index
function reset(){
	c.shapes = [];
	if(questions!=undefined){
		createShape(questions, currentQuestionIndex);
	}
	sizefactor = 0;
	c.valid = false;
	c.draw();
}

// match the created new shapes with the shapes in game area panel
// works when zoom in or out all shapes at same time
// not works for individual need add sizeFactor to Shape constructor for each shape
function matchShapeSize(sizeFactor) {
		if(sizeFactor>0){
			for(var i = 0; i<sizeFactor; i++){
				c.shapes[c.shapes.length-1].scale(1/0.7);
			}
			c.valid = false;
			c.draw();
		}
		else if(sizeFactor<0){
			for(var j = 0;j<(0-sizeFactor); j++){
				c.shapes[c.shapes.length-1].scale(0.7);
			}
			c.valid = false;
			c.draw();
		}
	
}

//	resize rule panel and game area panel to fit the screen with the current window inner height
function reSizePanelHeight(){
	document.getElementById("rulesPanelSvg").style.height = window.innerHeight * 0.75 +'px';
	document.getElementById("gameAreaPanel").style.height = window.innerHeight * 0.75+'px';
	document.getElementById("introduction").style.height = window.innerHeight * 2+'px';
	document.getElementById("elimination").style.height = window.innerHeight * 2+'px';
}

