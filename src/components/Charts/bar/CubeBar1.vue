<template>
  <div id="cubeBar1" class="chart-item" />
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

// @ts-ignore
@Component({
  name: 'CubeBar1'
})
export default class extends mixins(ResizeMixin) {
  private chart:any=null
  private timer:any=null
  private chartData = [
    {
      name: '一号楼',
      value: 12
    },
    {
      name: '三号楼',
      value: 30
    },
    {
      name: '二号楼',
      value: 42
    },
    {
      name: '五号楼',
      value: 30
    },
    {
      name: '四号楼',
      value: 42
    }
  ]

  mounted() {
    this.initCharts()
  }

  beforeDestroy() {
    clearInterval(this.timer)
  }

  private initCharts() {
    this.chart = echarts.init(document.getElementById('cubeBar1') as HTMLDivElement)
    this.chart.clear()
    const option = {
      // tooltip: {
      //   trigger: 'axis',
      //   axisPointer: {
      //     type: 'cross'
      //   },
      //   // formatter: function(params:any) {
      //   //   const data = params[0].data.toFixed(0)
      //   //   const value = data === 0 ? '0' : data
      //   //   const name = params[0].name
      //   //   return name + '</br>' + value
      //   // },
      //   backgroundColor: 'rgba(8, 32, 66, 0.92)'
      // },
      grid: [
        {
          width: '80%',
          left: '7%',
          bottom: '4%',
          height: '66%',
          containLabel: true
        }
      ],
      xAxis: [{
        type: 'category',
        data: this.chartData.map(item => item.name),
        axisTick: {
          alignWithLabel: true
        },
        nameTextStyle: {
          color: '#82b0ec'
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#82b0ec'
          }
        },
        axisLabel: {
          textStyle: {
            color: '#fff'
          },
          margin: 20
        }
      }],
      yAxis: [{
        show: true,
        minInterval: 1,
        splitNumber: 3,
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      }],
      series: [
        // 柱状图头部
        {
          name: '',
          type: 'pictorialBar',
          symbolSize: [15, 6],
          barWidth: '15',
          symbolOffset: [0, -4],
          symbolPosition: 'end',
          z: 12,
          // "barWidth": "0",
          label: {
            normal: {
              show: true,
              position: 'top',
              // "formatter": "{c}%"
              fontSize: 14,
              fontWeight: 'bold',
              color: '#34DCFF',
              formatter: (p:any) => {
                const data = p.value.toFixed(0)
                return data === 0 ? '0' : data
              }
            }
          },
          color: '#2DB1EF',
          data: this.chartData
        },
        // 柱状图底座
        {
          name: '',
          type: 'pictorialBar',
          symbolSize: [15, 6],
          symbolOffset: [0, 3],
          // "barWidth": "20",
          barWidth: '15',
          z: 12,
          color: 'rgba(0, 54, 178, 1)',
          data: this.chartData
        },
        // 柱状图线1
        {
          name: '',
          type: 'pictorialBar',
          barWidth: '15',
          symbolSize: [20, 8],
          symbolOffset: [0, 6],
          z: 10,
          itemStyle: {
            normal: {
              color: 'transparent',
              borderColor: '#00E4FF',
              borderType: 'solid',
              borderWidth: 1
            }
          },
          data: this.chartData
        },
        {
          name: '',
          type: 'pictorialBar',
          symbolSize: [26, 13],
          symbolOffset: [0, 8],
          z: 10,
          barWidth: '15',
          itemStyle: {
            normal: {
              color: 'transparent',
              borderColor: '#0897ae',
              borderType: 'solid',
              borderWidth: 1
            }
          },
          data: this.chartData
        },
        {
          type: 'bar',
          // silent: true,
          barWidth: '15',
          barGap: '10%', // Make series be overlap
          barCateGoryGap: '10%',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [{
                offset: 0,
                color: 'rgba(0, 192, 255, 1)'
              },
              {
                offset: 1,
                color: 'rgba(0, 54, 178, 1)'
              }
              ]),
              opacity: 0.8
            }
          },
          data: this.chartData,
          1: 20
        }
      ]
    }
    this.chart.setOption(option)
    this.timer = setInterval(() => {
      this.chart.clear()
      this.chart.setOption(option)
    }, 10000)
  }
}
</script>
