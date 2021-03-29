interface IWebGLContext extends WebGLRenderingContext{
  program:WebGLProgram
}

class Tools {
  static initShaders(gl:IWebGLContext, vshader:string, fshader:string) {
    const program = Tools.createProgram(gl, vshader, fshader)
    if (!program) {
      console.log('创建program失败')
      return false
    }
    gl.useProgram(program)
    gl.program = program

    return true
  }

  static createProgram(gl:IWebGLContext, vshader:string, fshader:string) {
    // 创造着色器对象
    const vertexShader = Tools.loadShader(gl, gl.VERTEX_SHADER, vshader)
    const fragmentShader = Tools.loadShader(gl, gl.FRAGMENT_SHADER, fshader)
    if (!vertexShader || !fragmentShader) {
      return null
    }

    // 创造 program 对象
    const program = gl.createProgram()
    if (!program) {
      return null
    }

    // 绑定着色器与program
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    // 连接program
    gl.linkProgram(program)

    // 检查连接结果
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!linked) {
      const error = gl.getProgramInfoLog(program)
      console.log('连接 program失败: ' + error)
      gl.deleteProgram(program)
      gl.deleteShader(fragmentShader)
      gl.deleteShader(vertexShader)
      return null
    }
    return program
  }

  /**
   * 创建着色器
   * @param gl
   * @param type
   * @param source
   * @returns {*}
   */
  static loadShader(gl:IWebGLContext, type:number, source:string) {
    // 创建着色器
    const shader = gl.createShader(type)
    if (shader == null) {
      console.log('创建着色器失败')
      return null
    }

    // Set the shader program
    gl.shaderSource(shader, source)

    // 编译着色器
    gl.compileShader(shader)

    // 检查编译结果
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!compiled) {
      const error = gl.getShaderInfoLog(shader)
      console.error('编译着色器失败: ' + error)
      gl.deleteShader(shader)
      return null
    }

    return shader
  }
}

export default Tools
