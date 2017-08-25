function getMouseCoords(ev){
	if(ev.pageX || ev.pageY)
		return {x:ev.pageX, y:ev.pageY};

	return{
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop - document.body.clientTop
	};
}

function EditorControl(){
	this.draggingObject = null;
	this.lastMouseCoords = null;
}

EditorControl.prototype.clickObject = function(object){
	this.draggingObject = object;
};

EditorControl.prototype.update = function(mouseCoords){
	var currentMouseCoordinates = mouseCoords;
	if(this.lastMouseCoords){
		var dx = currentMouseCoordinates.x - this.lastMouseCoords.x;
		var dy = currentMouseCoordinates.y - this.lastMouseCoords.y;

		if(this.draggingObject != null){
			this.draggingObject.onDrag(dx,dy);
		}
	}
	this.lastMouseCoords = currentMouseCoordinates;
}

EditorControl.prototype.checkForClick = function(clickableObjects, x, y){
	for(var i = 0; i < clickableObjects.length; i++){
		if(clickableObjects[i] instanceof EditorObject && clickableObjects[i].getClick(x,y)){
			this.clickObject(clickableObjects[i]);
		}
	}
}

