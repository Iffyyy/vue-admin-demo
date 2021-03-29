<template>
  <div :id="cid" class="chart-item" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

// @ts-ignore
@Component({
  name: 'FencePie'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 0 }) private num!: number
  @Prop({ default: 'fence' }) private cid!: string

  private chart: any = {}
  private value = '1'
  private timer: any = null
  private dataIndex = 0
  private colorList = Object.freeze(['0, 236, 233', '22, 114, 236', '0, 255, 163'])
  // get cid() {
  //   return 'rate' + this.num
  // }

  get color() {
    return this.colorList[this.num]
  }

  mounted() {
    this.initCharts()
  }

  beforeDestroy() {
    clearInterval(this.timer)
  }

  private initCharts() {
    const inRadius = 50
    const outRadius = 100
    const num = 16
    const width = 24
    const gap = 8
    const startAngle = 0

    this.chart = echarts.init(
      document.getElementById(this.cid) as HTMLDivElement
    )
    const nameColor = '#3B9FFF'
    const labelColor = 'rgba(255,255,255,0.9)'

    const scaleData = new Array(num).fill({
      name: '',
      value: 100
    })
    const placeHolderStyle = {
      normal: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        color: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0
      }
    }
    const data = []
    const lineData = []
    const dataBg = []
    const color = `rgba(${this.color},0.9)`
    const colorBorder = `rgba(${this.color},0.1)`
    for (let i = 0; i < scaleData.length; i++) {
      data.push(
        {
          data: scaleData[i].value,
          value: width + Math.random() * 4,
          name: scaleData[i].name,
          itemStyle: {
            normal: {
              color: color
              // borderWidth: 6,
              // borderColor: 'rgba(32,156,255,0.3)'
            }
          }
        },
        {
          value: gap,
          name: '',
          itemStyle: placeHolderStyle
        }
      )

      dataBg.push(
        {
          data: scaleData[i].value,
          value: width + Math.random() * 4,
          name: scaleData[i].name,
          itemStyle: {
            normal: {
              color: colorBorder
              // borderWidth: 10,
              // borderColor: colorBorder[0]
            }
          }
        },
        {
          value: gap,
          name: '',
          itemStyle: placeHolderStyle
        }
      )
    }
    data.push({
      value: 100,
      name: '',
      itemStyle: placeHolderStyle
    })
    dataBg.push({
      value: 40,
      name: '',
      itemStyle: placeHolderStyle
    })
    const seriesObj = [
      {
        name: '',
        type: 'pie',
        // clockWise: false,
        radius: [inRadius, outRadius - 8],
        hoverAnimation: false,
        startAngle: startAngle,
        itemStyle: {
          normal: {
            label: {
              show: false
            }
          }
        },
        data: data,
        animationDuration: 2000
      },
      {
        name: '',
        type: 'pie',
        // clockWise: false,
        center: ['51%', '52%'],
        radius: [inRadius, outRadius],
        hoverAnimation: false,
        startAngle: startAngle,
        itemStyle: {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              length: 30,
              length2: 60,
              show: false
            }
          }
        },
        data: dataBg,
        animationDuration: 2000
      }
    ]
    const option = {
      // backgroundColor: 'rgba(255,0,0,0.4)',
      tooltip: {
        show: false
      },
      legend: {
        show: false
      },
      toolbox: {
        show: false
      },
      series: seriesObj
    }
    this.chart.setOption(option)

    this.startMove(option)
    this.chart.on('mouseover', (param: any) => {
      clearInterval(this.timer)
      clearInterval(this.timer)
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
      })
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 1
      })
      this.chart.dispatchAction({
        type: 'highlight',
        dataIndex: param.dataIndex
      })
    })
    this.chart.on('mouseout', () => {
      this.startMove(option)
    })
  }

  private startAnimation(chartChild: any) {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      chartChild.dispatchAction({
        type: 'downplay',
        dataIndex: this.dataIndex
      })
      chartChild.dispatchAction({
        type: 'highlight',
        dataIndex: this.dataIndex
      })
    }, 4000)
  }

  private startMove(option: any) {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.chart.clear()
      this.chart.setOption(option)
    }, 1000 * 10)
  }
}
</script>
