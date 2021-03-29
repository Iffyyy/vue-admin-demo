import { EChartOption, ECharts } from 'echarts'
import { Component, Vue, Prop } from 'vue-property-decorator'

// export interface ChartData {
//   axis: string[]
//   data: number[]
//   name: string[]
// }

@Component({
  name: 'ResizeMixin'
})
export default class extends Vue {
  @Prop({ default: 'BoardLine' }) protected cid!: string
  @Prop({ default: () => {} }) protected option!: EChartOption
  @Prop({ default: () => ['#02C7C8', '#E44100', '#07F672'] }) private colors!: Array<string>
  @Prop({}) protected data!: any
  @Prop({ default: 30 * 1000 }) protected time!: number

  protected chart!: ECharts | null
  private sidebarElm?: Element
  private animateTimer!:any

  get animate() {
    return (JSON.stringify(this.option) !== '{}' && this.option) ? 'choose' : 'rerender'
  }

  mounted() {
    this.initResizeEvent()
    this.initSidebarResizeEvent()
  }

  beforeDestroy() {
    this.destroyResizeEvent()
    this.destroySidebarResizeEvent()
    if (this.animateTimer) {
      clearInterval(this.animateTimer)
    }
    if (this.chart) {
      echarts.dispose(this.chart)
    }
  }

  activated() {
    this.initResizeEvent()
    this.initSidebarResizeEvent()
  }

  deactivated() {
    this.destroyResizeEvent()
    this.destroySidebarResizeEvent()
    if (this.chart) {
      echarts.dispose(this.chart)
    }
  }

  private chartResizeHandler() {
    if (this.chart) {
      this.chart.resize()
    }
  }

  private sidebarResizeHandler(e: TransitionEvent) {
    if (e.propertyName === 'width') {
      this.chartResizeHandler()
    }
  }

  private initResizeEvent() {
    if (this.chartResizeHandler) {
      window.addEventListener('resize', this.chartResizeHandler)
    }
  }

  private destroyResizeEvent() {
    if (this.chartResizeHandler) {
      window.removeEventListener('resize', this.chartResizeHandler)
    }
  }

  private initSidebarResizeEvent() {
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    if (this.sidebarElm) {
      this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler as EventListener)
    }
  }

  private destroySidebarResizeEvent() {
    if (this.sidebarElm) {
      this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler as EventListener)
    }
  }

  public setAnimate(option:EChartOption) {
    this.renderChart(option)
    this.startMove(option, this.time)

    if (this.chart) {
      this.chart.on('mouseover', () => {
        clearInterval(this.animateTimer)
      })
      this.chart.on('mouseout', () => {
        this.startMove(option)
      })
    }
  }

  private renderChart(option:EChartOption) {
    if (this.chart) {
      this.chart.clear()
      this.chart.setOption(option)
      if (JSON.stringify(this.option) !== '{}' && this.option) {
        setTimeout(() => {
          (this.chart as any).setOption(this.option)
        }, 2000)
      }
    }
  }

  public startMove(option:EChartOption, time:number = 10 * 1000) {
    const options:{[key:string]:any} = {
      rerender: this.reRender,
      choose: this.chooseItem
    }

    options[this.animate](option, time)
  }

  private reRender(option:EChartOption, time:number = 10 * 1000) {
    clearInterval(this.animateTimer)
    this.animateTimer = setInterval(() => {
      this.renderChart(option)
    }, time)
  }

  private chooseItem(time:number = 10 * 1000) {
    clearInterval(this.animateTimer)
    let dataIndex = 0
    this.animateTimer = setInterval(() => {
      if (this.chart) {
        this.chart.dispatchAction({
          type: 'showTip',
          dataIndex: dataIndex,
          seriesIndex: 0
        })
        dataIndex === this.data.axis.length - 1
          ? (dataIndex = 0)
          : dataIndex++
      }
    }, time)
  }
}
