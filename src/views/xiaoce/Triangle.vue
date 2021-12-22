<!-- 小册webgl的学习-->
<template>
  <div class="webgl">
    <div>三角形</div>
    <canvas id="canvas" width="640" height="380" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getCanvas, getWebGLContext, createShaderFromScript, createProgram, randomColor } from '@/utils/webgl-helper'

@Component({
  name: 'Three'
})
export default class extends Vue {
  mounted() {
    this.initial()
  }

  private initial() {
    const vshaderSource = `
    //设置浮点数精度为中等精度
    precision mediump float;
    // 接收顶点坐标 (x, y)
    attribute vec2 a_Position;
    // 接收 canvas 的尺寸(width, height)
    attribute vec2 a_Screen_Size;
    void main(){
        vec2 position = (a_Position / a_Screen_Size) * 2.0 - 1.0;
        position = position * vec2(1.0,-1.0);
        gl_Position = vec4(position, 0, 1);
    }`

    const fshaderSource = `
    //设置浮点数据类型为中级精度
    precision mediump float;
    //接收 JavaScript 传过来的颜色值（rgba）。
    uniform vec4 u_Color;

    void main(){
      vec4 color = u_Color / vec4(255, 255, 255, 1);
      gl_FragColor = color;
    }`

    // 获取canvas
    const canvas = getCanvas('canvas')

    // 获取webgl绘图环境
    const gl = getWebGLContext(canvas)

    // 创建顶点着色器
    const vertexShader = createShaderFromScript(gl, gl.VERTEX_SHADER, vshaderSource)
    // 创建片元着色器
    const fragmentShader = createShaderFromScript(gl, gl.FRAGMENT_SHADER, fshaderSource)

    // 创建着色器程序
    const program = createProgram(gl, vertexShader, fragmentShader)
    // 告诉 WebGL 运行哪个着色器程序
    gl.useProgram(program)

    // 设置清空画布颜色为黑色。
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // 用上一步设置的清空画布颜色清空画布。
    gl.clear(gl.COLOR_BUFFER_BIT)

    const positions:number[] = []
    // 找到顶点着色器中的变量aPosition
    const aPosition = gl.getAttribLocation(program, 'a_Position')
    // 找到顶点着色器中的变量aScreenSize
    const aScreenSize = gl.getAttribLocation(program, 'a_Screen_Size')
    const uColor = gl.getUniformLocation(program, 'u_Color')

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

    gl.enableVertexAttribArray(aPosition)

    // 每次取两个数据
    const size = 2
    // 每个数据的类型是32位浮点型
    const type = gl.FLOAT
    // 不需要归一化数据
    const normalize = false
    // 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
    const stride = 0
    // 从缓冲起始位置开始读取
    const offset = 0
    // 将 aPosition 变量获取数据的缓冲区指向当前绑定的 buffer。
    gl.vertexAttribPointer(aPosition, size, type, normalize, stride, offset)
    gl.vertexAttrib2f(aScreenSize, canvas.width, canvas.height)

    // 绘制图元设置为三角形
    // const primitiveType = gl.TRIANGLES
    // 从顶点数组的开始位置取顶点数据
    // 因为我们要绘制三个点，所以执行三次顶点绘制操作。
    // const count = 3
    // gl.drawArrays(primitiveType, offset, count)

    canvas.addEventListener('mouseup', e => {
      const x = e.offsetX
      const y = e.offsetY
      positions.push(x, y)
      if (positions.length % 6 === 0) {
      // 向缓冲区中复制新的顶点数据。
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)
        const color = randomColor()
        gl.uniform4f(uColor, color.r, color.g, color.b, color.a)
        // 重新渲染
        renderGl(gl)
      }
    })

    gl.clearColor(0, 0, 0, 1)

    // 渲染函数
    function renderGl(gl:any) {
      // 用上一步设置的清空画布颜色清空画布。
      gl.clear(gl.COLOR_BUFFER_BIT)
      // 绘制图元设置为三角形
      const primitiveType = gl.TRIANGLES
      // 从顶点数组的开始位置取顶点数据
      const drawOffset = 0
      // 因为我们要绘制 N 个点，所以执行 N 次顶点绘制操作。
      if (positions.length > 0) {
        gl.drawArrays(primitiveType, drawOffset, positions.length / 2)
      }
    }
    renderGl(gl)
  }
}
</script>
<style lang="scss" scoped>
.webgl {
}
</style>
