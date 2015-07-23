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