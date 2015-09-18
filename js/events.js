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

document.getElementById("rulesPanelSvg").style.height = window.innerHeight+'px';
document.getElementById("gameAreaPanel").style.height = window.innerHeight+'px';


var inputFile = $("#uploadFile");
var fileName = null;
var selectedFile = [];
var currentQuestionIndex = 0;

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
			});
			/*reader = new FileReader();

			reader.onload = function (event) {
				var result = event.target.result;
				selectedFile = result;
			};
			reader.readAsText(file);*/
		} else {
			alert("json file only!")
		}
	}
});

function update() {
	canvasGameArea.width = canvasGameArea.parentNode.clientWidth;
	canvasGameArea.height = canvasGameArea.parentNode.clientHeight;
}

resetButton.addEventListener("click", function(){
	c.shapes = [];
	c.valid = false;
	c.draw();
	
});

var sizeFactor = 0;
zoomInButton.addEventListener("click", function(){
		var ctx = c.ctx;
		if (sizeFactor > 3) return;
		for(var i = 0; i<c.shapes.length; i++){
			c.shapes[i].scaleDivide(0.7)
		}
		c.valid = false;
		c.draw();
		sizeFactor++;
});

zoomOutButton.addEventListener("click", function(){
	if (sizeFactor < -3) return;
	for(var i = 0; i<c.shapes.length; i++){
		c.shapes[i].scale(0.7)
	}
	c.valid = false;
	c.draw();
	sizeFactor--;
});



imageBin.addEventListener("mouseover", function(){
	var obj = c.shapes[c.shapes.length-1];
	c.shapes.splice(c.shapes.indexOf(obj),1);
	console.log("mouseover should remove rules on game area not rule panle")
});

arrowLeft.addEventListener("click", function(){
	if(questions!=null){
		currentQuestionIndex--;
		if(currentQuestionIndex<0){
			currentQuestionIndex  = 0;
		}
		reset();
	}
});

arrowRight.addEventListener("click", function(){
	if(questions!=null){
		currentQuestionIndex ++;
		if(currentQuestionIndex>questions.length-1){
			currentQuestionIndex = questions.length-1;
		}
		reset();
	}
});

window.onresize = function(){
	canvasGameArea.width = canvasGameArea.parentNode.clientWidth;
	canvasGameArea.height = canvasGameArea.parentNode.clientHeight;
	c.width = canvasGameArea.width;
	c.height = canvasGameArea.height;
	c.clear();
	c.valid = false;
	c.draw();
	window.location.reload();
};

function reset(){
	console.log("reset");
	c.shapes = [];
	createShape(questions, currentQuestionIndex);//add question to game area
	c.valid = false;
	c.draw();
}

function matchShapeSize() {
	if(sizeFactor>0){
		for(var i = 0; i<sizeFactor; i++){
			c.shapes[c.shapes.length-1].scaleDivide(0.7);
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
