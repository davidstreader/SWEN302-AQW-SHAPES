var resetButton = document.getElementById("resetButton");
var showHideButton = document.getElementById("showHideButton");
var viewAnswerButton = document.getElementById("viewAnswerButton");
var hintButton = document.getElementById("hintButton");
var zoomInButton = document.getElementById("zoomInButton");
var uploadButton = document.getElementById("zoomOutButton");
var inputFile = $("#uploadFile");
var gameAreaCanvas = document.getElementById("gameAreaCanvas");
var fileName = null;
var selectedFile = null;

inputFile.change(function () {
	var file, reader, slashIndex;

	if (this.files.length > 0) {
		file = this.files[0];
		fileName = file.name;

		slashIndex = fileName.lastIndexOf("/");

		if (fileName.substring(slashIndex) === ".json") {
			reader = new FileReader();
			reader.onload = function (event) {
				var result = event.target.result;
				selectedFile[fileName] = result;
			};
		} else {
			alert("json file only!")
		}
	}
});
