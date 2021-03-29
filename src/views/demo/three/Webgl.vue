<template>
  <div class="webgl">
    <div class="test">
      <canvas id="flagCanvas" width="200" height="200" />
    </div>
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
    this.flagFlow()
  }

  private flagFlow() {
    const canvas = document.getElementById('flagCanvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const IMG_MAX_WIDTH = 600
    const IMG_MAX_HEIGHT = 600
    let imgWidth:number, imgHeight:number
    let canvasWidth:number, canvasHeight:number

    const image = new Image()
    image.src = flagImg

    const amplitude = 30 // 振幅
    const period = 2 // 周期数
    const frequency = 1 // 频率
    let wavelength // 波长
    let v:number // 波速
    let cftX:number // x系数
    let cftA:number // 振幅系数

    image.onload = function(ev) {
      imgWidth = Math.floor(image.width)
      imgHeight = Math.floor(image.height)

      const canvas = document.getElementById('flagCanvas') as HTMLCanvasElement
      let scale = 1
      if (imgWidth > IMG_MAX_WIDTH) {
        scale = IMG_MAX_WIDTH / imgWidth
      }
      if (imgHeight > IMG_MAX_HEIGHT) {
        scale = scale * IMG_MAX_HEIGHT / imgHeight
      }

      canvasWidth = imgWidth
      canvasHeight = imgHeight + amplitude * 2
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      canvas.style.transform = 'translate3d(-50%,-50%,0) scale(' + scale + ')'

      wavelength = imgWidth / period
      cftX = 2 * Math.PI / wavelength
      cftA = amplitude / imgWidth
      v = wavelength * frequency

      tick()
    }

    const fps = 70 // 每秒帧数
    const interval = 1000 / fps // 连续帧之间间隔（理论）
    const stop = false // 停止动画
    let timeNow = Date.now() // 当前时间
    let timeLast = timeNow // 上一帧时间
    let delta = 0 // 连续帧之间间隔（实际）

    let y = 0
    // +++++++++++++++++++++
    let lastY = 0
    let distance = 0
    const tick = function() {
      if (stop) return false
      timeNow = Date.now()
      delta = timeNow - timeLast
      if (delta > interval) {
        timeLast = timeNow
        distance += (delta / 1000 * v)
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        for (let x = 0; x < imgWidth; x++) {
          y = cftA * x * Math.sin(cftX * (x - distance)) + amplitude
          ctx.drawImage(image, x, 0, 1, imgHeight, x, y, 1, imgHeight)

          ctx.fillStyle = 'rgba(255,255,255,' + (x === 0 ? 0 : (y - lastY) * 0.5) + ')'
          ctx.fillRect(x, y, 1, imgHeight)
          // +++++++++++++++++++++
          lastY = y
        }
      }
      requestAnimationFrame(tick)
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
