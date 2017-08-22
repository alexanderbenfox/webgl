var canvas;
var surface;
var sprite;

function new_start(){
	canvas = document.getElementById('glCanvas');
	console.log('CANVAS ' + canvas);
	surface = new DrawSurface(canvas);
	sprite = new Sprite(surface, 256, 256, 'box.png');
	setInterval(drawScene, 15)
}

function drawScene(){
	surface.clear();
	surface.push();
	surface.translate(surface.width/2, surface.height/2);
	surface.rotate(Date.now()/1000 * Math.PI * .1);
	sprite.blit(sprite.width * (-0.5), sprite.height * (-0.5));
	surface.pop();
}
