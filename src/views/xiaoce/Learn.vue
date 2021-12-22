<!-- 小册webgl的学习-->
<template>
  <div class="webgl">
    <div>点</div>
    <canvas id="canvas" width="640" height="380" />
    <div>三角形</div>
    <canvas id="canvas1" width="640" height="380" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getCanvas, getWebGLContext, createShaderFromScript, createProgram } from '@/utils/webgl-helper'
import flagImg from '@/assets/red.png'

@Component({
  name: 'Three'
})
export default class extends Vue {
  mounted() {
    this.initial()
  }

  private sourcePre() {}

  private initial() {
    const vshaderSource = `
    //设置浮点数精度为中等精度
    precision mediump float;
    //接收点在 canvas 坐标系上的坐标 (x, y)
    attribute vec2 aPosition;
    //接收 canvas 的宽高尺寸
    attribute vec2 aScreenSize;
    void main(){
        //start 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
      vec2 position = (aPosition / aScreenSize) * 2.0 - 1.0; 
      position = position * vec2(1.0, -1.0);
      gl_Position = vec4(position, 0, 1);
      //end 将屏幕坐标系转化为裁剪坐标（裁剪坐标系）
      //声明要绘制的点的大小。
      gl_PointSize = 10.0;
    }`

    const fshaderSource = `
    //设置浮点数精度为中等精度
    precision mediump float;
    //接收 JavaScript 传过来的颜色值（RGBA）。
    uniform vec4 uColor;
    void main(){
        //将普通的颜色表示转化为 WebGL 需要的表示方式，即将【0-255】转化到【0,1】之间。
      vec4 color = uColor / vec4(255, 255, 255, 1);
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

    // 找到顶点着色器中的变量aPosition
    const aPosition = gl.getAttribLocation(program, 'aPosition')
    // 找到顶点着色器中的变量aScreenSize
    const aScreenSize = gl.getAttribLocation(program, 'aScreenSize')
    // 找到片元着色器中的变量uColor
    const uColor = gl.getUniformLocation(program, 'uColor')
    // 为顶点着色器中的 aScreenSize 传递 canvas 的宽高信息
    gl.vertexAttrib2f(aScreenSize, canvas.width, canvas.height)
    // 存储点击位置的数组。
    const points:any = []
    canvas.addEventListener('click', e => {
      const x = e.offsetX
      const y = e.offsetY
      const color = this.randomColor()
      points.push({ x: x, y: y, color: color })
      gl.clearColor(0, 0, 0, 1.0)
      // 用上一步设置的清空画布颜色清空画布。
      gl.clear(gl.COLOR_BUFFER_BIT)
      for (let i = 0; i < points.length; i++) {
        const color = points[i].color
        // 为片元着色器中的 uColor 传递随机颜色
        gl.uniform4f(uColor, color.r, color.g, color.b, color.a)
        // 为顶点着色器中的 aPosition 传递顶点坐标。
        gl.vertexAttrib2f(aPosition, points[i].x, points[i].y)
        // 绘制点
        gl.drawArrays(gl.POINTS, 0, 1)
      }
    })
    // 设置清屏颜色
    gl.clearColor(0, 0, 0, 1.0)
    // 用上一步设置的清空画布颜色清空画布。
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  private randomColor() {
    return {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
      a: Math.random()
    }
  }
}
</script>
<style lang="scss" scoped>
.webgl {
}

.test{
  position: relative;
  width: 800px;
  height: 500px;
  background: pink;
  overflow: hidden;
  margin: 100px auto;

  #flagCanvas{
    position: absolute;
    left: 24%;
    top: 12%;
  }
}
</style>
