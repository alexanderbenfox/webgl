function inBounds2D(topLeft, bottomRight, value){
	if(value.x > topLeft.x && value.x < bottomRight.x){
		if(value.y > topLeft.y && value.y < bottomRight.y)
			return true;
	}
	return false;
}

function Obj(img, width, height, surf, startX, startY){
	if(img)
		this.sprite = new Sprite(surf, width, height, img);
	else
		this.sprite = null;

	this.x = startX;
	this.y = startY;

	this.dx = 0;
	this.dy = 0;

	this.width = width;
	this.height = height;

	this.topLeft = {x:this.x, y:this.y};
	this.bottomRight = {x:(this.x + width), y:(this.y + height)};
}

Obj.prototype.move = function(delta_x, delta_y) {
	// load the sprite stuff
	this.dx = delta_x;
	this.dy = delta_y;
};

Obj.prototype.updateBounds = function(){
	this.topLeft = {x:this.x, y:this.y};
	this.bottomRight = {x:this.x + this.width, y : this.y + this.height};
};

Obj.prototype.update = function(dt){
	//Abstract
	this.updateBounds();
};

Obj.prototype.bounds = function(vec2){
	return inBounds2D(this.topLeft, this.bottomRight, vec2);
};

Obj.prototype.draw = function(){
	if(this.sprite)
		this.sprite.blit(this.x - camera.x, this.y - camera.y);
};



function EditorObject(img, width, height, surf, startX, startY){
	Obj.call(this, img, width, height, surf, startX, startY);
}

EditorObject.prototype.getClick = function(mouseX, mouseY){
	if(Obj.prototype.bounds.call(this, {x:mouseX, y:mouseY}))
		return true;
	return false;
};

EditorObject.prototype.onDrag = function(dx, dy){
	this.x += dx;
	this.y += dy;
};



extend(Obj, EditorObject);


function GameObject(img, width, height, surf, startX, startY){
	Obj.call(this, img, width, height, surf, startX, startY);
}

GameObject.prototype.update = function(dt){
	this.x += (this.dx * dt);
	this.y += (this.dy * dt);
	Obj.prototype.update.call(this, dt);
};

extend(Obj, GameObject);

