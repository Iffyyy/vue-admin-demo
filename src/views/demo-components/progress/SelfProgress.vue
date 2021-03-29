<template>
  <div class="el-progress" :class="[
    'el-progress--' + type,
    {
      'el-progress--without-text': !showText,
      'el-progress--text-inside': textInside
    }
  ]" role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100"
  >
    <div v-if="type === 'line'" class="el-progress-bar">
      <div class="el-progress-bar__outer" :style="{height: strokeWidth + 'px'}">
        <div class="el-progress-bar__inner" :style="barStyle">
          <div v-if="showText && textInside" class="el-progress-bar__innerText">
            {{ content }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="el-progress-circle" :style="{height: width + 'px', width: width + 'px'}">
      <svg viewBox="0 0 100 100">
        <path class="el-progress-circle__track" :d="trackPath" :stroke="strokeBg" :stroke-width="relativeStrokeWidth" fill="none" :stroke-linecap="strokeLinecap" :style="trailPathStyle" />
        <path class="el-progress-circle__path" :d="trackPath" :stroke="stroke" fill="none" :stroke-linecap="strokeLinecap" :stroke-width="percentage ? relativeStrokeWidth : 0" :style="circlePathStyle" />
      </svg>
    </div>
    <div v-if="showText && !textInside" class="el-progress__text" :style="type==='dashboard'?{color: stroke}:''">
      {{ percentage }}
    </div>
    <div class="label-note">
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'SelfProgress'
})
export default class extends Vue {
  @Prop({
    default: 'line',
    validator: (val) => ['line', 'circle', 'dashboard'].indexOf(val) > -1
  })
  private type!: string

  @Prop({ default: 0, validator: (val) => val >= 0 && val <= 100 })
  private percentage!: number

  @Prop({ default: 6 }) private strokeWidth!: number
  @Prop({ default: 'round' }) private strokeLinecap!: string
  @Prop({ default: false }) private textInside!: boolean
  @Prop({ default: 126 }) private width!: number
  @Prop({ default: '' }) private color!: any
  @Prop({ default: '' }) private bgColor!: any
  @Prop({ default: true }) private showText!: boolean
  @Prop({ default: '' }) private label!: string

  get barStyle() {
    const style = {
      width: '',
      backgroundColor: ''
    }
    style.width = this.percentage + '%'
    style.backgroundColor = this.getCurrentColor(this.percentage)
    return style
  }

  get relativeStrokeWidth() {
    return ((this.strokeWidth / this.width) * 100).toFixed(1)
  }

  get radius() {
    if (this.type === 'circle' || this.type === 'dashboard') {
      // @ts-ignore
      return parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10)
    } else {
      return 0
    }
  }

  get trackPath() {
    const radius = this.radius
    const isDashboard = this.type === 'dashboard'
    return `
          M 50 50
          m 0 ${isDashboard ? '' : '-'}${radius}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '-' : ''}${radius * 2}
          a ${radius} ${radius} 0 1 1 0 ${isDashboard ? '' : '-'}${radius * 2}
          `
  }

  get perimeter() {
    return 2 * Math.PI * this.radius
  }

  get rate() {
    return this.type === 'dashboard' ? 0.75 : 1
  }

  get strokeDashoffset() {
    const offset = (-1 * this.perimeter * (1 - this.rate)) / 2
    return `${offset}px`
  }

  get trailPathStyle() {
    return {
      strokeDasharray: `${this.perimeter * this.rate}px, ${this.perimeter}px`,
      strokeDashoffset: this.strokeDashoffset
    }
  }

  get circlePathStyle() {
    return {
      strokeDasharray: `${
        this.perimeter * this.rate * (this.percentage / 100)
      }px, ${this.perimeter}px`,
      strokeDashoffset: this.strokeDashoffset,
      transition: 'stroke-dasharray 0.6s ease 0s, stroke 0.6s ease'
    }
  }

  get stroke() {
    let ret
    if (this.color) {
      ret = this.getCurrentColor(this.percentage)
    } else {
      switch (this.percentage / 10) {
        case 10:
        case 9:
          ret = 'rgba(38, 203, 169, 1)'
          break
        case 8:
        case 7:
          ret = 'rgba(255, 170, 35, 1)'
          break
        default:
          ret = 'rgba(252, 79, 85, 1)'
          break
      }
    }
    return ret
  }

  get strokeBg() {
    let ret
    if (this.color) {
      ret = this.getCurrentColor(this.percentage)
    } else {
      switch (this.percentage / 10) {
        case 10:
        case 9:
          ret = 'rgba(38, 203, 169, 0.3)'
          break
        case 8:
        case 7:
          ret = 'rgba(255, 170, 35, 0.3)'
          break
        default:
          ret = 'rgba(252, 79, 85, 0.3)'
          break
      }
    }
    return ret
  }

  get progressTextSize() {
    return this.type === 'line'
      ? 12 + this.strokeWidth * 0.4
      : this.width * 0.111111 + 2
  }

  get content() {
    return `${this.percentage}%`
  }

  private getCurrentColor(percentage: number) {
    if (typeof this.color === 'function') {
      return this.color(percentage)
    } else if (typeof this.color === 'string') {
      return this.color
    } else {
      return this.getLevelColor(percentage)
    }
  }

  private getLevelColor(percentage: number) {
    const colorArray = this.getColorArray().sort(
      (a: { percentage: number }, b: { percentage: number }) =>
        a.percentage - b.percentage
    )
    for (let i = 0; i < colorArray.length; i++) {
      if (colorArray[i].percentage > percentage) {
        return colorArray[i].color
      }
    }
    return colorArray[colorArray.length - 1].color
  }

  private getColorArray() {
    const color = this.color
    const span = 100 / color.length
    return color.map((seriesColor: string, index: number) => {
      if (typeof seriesColor === 'string') {
        return {
          color: seriesColor,
          progress: (index + 1) * span
        }
      }
      return seriesColor
    })
  }
}
</script>

<style lang="scss" scoped>
.el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.el-progress--dashboard .el-progress__text {
  font-size: 40px;
  font-weight: 400;
  font-family: 'Dinpro';
}
.label-note {
  width: 100%;
  font-size: 13px;
  position: absolute;
  bottom: -4%;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}
</style>
