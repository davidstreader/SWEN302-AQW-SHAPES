// Constructor for Shape objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.

//c is the canvas created for debugging purposes only
var c;
var MAX_COLLISION_RADIUS = 70;

function Shape(currX, currY, points, color) {
    this.points = points;
    this.currX = currX;
    this.currY = currY;
    this.color = color;
}

function ComboShape(currX, currY, collisionX, collisionY,  shapes) {
    this.shapeList = shapes;
    this.currX = currX;
    this.currY = currY;
    this.collX = collisionX;
    this.collY = collisionY;
}

ComboShape.prototype.collidingWith = function(shape){
    var lenX = Math.abs((shape.collX + shape.currX) - (this.collX + this.currX));
    var lenY = Math.abs((shape.collY + shape.currY) - (this.collY + this.currY));
    var hypot = Math.sqrt((lenX * lenX) + (lenY * lenY));
    if(hypot<MAX_COLLISION_RADIUS){
        console.log("Collision detected, hypotenuse length: " + hypot);
        return true;
    }
    return false;
};

ComboShape.prototype.contains = function(mouseX, mouseY, ctx){
    for(var i=0; i < this.shapeList.length; i++) {
        var currShape = this.shapeList[i];
        if(currShape.contains(mouseX, mouseY, ctx, this.currX, this.currY)){
            console.log("currshape contains point: " + mouseX + ", " + mouseY);
            return true;
        }
    }
    return false;
};

// Determine if a point is inside the shape's bounds by pathing each shape and calling isPointInPath
// Start from back to get the newest placed if theres overlap
Shape.prototype.contains = function(mouseX, mouseY, ctx, offsetX, offsetY) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    ctx.beginPath();
    ctx.moveTo(this.currX + offsetX + this.points[0].x, this.currY + offsetY + this.points[0].y);
    for(var i=0; i<this.points.length; i++){
        ctx.lineTo(this.currX + offsetX + this.points[i].x , this.currY + offsetY + this.points[i].y);
    }
    return ctx.isPointInPath(mouseX,mouseY);
};

ComboShape.prototype.draw = function(context) {
    for(var i=0; i < this.shapeList.length; i++) {
        var currShape = this.shapeList[i];
        currShape.draw(context, this.currX, this.currY);
    }
};

Shape.prototype.draw = function(context, offsetX, offsetY){
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
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
        for(var i=0; i<shapes.length; i++){
            for(var j=0; j<shapes.length; j++) {
                if(shapes[i]===shapes[j]){break;}
                if (shapes[i].collidingWith(shapes[j])) {
                    //TODO handle shape snapping here.
                    var newShapes = [];
                    var deltaX = shapes[i].collX - shapes[j].collX;
                    var deltaY = shapes[i].collY - shapes[j].collY;

                    newShapes.concat(shapes[i].shapeList);
                    newShapes.concat(shapes[j].shapeList);
                    var newCombo = new ComboShape(shapes[i].currX, shapes[i].currY, 0, 0, newShapes);
                    shapes.splice(j, 1);
                    shapes[i] = newCombo;
                    break;
                }
            }
        }
    });

	// Up, down, and move are for dragging
	canvas.addEventListener('mousedown', function(e) {
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
				myState.dragoffx = mx - mySel.currX;
				myState.dragoffy = my - mySel.currY;
				myState.dragging = true;
				myState.selection = mySel;
				myState.valid = false;
				return;
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
		if (myState.dragging){
			var mouse = myState.getMouse(e);
			// We don't want to drag the object by its top-left corner, we want to drag it
			// from where we clicked. Thats why we saved the offset and use it here
			myState.selection.currX = mouse.x - myState.dragoffx;
			myState.selection.currY = mouse.y - myState.dragoffy;
			myState.valid = false; // redraw
		}
	}, true);
	canvas.addEventListener('mouseup', function(e) {
		myState.dragging = false;
	}, true);

	//Fun function to return random color
	function get_random_color() {
		function c() {
			return Math.floor(Math.random()*256).toString(16)
		}
		return "#"+c()+c()+c();
	}
/*	// double click for making new shapes
	canvas.addEventListener('dblclick', function(e) {
		var mouse = myState.getMouse(e);
		myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, shapePoints.AND,get_random_color()));
	}, true);*/


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

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
    // if our state is invalid, redraw and validate!
    if (!this.valid) {
        var ctx = this.ctx;
        var shapes = this.shapes;
        this.clear();
        // draw all shapes
        for (var i = 0; i < shapes.length; i++) {
            shapes[i].draw(ctx);
        }
        this.valid = true;
    }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
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

function CreateShape(logicArray){
    for(var i =0; i < logicArray.length; i++){
    var value = operator.value;
    var left = operator.left;
    var right = operator.right;
    }

}

var shapePoints={
    AND :[{x:0, y:100}, {x:60, y:0}, {x:120, y:100}, {x:100, y:100}, {x:60, y:35}, {x:20, y:100}, {x:0, y:100}],
    OR : [{x:0, y:0}, {x:60, y:100}, {x:120, y:0}, {x:100, y:0}, {x:60, y:70}, {x:20, y:0}, {x:0, y:0}],
    IMPLIES: [{x:0, y:20}, {x:90, y:20}, {x:70, y:0}, {x:85, y:0}, {x:110, y:35}, {x:90, y:70}, {x:80, y:70}, {x:90, y:50}, {x:0, y:50}, {x:0, y:40}, {x:90, y:40}, {x:90, y:30}, {x:0, y:30}, {x:0, y:20}],
    NOT :  [{x:0, y:0}, {x:120, y:0}, {x:50, y:60}, {x:30, y:60}, {x:80, y:20}, {x:0, y:20}, {x:0, y:0}],
    "⊢" :  [{x:0, y:0}, {x:30, y:0}, {x:30, y:30}, {x:100, y:30}, {x:100, y:50}, {x:30, y:50}, {x:30, y:80}, {x:0, y:80}, {x:0, y:0}],
    RULE :  [{x:0, y:0}, {x:150, y:0}, {x:150, y:100}, {x:300, y:100}, {x:300, y:0}, {x:450, y:0}, {x:450, y:300}, {x:300, y:300}, {x:300, y:200}, {x:150, y:200}, {x:150, y:300}, {x:0, y:300}, {x:0, y:0}],
    QUESTION : [{x:0, y:100}, {x:150, y:100}, {x:150, y:0}, {x:300, y:0}, {x:300, y:100}, {x:450, y:100}, {x:450, y:200}, {x:0, y:200}, {x:0, y:100}],

    E :  [{x:0, y:0}, {x:100, y:0}, {x:100, y:60}, {x:80, y:60}, {x:80, y:20}, {x:0, y:20}, {x:0, y:0}],
    F :  [{x:0, y:0}, {x:0, y:100}, {x:60, y:100}, {x:60, y:80}, {x:20, y:80}, {x:20, y:0}, {x:0, y:0}],
    G :  [{x:0, y:0}, {x:100, y:0}, {x:100, y:60}, {x:80, y:60}, {x:80, y:20}, {x:0, y:20}, {x:0, y:0}]

};

//initilisation method called from html on load up
function init() {
    var canvas = document.getElementById('canvasGameArea');
    var cs = new CanvasState(canvas);
    canvas.width = canvasSvg.clientWidth;
    canvas.height = canvasSvg.clientHeight;
    cs.width = canvasSvg.clientWidth;
    cs.height = canvasSvg.clientHeight;
   
    //cs.addShape(new Shape(15,125,shapePoints.RULE,"#FFF"));
    //cs.addShape(new Shape(15,125,shapePoints.QUESTION,"#FFF"));
    //cs.addShape(new Shape(15,15,shapePoints.AND,"#F00"));
    //cs.addShape(new Shape(115,15,shapePoints.OR,"#00F"));
    //cs.addShape(new Shape(235,25,shapePoints.IMPLIES,"#F0F"));
    //cs.addShape(new Shape(235,25,shapePoints.IMPLIES,"#F0F"));
    //cs.addShape(new Shape(385,25,shapePoints.NOT,"#0FF"));
    //cs.addShape(new Shape(15,125,shapePoints.TURNSTYLE,"#0F0"));
    //
    //cs.addShape(new Shape(115,125,shapePoints.E,"#FF0"));
    //cs.addShape(new Shape(235,125,shapePoints.F,"#000"));
    //cs.addShape(new Shape(115,125,shapePoints.E,"#FF0"));
    //cs.addShape(new Shape(235,125,shapePoints.F,"#000"));

    var rule = new ComboShape(10, 10, 225, 300,
        [new Shape(10,10,shapePoints.RULE,"#FFF"), new Shape(15,15,shapePoints.E,"#00F"), new Shape(330,15,shapePoints.F,"#00F"), new Shape(180,225,shapePoints.IMPLIES,"#00F")]
    );
    cs.addShape(rule);

    var question = new ComboShape(10, 400, 225, 100,
        [new Shape(10,10,shapePoints.QUESTION,"#FFF"), new Shape(15,130,shapePoints.E,"#00F"), new Shape(330,110,shapePoints.F,"#00F"), new Shape(180,15,shapePoints.IMPLIES,"#00F")]
    );
    cs.addShape(question);
    //combo.draw(cs.ctx);

    // debuggin pruposes only
    c = cs;

}