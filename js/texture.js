function Texture(surface, canvas, src, scale){
	this.surface = surface;
	this.canvas = canvas;
	this.scale = scale;
	this.img = new Image();
	this.img.onload = function() {loadTexture();}
	this.img.src = src;
}

Texture.prototype.loadTexture = function(){
	var gl = this.surface.gl;
	this.texture = gl.createTexture();

	//bind texture for set up
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.canvas);

	if(this.scale){
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.generateMipmap(gl.TEXTURE_2D);
	}
}