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