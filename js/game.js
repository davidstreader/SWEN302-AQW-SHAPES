/**
 * Created by Anubites on 17/07/15.
 */

$(document).ready(drawShizz);

function drawShizz()
{
    //var canvas = document.getElementById('game-area');
    var canvas = document.getElementById('game-area');
    var context = canvas.getContext('2d');
    //var a1 = new AndShape(1, 5);
    //var a2 = new AndShape(7, 2);
    //var b1 = new OrShape(23, 3);
    //var b2 = new OrShape(65, 4);

}

/**
 * Shape Object
 * An object representing a shape.
 */
function Shape(startX, startY) {
    this.points = [];
    this.x = startX;
    this.y = startY;

}

Shape.prototype.drawShape = function(context){
    context.moveTo(this.points[0].x + this.x, this.points[0].y + this.y);
    for(var i=1; i<this.points.length; i++){
        context.lineTo(this.points[i].x + this.x, this.points[i].y + this.y);
    }
    context.lineJoin = 'miter';
    context.stroke();
};

function AndShape(startX, startY){
    var shape = new Shape(startX, startY);
    shape.points = [{x:110, y:456}, {x:144, y:356}, {x:248, y:300}];
    return shape;
}

function OrShape(startX, startY){
    var shape = new Shape(startX, startY);
    shape.points = [{x:20, y:70}, {x:90, y:230}, {x:350, y:380}];
    return shape;
}

