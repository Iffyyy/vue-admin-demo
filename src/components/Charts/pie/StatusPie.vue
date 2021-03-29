<template>
  <div id="StatusPie" class="chart-item" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import { getTotal } from '@/utils/index'

// @ts-ignore
@Component({
  name: 'StatusPie'
})
export default class extends mixins(ResizeMixin) {
  @Prop({
    default: () => [
      ['#FD44AE', '#F84D6F'],
      ['#17D1A5', '#26D7E1']
    ]
  }) private colorList!: Array<string>

  @Prop({ default: 'rgba(4,172,203, 0.2)' }) private bgColor!: string

  private chart: any = null
  private timer: any = null
  get totalNum() {
    return getTotal(this.data)
    // return 121
  }

  get series() {
    let i = 0
    let data = []
    data = this.data.slice(0, this.data.length - 1).map((item: { name: string; value: string }) => {
      return {
        type: 'bar',
        show: true,
        roundCap: true,
        stack: 'stack',
        coordinateSystem: 'polar',
        name: item.name,
        data: [item.value],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
            0,
            0,
            0,
            1,
            [
              {
                offset: 0,
                color: this.colorList[i][0]
              },
              {
                offset: 1,
                color: this.colorList[i++][0]
              }
            ],
            false
          )
        },
        emphasis: {
          label: {
            show: true,
            position: ['50%', '50%']
          }
        },
        animation: true,
        animationDelay: 800 * i,
        animationDuration: 3000
      }
    })

    data.unshift({
      type: 'bar',
      show: true,
      data: [(this.totalNum || 1) - 1],
      coordinateSystem: 'polar',
      name: this.data[this.data.length - 1].name,
      stack: 'stack',
      barWidth: '20%',
      roundCap: true,
      itemStyle: {
        color: this.bgColor,
        borderWidth: 1
      },
      emphasis: {
        label: {
          show: true
        }
      },
      animation: true,
      animationDuration: 3000
      // silent: true
    })

    data.unshift({
      type: 'bar',
      show: true,
      data: [1],
      coordinateSystem: 'polar',
      name: this.data[this.data.length - 1].name,
      stack: 'stack',
      barWidth: '20%',
      roundCap: true,
      itemStyle: {
        color: this.bgColor,
        borderWidth: 1
      },
      emphasis: {
        label: {
          show: true
        }
      },
      animation: true,
      animationDuration: 3000
      // silent: true
    })

    console.log(this.data, 'data')
    data.push({
      type: 'pie',
      show: true,
      startAngle: 0,
      clockwise: false,
      radius: [0, '63%'],
      data: this.data,
      itemStyle: {
        color: 'transparent'
      },
      label: {
        show: true,
        color: '#fff',
        padding: [0, -86],
        height: 70,
        formatter: function(param: any) {
          return '{a|' + param.name + '} ' + ' {n|' + param.percent.toFixed(0) + '%}'
        },
        rich: {
          a: {
            fontSize: 16,
            color: '#fff',
            fontWeight: 400,
            lineHeight: 40,
            padding: [0, 0, 5, 0]
          },
          n: {
            fontSize: 22,
            color: '#fff',
            fontWeight: 'bold',
            lineHeight: 40
          }
        }
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 80,
        lineStyle: {
          color: '#04ACCB',
          width: 2
        }
      },
      roundCap: true,
      stack: 'stack',
      coordinateSystem: 'polar',
      animation: true,
      animationDelay: 1600,
      animationDuration: 3000
    })
    return data
  }

  mounted() {
    console.log(this.data, 'mounted')
    this.initCharts()
  }

  private initCharts() {
    const first = this.data[0].value
    const second = this.data[1].value
    const third = this.data[0].value - second - first
    const labelData = this.data
    this.chart = echarts.init(document.getElementById('StatusPie') as HTMLDivElement)
    const option = {
      title: {
        text: this.data[0].value + `\n{a|${this.data[0].name}}`,
        textStyle: {
          color: '#fff',
          fontSize: '30',
          rich: {
            a: { fontsize: '16' }
          }
        },
        x: 'center',
        y: 'center'
      },
      grid: {
        width: '70%',
        height: '70%'
      },
      // legend: {
      //   show: true,
      //   orient: "vertical",
      //   top: "2%",
      //   left: "2%",
      //   textStyle: {
      //     color: "#fff",
      //   },
      //   formatter: (data) => {
      //     return data;
      //   },
      //   data: this.data,
      // },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      angleAxis: {
        startAngle: 0,
        clockwise: false,
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false,
          length: 1
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      radiusAxis: {
        type: 'category',
        z: 10,
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        interval: 30
      },
      polar: {
        radius: '104%' // 总体的最小半径，最大半径
      },
      series: this.series
    }
    this.chart.setOption(option)
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.chart.clear()
      this.chart.setOption(option)
    }, 1000 * 30)
  }
}
</script>
