/**
 * 获取canvas
 * @param id
 */
export const getCanvas = function(id:string) {
  return document.querySelector('#canvas') as HTMLCanvasElement
}

/**
 * 获取webgl绘图环境
 * @param canvas
 */
export const getWebGLContext = function(canvas:HTMLCanvasElement) {
  return (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext
}

/**
 * 创建顶点着色器
 * @param id
 */
export const createShaderFromScript = function(gl:WebGLRenderingContext, type:number, vshaderSource:string) {
  // 获取顶点着色器源码
  const vertexShaderSource = vshaderSource
  // 创建顶点着色器对象
  const vertexShader = gl.createShader(type) as WebGLShader
  // 将源码分配给顶点着色器对象
  gl.shaderSource(vertexShader, vertexShaderSource)
  // 编译顶点着色器程序
  gl.compileShader(vertexShader)
  return vertexShader
}

/**
 * 创建着色器程序
 * @param id
 */
export const createProgram = function(gl:WebGLRenderingContext, vertexShader:WebGLShader, fragmentShader:WebGLShader) {
  // 创建着色器程序
  const program = gl.createProgram() as WebGLProgram
  // 将顶点着色器挂载在着色器程序上。
  gl.attachShader(program, vertexShader)
  // 将片元着色器挂载在着色器程序上。
  gl.attachShader(program, fragmentShader)
  // 链接着色器程序
  gl.linkProgram(program)
  return program
}

export const randomColor = function() {
  return {
    r: Math.random() * 255,
    g: Math.random() * 255,
    b: Math.random() * 255,
    a: Math.random()
  }
}

export const createBuffer = function(gl:WebGLRenderingContext, obj:any, options:Partial<{size: number, type: number, normalized: boolean, stride: number, offset: number}>) {
  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  const { size = 1, type = gl.FLOAT, normalized = false, stride = 0, offset = 0 } = options
  gl.vertexAttribPointer(obj, size, type, normalized, stride, offset)
  return colorBuffer
}
