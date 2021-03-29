<template>
  <div id="TrendLine" class="trend-line" />
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import { Component } from 'vue-property-decorator'
// @ts-ignore
@Component({
  name: 'TrendLine'
})
export default class extends mixins(ResizeMixin) {
  private chart:any=null
  private dataIndex:number=0
  private timer:any=null
  private timer2:any=null
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
    this.initchart()
  }

  private initchart() {
    this.chart = echarts.init(document.getElementById('TrendLine') as HTMLDivElement)
    const self = this
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: [
        {
          width: '76%',
          left: '7%',
          bottom: '0',
          height: '77%',
          containLabel: true
        }
      ],
      xAxis: {
        type: 'category',
        name: '日期',
        nameTextStyle: {
          color: 'rgba(255,255,255,1)',
          fontSize: '12',
          fontWeight: 'bold',
          padding: [24, 0, 0, 0]
        },
        boundaryGap: false,
        axisLabel: {
          formatter: '{value}',
          rotate: '30',
          textStyle: {
            color: 'rgba(255,255,255,1)',
            fontSize: '12'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#2CDEFF',
            width: 2
          }
        },
        axisTick: {
          lineStyle: {
            color: 'rgba(0,204,255,0.1)',
            type: 'dotted'
          }
        },
        data: this.chartData.map(item => item.name)
      },
      yAxis: {
        type: 'value',
        name: '事件数(件)',
        minInterval: 1,
        splitNumber: 3,
        nameTextStyle: {
          fontSize: '14',
          color: '#2DDEFF',
          fontWeight: '300',
          padding: [0, 0, 10, 0]
        },
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(17,163,159,1)',
            width: 2
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
      series: [{
        type: 'line',
        smooth: true,
        symbol: 'none',
        silent: true,
        animationDuration: 2000,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 1, [
              {
                offset: 0.1,
                color: 'rgba(44,222,255,0)'
              },
              {
                offset: 0.9,
                color: '#2CDEFF'
              },
              {
                offset: 1,
                color: 'rgba(44,222,255,0)'
              }
            ])
          }
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(44,222,255,.5)'
            },
            {
              offset: 1,
              color: 'rgba(44,222,255,0)'
            }
          ])
        },
        emphasis: {
          label: {
            show: true,
            color: '#fff'
          }
        },
        data: this.chartData.map(item => item.value)
      }]

    }
    this.chart.setOption(option)

    this.startAnimation(this.chart)

    this.startMove(option)
    this.chart.on('mouseover', (param:any) => {
      clearInterval(this.timer)
      clearInterval(this.timer2)
      this.chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0
      })
      this.chart.dispatchAction({
        type: 'highlight',
        dataIndex: param.dataIndex
      })
    })
    this.chart.on('mouseout', function() {
      self.startAnimation(self.chart)
      self.startMove(option)
    })
  }

  private startAnimation(chartChild:any) {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      chartChild.dispatchAction({
        type: 'downplay',
        dataIndex: this.dataIndex
      })
      this.dataIndex === this.chartData.length ? (this.dataIndex = 0) : this.dataIndex++

      chartChild.dispatchAction({
        type: 'highlight',
        dataIndex: this.dataIndex
      })
    }, 2000)
  }

  private startMove(option:object) {
    clearInterval(this.timer2)
    this.timer2 = setInterval(() => {
      this.chart.clear()
      this.chart.setOption(option)
    }, 1000 * 60)
  }
}
</script>

<style scoped>
    .trend-line{
        width: 400px;
        height: 200px;
    }
</style>
