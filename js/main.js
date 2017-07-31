var gl;
var canvas;

var shaderProgram;
var square;

var perspectiveMatrix;
//mv matrix is the drawing position
var mvMatrixStack;

//stuff for updating
var lastUpdateTime = 0;

//stuff for rotation
var xIncValue = 0.01;
var yIncValue = 0;
var zIncValue = 0;


function start(){
	canvas = document.getElementById('glCanvas');

	console.log("Initializing...");

	gl = initWebGL();

	if(!gl) {return;}
	initShaders();

	
	initGameObjects();
	
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
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);
	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	console.log("GL initialized.");
	return gl;
}

function initGameObjects(){
	square = new VertexImage();
	mvMatrixStack = new MatrixStack();

	square.init();
	mvMatrixStack.init();
	square.initTexture(gl, "cubetexture.png");
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

	var vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
	gl.enableVertexAttribArray(vertexPosition);

	var textureCoordinate = gl.getAttribLocation(shaderProgram, 'aTextureCoordinate');
	gl.enableVertexAttribArray(textureCoordinate);

	var resolutionLocation = gl.getUniformLocation(shaderProgram, 'uResolution');
	var transformationMatrix = gl.getUniformLocation(shaderProgram, 'uMatrix');

	console.log("Shaders initialized.")

	return { position:vertexPosition, texture:textureCoordinate, resolution:resolutionLocation, matrix:transformationMatrix };
}

function initBuffers(){
	square.verticesBuffer = gl.createBuffer();
	

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
	square.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, square.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


	square.textureBuffer = gl.createBuffer();

	var textureCoords = [
		0.0, 0.0,
		1.0, 0.0,
		0.0, 1.0,
		1.0, 1.0
	]
	gl.bindBuffer(gl.ARRAY_BUFFER, square.textureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

	console.log("Buffers initialized.");
}

function drawScene(){
	if(square.texLoad){
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

		mvMatrixStack.mvMatrix = Matrix.I(4);

		mvTranslate([-0.0, 0.0, -6.0]);

		//save current matrix
		mvMatrixStack.push_matrix();

		//apply movement
		mvTranslate([square.xOffset, square.yOffset, square.zOffset]);
		//apply rotation
		mvMatrixStack.rotate(square.rotation, [0,0,1]);
		
		//bind position
		gl.bindBuffer(gl.ARRAY_BUFFER, square.verticesBuffer);
		gl.vertexAttribPointer(square.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		//color buffers
		//gl.bindBuffer(gl.ARRAY_BUFFER, square.colorBuffer);
		//gl.vertexAttribPointer(square.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);

		//bind texture

		gl.bindBuffer(gl.ARRAY_BUFFER, square.textureBuffer);
		gl.vertexAttribPointer(square.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, square.texture);
		gl.uniform1i(gl.getUniformLocation(shaderProgram, 'uSampler'), 0);



		//apply shaders and draw
		setMatrixUniforms();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		//restore original matrix

		mvMatrixStack.pop_matrix();

		//do update loop

		var currentTime = (new Date).getTime();
		if(lastUpdateTime){
			var deltaTime = currentTime - lastUpdateTime;
			update(deltaTime);
		}
		lastUpdateTime = currentTime;

		console.log("scene drawn");
	}
}

function update(dt){
	var normalizedUpdateValue = (30 * dt) / 1000.0;

	var rotation = square.rotation + normalizedUpdateValue;
	var x = square.xOffset + xIncValue * normalizedUpdateValue;
	var y = square.yOffset + yIncValue * normalizedUpdateValue;
	var z = square.zOffset + zIncValue * normalizedUpdateValue;

	square.setRotation(rotation, x, y, z);

	if(Math.abs(y) > 2.5){
		xIncValue*=-1;
		yIncValue*=-1;
		zIncValue*=-1;
	}

}

function setMatrixUniforms() {
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrixStack.mvMatrix.flatten()));
}

function multMatrix(m) {
  mvMatrixStack.mvMatrix = mvMatrixStack.mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}