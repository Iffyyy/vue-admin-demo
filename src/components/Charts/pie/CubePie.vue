<template>
  <div :id="cid" class="chart-item" />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import echarts, { EChartOption, ECharts } from 'echarts'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import variables from '@/styles/_variables.scss'

interface ChartData {
  name: string
  value: number
  rate: string
  itemStyle?: { [key: string]: string | number }
}

// @ts-ignore
@Component({
  name: 'CubePie'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 'cubePie' }) private cid!: string
  @Prop({ default: () => ['#02C7C8', '#E44100', '#07F672'] }) private colors!: Array<string>
  @Prop({ default: () => [2, 1, 3] }) private heights!: Array<number>
  @Prop({ default: () => 150 }) private size!: number
  @Prop({ default: () => 1 }) private opacity!: number

  mounted() {
    this.initialChart()
  }

  get variables() {
    return variables
  }

  get sortHeight() {
    return this.heights.sort((a: number, b: number) => a - b)
  }

  get pieData() {
    let i = 0
    // const data = JSON.parse(JSON.stringify(this.data))
    return this.data.sort((a: any, b: any) => {
      a = a.value || a
      b = b.value || b
      return a - b
    })
      .map((item:any) => {
        const data = { ...item }
        data.itemStyle = {
          opacity: this.opacity,
          color: this.colors[i++]
        }
        return data
      })
  }

  @Watch('chartData')
  private changeData(newV: Array<ChartData>) {
    if (newV.length) {
      this.initialChart()
    }
  }

  private initialChart() {
    console.log(this.pieData, 'pieData')
    // 各区域高度比例
    const heights = this.sortHeight
    const distance: number = this.size

    // 传入数据生成 option
    const option = getPie3D(this.pieData, 7 / 8)

    this.chart = echarts.init(document.getElementById(this.cid) as HTMLDivElement)
    // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
    function getParametricEquation(startRatio: number, endRatio: number, isSelected: boolean, isHovered: boolean, k: number, height: number) {
      // 计算
      const midRatio = (startRatio + endRatio) / 2

      const startRadian = startRatio * Math.PI * 2
      const endRadian = endRatio * Math.PI * 2
      const midRadian = midRatio * Math.PI * 2

      // 如果只有一个扇形，则不实现选中效果。
      if (startRatio === 0 && endRatio === 1) {
        isSelected = false
      }

      // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
      k = typeof k !== 'undefined' ? k : 1 / 3

      // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
      const offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0
      const offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0

      // 计算高亮效果的放大比例（未高亮，则比例为 1）
      const hoverRate = isHovered ? 1.05 : 1

      // 返回曲面参数方程
      return {
        u: {
          min: -Math.PI,
          max: Math.PI * 3,
          step: Math.PI / 32
        },

        v: {
          min: 0,
          max: Math.PI * 2,
          step: Math.PI / 20
        },

        x: function(u: number, v: number) {
          if (u < startRadian) {
            return offsetX + Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          }
          if (u > endRadian) {
            return offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          }
          return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate
        },

        y: function(u: number, v: number) {
          if (u < startRadian) {
            return offsetY + Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
          }
          if (u > endRadian) {
            return offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
          }
          return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate
        },

        z: function(u: number, v: number) {
          if (u < -Math.PI * 0.5) {
            return Math.sin(u)
          }
          if (u > Math.PI * 2.5) {
            return Math.sin(u)
          }
          return Math.sin(v) > 0 ? 1 * height : -1
        }
      }
    }

    // 生成模拟 3D 饼图的配置项
    function getPie3D(pieData: any, internalDiameterRatio: number) {
      const series = []
      let sumValue = 0
      let startValue = 0
      let endValue = 0
      const legendData = []
      const k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3

      // 为每一个饼图数据，生成一个 series-surface 配置
      for (let i = 0; i < pieData.length; i++) {
        sumValue += pieData[i].value

        const seriesItem: any = {
          name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
          type: 'surface',
          parametric: true,
          wireframe: {
            show: false
          },
          pieData: pieData[i],
          pieStatus: {
            selected: false,
            hovered: false,
            k: k
          }
        }

        if (typeof pieData[i].itemStyle !== 'undefined') {
          const itemStyle: any = {}
          // typeof pieData[i].itemStyle.color !== 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null
          // typeof pieData[i].itemStyle.opacity !== 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null
          pieData[i].itemStyle.color && (itemStyle.color = pieData[i].itemStyle.color)
          pieData[i].itemStyle.opacity && (itemStyle.opacity = pieData[i].itemStyle.opacity)

          seriesItem.itemStyle = itemStyle
        }
        series.push(seriesItem)
      }

      // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
      // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
      for (let i = 0; i < series.length; i++) {
        endValue = startValue + series[i].pieData.value

        series[i].pieData.startRatio = startValue / sumValue
        series[i].pieData.endRatio = endValue / sumValue
        series[i].parametricEquation = getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, heights[i])

        startValue = endValue

        legendData.push(series[i].name)
      }

      // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
      series.push({
        name: 'mouseoutSeries',
        type: 'surface',
        parametric: true,
        wireframe: {
          show: false
        },
        itemStyle: {
          opacity: 0
        },
        parametricEquation: {
          u: {
            min: 0,
            max: Math.PI * 2,
            step: Math.PI / 20
          },
          v: {
            min: 0,
            max: Math.PI,
            step: Math.PI / 20
          },
          x: function(u: number, v: number) {
            return Math.sin(v) * Math.sin(u) + Math.sin(u)
          },
          y: function(u: number, v: number) {
            return Math.sin(v) * Math.cos(u) + Math.cos(u)
          },
          z: function(u: number, v: number) {
            return Math.cos(v) > 0 ? 0.1 : -0.1
          }
        }
      })
      console.log(sumValue, 'sumValue')

      // 准备待返回的配置项，把准备好的 legendData、series 传入。
      const option: any = {
        // animation: false,
        legend: {
          orient: 'vertical',
          top: '10%',
          left: '2%',
          itemWidth: 14,
          data: legendData,
          textStyle: {
            color: 'white'
          }
        },
        tooltip: {
          // backgroundColor: '#121A28',
          formatter: (params: any) => {
            if (params.seriesName !== 'mouseoutSeries') {
              return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${params.seriesName}：${option.series[params.seriesIndex].pieData.value}<br/>占比：${(option.series[params.seriesIndex].pieData.value / (sumValue || 1) * 100).toFixed(0)}%`
            }
          }
        },
        xAxis3D: {
          min: -1,
          max: 1
        },
        yAxis3D: {
          min: -1,
          max: 1
        },
        zAxis3D: {
          min: -1,
          max: 1
        },
        grid3D: {
          show: false,
          boxHeight: 12,
          left: '10%',
          top: '-14%',
          viewControl: {
            // projection: 'orthographic',
            autoRotate: true, // 是否开启自动3d 旋转
            minAlpha: 24,
            maxAlpha: 24,
            maxDistance: distance, // 最大的值 （默认400）
            minDistance: distance // 是距离 最小值 （默认40） 与最大值相等时 则不能够放大与缩小
          }
        },
        series: series
      }
      return option
    }

    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    let selectedIndex: any = ''
    let hoveredIndex: any = ''

    // 监听点击事件，实现选中效果（单选）
    this.chart.on('click', (params: any) => {
      // 从 option.series 中读取重新渲染扇形所需的参数，将是否选中取反。
      const isSelected = !option.series[params.seriesIndex].pieStatus.selected
      const isHovered = option.series[params.seriesIndex].pieStatus.hovered
      const k = option.series[params.seriesIndex].pieStatus.k
      const startRatio = option.series[params.seriesIndex].pieData.startRatio
      const endRatio = option.series[params.seriesIndex].pieData.endRatio

      // 如果之前选中过其他扇形，将其取消选中（对 option 更新）
      if (selectedIndex !== '' && selectedIndex !== params.seriesIndex) {
        option.series[selectedIndex].parametricEquation = getParametricEquation(option.series[selectedIndex].pieData.startRatio, option.series[selectedIndex].pieData.endRatio, false, false, k, heights[selectedIndex])
        option.series[selectedIndex].pieStatus.selected = false
      }

      // 对当前点击的扇形，执行选中/取消选中操作（对 option 更新）
      option.series[params.seriesIndex].parametricEquation = getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, heights[params.seriesIndex])
      option.series[params.seriesIndex].pieStatus.selected = isSelected

      // 如果本次是选中操作，记录上次选中的扇形对应的系列号 seriesIndex
      isSelected && (selectedIndex = params.seriesIndex)

      // 使用更新后的 option，渲染图表
      if (this.chart) {
        this.chart.setOption(option)
      }
    })

    // 监听 mouseover，近似实现高亮（放大）效果
    this.chart.on('mouseover', (params: any) => {
      // 准备重新渲染扇形所需的参数
      let isSelected
      let isHovered
      let startRatio
      let endRatio
      let k

      // 如果触发 mouseover 的扇形当前已高亮，则不做操作
      if (hoveredIndex === params.seriesIndex) {
        // 否则进行高亮及必要的取消高亮操作
      } else {
        // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
        if (hoveredIndex !== '') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
          isSelected = option.series[hoveredIndex].pieStatus.selected
          isHovered = false
          startRatio = option.series[hoveredIndex].pieData.startRatio
          endRatio = option.series[hoveredIndex].pieData.endRatio
          k = option.series[hoveredIndex].pieStatus.k

          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          option.series[hoveredIndex].parametricEquation = getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, heights[hoveredIndex])
          option.series[hoveredIndex].pieStatus.hovered = isHovered

          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = ''
        }

        // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
        if (params.seriesName !== 'mouseoutSeries') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = option.series[params.seriesIndex].pieStatus.selected
          isHovered = true
          startRatio = option.series[params.seriesIndex].pieData.startRatio
          endRatio = option.series[params.seriesIndex].pieData.endRatio
          k = option.series[params.seriesIndex].pieStatus.k

          // 对当前点击的扇形，执行高亮操作（对 option 更新）
          option.series[params.seriesIndex].parametricEquation = getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, heights[params.seriesIndex])
          option.series[params.seriesIndex].pieStatus.hovered = isHovered

          // 记录上次高亮的扇形对应的系列号 seriesIndex
          hoveredIndex = params.seriesIndex
        }

        // 使用更新后的 option，渲染图表
        if (this.chart) {
          this.chart.setOption(option)
        }
      }
    })

    // 修正取消高亮失败的 bug
    this.chart.on('globalout', () => {
      if (hoveredIndex !== '') {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
        const isSelected = option.series[hoveredIndex].pieStatus.selected
        const isHovered = false
        const k = option.series[hoveredIndex].pieStatus.k
        const startRatio = option.series[hoveredIndex].pieData.startRatio
        const endRatio = option.series[hoveredIndex].pieData.endRatio

        // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
        option.series[hoveredIndex].parametricEquation = getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, heights[hoveredIndex])
        option.series[hoveredIndex].pieStatus.hovered = isHovered

        // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
        hoveredIndex = ''
      }

      // 使用更新后的 option，渲染图表
      if (this.chart) {
        this.chart.setOption(option)
      }
    })

    this.chart.setOption(option)
  }
}
</script>
