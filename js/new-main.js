var canvas;
var surface_sprites;
var surface_lines;
var obj_1;
var obj_2;
var camera;
var lines;

var square

var gameObjects;

var lastUpdateTime;

var inGame;



function Line(surface, x1, x2, y1, y2, width){
	this.surface = surface;
	this.vertexBuffer = surface.gl.createBuffer();
	this.colorBuffer = surface.gl.createBuffer();

	this.points = new Float32Array([
		x1, y1, x2, y1,
		x1, y2, x1, y2,
		x2, y1, x2, y2]);

	this.width = width;
}

Line.prototype.blit = function(){

	var surface = this.surface;
	var gl = this.surface.gl;
	var program = this.surface.locations.program;

	gl.useProgram(program);

	var vertexPosition = surface.locations.position;
	var vertexColor = surface.locations.texture;
	var matrixLocation = surface.locations.matrix;
	var matrix = surface.getMatrix();

	//gl.disableVertexAttribArray(vertexTexture);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.points, gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0,0);

	/*var colors = [
	1.0, 1.0, 1.0, 1.0,//white
	1.0, 0.0, 0.0, 0.0,//red
	0.0, 1.0, 0.0, 0.0,//green
	0.0, 0.0, 1.0, 0.0];//blue*/

	var colors = [
	1.0,1.0,1.0,1.0,
	1.0,0.0,0.0,1.0,
	0.0,1.0,0.0,1.0,
	0.0,0.0,1.0,1.0];

	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexColor, 2, gl.FLOAT, false, 0,0);

	var n_matrix = new Float32Array(matrix.flatten());

	gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
	gl.lineWidth(this.width);
	gl.drawArrays(gl.LINES,0, 6);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
};

function Square(surface, x1, x2, y1, y2, width){
	this.surface = surface;
	this.vertexBuffer = surface.gl.createBuffer();
	this.colorBuffer = surface.gl.createBuffer();

	this.points = new Float32Array([
		x1, y1, x2, y1,
		x1, y2, x1, y2,
		x2, y1, x2, y2]);

	this.width = width;
}

Square.prototype.blit = function(){

	var surface = this.surface;
	var gl = this.surface.gl;
	var program = this.surface.locations.program;

	gl.useProgram(program);

	var vertexPosition = surface.locations.position;
	var vertexColor = surface.locations.texture;
	var matrixLocation = surface.locations.matrix;
	var matrix = surface.getMatrix();

	//gl.disableVertexAttribArray(vertexTexture);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.points, gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0,0);

	/*var colors = [
	1.0, 1.0, 1.0, 1.0,//white
	1.0, 0.0, 0.0, 0.0,//red
	0.0, 1.0, 0.0, 0.0,//green
	0.0, 0.0, 1.0, 0.0];//blue*/

	var colors = [
	1.0,1.0,1.0,1.0,
	1.0,0.0,0.0,1.0];

	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexColor, 1, gl.FLOAT, false, 0,0);

	var n_matrix = new Float32Array(matrix.flatten());

	gl.uniformMatrix3fv(matrixLocation, false, n_matrix);
	//gl.lineWidth(this.width);
	gl.drawArrays(gl.TRIANGLES,0, 6);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
};



/*ScriptEventEnum = {
	OnStart : 0,
	OnPlayerTouch : 1,
	OnDestroy : 2
};

function executeJSInContext(script, context){
	return function() {return eval(script);}.call(context);
}

function ScriptableEvent(){
	this.eventList = [];
};

ScriptableEvent.prototype.setNewScript = function(s, t){
	var event = {script : s, type : t};
	this.eventList.push(event);
};

ScriptableEvent.prototype.execute = function(eventType, object){
	if(inGame){
		for (var i = 0; i < this.eventList.length; i++) {
			if(this.eventList[i].type == eventType){
				executeJSInContext(eventList[i].script, object);
			}
		}
	}
};*/

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

	surface_sprites = new DrawSurface(canvas);
	surface_lines = new DrawSurface(canvas, true);

	obj_1 = new GameObject('box.png', 256, 256, surface_sprites, 0,0);
	obj_2 = new GameObject('box.png', 256, 256, surface_sprites, 256, 0);
	camera = new GameObject(null, null, null, null, 0,0);



	lines = [];
	var screen_width = surface_lines.width;
	var screen_height = surface_lines.height;

	square = new Square(surface_lines, screen_width-3*32, screen_width, 0, screen_height,0);

	for(var x = 0; x < screen_width; x+=32){
		var line = new Line(surface_lines, x,x,0,screen_height, 2);
		lines.push(line);
	}

	for(var y = 0; y < screen_height; y+=32){
		var line = new Line(surface_lines, 0, screen_width, y,y,2);
		lines.push(line);
	}

	//line = new Line(surface_lines, 100,256,100,256,2);

	gameObjects = [obj_1, obj_2, camera];

	//obj_1.move(5,5);
	//obj_2.move(-5,5);
	//camera.move(5,3);

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
	for(var i = 0; i < lines.length; i++){
		lines[i].blit();
	}
	square.blit();
}

function drawScene(){

	surface_sprites.clear();
	surface_lines.clear();
	surface_sprites.push();
	surface_lines.push();

	surface_sprites.translate(surface_sprites.width/2, surface_sprites.height/2);
	surface_lines.translate(surface_lines.width/2, surface_lines.height/2);
	surface_sprites.rotate(Date.now()/1000 * Math.PI * .1);
	surface_lines.rotate(Date.now()/1000 * Math.PI * .1);

	updateLoop();
	draw();

	surface_sprites.pop();
	surface_lines.pop();
}
