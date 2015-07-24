/**
 * Created by Anubites on 17/07/15.
 */

$(document).ready(drawShizz);

function drawShizz()
{
    //var canvas = document.getElementById('game-area');
    var canvas = document.getElementById('game-area');
    var context = canvas.getContext('2d');

// set line width for all lines
    context.lineWidth = 25;

// miter line join (left)
    context.beginPath();
    context.moveTo(99, 150);
    context.lineTo(149, 50);
    context.lineTo(199, 150);
    context.lineJoin = 'miter';
    context.stroke();

// round line join (middle)
    context.beginPath();
    context.moveTo(239, 150);
    context.lineTo(289, 50);
    context.lineTo(339, 150);
    context.lineJoin = 'round';
    context.stroke();

// bevel line join (right)
    context.beginPath();
    context.moveTo(379, 150);
    context.lineTo(429, 50);
    context.lineTo(479, 150);
    context.lineJoin = 'bevel';
    context.stroke();
}

/**
 * Shape Object
 * An object representing a shape.
 */
function Shape(shapePoints) {
    var points = shapePoints;

    this.drawShape = function(context){
        context.moveTo(points[0].x, points[0].y);
        for(var i=1; i<points.length; i++){
            context.lineTo(points[i].x, points[i].y);
        }
        context.lineJoin = 'miter';
        context.stroke();
    };

    this.addPoint = function(xPt, yPt){
        points.append({x:xPt, y:yPt})
    };
}
var shapes={
    AND : [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}],
    OR : [{x:0, y:0}, {x:0, y:0}, {x:0, y:0}]
};
