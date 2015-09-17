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

document.getElementById("rulesPanelSvg").style.height = window.innerHeight * 0.75 +'px';
document.getElementById("gameAreaPanel").style.height = window.innerHeight * 0.75+'px';


var inputFile = $("#uploadFile");
var fileName = null;
var selectedFile = [];

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

//allow specific shape resize and whole canvas resize
var sizeFactor = 0;
zoomInButton.addEventListener("click", function(){
	if (sizeFactor > 3) return;
		
	if (selectedShape !== undefined){
		selectedShape.scaleDivide(0.7);
	} else {
		for(var i = 0; i<c.shapes.length; i++){
			c.shapes[i].scaleDivide(0.7)
		}
	}
		
	c.valid = false;
	c.draw();
	sizeFactor++;
});

//allow specific shape resize and whole canvas resize
zoomOutButton.addEventListener("click", function(){
	if (sizeFactor < -3) return;
	
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



imageBin.addEventListener("mouseover", function(){
	var obj = c.shapes[c.shapes.length-1];
	c.shapes.splice(c.shapes.indexOf(obj),1);
	console.log("mouseover should remove rules on game area not rule panle")
});

arrowLeft.addEventListener("click", function(){
	if(questions!=null){
		currentQuestionIndex = currentQuestionIndex-1;
		if(currentQuestionIndex<0){
			return;
		}
		reset();
		createShape(questions, currentQuestionIndex);
		// TODO: get from questionShapes array
		// c.addShape(questions[currentQuestionIndex]);
	}
});

arrowRight.addEventListener("click", function(){
	if(questions!=null){
		currentQuestionIndex = currentQuestionIndex+1;
		if(currentQuestionIndex>questions.length-1){
			return;
		}
		reset();
		createShape(questions, currentQuestionIndex);
		// TODO: get from questionShapes array
		// c.addShape(questions[currentQuestionIndex]);

	}
});

window.onresize = function(){
	document.getElementById("rulesPanelSvg").style.height = window.innerHeight * 0.75 +'px';
	document.getElementById("gameAreaPanel").style.height = window.innerHeight * 0.75+'px';
	
	canvasGameArea.width = canvasGameArea.parentNode.clientWidth;
	canvasGameArea.height = canvasGameArea.parentNode.clientHeight;
	c.width = canvasGameArea.width;
	c.height = canvasGameArea.height;
	c.clear();
	c.valid = false;
	c.draw();
	window.location.reload();
}
function reset(){
	console.log("reset");
	c.shapes = [];
	//createShape(questions, 0);//add question to game area
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