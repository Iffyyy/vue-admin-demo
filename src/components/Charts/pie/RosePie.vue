<template>
  <div id="rosePie" class="chart-item" />
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

// @ts-ignore
@Component({
  name: 'RosePie'
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
    value: 42
  }]

  mounted() {
    console.log(this.data, 'rose')
    this.initCharts()
  }

  private initCharts() {
    this.chart = echarts.init(document.getElementById('rosePie') as HTMLDivElement)

    const option = {
      series: [
        {
          type: 'pie',
          radius: ['64%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          roseType: 'radius',
          silent: true,
          labelLine: {
            show: false,
            length: 1
          },
          data: this.chartData
        },
        {
          type: 'pie',
          silent: true,
          radius: ['44%', '65%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            backgroundColor: 'rgba(255,255,255,1)',
            normal: {
              show: false,
              position: 'center'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.chartData
        }
      ]
    }
    this.chart.setOption(option)
  }
}
</script>
