//
// Matrix stuff
//

Matrix.Translation = function (v){
	if(v.elements.length == 2){
		var r = Matrix.I(3);
		r.elements[2][0] = v.elements[0];
		r.elements[2][1] = v.elements[1];
		return r;
	}

	if(v.elements.length == 3){
		var r = Matrix.I(4);
		r.elements[0][3] = v.elements[0];
		r.elements[1][3] = v.elements[1];
		r.elements[2][3] = v.elements[2];
		return r;
	}

	throw "Invalid length for Translation";
};

Matrix.prototype.flatten = function()
{
	var result = [];
	if(this.elements.length == 0)
		return [];

    for (var j = 0; j < this.elements[0].length; j++)
        for (var i = 0; i < this.elements.length; i++)
            result.push(this.elements[i][j]);

	return result;
};

Matrix.prototype.ensure4x4 = function()
{
	var e = this.elements;
	if(e.length == 4 && e[0].length == 4)
		return this;
	if(e.length > 4 || e[0].length > 4)
		return null;

	//fill the rest with identity
	for(var i = 0; i < e.length; i++){
		for (var j = e[i].length; j < 4; j++){
			if(i == j)
				e[i].push(1);
			else
				e[i].push(0);
		}
	}

	for(var i = e.length; i < 4; i++){
		var row = [0,0,0,0];
		row[i] = 1;
		e.push(row);
	}

	this.elements = e;
	return this;
};

Matrix.prototype.make3x3 = function()
{
	if(this.elements.length != 4 || this.elements[0].length != 4)
		return null;

	return Matrix.create([[this.elements[0][0], this.elements[0][1], this.elements[0][2]],
                          [this.elements[1][0], this.elements[1][1], this.elements[1][2]],
                          [this.elements[2][0], this.elements[2][1], this.elements[2][2]]]);
};

Vector.prototype.flatten = function(){
	return this.elements;
};



//
// Matrix Utility Functions
//

function matrix_identity(m){
	m = Matrix.I(4);
	return m;
}

function matrix_multiply(m1, m2){
	m1 = m1.x(m2);
	return m1;
}

function matrix_translate(m, v){
	return matrix_multiply(m, Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}