var canvas;
var surface;
var obj_1;
var obj_2;
var camera;

var gameObjects;

var lastUpdateTime;

var inGame;

ScriptEventEnum = {
	OnStart : 0,
	OnPlayerTouch : 1,
	OnDestroy : 2
}

function executeJSInContext(script, context){
	return function() {return eval(script);}.call(context);
}

function ScriptableEvent(){
	this.eventList = [];
}

ScriptableEvent.prototype.setNewScript = function(s, t){
	var event = {script : s, type : t};
	this.eventList.push(event);
}

ScriptableEvent.prototype.execute = function(eventType, object){
	if(inGame){
		for (var i = 0; i < this.eventList.length; i++) {
			if(this.eventList[i].type == eventType){
				executeJSInContext(eventList[i].script, object);
			}
		}
	}
}

function GameObject(img, width, height, surf, startX, startY){
	if(img)
		this.sprite = new Sprite(surf, width, height, img);
	else
		this.sprite = null;

	this.x = startX;
	this.y = startY;

	this.dx = 0;
	this.dy = 0;
}

GameObject.prototype.move = function(delta_x, delta_y) {
	// load the sprite stuff
	this.dx = delta_x;
	this.dy = delta_y;
};

GameObject.prototype.update = function(dt){
	this.x += (this.dx * dt);
	this.y += (this.dy * dt);
};

GameObject.prototype.draw = function(){
	if(this.sprite)
		this.sprite.blit(this.x - camera.x, this.y - camera.y);
};


function new_start(){
	canvas = document.getElementById('glCanvas');
	console.log('CANVAS ' + canvas);

	surface = new DrawSurface(canvas);

	obj_1 = new GameObject('box.png', 256, 256, surface, 0,0);
	obj_2 = new GameObject('box.png', 256, 256, surface, 256, 0);
	camera = new GameObject(null, null, null, null, 0,0);

	gameObjects = [obj_1, obj_2, camera];

	obj_1.move(5,5);
	obj_2.move(-5,5);
	camera.move(5,3);

	setInterval(drawScene, 15)
}

function updateLoop(){
	var currentTime = (new Date).getTime();
	if(lastUpdateTime){
		var deltaTime = currentTime - lastUpdateTime;
		update(deltaTime);
	}
	lastUpdateTime = currentTime;
}

function update(dt){
	var normalizedUpdateValue = (30 * dt) / 1000.0;
	for (var i = 0; i < gameObjects.length; i++) {
		gameObjects[i].update(normalizedUpdateValue);
	}
}

function draw(){
	obj_1.draw();
	obj_2.draw();
}

function drawScene(){

	surface.clear();
	surface.push();

	surface.translate(surface.width/2, surface.height/2);
	surface.rotate(Date.now()/1000 * Math.PI * .1);

	updateLoop();
	draw();

	surface.pop();
}
