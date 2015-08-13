
function initr() {
	var canvasr = document.getElementById('canvasRules');
	var csr = new CanvasState(canvasr);
    
	var rule = new ComboShape(10, 10,
	        [new Shape(10,10,shapePoints.RULE,"#FFF"), new Shape(15,15,shapePoints.A,"#00F"), new Shape(330,15,shapePoints.B,"#00F"), new Shape(180,225,shapePoints.IMPLIES,"#00F")]
	    );
	csr.addShape(rule);
//	csr.ctx.scale(0.3, 0.1);
	
	// debuggin purposes only
	cr = csr;
}



