class MatrixStack{
	constuctor(){
		this.stack = [];
		this.mvMatrix = Matrix.I(4); 
		console.log('Matrix stack created.')
	}

	init(){
		this.stack = [];
		this.mvMatrix = Matrix.I(4); 
		console.log('Matrix stack created.')
	}

	push_matrix(m){
		if(m){
			this.stack.push(m.dup());
			this.mvMatrix = m.dup();
		}
		else
		{
			this.stack.push(this.mvMatrix.dup());
		}
	}

	pop_matrix(){
		if(!this.stack.length){
			throw('Can\'t pop from empty stack');
		}

		this.mvMatrix = this.stack.pop();
		return this.mvMatrix;
	}

	rotate(angle, v){
		var radians = angle * Math.PI / 180.0;
		var m = Matrix.Rotation(radians, $V([v[0], v[1], v[2]])).ensure4x4();
		this.mvMatrix = matrix_multiply(this.mvMatrix, m);
	}
}

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
	}

	setRotation(rot, xO, yO, zO){
		this.rotation = rot;
		this.xOffset = xO;
		this.yOffset = yO;
		this.zOffset = zO;
	}
}