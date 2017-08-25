function initGL(gl, width, height, line){
	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.depthFunc(gl.LEQUAL);
	gl.disable(gl.DEPTH_TEST);
	gl.disable(gl.CULL_FACE);
	gl.enable(gl.BLEND);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	if(line)
		return initShaderNoTexture(gl);
	return initShaders(gl);
}

function initShaders(gl){
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

	return { position:vertexPosition, texture:textureCoordinate, resolution:resolutionLocation, matrix:transformationMatrix, program:shaderProgram };
}

function initShaderNoTexture(gl){
	var fragmentShader = getShader(gl, 'shader-fs-not');
	var vertexShader = getShader(gl, 'shader-vs-not');

	shaderProgram2 = gl.createProgram();

	gl.attachShader(shaderProgram2, vertexShader);
	gl.attachShader(shaderProgram2, fragmentShader);
	gl.linkProgram(shaderProgram2);

	if(!gl.getProgramParameter(shaderProgram2, gl.LINK_STATUS)) {alert('Unable to initialize shader program: ' + gl.getProgramInfoLog(shaderProgram2));}
	gl.useProgram(shaderProgram2);

	var vertexPosition = gl.getAttribLocation(shaderProgram2, 'aVertexPosition');
	gl.enableVertexAttribArray(vertexPosition);

	var vertexColor = gl.getAttribLocation(shaderProgram2, 'aVertexColor');
	gl.enableVertexAttribArray(vertexColor);

	var resolutionLocation = gl.getUniformLocation(shaderProgram2, 'uResolution');
	var transformationMatrix = gl.getUniformLocation(shaderProgram2, 'uMatrix');
	return { position:vertexPosition, texture:vertexColor, resolution:resolutionLocation, matrix:transformationMatrix, program:shaderProgram2 };
}

function getShader(gl, id, type){
	var shaderScript, theSource, currentChild, shader;

	shaderScript = document.getElementById(id);
	if(!shaderScript){return null;}

	currentChild = shaderScript.firstChild;
	theSource = "";

	while(currentChild){
		if(currentChild.nodeType == 3){theSource += currentChild.textContent;}
		currentChild = currentChild.nextSibling;
	}

	if(!type){
		if(shaderScript.type == 'x-shader/x-fragment'){
			type = gl.FRAGMENT_SHADER;
		}
		else if(shaderScript.type == 'x-shader/x-vertex'){
			type = gl.VERTEX_SHADER;
		}
		else{
			console.log("Unknown shader type.");
			return null;
		}
	}

	shader = gl.createShader(type);
	//read shader text into source
	gl.shaderSource(shader, theSource);

	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		console.log('An error ocurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}


function getGLContext(canvas, opts){
	return canvas.getContext('webgl', opts) || canvas.getContext('experimental-webgl', opts);
}

function nextPowerOfTwo(n){
	var i = Math.floor(n/2);
	while(i<n) i*=2;
	return i;
}