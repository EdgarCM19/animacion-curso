function initWebGL(canvas) {
	var gl
	try {
		gl = canvas.getContext('experimental-webgl')
	} catch (e) {
		var msg = 'Error creating WebGL context!' + e.toString()
		alert(msg)
		throw Error(msg)
	}
	return gl
}

function initViewport(gl, canvas) {
	gl.viewport(0, 0, canvas.width, canvas.height)
}

var projectionMatrix, modelViewMatrix

function initMatrices() {
	//Matriz de transformacion para el cuadrado
	modelViewMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -3.33, 1])
	//Matriz de proyeccion
	projectionMatrix = new Float32Array([2.41421, 0, 0, 0, 0, 2.41421, 0, 0, 0, 0, -1.002002, -1, 0, 0, -0.2002002, 0])
}

function createStar(gl) {
	var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var verts = [
         0,		0,	 	0,
        -0.12,	0.16, 	0,
         0,		0.5, 	0,
         0.12, 	0.16, 	0,
         0.5, 	0.16, 	0,
         0.2,  -0.06, 	0,
         0.3,  -0.4, 	0,
         0,    -0.2, 	0,
        -0.3,  -0.4, 	0, 
        -0.2,  -0.06, 	0, 
        -0.5,   0.15, 	0, 
        -0.12,  0.16, 	0,
        
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    var star = {
		buffer:vertexBuffer, 
		vertSize:3, 
		nVerts:verts.length, 
		primtype:gl.TRIANGLE_FAN
	}
    return star;
}

function createShader(gl, str, type) {
	var shader
	if (type == 'fragment') {
		shader = gl.createShader(gl.FRAGMENT_SHADER)
	} else if (type == 'vertex') {
		shader = gl.createShader(gl.VERTEX_SHADER)
	} else {
		return null
	}

	gl.shaderSource(shader, str)
	gl.compileShader(shader)

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader))
		return null
	}

	return shader
}

var vertexShaderSource = ` 
    attribute vec3 vertexPos;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    void main(void){
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
    }
`

var fragmentShaderSource = `
    void main(void){
        gl_FragColor = vec4(1.0, 1.0, 0, 1.0);
    }
`

var shaderProgram, shaderVertexPositionAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform

function initShader(gl) {
	var fragmentShader = createShader(gl, fragmentShaderSource, 'fragment')
	var vertexShader = createShader(gl, vertexShaderSource, 'vertex')

	shaderProgram = gl.createProgram()
	gl.attachShader(shaderProgram, vertexShader)
	gl.attachShader(shaderProgram, fragmentShader)
	gl.linkProgram(shaderProgram)

	shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'vertexPos')
	gl.enableVertexAttribArray(shaderVertexPositionAttribute)

	shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, 'projectionMatrix')
	shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, 'modelViewMatrix')

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Couldn't not initialize shaders")
	}
}

function draw(gl, obj) {
	gl.clearColor(0.0, 0.0, 1.0, 1.0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer)

	gl.useProgram(shaderProgram)

	gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0)
	gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix)
	gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix)

	gl.drawArrays(obj.primtype, 0, obj.nVerts)
}

function onLoad() {
	var canvas = document.getElementById('webglcanvas')
	var gl = initWebGL(canvas)
	initViewport(gl, canvas)
	initMatrices()
	var star = createStar(gl)
	initShader(gl)
	draw(gl, star)

	var title = document.getElementById('nombre')
	var modo = document.getElementById('modo')
	var vertices = document.getElementById('nvert')
	title.innerHTML = 'Figura: Estrella'
	modo.innerHTML = 'Modo de dibujo: TRIANGLE_FAN'
	vertices.innerHTML = 'Numero de vertices: ' + star.nVerts / 3
}
