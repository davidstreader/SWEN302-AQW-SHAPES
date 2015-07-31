var resetButton = document.getElementById("resetButton");
var showHideButton = document.getElementById("showHideButton");
var viewAnswerButton = document.getElementById("viewAnswerButton");
var hintButton = document.getElementById("hintButton");
var zoomInButton = document.getElementById("zoomInButton");
var uploadButton = document.getElementById("zoomOutButton");
var inputFile = $("#uploadFile");
var gameAreaCanvas = document.getElementById("gameAreaCanvas");
var selectedFile = null;

resetButton.addEventListener("click", function(){

});

inputFile.change(function () {
	var i, l, file, fileName, fileNameList, lastValid;
	var hasFinished = true;

	function readFileList(currentFileName, currentFile){
		var reader = new FileReader();

		reader.onload = function (event) {
			var result = event.target.result;

			try {
				localStorage["file:" + currentFileName] = result;
			}
			catch (err) {
				console.error(err.message);
				return;
			}

			addFile(currentFileName);

			if (lastValid === currentFileName) {
				openFile(currentFileName);

				if (uploadStoreLastSelect !== undefined){

					if (lastSelect === uploadStoreLastSelect) {
						currentDirectory = uploadStoreCurrentDirectory;
					}
				}
			}
		};

		if (isText(currentFileName)) {
			reader.readAsText(currentFile);
		} else if (isImage(currentFileName) || isAudio(currentFileName)){
			reader.readAsDataURL(currentFile);
		}
	}

	fileNameList = [];

	for (i = 0, l = this.files.length; i < l; i += 1) {
		file = this.files[i];
		fileName = file.name;

		/**
		if (!validateName(fileName, "file")) {
			if (!confirm("Rename the file on upload?")) {
				continue;
			}

			fileName = getName(fileName, "file");

			if (!fileName) {
				continue;
			}
		}
		 */

		fileNameList[i] = fileName;
	}

	for (i = 0; i < l; i += 1) {
		console.log("aa: "+fileNameList[i]);
		if (fileNameList[i] !== undefined) {
			hasFinished = false;
			readFileList(fileNameList[i], this.files[i]);
			lastValid = fileNameList[i];
			console.log(fileNameList[i]);
		}
	}
});

input.change(function () {
	var file, fileName, reader;

	if (this.files.length > 0) {
		file = this.files[0];
		fileName = file.name;
		if (path.extname(fileName) === ".jason") {
			if (!validateName(fileName)) {
				if (!confirm("Rename the file on upload?")) {
					return;
				}

				fileName = getName();

				if (!fileName) {
					return;
				}
			}
		}

		reader = new FileReader();
		reader.onload = function (event) {
			var result = event.target.result;
			if (!isText(fileName)) {
				result = btoa(result);
			}

			selectedFile[fileName] = result;
		};

		if (isText(fileName)) {
			reader.readAsText(file);
		} else {
			reader.readAsBinaryString(file);
		}
	}
});
isChanged: isChanged
