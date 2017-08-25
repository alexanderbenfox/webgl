var editor = new EditorControl();

document.onmousemove = mouseMove;
document.onmouseup = mouseUp;

function mouseMove(ev){
	ev = ev || window.event;
	var mousePosition = getMouseCoords(ev);
}

function getMouseCoords(ev){
	if(ev.pageX || ev.pageY)
		return {x:ev.pageX, y:ev.pageY};

	return{
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop - document.body.clientTop
	};
	}
}

function mouseUp(ev){
	editor.draggingObject = null;
}

function EditorControl(){
	this.draggingObject = null;
}

EditorControl.prototype.clickObject = function(object){
	if(object.draggable)
		this.draggingObject = object;
};