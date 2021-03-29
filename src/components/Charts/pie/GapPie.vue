<template>
  <div id="gapPie" class="chart-item" />
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

// @ts-ignore
@Component({
  name: 'GapPie'
})
export default class extends mixins(ResizeMixin) {
  private chart:any=null
  private chartData=[{
    name: '南门',
    value: 12
  }, {
    name: '北门',
    value: 30
  }, {
    name: '西南门',
    value: 12
  }]

  mounted() {
    this.initCharts()
  }

  private initCharts() {
    this.chart = echarts.init(document.getElementById('gapPie') as HTMLDivElement)

    const option = {
      legend: {
        left: '4%',
        bottom: '1%',
        icon: 'circle',
        itemWidth: 15, // 设置宽度
        itemHeight: 12, // 设置高度
        orient: 'vertical',
        itemGap: 12,
        textStyle: {
          color: 'rgba(255,255,255,0.9)',
          fontSize: '13',
          width: 55,
          padding: [0, 0, 0, 10]
        },
        data: this.chartData
      },
      color: ['#26CBA9', '#FFAA23'],
      series: [
        {
          type: 'pie',
          roseType: false,
          radius: ['40%', '56%'],
          center: ['50%', '40%'],
          label: {
            show: true,
            position: 'outside',
            textBorderColor: 'transparent',
            formatter: function(data:any) {
              return `{a|${data.percent.toFixed(0)}%}`
            },
            rich: {
              a: {
                fontWeight: 'bold',
                fontSize: 16
                // fontFamily:'Microsoft YaHei'
              }
            }
          },
          labelLine: {
            show: false,
            length: 1
          },
          itemStyle: {
            borderType: 'solid',
            borderWidth: '5',
            borderColor: 'rgba(16, 30, 46, 1)'
          },
          data: this.chartData,
          animationEasing: 'cubicGapPie',
          animationDuration: 2600
        }
      ]
    }
    this.chart.setOption(option)
  }
}
</script>
