<template>
  <div :id="cid" class="chart-item" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import echarts, { EChartOption, ECharts } from 'echarts'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import variables from '@/styles/_variables.scss'

// @ts-ignore
@Component({
  name: 'CubeBar'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: () => [] }) private barData!: Array<object>
  @Prop({ default: 'cubeBar' }) private cid!: string

  protected chart!: any
  private colorList = [
    {
      type: 'linear',
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#20BAA6'
        },
        {
          offset: 0.5,
          color: '#20BAA6'
        },
        {
          offset: 0.5,
          color: '#1B9C8B'
        },
        {
          offset: 1,
          color: '#2BA495'
        }
      ]
    }
  ]

  private colors1 = [
    {
      type: 'linear',
      x: 0,
      x2: 0,
      y: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#C42526'
        },
        {
          offset: 0.5,
          color: '#C42526'
        },
        {
          offset: 0.5,
          color: '#aa1e1e'
        },
        {
          offset: 1,
          color: '#aa1e1e'
        }
      ]
    }
  ]

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
    this.initialBar()
  }

  get variables() {
    return variables
  }

  private initialBar() {
    const topBar = document.getElementById(this.cid)
    this.chart = echarts.init(topBar as HTMLDivElement)
    // 多系列无法定位
    const data = this.chartData
    const barWidth = 26
    const option = {
      textStyle: {
        color: '#fff',
        fontSize: 16
      },
      // tooltip: {
      //   backgroundColor: 'rgba(0,104,124,0.2)',
      //   padding: 10,
      //   formatter: (params: any) => {
      //     return (
      //       params.marker +
      //       params.name +
      //       '<br/> 应出勤：' +
      //       params.data.plan +
      //       '<br/>实际出勤：' +
      //       params.data.record
      //     )
      //   }
      // },
      grid: {
        top: '5%',
        bottom: '5%',
        left: '30%',
        right: '10%'
      },
      yAxis: {
        inverse: true,
        offset: 3,
        axisLine: {
          show: 0
        },
        axisTick: {
          show: 0
        },
        axisLabel: {
          fontSize: 14
        },
        data: data.map(item => item.name)
      },
      xAxis: {
        axisLabel: {
          show: 0
        },
        axisLine: {
          show: 0
        },
        axisTick: {
          show: 0
        },
        splitLine: {
          show: 0
        }
      },
      series: [
        {
          z: 1,
          type: 'bar',
          barWidth: barWidth,
          data: data.map((item, i) => {
            return {
              value: item.value
            }
          }),
          itemStyle: {
            color: (params: any) => {
              return params.dataIndex > 1 ? this.colors1[0] : this.colorList[0]
            },
            borderWidth: 0
          },
          animationDuration: 1000
        },
        {
          z: 2,
          name: '底部',
          type: 'pictorialBar',
          data: data.map((item) => {
            return {
              value: 1
            }
          }),
          itemStyle: {
            color: (params: any) => {
              return params.dataIndex > 1 ? this.colors1[0] : this.colorList[0]
            },
            borderWidth: 0
          },
          symbol: 'diamond',
          symbolOffset: ['-50%', 0],
          symbolSize: [10, barWidth],
          animationDuration: 1000
        },
        {
          z: 3,
          name: '上部1',
          type: 'pictorialBar',
          symbolPosition: 'end',
          data: data.map((item, i) => {
            const itemStyle = {
              borderColor:
                i > 1
                  ? this.colors1[0].colorStops[3].color
                  : this.colorList[0].colorStops[3].color,
              borderWidth: 2,
              color:
                i > 1
                  ? this.colors1[0].colorStops[3].color
                  : this.colorList[0].colorStops[3].color
            }
            return {
              value: item.value || 0.0001,
              itemStyle: itemStyle
            }
          }),
          barCategoryGap: 2,
          symbol: 'diamond',
          symbolOffset: ['50%', 0],
          symbolSize: [(10 * (barWidth - 2)) / barWidth, barWidth - 4],
          /* itemStyle: {
               normal: {
                 borderColor: '#C1CB01',
                 borderWidth: 2,
                 color: '#C1CB01'
               }
             }, */
          label: {
            show: true,
            position: 'right',
            formatter: (p:any) => {
              const data = p.value.toFixed(0)
              return data === 0 ? '' : data + '%'
            },
            fontSize: 14,
            color: '#fff'
          },
          animationDuration: 1000
        }
      ]
    }
    this.chart.setOption(option)
  }
}
</script>
