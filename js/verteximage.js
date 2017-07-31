function MatrixStack(){
	this.stack = [];
	this.matrix = Matrix.I(4); 
	console.log('Matrix stack created.')
}

MatrixStack.prototype.push_matrix(m){
	if(m){
		this.stack.push(m.dup());
		this.matrix = m.dup();
	}
	else
	{
		this.stack.push(this.matrix.dup());
	}
}

MatrixStack.prototype.pop_matrix(){
	if(!this.stack.length){
		throw('Can\'t pop from empty stack');
	}

	this.matrix = this.stack.pop();
	return this.matrix;
}

MatrixStack.prototype.rotate(angle, v){
	var radians = angle * Math.PI / 180.0;
	var m = Matrix.Rotation(radians, $V([v[0], v[1], v[2]])).ensure4x4();
	this.matrix = matrix_multiply(this.matrix, m);
}

var imgImage;

class VertexImage {
	constructor(vertices, color, positionAttr, colorAttr){
		this.verticesBuffer = vertices;
		this.colorBuffer = color;
		this.vertexPositionAttribute = positionAttr;
		this.vertexColorAttribute = colorAttr;
	}

	init(){
		this.rotation = 0;
		this.xOffset = 0;
		this.yOffset = 0;
		this.zOffset = 0;
		this.texLoad = false;
	}

	setRotation(rot, xO, yO, zO){
		this.rotation = rot;
		this.xOffset = xO;
		this.yOffset = yO;
		this.zOffset = zO;
	}
}

VertexImage.prototype.initTexture = function(gl, textureName){
	this.texture = gl.createTexture();
	imgImage = new Image();
	var vI = this;
	imgImage.onload = function() { console.log('loading texture'); vI.texLoad = true; handleTextureLoad(gl, vI.texture, imgImage);}
	imgImage.src = "cubetexture.png";
}

VertexImage.prototype.loadTexture = function(gl) { this.texLoad = true; handleTextureLoad(gl, this.texture, imgImage);}

function handleTextureLoad(gl, texture, image){
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}


function DrawSurface(canvas, gl, context, width, height){
	this.canvas = canvas;
	this.matrixStack = new MatrixStack();
	this.gl = gl;
	this.context = context;
	this.resize(width, height);
}

DrawSurface.prototype.resize = function(width, height){
	var density = window.devicePixelRatio || 1;

	if(!width && !height){
		width = this.canvas.clientWidth * density;
		height = this.canvas.clientHeight * density;
	}

	this.width = this.canvas.width = width;
	this.height = this.canvas.height = height;
	this.density = density;

	this.gl.viewport(0,0,width,height);
	this.gl.uniform2f(this.context.resolution, width, height);
}

DrawSurface.prototype.clear = function(){
	this.gl.clear(this.gl.COLOR_BUFFER_BIT);
} 

DrawSurface.prototype.push = function(){
	this.matrixStack.push_matrix();
}

DrawSurface.prototype.pop = function(){
	return this.matrixStack.pop_matrix();
}

DrawSurface.prototype.getMatrix = function(){
	return this.matrixStack.matrix;
}

DrawSurface.prototype.translate = function(v){
	this.getMatrix().Translation(v);
}

DrawSurface.prototype.rotate = function(angle, v){
	this.matrixStack.rotate(angle, v);
}

DrawSurface.prototype.getRect = function(){
	
}
