var gl;
var canvas;

var shaderProgram;
var square;

var perspectiveMatrix;
//mv matrix is the drawing position
var mvMatrix;


function start(){
	canvas = document.getElementById('glCanvas');

	console.log("Initializing...");

	gl = initWebGL();

	if(!gl) {return;}

	console.log("GL initialized.");

	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	initGameObjects();
	initShaders();
	initBuffers();
	setInterval(drawScene, 15)
}

function initWebGL() {
	gl = null;
	try {gl = canvas.getContext("experimental-webgl");}
	catch(e) {}
	// If we don't have a GL context, give up now
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}
	return gl;
}

function initGameObjects(){
	square = new VertexImage();
}

function initShaders(){
	var fragmentShader = getShader(gl, 'shader-fs');
	var vertexShader = getShader(gl, 'shader-vs');

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {alert('Unable to initialize shader program: ' + gl.getProgramInfoLog(shaderProgram));}
	gl.useProgram(shaderProgram);

	square.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
	gl.enableVertexAttribArray(square.vertexPositionAttribute);

	square.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
	gl.enableVertexAttribArray(square.vertexColorAttribute);

	console.log("Shaders initialized.")
}

function initBuffers(){
	square.verticesBuffer = gl.createBuffer();
	square.colorBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, square.verticesBuffer);

	var vertices = [
		1.0, 1.0, 0.0,
		-1.0, 1.0, 0.0,
		1.0, -1.0, 0.0,
		-1.0, -1.0, 0.0
		];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	var colors = [
		1.0, 1.0, 1.0, 1.0,
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0
		];

	gl.bindBuffer(gl.ARRAY_BUFFER, square.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

	console.log("Buffers initialized.");
}

function drawScene(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

	mvMatrix = Matrix.I(4);

	mvTranslate([-0.0, 0.0, -6.0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, square.verticesBuffer);
	gl.vertexAttribPointer(square.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	console.log("scene drawn");
}

function setMatrixUniforms() {
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}
