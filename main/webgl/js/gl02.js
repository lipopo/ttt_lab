var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl");

gl.clearColor(0.0,1.0,0.0,1.0);
gl.enable(gl.DEPTH_TEST);
gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);



vertexShaderSource = "attribute vec4 a_Position;\nuniform mat4 u_mvpMatrix;\nvoid main(){\ngl_Position = u_mvpMatrix * vec4(a_Position.xyz,10);gl_PointSize=1.0;\n}\n";
fragmentShaderSource = "precision mediump float;\nuniform vec4 a_Color;\nvoid main(){\ngl_FragColor = a_Color;\n}";

vertexShader = gl.createShader(gl.VERTEX_SHADER);
fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader,vertexShaderSource);
gl.shaderSource(fragmentShader,fragmentShaderSource);

gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

ShaderProgram = gl.createProgram();
gl.attachShader(ShaderProgram,vertexShader);
gl.attachShader(ShaderProgram,fragmentShader);
gl.linkProgram(ShaderProgram);

gl.useProgram(ShaderProgram);


vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER,kxfk,gl.STATIC_DRAW);

a_Position = gl.getAttribLocation(ShaderProgram,"a_Position");
gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(a_Position);

var mvpMatrix = new Matrix4();
mvpMatrix.setRotate(30,0,1,1);
var u_mvpMatrix = gl.getUniformLocation(ShaderProgram,"u_mvpMatrix");
gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);

var a_Color = gl.getUniformLocation(ShaderProgram,"a_Color");
gl.uniform4f(a_Color,1.0,1.0,1.0,0.0)

gl.drawArrays(gl.TRIANGLES,0,kxfk.length/3);

var jd = 0;
var r = Math.random();
var g = Math.random();
var b = Math.random();
rotate = function(){
    var mvpMatrix = new Matrix4();
    mvpMatrix.setRotate(jd,0,1,1);
    gl.uniform4f(a_Color,r,g,b,1.0);
    gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES,0,kxfk.length/3);
    
    jd += 1;
    if(jd == 359){
        jd = 0;
    }    
}

changeColor = function(){
    r = Math.random();
    g = Math.random();
    b = Math.random();
}
setInterval(rotate,30);
setInterval(changeColor,1000);