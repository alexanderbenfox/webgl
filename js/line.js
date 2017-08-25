function Line(surface, x1, x2, y1, y2, width){
	//this.surface = surface;
	//this.vertexBuffer = surface.gl.createBuffer();

	//this.points = new Float32Array([
	//	x1, y1, x2, y1,
	//	x1, y2, x1, y2,
	//	x2, y1, x2, y2]);

	//this.width = width;
	console.log("this gets called");
}

Line.prototype.say = function(){
	//console.log('hi');
};

Line.prototype.blit = function(){
	/*var surface = this.surface;
	var gl = this.surface.gl;

	var vertexPosition = surface.locations.position;
	var vertexTexture = surface.locations.texture;
	var matrixLocation = surface.locations.matrix;
	var matrix = surface.getMatrix();

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this.points, gl.STATIC_DRAW);
	gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0,0);

	gl.lineWidth(this.width);
	gl.drawArrays(gl.LINE_STRIP,0, this.points.length);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);*/
};