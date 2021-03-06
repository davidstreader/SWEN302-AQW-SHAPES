//Constructor for Shape objects to hold data for all drawn objects.
//For now they will just be defined as rectangles.

//c is the canvas created for debugging purposes only
var c, canvasIntroductionRulesPanel, canvasEliminationRulesPanel, selectedShape, selectedRuleShape;
var MAX_COLLISION_RADIUS = 70;
var DEFAULT_FONT_SIZE = 80;
var RULES_BACKGROUND_COLOUR = "#FFDEDE";
var QUESTION_BACKGROUND_COLOUR = "#46C7F2";
var LOWER_LEVEL_PADDING = 115;
var LEFT_SIDE_PADDING = 15;
var RIGHT_SIDE_PADDING = 315;
var selectedLetter = new Shape(0,0,"T");
var prevLetter;


function isString(s) {
	return typeof(s) === 'string' || s instanceof String;
}
function Shape(currX, currY, points, color) {
	if(isString(points)){
		this.letter = points;
		this.fontSize = DEFAULT_FONT_SIZE;
	}else{
		this.points = JSON.parse(JSON.stringify(points));
	}
	this.currX = currX;
	this.currY = currY;
	this.color = color;
}

function ComboShape(currX, currY, collisionX, collisionY, shapes, name, logicTree ,isQuestion) {
	this.shapeList = shapes;
	this.currX = currX;
	this.currY = currY;
	this.collX = collisionX;
	this.collY = collisionY;
	this.name = name;
	this.logicTree = logicTree;
	this.isQuestion = isQuestion;
}

ComboShape.prototype.collidingWith = function(shape){
	var lenX = Math.abs((shape.collX + shape.currX) - (this.collX + this.currX));
	var lenY = Math.abs((shape.collY + shape.currY) - (this.collY + this.currY));
	var hypot = Math.sqrt((lenX * lenX) + (lenY * lenY));
	if(hypot<MAX_COLLISION_RADIUS){
		console.log("Collision detected, hypotenuse length: " + hypot);
		console.log(this);
		console.log(shape);
		return(canSnap(shape.logicTree.belowTree,this.logicTree) && (this.isQuestion));

	}
	return false;
};

ComboShape.prototype.contains = function(mouseX, mouseY, ctx, offsetX, offsetY){
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
	for(var i=this.shapeList.length-1; i >= 0; i--) {
		var currShape = this.shapeList[i];
		if(currShape.contains(mouseX, mouseY, ctx, this.currX + offsetX, this.currY + offsetY)){
			console.log("currshape contains point: " + mouseX + ", " + mouseY);
			return true;
		}
	}
	return false;
};

Shape.prototype.scale = function(scaleFactor){
	scaleFactor = scaleFactor || 1;
	if(this.letter != null){
		this.fontSize = this.fontSize * scaleFactor;
	}else {
		for (var i = 0; i < this.points.length; i++) {
			this.points[i].x = this.points[i].x * scaleFactor;
			this.points[i].y = this.points[i].y * scaleFactor;
		}
	}
	this.currX = this.currX * scaleFactor;
	this.currY = this.currY * scaleFactor;
};



ComboShape.prototype.scale = function(scaleFactor){
	scaleFactor= scaleFactor || 1;
	for(var i=0; i<this.shapeList.length; i++){
		this.shapeList[i].scale(scaleFactor);
	}
	//scale not change the current x y position
	this.currX = this.currX * scaleFactor;
	this.currY = this.currY * scaleFactor;
	this.collX = this.collX * scaleFactor;
	this.collY = this.collY * scaleFactor;
};


//Determine if a point is inside the shape's bounds by pathing each shape and calling isPointInPath
//Start from back to get the newest placed if theres overlap
Shape.prototype.contains = function(mouseX, mouseY, ctx, offsetX, offsetY, isDblClcik) {
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	if(this.letter!=null){
		if(mouseX > this.currX+offsetX && mouseX < this.currX+offsetX+(this.fontSize * 0.75) && mouseY > this.currY+offsetY && mouseY < this.currY+offsetY+(this.fontSize*0.75)){
			selectedLetter.fontSize = this.fontSize;
			selectedLetter.currX = this.currX+offsetX;
			selectedLetter.currY = this.currY+offsetY;
			selectedLetter.letter = this.letter;

			return true;
		}
		return false;
	}
	else {
		ctx.beginPath();
		ctx.moveTo(this.currX + offsetX + this.points[0].x, this.currY + offsetY + this.points[0].y);
		for (var i = 0; i < this.points.length; i++) {
			ctx.lineTo(this.currX + offsetX + this.points[i].x, this.currY + offsetY + this.points[i].y);
		}
        ctx.closePath();
	}
    if(ctx.isPointInPath(mouseX, mouseY)){
        console.log("Shape says mouse in path");
    }
	return ctx.isPointInPath(mouseX,mouseY);
};

//Shape.prototype.contains = function(mouseX, mouseY, ctx, offsetX, offsetY) {
//offsetX = offsetX || 0;
//offsetY = offsetY || 0;
//ctx.beginPath();
//ctx.moveTo(this.currX + offsetX + this.points[0].x, this.currY + offsetY + this.points[0].y);
//for(var i=0; i<this.points.length; i++){
//ctx.lineTo(this.currX + offsetX + this.points[i].x , this.currY + offsetY + this.points[i].y);
//}
//return ctx.isPointInPath(mouseX,mouseY);
//};


ComboShape.prototype.draw = function(context, offsetX, offsetY) {
	if(offsetX != null){
		offsetX += this.currX;
		offsetY += this.currY;
	}
	offsetX = offsetX || this.currX;
	offsetY = offsetY || this.currY;
	for(var i=0; i < this.shapeList.length; i++) {
		var currShape = this.shapeList[i];
		currShape.draw(context, offsetX, offsetY);
	}
	if(this.name != null) {
		context.fillStyle = 'black';
		context.font = "10px serif";
		context.fillText(this.name, this.currX + 10, this.currY + 85);
		//context.font = DEFAULT_FONT_SIZE + "px serif";
	}
};

ComboShape.prototype.applyDelta = function(deltaX, deltaY) {
	var newShapeList = [];
	for(var i=0; i<this.shapeList.length; i++){
		newShapeList[i] = this.shapeList[i].applyDelta(deltaX, deltaY);
	}//Note, doesn't recurse down to Shape. Just applies to comboShape.
	return new ComboShape(this.currX, this.currY, this.collX, this.collY, newShapeList, this.logicTree, this.isQuestion);
};

ComboShape.prototype.clone = function(){
	var s = [];
	for(var j = 0; j < this.shapeList.length; j++){
		if(this.shapeList[j].letter == null) {
			s[j] = new Shape(this.shapeList[j].currX, this.shapeList[j].currY, this.shapeList[j].points, this.shapeList[j].color);
		}
		else {
			s[j] = new Shape(this.shapeList[j].currX, this.shapeList[j].currY, this.shapeList[j].letter, this.shapeList[j].color);
			s[j].fontSize = this.shapeList[j].fontSize;
			//s[j].scale(this.shapeList[j].textScaleFactor);
		}
	}
	return new ComboShape(10, 10, this.collX, this.collY, s, this.name ,this.logicTree, this.isQuestion); //Not deep cloned
};

Shape.prototype.applyDelta = function(deltaX, deltaY){
	var toRet = null;
	if(this.letter == null) {
		toRet = new Shape(this.currX + deltaX, this.currY + deltaY, this.points, this.color);
	}
	else {
		toRet =  new Shape(this.currX + deltaX, this.currY + deltaY, this.letter, this.color);
		toRet.fontSize = this.fontSize;
	}
	return toRet;
};

Shape.prototype.draw = function(context, offsetX, offsetY){
	offsetX = offsetX || 0;
	offsetY = offsetY || 0;
	if(this.letter != null){
		context.fillStyle = 'black';
		context.font = Math.floor(this.fontSize) + "px " + "serif";
		context.textBaseline = 'top';
		context.fillText(this.letter, this.currX + offsetX, this.currY + offsetY);
		//context.font = DEFAULT_FONT_SIZE + "px " + "serif";
	}
	else{
		context.beginPath();
		context.moveTo(this.currX + offsetX + this.points[0].x, this.currY + offsetY + this.points[0].y);
		for(var i=0; i<this.points.length; i++){
			context.lineTo(this.currX + offsetX + this.points[i].x , this.currY + offsetY + this.points[i].y);
		}
		context.fillStyle = this.color;
		context.fill();
		context.lineJoin = 'round';
		context.stroke();
		context.closePath();
	}
};

function CanvasState(canvas) {
	//setup for when canvas is made
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext('2d');
	// This complicates things a little but but fixes mouse co-ordinate problems
	// when there's a border or padding. See getMouse for more detail
	var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
		this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
		this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
		this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
	}

	var html = document.body.parentNode;
	this.htmlTop = html.offsetTop;
	this.htmlLeft = html.offsetLeft;

	// **** Keep track of state! ****

	this.valid = false; // when set to false, the canvas will redraw everything
	this.shapes = [];  // the collection of things to be drawn
	this.dragging = false; // Keep track of when we are dragging
	// the current selected object. In the future we could turn this into an array for multiple selection
	this.selection = null;
	this.dragoffx = 0; // See mousedown and mousemove events for explanation
	this.dragoffy = 0;

	// **** events ****

	// This is an example of a closure!
	// Right here "this" means the CanvasState. But we are making events on the Canvas itself,
	// and when the events are fired on the canvas the variable "this" is going to mean the canvas!
	// Since we still want to use this particular CanvasState in the events we have to save a reference to it.
	// This is our reference!
	var myState = this;

	//fixes a problem where double clicking causes text to get selected on the canvas
	canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

	canvas.addEventListener('mouseup', function(e){
		var shapes = myState.shapes;
		for(var questionIndex=0; questionIndex<shapes.length; questionIndex++){
			for(var ruleIndex=0; ruleIndex<shapes.length; ruleIndex++) {
				if(shapes[questionIndex]===shapes[ruleIndex]){continue;}
				if (shapes[questionIndex].collidingWith(shapes[ruleIndex])) {
					console.log(questionIndex + " " + ruleIndex);
					var newShapes = [];
					var newAbove = getArrayAbove(shapes[ruleIndex].logicTree,shapes[questionIndex].logicTree);
					console.log(newAbove);
					var deltaX = shapes[ruleIndex].collX - shapes[questionIndex].collX;
					var deltaY = shapes[ruleIndex].collY - shapes[questionIndex].collY;
					shapes[questionIndex].applyDelta(deltaX, deltaY); // new comboshape
					//newShapes = shapes[ruleIndex].shapeList.concat(s1.shapeList);
					var topLeft = buildAboveShape(newAbove[0],shapes[ruleIndex].currX, shapes[ruleIndex].currY, 1);
					var topRight = buildAboveShape(newAbove[1],shapes[ruleIndex].currX+450, shapes[ruleIndex].currY, 1);
					var exp = new Operator("TURNSTILE");
					exp.left = newAbove[0];
					exp.right = newAbove[1];

					var result = new ComboShape(topLeft.currX,topLeft.currY,0,0,[topLeft,topRight],"",exp,true);
					result.scale(0.5);
					newShapes.push(result);
					shapes[questionIndex].name = "";

					newShapes.push(shapes[questionIndex]);
					shapes[questionIndex] = new ComboShape(shapes[ruleIndex].currX, shapes[ruleIndex].currY, 225,110,
						newShapes, shapes[questionIndex].name, shapes[questionIndex].logicTree, true);

					//shapes[questionIndex] = result;
					shapes = shapes.splice(ruleIndex, 1);
					myState.valid = false;
					myState.draw();
					break;
				}
			}
		}
	});

	// Up, down, and move are for dragging
	canvas.addEventListener('mousedown', function(e) {
		selectedShape = undefined;
		var mouse = myState.getMouse(e);
		var mx = mouse.x;
		var my = mouse.y;
		var shapes = myState.shapes;
		for (var i = shapes.length-1 ; i >= 0 ; i--) {
			if (shapes[i].contains(mx, my, myState.ctx)) {
				var mySel = shapes[i];
				bringToFront(mySel); // bring the select shape to the front
				myState.shapes = shapes; // sign the new reranged shapes to myState
				// Keep track of where in the object we clicked
				// so we can move it smoothly (see mousemove)
				selectedShape = mySel;
				if(selectedShape.currX<0){
					selectedShape.currX = 0;
					myState.valid = false;
					return;
				}
				else if(selectedShape.currY<0){
					selectedShape.currY = 0;
					myState.valid = false;
					return;
				}
				else if(selectedShape.currY>c.height - 150){
					selectedShape.currY = c.height-150;
					myState.valid = false;
					return;
				}
				else if(selectedShape.currX>c.width - 200){
					selectedShape.currX = c.width-200;
					myState.valid = false;
					return;
				}
				else{
					myState.dragoffx = mx - mySel.currX;
					myState.dragoffy = my - mySel.currY;
					myState.dragging = true;
					myState.selection = mySel;
					myState.valid = false;
					return;
				}
			}
		}

		// havent returned means we have failed to select anything.
		// If there was an object selected, we deselect it
		if (myState.selection) {
			myState.selection = null;
			myState.valid = false; // Need to clear the old selection border
		}
		function bringToFront(object){
			idx = shapes.indexOf(object);
			// if object is not on top of stack (last item in an array)
			if (idx !== shapes.length-1) {
				var temp  = new Array(shapes.length);
				var i = 0;
				var j = 0;
				for (; i<shapes.length; i++) {
					if(shapes[i]!==object){
						temp[j] = shapes[i];
						j++;
					}
				}
				temp[temp.length-1] = object;
				shapes = temp;
			}
		}
	}, true);

	canvas.addEventListener('mousemove', function(e) {
		if (myState == c){
			if (myState.dragging){
				var mouse = myState.getMouse(e);

				if(selectedShape.currX<0){
					selectedShape.currX = 0;
					myState.valid = false;
					return;
				}
				else if(selectedShape.currY<0){
					selectedShape.currY = 0;
					myState.valid = false;
					return;
				}
				else if(selectedShape.currY>c.height - 150){
					selectedShape.currY = c.height-150;
					myState.valid = false;
					return;
				}
				else if(selectedShape.currX>c.width - 200){
					selectedShape.currX = c.width-200;
					myState.valid = false;
					return;
				}
				else{
					// We don't want to drag the object by its top-left corner, we want to drag it
					// from where we clicked. Thats why we saved the offset and use it here
					myState.selection.currX = mouse.x - myState.dragoffx;
					myState.selection.currY = mouse.y - myState.dragoffy;
					myState.valid = false; // redraw
				}
			}
		}
	}, true);

	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
	}, true);

	canvas.addEventListener('dblclick', function(e){
	selectedLetter.fontSize = 0;
	var mouse = myState.getMouse(e);
	var mx = mouse.x;
	var my = mouse.y;
		selectedLetter.letter = "-1";

		var shapes = myState.shapes;
		for (var i = shapes.length - 1; i >= 0; i--) {
			if (shapes[i].contains(mx, my, myState.ctx)) {
				if(prevLetter == selectedLetter.letter){
					window.alert("Question Complete, Press OK for the next question");
					currentQuestionIndex++;
					selectedLetter.fontSize = 0;
					selectedLetter.letter = "-1";
					reset();
				}
				myState.ctx.globalAlpha = 0.4;
				myState.ctx.fillStyle = "green";
				myState.ctx.fillRect(selectedLetter.currX - selectedLetter.fontSize*0.1,selectedLetter.currY,selectedLetter.fontSize,selectedLetter.fontSize*0.8);
				myState.ctx.globalAlpha = 1.0;
				prevLetter = selectedLetter.letter;



			}


		}
	}, true);

		// **** Options! ****
	this.interval = 1000/60;
	setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
	this.shapes.push(shape);
	this.valid = false;
}

CanvasState.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

//While draw is called as often as the INTERVAL variable demands,
//It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
	// if our state is invalid, redraw and validate!
	if (!this.valid) {
		var ctx = this.ctx;
		var shapes = this.shapes;
		this.clear();
		// draw all shapes
		ctx.strokeStyle = '#000';
		for (var i = 0; i < shapes.length; i++) {
			if(selectedShape!=undefined){

				if(i == shapes.length - 1){
					ctx.strokeStyle = '#ff0000';
				}
			}
			shapes[i].draw(ctx);


		}
		this.valid = true;

	}
}

//Creates an object with x and y defined, set to the mouse position relative to the state's canvas
//If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
	var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;

	// Compute the total offset
	if (element.offsetParent !== undefined) {
		do {
			offsetX += element.offsetLeft;
			offsetY += element.offsetTop;
		} while ((element = element.offsetParent));
	}

	// Add padding and border style widths to offset
	// Also add the <html> offsets in case there's a position:fixed bar
	offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
	offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

	mx = e.pageX - offsetX;
	my = e.pageY - offsetY;
	return {x: mx, y: my};
}

var SHAPE_X = 450;
var QSN_Y = 200;
var RULE_Y = 300;

var shapePoints={
	AND 		: "∧"/*[{x:0, y:100}, {x:60, y:0}, {x:120, y:100}, {x:100, y:100}, {x:60, y:35}, {x:20, y:100}, {x:0, y:100}]*/,
	OR 			: "∨"/*[{x:0, y:0}, {x:60, y:100}, {x:120, y:0}, {x:100, y:0}, {x:60, y:70}, {x:20, y:0}, {x:0, y:0}]*/,
	IMPLIES		: "→"/*[{x:0, y:20}, {x:90, y:20}, {x:70, y:0}, {x:85, y:0}, {x:110, y:35}, {x:90, y:70}, {x:80, y:70}, {x:90, y:50}, {x:0, y:50}, {x:0, y:40}, {x:90, y:40}, {x:90, y:30}, {x:0, y:30}, {x:0, y:20}]*/,
	NOT 		: "¬"/*[{x:0, y:0}, {x:120, y:0}, {x:50, y:60}, {x:30, y:60}, {x:80, y:20}, {x:0, y:20}, {x:0, y:0}]*/,
	TURNSTILE 	: "⊢"/*[{x:0, y:0}, {x:15, y:0}, {x:15, y:15}, {x:40, y:15}, {x:40, y:25}, {x:15, y:25}, {x:15, y:40}, {x:0, y:40}, {x:0, y:0}]*/,
	RULE: [{x: 0, y: RULE_Y / 3}, {x: SHAPE_X / 3, y: RULE_Y / 3}, {x: SHAPE_X / 3, y: 0},
		{x: SHAPE_X * 2 / 3, y: 0}, {x: SHAPE_X * 2 / 3, y: RULE_Y / 3}, {x: SHAPE_X, y: RULE_Y / 3}, {x: SHAPE_X,y: RULE_Y},
		{x: SHAPE_X * 2 / 3, y: 300}, {x: SHAPE_X * 2 / 3, y: 200}, {x: SHAPE_X / 3, y: 200},
		{x: SHAPE_X / 3, y: 300}, {x: 0, y: 300}, {x: 0, y: 100}],
	QUESTION: [{x: 0, y: QSN_Y / 2}, {x: SHAPE_X / 3, y: QSN_Y / 2}, {x: SHAPE_X / 3, y: 0}, {
		x: SHAPE_X * 2 / 3,
		y: 0
	}, {x: SHAPE_X * 2 / 3, y: QSN_Y / 2}, {x: SHAPE_X, y: QSN_Y / 2}, {x: SHAPE_X, y: QSN_Y}, {
		x: 0,
		y: QSN_Y
	}, {x: 0, y: QSN_Y/2}],

	A :  "A" /*[{x:0, y:100}, {x:60, y:0}, {x:120, y:100}, {x:100, y:100}, {x:60, y:35}, {x:20, y:100}, {x:0, y:100}]*/,
	B :  "B"/*[{x:0, y:0}, {x:0, y:100}, {x:60, y:100}, {x:60, y:80}, {x:20, y:80}, {x:20, y:0}, {x:0, y:0}]*/,
	C :  "C"/*[{x:0, y:0}, {x:100, y:0}, {x:100, y:60}, {x:80, y:60}, {x:80, y:20}, {x:0, y:20}, {x:0, y:0}]*/,
	T :  "T"/*[{x:0, y:0}, {x:100, y:0}, {x:100, y:60}, {x:80, y:60}, {x:80, y:20}, {x:0, y:20}, {x:0, y:0}]*/, //same as A
	F :  "F"/*[{x:0, y:0}, {x:100, y:0}, {x:100, y:60}, {x:80, y:60}, {x:80, y:20}, {x:0, y:20}, {x:0, y:0}]*/  //same as A
};
//initilisation method called from html on load up

function init() {
	//game area
	var canvas = document.getElementById('canvasGameArea');
	var cs = new CanvasState(canvas);
	canvas.width = canvasSvg.clientWidth;
	canvas.height = canvasSvg.clientHeight;
	cs.width = canvasSvg.clientWidth;
	cs.height = canvasSvg.clientHeight;
	
	c = cs;

	//rules area

	//rules area introduction
	var canvasr = document.getElementById('canvasRules');
	var csr = new CanvasState(canvasr);
	canvasr.width = rulesPanelSvg.clientWidth;
	canvasr.height = 1200;
	$("#canvasRules").parent().css('height', rulesPanelSvg.clientHeight);

	//rules area elimination
	var canvase = document.getElementById('canvasElimination');
	var cse = new CanvasState(canvase);
	canvase.width = rulesPanelSvg.clientWidth;
	canvase.height = 1200;
	$("#canvasElimination").parent().css('height', rulesPanelSvg.clientHeight);

	var mx = -1;
	var my = -1;
	//get mouse x and y position when scroll bar moved
	document.getElementById('canvasElimination').addEventListener('click', function(e) {
		mx = -1;
		my = -1;
		var relativePosition = {
			left: e.pageX - $(document).scrollLeft() - $('#canvasElimination').offset().left,
			top : e.pageY - $(document).scrollTop() - $('#canvasElimination').offset().top
		};
		mx = relativePosition.left;
		my = relativePosition.top
	}, true);

	//get mouse x and y position when scroll bar moved
	document.getElementById('canvasRules').addEventListener('click', function(e) {
		mx = -1;
		my = -1;
		var relativePosition = {
			left: e.pageX - $(document).scrollLeft() - $('#canvasRules').offset().left,
			top : e.pageY - $(document).scrollTop() - $('#canvasRules').offset().top
		};
		mx = relativePosition.left;
		my = relativePosition.top
	}, true);

	//click rule shape to create a same new rule shape on game area canvas
	//introduction canvas click listener
	canvasr.addEventListener('click', function(e) {
		var sps = csr.shapes;
		selectedShape = undefined;
		for (var i = 0; i < sps.length; i++) {
			if (sps[i].contains(mx, my, canvasIntroductionRulesPanel.ctx)) {
				c.addShape(sps[i].clone());
				matchShapeSize(sizefactor);
				return;
			}
		}
	}, true);

	//elimination canvas click listener
	canvase.addEventListener('click', function(e) {
		selectedShape = undefined;
		var sps = cse.shapes;
		for (var i = 0; i < sps.length; i++) {
			if (sps[i].contains(mx, my, canvasIntroductionRulesPanel.ctx)) {
				c.addShape(sps[i].clone());
				matchShapeSize(sizefactor);
				return;
			}
		}
	}, true);

	// debugging purposes only
	c = cs;
	canvasEliminationRulesPanel = cse;
	canvasIntroductionRulesPanel = csr;

	drawRules(rules);
	setCanvasHeight(canvasr,canvase);
}
function setCanvasHeight(canvasr, canvase){
	canvasr.height = rulesIntroPanelHeight;
	canvase.height = rulesElimPanelHeight;
}


function createShape(logicArray,i){
	var logicShapes =[];
	var OpValue = logicArray[i].value;
	var left = logicArray[i].left;
	var right = logicArray[i].right;
	var padding = 10;
	if(left.value !== "") {
		var leftShape = createShape2(left, 10, 10, logicArray[i]);
		logicShapes.push(leftShape);
		padding = 460;
	}
	var rightShape = createShape2(right,padding,10,logicArray[i]);
	logicShapes.push(rightShape);

	c.addShape(new ComboShape(400,400,235,110,logicShapes,"",logicArray[i],true));
	c.shapes[c.shapes.length-1].scale(0.5);
}

function createShape2(operator,x,y,dictTree) {
    var logicShapes = [];
    var OpValue = operator.value;
    var left = operator.left;
    var right = operator.right;
    logicShapes.push(new Shape(10,10,shapePoints.QUESTION,QUESTION_BACKGROUND_COLOUR));

    if (left instanceof Operator) {
        logicShapes.push(buildShape(left, LEFT_SIDE_PADDING, LOWER_LEVEL_PADDING, 0.3));
    }
    else if(left instanceof Variable){
        //logicShapes.push(new Shape(10,10,shapePoints.QUESTION,QUESTION_BACKGROUND_COLOUR));
        if( left.value !== ""){
            logicShapes.push(new Shape(LEFT_SIDE_PADDING, LOWER_LEVEL_PADDING, shapePoints[left.value]));
        }
    }

    if (right instanceof Operator) {
        logicShapes.push(buildShape(right, RIGHT_SIDE_PADDING, LOWER_LEVEL_PADDING, 0.3));
    }
    else if(right instanceof Variable ){
       // logicShapes.push(new Shape(rightsidepadding,10,shapePoints.QUESTION,QUESTION_BACKGROUND_COLOUR));
        if( right.value !== ""){
            logicShapes.push(new Shape(RIGHT_SIDE_PADDING, LOWER_LEVEL_PADDING, shapePoints[right.value]));
        }
    }
    if (OpValue !== "") {
        logicShapes.push(new Shape(180, 15, shapePoints[OpValue]));
    }
    return new ComboShape(x, y, 225, 100, logicShapes, " ", dictTree,true);
}

function drawShape(above,below) {
	var logicShapesAbove =[];
		for(var i = 0; i< above; i++){
				logicShapesAbove.push(new Shape(450*i,10,shapePoints.QUESTION,QUESTION_BACKGROUND_COLOUR));
			}
		var top = (new ComboShape(0,0,0,0,logicShapesAbove,"",null,true));
		var logicShapesBelow = [];
		for(var i = 0; i< below; i++){
				logicShapesBelow.push(new Shape(450*i,10,shapePoints.RULEBELOW,QUESTION_BACKGROUND_COLOUR));
			}
		var xPadding = ((above-below)*450)/2;
		console.log(xPadding);
		var bot  = new ComboShape(xPadding,200,0,0,logicShapesBelow,"",null,true);
		var logicShapeFull = [];
		logicShapeFull.push(top);
		logicShapeFull.push(bot);
		return new ComboShape(200,300,0,0,logicShapeFull,"",null,true);
	}


function buildAboveShape(operator,x,y,scale){
	var logicShapes =[];
	var OpValue = operator.value;
	var left = operator.left;
	var right = operator.right;
	logicShapes.push(new Shape(10,10,shapePoints.RULE,QUESTION_BACKGROUND_COLOUR));

	if(OpValue !=""){
		logicShapes.push(new Shape(180,15, shapePoints[OpValue]));
	}

	if(left.value !="" && left instanceof Operator)
		logicShapes.push(buildShape(left,LEFT_SIDE_PADDING,LOWER_LEVEL_PADDING,0.3));

	else if(left.value != "")
		logicShapes.push(new Shape(LEFT_SIDE_PADDING,LOWER_LEVEL_PADDING,shapePoints[left.value]));

	if(right.value !="" && right instanceof Operator)
		logicShapes.push(buildShape(right,RIGHT_SIDE_PADDING,LOWER_LEVEL_PADDING,0.3));

	else if(right.value !="")
		logicShapes.push(new Shape(RIGHT_SIDE_PADDING,LOWER_LEVEL_PADDING,shapePoints[right.value]));

	var result = (new ComboShape(x,y,225,15,logicShapes,"",operator,true));
	if(scale != 0) {
		result.scale(scale);
		result.currX = x;
		result.currY = y;
	}

	return result;
}

function buildShape(operator,x,y,scale){
	var logicShapes =[];
	var OpValue = operator.value;
	var left = operator.left;
	var right = operator.right;
	logicShapes.push(new Shape(10,10,shapePoints.QUESTION,QUESTION_BACKGROUND_COLOUR));

	if(OpValue !=""){
    	logicShapes.push(new Shape(180,15, shapePoints[OpValue]));
	}

	if(left.value !="" && left instanceof Operator)
		logicShapes.push(buildShape(left,LEFT_SIDE_PADDING,LOWER_LEVEL_PADDING,0.3));

	else if(left.value != "")
		logicShapes.push(new Shape(LEFT_SIDE_PADDING,LOWER_LEVEL_PADDING,shapePoints[left.value]));

	if(right.value !="" && right instanceof Operator)
		logicShapes.push(buildShape(right,RIGHT_SIDE_PADDING,LOWER_LEVEL_PADDING,0.3));

	else if(right.value !="")
		logicShapes.push(new Shape(RIGHT_SIDE_PADDING,LOWER_LEVEL_PADDING,shapePoints[right.value]));

	var result = (new ComboShape(x,y,225,15,logicShapes,"",operator,true));
	if(scale != 0) {
		result.scale(scale);
		result.currX = x;
		result.currY = y;
	}

	return result;
}


function drawRules(ruleArray) {
	var countIntroductionRules = 0;
	var countEliminationRules = 0;
	for (var i = 0; i < ruleArray.length; i++) {
		var logicshapes = [];
		logicshapes.push(new Shape(10, 10, shapePoints.RULE, RULES_BACKGROUND_COLOUR));
		var above = ruleArray[i].above;
		var below = ruleArray[i].below;

		if (ruleArray[i].type == "Introduction") {
			for (var j = 0; j < above.length; j++) {
				for (k = 0; k < above[j].length; k++) {
					var operator = above[j];
					if (above[j][k] == "")
						continue;
					var shape = new Shape(k * 100 + 15, 20, shapePoints[above[j][k]]);
					shape.scale((150 / above[j].length) / 90);
					shape.currX += (j * 300);
					logicshapes.push(shape);
				}
			}

			for (var j = 0; j < below.length; j++) {
				if (below[j] == "")
					continue;
				var shape = new Shape(j * 100 + 800, 800, shapePoints[below[j]]);
				shape.scale((150 / below.length) / 90);
				shape.currX += (j * 10);
				logicshapes.push(shape);
			}
			countIntroductionRules++;
			var result = new ComboShape(10, (i - countEliminationRules) * 350 + 10, 225, 300, logicshapes, ruleArray[i].name,ruleArray[i],false);

			result.scale(0.5);
			rulesIntroPanelHeight = (i - countEliminationRules) * 230;
			canvasIntroductionRulesPanel.addShape(result);
		}
		else if (ruleArray[i].type == "Elimination"){
			for (var j = 0; j < above.length; j++) {
				for (k = 0; k < above[j].length; k++) {
					var operator = above[j];
					if (above[j][k] == "")
						continue;
					var shape = new Shape(k * 100 + 15, 20, shapePoints[above[j][k]]);
					shape.scale((150 / above[j].length) / 90);
					shape.currX += (j * 300);
					logicshapes.push(shape);
				}
			}

			for (var j = 0; j < below.length; j++) {
				if (below[j] == "")
					continue;
				var shape = new Shape(j * 100 + 500, 450, shapePoints[below[j]]);
				shape.scale((150 / below.length) / 90);
//				shape.currX += (j * 10);
				logicshapes.push(shape);
			}
			countEliminationRules++;
			var result = new ComboShape(10, (i - countIntroductionRules) * 350 + 10, 225, 300, logicshapes, ruleArray[i].name,ruleArray[i],false);

			result.scale(0.5);
			rulesElimPanelHeight = (i - countIntroductionRules) * 230;
			canvasEliminationRulesPanel.addShape(result);
		}
	}
}