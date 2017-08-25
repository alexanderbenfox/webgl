
function MatrixStack(){
	this.stack = [];
	this.matrix = Matrix.I(3); 
	console.log('Matrix stack created.');
}

MatrixStack.prototype.push_matrix = function(m){
	if(m){
		this.stack.push(m.dup());
		this.matrix = m.dup();
	}
	else
	{
		this.stack.push(this.matrix.dup());
	}
};

MatrixStack.prototype.pop_matrix = function(){
	if(!this.stack.length){
		throw('Can\'t pop from empty stack');
	}

	this.matrix = this.stack.pop();
	return this.matrix;
};

MatrixStack.prototype.rotate = function(angle, v){
	var radians = angle * Math.PI / 180.0;
	var m = Matrix.Rotation(radians, $V([v[0], v[1], v[2]])).ensure4x4();
	this.matrix = matrix_multiply(this.matrix, m);
};


function DrawSurface(canvas, line){
	this.canvas = canvas;
	this.matrixStack = new MatrixStack();
	this.width = 0;
	this.height = 0;

	this.gl = getGLContext(canvas, {alpha: false, premultipliedAlpha: false});
	this.locations = initGL(this.gl, this.width, this.height, line);
	this.program = this.locations.program;
	this.resize(this.width, this.height);
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

	console.log((this.program));
	this.gl.useProgram(this.program);
	this.gl.uniform2f(this.locations.resolution, width, height);
};

DrawSurface.prototype.clear = function(){
	this.gl.clear(this.gl.COLOR_BUFFER_BIT);
};

DrawSurface.prototype.push = function(){
	this.matrixStack.push_matrix();
};

DrawSurface.prototype.pop = function(){
	return this.matrixStack.pop_matrix();
};

DrawSurface.prototype.getMatrix = function(){
	return this.matrixStack.stack[this.matrixStack.stack.length - 1];
};

DrawSurface.prototype.translate = function(tx, ty){
	var m = this.getMatrix();
	return Translate(m, [tx,ty,0]);
};

DrawSurface.prototype.rotate = function(angle, v){
	v = v || [0,0,0];
	this.matrixStack.rotate(angle, v);
};

DrawSurface.prototype.getRect = function(){
	var matrix = matrixStack.matrix.dup();
	var ul = [0,0];
	var lr = [this.width, this.height];
	matrix = invert(matrix, matrix);
	ul = transform(ul, ul, matrix);
	lr = transform(lr, lr, matrix);
	return {
		left: ul[0],
		top: ul[1],
		right: lr[0],
		bottom: lr[1]
	}
};

function transform(out, a, m){
	var x = a[0];
	var y = a[1];
	out[0] = m[0] * x + m[3] * y + m[6];
	out[1] = m[1] * x + m[3] * y + m[7];
	return out;	
}

function invert(out, a) {
  var a00 = a[0], a01 = a[1], a02 = a[2]
  var a10 = a[3], a11 = a[4], a12 = a[5]
  var a20 = a[6], a21 = a[7], a22 = a[8]

  var b01 = a22 * a11 - a12 * a21
  var b11 = -a22 * a10 + a12 * a20
  var b21 = a21 * a10 - a11 * a20

  // Calculate the determinant
  var det = a00 * b01 + a01 * b11 + a02 * b21

  if (!det) return null
  det = 1.0 / det

  out[0] = b01 * det
  out[1] = (-a22 * a01 + a02 * a21) * det
  out[2] = (a12 * a01 - a02 * a11) * det
  out[3] = b11 * det
  out[4] = (a22 * a00 - a02 * a20) * det
  out[5] = (-a12 * a00 + a02 * a10) * det
  out[6] = b21 * det
  out[7] = (-a21 * a00 + a01 * a20) * det
  out[8] = (a11 * a00 - a01 * a10) * det

  return out
}

function multMatrix(m1, m2){
	return m1.x(m2);
}

function Translate(m, v){
	return multMatrix(m, Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}