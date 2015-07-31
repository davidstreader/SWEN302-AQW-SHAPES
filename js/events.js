var resetButton = document.getElementById("resetButton");
var showHideButton = document.getElementById("showHideButton");
var viewAnswerButton = document.getElementById("viewAnswerButton");
var hintButton = document.getElementById("hintButton");
var zoomInButton = document.getElementById("zoomInButton");
var uploadButton = document.getElementById("zoomOutButton");

var canvasGameArea = document.getElementById("canvasGameArea");
var canvasSvg = document.getElementById("canvasSvg");

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
			reader = new FileReader();

			reader.onload = function (event) {
				var result = event.target.result;
				selectedFile = result;
			};
			reader.readAsText(file);
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
	init();
});

zoomInButton.addEventListener("click", function(){
	var ctx = c.ctx;
	ctx.scale(1.2,1.2);
	c.valid = false;
	c.draw();

});
zoomOutButton.addEventListener("click", function(){
	var ctx = c.ctx;
	c.valid = false;
	ctx.scale(0.8,0.8);

});

window.onresize = function(){
	c.width = canvasGameArea.parentNode.clientWidth;
	c.height = canvasGameArea.parentNode.clientHeight;
	console.log(c.width+"   "+c.height);
	c.valid = false;
	c.draw();
	window.location.reload();

}
