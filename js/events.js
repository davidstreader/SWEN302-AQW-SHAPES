var resetButton = document.getElementById("resetButton");
var showHideButton = document.getElementById("showHideButton");
var viewAnswerButton = document.getElementById("viewAnswerButton");
var hintButton = document.getElementById("hintButton");
var zoomInButton = document.getElementById("zoomInButton");
var uploadButton = document.getElementById("zoomOutButton");
var imageBin = document.getElementById("imageBin");
var canvasGameArea = document.getElementById("canvasGameArea");
var canvasSvg = document.getElementById("gameAreaPanel");

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
				createShape(questions);

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
	c.shapes = null;
	c.ctx = null;
	c = null;
	init();
});
var zoomInFactor = 1;
zoomInButton.addEventListener("click", function(){
	
	if(zoomInFactor>1.6 || zoomInFactor<1){ 
		return;
	}
	else{
		zoomInFactor = zoomInFactor+ 0.2;
		var ctx = c.ctx;
		for(var i = 0; i<c.shapes.length; i++){
			c.shapes[i].scale(zoomInFactor)
		}
		c.valid = false;
		c.draw();
	}
	if(zoomOutFactor+0.2<1){
		zoomOutFactor = zoomOutFactor +0.2;
	}
	console.log("zoom in :" + zoomInFactor+"   zoom out: "+ zoomOutFactor);

});
var zoomOutFactor = 1;
zoomOutButton.addEventListener("click", function(){
	
	console.log(zoomOutFactor);
	if(zoomOutFactor<0.6 || zoomOutFactor>1){ 
		return;
	}
	else{
		zoomOutFactor = zoomOutFactor -0.2;
	}
	var ctx = c.ctx;
	for(var i = 0; i<c.shapes.length; i++){
		c.shapes[i].scale(zoomOutFactor)
	}
	c.valid = false;
	c.draw();
	if(zoomInFactor-0.2>1){
		zoomInFactor = zoomInFactor - 0.2;
	}
	console.log("zoom in :" + zoomInFactor+"   zoom out: "+ zoomOutFactor);

});
imageBin.addEventListener("mouseover", function(){
	var obj = c.shapes[c.shapes.length-1];
	c.shapes.splice(c.shapes.indexOf(obj),1);
	console.log("mouseover should remove rules on game area not rule panle")
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
}
