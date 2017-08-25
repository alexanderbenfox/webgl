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