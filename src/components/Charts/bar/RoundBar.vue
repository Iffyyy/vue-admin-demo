<template>
  <div id="rosePie" class="chart-item" />
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

// @ts-ignore
@Component({
  name: 'RoundBar'
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
    this.chart = echarts.init(document.getElementById('rosePie') as HTMLDivElement)
    const option = {
      legend: {
        left: '24%',
        y: '0',
        icon: 'circle',
        orient: 'horizontal',
        itemGap: 10,
        textStyle: {
          color: '#fff',
          fontSize: '14',
          width: 55,
          padding: [0, 0, 0, 0]
        },
        data: this.chartData
      },
      // tooltip: {
      //   trigger: 'axis',
      //   axisPointer: { // 坐标轴指示器，坐标轴触发有效
      //     type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      //   }
      // },
      grid: {
        top: '22%',
        bottom: '3%',
        width: '80%',
        left: '6%',
        containLabel: true
      },
      xAxis: {
        name: '日期/日',
        nameTextStyle: {
          color: '#00CCFF',
          padding: [15, 20, 0, 0]
        },

        type: 'category',
        data: this.chartData,
        axisTick: {
          lineStyle: {
            color: 'rgba(0,204,255,0.1)',
            type: 'dotted'
          }
        },
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: 'rgba(255,255,255,0.7)'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#042E4A',
            opacity: 0.5
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '总数/人',
        minInterval: 1,
        splitNumber: 3,
        nameTextStyle: {
          color: '#00CCFF'
        },
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: 'rgba(255,255,255,0.7)'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(0,204,255,0.1)'
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          lineStyle: {
            color: 'rgba(0,204,255,0.1)',
            type: 'dotted'
          }
        }
      },
      // animationDuration: 2000,
      series: [
        {
          name: this.chartData,
          type: 'bar',
          width: '13px',
          barMinWidth: '13px',
          barMaxWidth: '13px',
          barMinHeight: '2px',
          itemStyle: {
            emphasis: {
              barBorderRadius: 7
            },
            normal: {
              barBorderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(255, 170, 35, 1)' },
                  { offset: 0.5, color: 'rgba(255, 170, 35, .5)' },
                  { offset: 1, color: 'rgba(255, 170, 35, 0)' }
                ]
              )
            }
          },
          data: this.chartData
        },
        {
          name: this.chartData,
          type: 'bar',
          barMinWidth: '13px',
          barMinHeight: '2px',
          barMaxWidth: '13px',
          barCategoryGap: '5%',
          itemStyle: {
            emphasis: {
              barBorderRadius: 7
            },
            normal: {
              barBorderRadius: [10, 10, 0, 0],
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(38, 203, 169, 1)' },
                  { offset: 0.5, color: 'rgba(38, 203, 169, .5)' },
                  { offset: 1, color: 'rgba(38, 203, 169, 0)' }
                ]
              )
            }

          },
          data: this.chartData
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
