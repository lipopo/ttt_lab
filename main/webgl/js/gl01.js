var canvas = document.getElementById("gl");
var gl = canvas.getContext("webgl");

gl.clearColor(0.0,0.0,0.0,0.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);


vertexShaderSource = "uniform mat4 u_MvpMatrix;\nattribute vec4 a_Position;\nattribute vec4 a_Color;\nuniform vec3 u_LightColor;\nuniform vec3 u_AmbientLight;\nuniform vec3 u_LightDirection;\nattribute vec4 a_Normal;\nvarying vec4 v_Color;\nvoid main(){\n    gl_Position = u_MvpMatrix * a_Position;\n    vec3 normal = normalize(vec3(a_Normal));\n    float nDot = max(dot(u_LightDirection,normal),0.0);\n    vec3 diffuse = u_LightColor * vec3(a_Color) * nDot;\n    vec3 ambient = u_AmbientLight * a_Color.rgb;\n    v_Color = vec4(diffuse + ambient,a_Color.a);\n}";
fragmentShaderSource = "precision mediump float;\nvarying vec4 v_Color;\nvoid main(){\n    gl_FragColor = v_Color;\n}";

vsShader = gl.createShader(gl.VERTEX_SHADER);
frShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vsShader,vertexShaderSource);
gl.shaderSource(frShader,fragmentShaderSource);

gl.compileShader(vsShader);
gl.compileShader(frShader);

ShaderProgram = gl.createProgram();

gl.attachShader(ShaderProgram,vsShader);
gl.attachShader(ShaderProgram,frShader);
gl.linkProgram(ShaderProgram);

gl.useProgram(ShaderProgram);

vertexBuffer = gl.createBuffer();
indexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
var verticesColors = new Float32Array([
    1.0,1.0,1.0,1.0,1.0,1.0,    //v0
    -1.0,1.0,1.0,1.0,0.0,1.0,   //v1
    -1.0,-1.0,1.0,1.0,0.0,0.0,  //v2
    1.0,-1.0,1.0,0.0,1.0,0.0,   //v3
    1.0,-1.0,-1.0,1.0,0.0,1.0,  //v4
    1.0,1.0,-1.0,1.0,1.0,0.0,   //v5
    -1.0,1.0,-1.0,0.0,1.0,1.0,  //v6
    -1.0,-1.0,-1.0,0.0,0.0,0.0, //v7
]);
var indices = new Uint8Array([
    0,1,2,0,2,3,    //frount
    0,3,4,0,4,5,    //right
    0,5,6,0,6,1,    //up
    1,6,7,1,7,2,    //left
    7,4,3,7,3,2,    //down
    4,7,6,4,6,5     //back
]);

gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);
size = verticesColors.BYTES_PER_ELEMENT;
a_Position = gl.getAttribLocation(ShaderProgram,"a_Position");
gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,size*6,0);
gl.enableVertexAttribArray(a_Position);

a_Color = gl.getAttribLocation(ShaderProgram,"a_Color");
gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,size*6,size*3);
gl.enableVertexAttribArray(a_Color);

var mvpMatrix = new Matrix4();
mvpMatrix.setPerspective(30,1,1,100);
mvpMatrix.lookAt(3,3,7,0,0,0,0,1,0);
u_MvpMatrix = gl.getUniformLocation(ShaderProgram,"u_MvpMatrix");
gl.uniformMatrix4fv(u_MvpMatrix,false,mvpMatrix.elements);

var u_LightColor = gl.getUniformLocation(ShaderProgram,"u_LightColor");
var u_LightDirection = gl.getUniformLocation(ShaderProgram,"u_LightDirection");
var u_AmbientLight = gl.getUniformLocation(ShaderProgram,"u_AmbientLight");

gl.uniform3f(u_LightColor,1.0,1.0,1.0);
var lightDirection = new Vector3([0.5,0.3,4.0]);
lightDirection.normalize();
gl.uniform3fv(u_LightDirection,lightDirection.elements);
gl.uniform3f(u_AmbientLight,0.2,0.2,0.2);

var normals = new Float32Array([
    1,1,1,-1,1,1,
    -1,-1,1,1,-1,1,
    1,-1,-1,1,1,-1,
    -1,1,-1,-1,-1,-1
]);

normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER,normals,gl.STATIC_DRAW);
var a_Normal = gl.getAttribLocation(ShaderProgram,"a_Normal");
gl.vertexAttribPointer(a_Normal,3,gl.FLOAT,false,size*3,0);
gl.enableVertexAttribArray(a_Normal);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);

gl.drawElements(gl.TRIANGLES,indices.length,gl.UNSIGNED_BYTE,0);


/*
use = gl.getAttribLocation(ShaderProgram,"usePosition");
u_color = gl.getUniformLocation(ShaderProgram,"useColor");
gl.vertexAttrib4f(use,0.5,0.5,0.0,1.0);
gl.uniform4f(u_color,1.0,0.0,0.0,1.0);
gl.drawArrays(gl.POINTS,0,1);
gl.vertexAttrib4f(use,0.5,0.0,0.0,1.0);
gl.uniform4f(u_color,0.0,1.0,0.0,1.0);
gl.drawArrays(gl.POINTS,0,1);
gl.vertexAttrib4f(use,0.0,0.5,0.0,1.0);
gl.uniform4f(u_color,0.0,0.0,1.0,1.0);
gl.drawArrays(gl.POINTS,0,1);
gl.vertexAttrib4f(use,0.0,0.0,0.0,1.0);
gl.uniform4f(u_color,0.5,0.5,0.5,1.0);
gl.drawArrays(gl.POINTS,0,1);
*/

/*
vsShader:
uniform mat4 u_MvpMatrix;
attribute vec4 a_Position;
attribute vec4 a_Color;
attribute vec4 a_Normal;

uniform vec3 u_LightColor;
uniform vec3 u_LightDirection;
uniform vec3 u_AmbientLight;
varying vec4 v_Color;
void main(){
    gl_Position = u_MvpMatrix * a_Position;
    vec3 normal = normalize(vec3(a_Normal));
    float nDot = max(dot(u_LightDirection,normal),0.0);
    vec3 diffuse = u_LightColor * vec3(a_Color) * nDot;
    vec3 ambient = u_AmbientLight * a_Color.rgb;
    v_Color = vec4(diffuse+ambient,a_Color.a);
}
frShader:
varying vec4 v_Color;
void main(){
    gl_FragColor = v_Color;
}
*/