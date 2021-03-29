<template>
  <div id="petition" class="petition" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

@Component({
  name: 'WarningBar'
})
export default class extends mixins(ResizeMixin) {
  mounted() {
    this.initChart()
  }

  private initChart() {
    this.chart = echarts.init(document.getElementById('petition') as HTMLDivElement)
    var lastYearData = [3, 20, 62, 34, 55, 65, 33]
    var thisYearData = [11, 38, 23, 39, 66, 66, 79]
    let borderData = []
    const scale = 1
    borderData = thisYearData.map(item => {
      return scale
    })
    const option = {
      baseOption: {
        timeline: {
          show: false,
          top: 0,
          data: []
        },
        legend: {
          show: false
        },
        grid: [{
          show: false,
          left: '5%',
          top: '10%',
          bottom: '8%',
          containLabel: true,
          width: '80%'
        }],
        xAxis: {
          type: 'category',
          data: ['德州', '德城区', '陵城区', '禹城市', '乐陵市', '临邑县',
            '平原县', '夏津县', '武城县', '庆云县', '宁津县', '齐河县'],
          axisLine: {
            show: true,
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(0, 243, 255, 0.9)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0, 243, 255, 0.1)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
              // color: 'rgba(0, 243, 255, 1)'
            }
          },
          axisTick: {
            show: false,
            length: 9,
            alignWithLabel: true,
            lineStyle: {
              color: '#7DFFFD'
            }
          },
          axisLabel: {
            fontSize: 10,
            color: '#fff'
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(0, 243, 255, 0.1)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(0, 243, 255, 0.9)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
              // color: 'rgba(0, 243, 255, 1)'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 16,
            show: false
          }
          // boundaryGap: ['20%', '20%']
        },
        series: [
          {
            name: '2017',
            type: 'bar',
            barWidth: 22,
            stack: '1',
            itemStyle: {
              normal: {
                color: 'rgba(1, 255, 246, 0.1)'
              }
            },
            label: {
              show: true,
              position: 'top',
              color: '#fff'
            },
            data: lastYearData,
            markLine: {
              silent: true,
              data: [{ yAxis: 50 }],
              lineStyle: {
                color: 'rgba(251, 0, 30, 0.8)'
              }
            },
            animationEasing: 'elasticOut'
          },
          {
            name: '2017',
            type: 'bar',
            barWidth: 25,
            stack: '1',
            itemStyle: {
              normal: {
                color: 'rgba(1, 255, 246, 1)'
              }
            },
            data: borderData
          }
        ]

      },
      options: []
    }
    // @ts-ignore
    this.chart.setOption(option)
  }
}
</script>

<style scoped>
.petition{
  width: 400px;
  height: 300px;
}
</style>
