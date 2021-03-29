<template>
  <div class="rate-pie" :style="`color:rgba(${color},0.4)`">
    <div :id="cid" class="pie-container" />
    <div class="out-circle" />
    <div class="in-circle" />
    <div class="light" :style="`background: linear-gradient(0deg, rgba(${color},1) 0%, rgba(0, 236, 233, 0) 100%)`" />
    <div class="center-circle">
      <span class="count move-count " :style="`text-shadow:0 0 12px rgba(${color},1),0 0 12px rgba(${color},1)`">{{ (Math.random()*100).toFixed(0) }}</span>
      <div class="rate" :class="0?'down':'rise'">
        对比昨日
        <span>{{ 0?'下降':'上升' }}{{ 100 }}%</span>
        <div>
          <span />
        </div>
      </div>
      <div class="title">
        {{ textList[num] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

// @ts-ignore
@Component({
  name: 'CirclePie'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ default: 0 }) private num!: number

  private chart: any = {}
  private value = '1'
  private timer: any = null
  private dataIndex = 0
  private colorList = Object.freeze(['0, 236, 233', '22, 114, 236', '0, 255, 163'])
  private textList=Object.freeze(['今日预警次数', '本周累积预警次数', '本月累积预警次数'])

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
    const inRadius = 70
    const outRadius = 100
    const num = 20
    const width = 20
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

    // this.startAnimation(this.chart);

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
      // this.startAnimation(this.chart);
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

<style lang="scss" scoped >
$imgUrl: $assets + 'board/';

.rate-pie {
  width: 240px;
  height: 240px !important;
  position: relative;
  text-align: center;
  /* min-width: 200px;
  min-height: 400px; */
  /* transform: rotateX(72deg); */
  /* transform: scale(1, 0.2); */
  /* transform: rotate3d(0,1,1,80deg); */

  .base-pie{
    width: 300px;
    height: 300px;
  }

  .pie-container {
    width: 100%;
    height: 100%;
    transform: perspective(400px) rotateX(79deg);
  }

  .in-circle,
  .out-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -40%);
    border-radius: 50%;
    border: 2px solid;

    &.in-circle {
      width: 110px;
      height: 18px;
    }

    &.out-circle {
      width: 250px;
      height: 54px;
    }
  }

  .light {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -86%);
    width: 227px;
    height: 66px;
    opacity: 0.51;
    clip-path: polygon(0% 0%, 100% 0%, 73% 100%, 27% 100%);
  }

  .center-circle {
    margin-top: 40px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 168px;
    text-align: center;
    letter-spacing: 0;
    color: white;

    .count {
      font-size: 50px;
      font-family: LiquidCrystal;
      font-weight: 400;
      letter-spacing: 4px;
    }

    .rate {
      font-size: 16px;
      font-weight: 400;

      > span {
        padding-left: 6px;
      }

      &.down {
        > span {
          font-size: 18px;
          font-weight: bold;
          color: rgba(1, 190, 167, 1);
        }

        > div {
          display: inline-block;
          overflow: hidden;
          height: 16px;

          animation: down 1s infinite;

          > span {
            display: inline-block;
            width: 19px;
            height: 16px;
            vertical-align: baseline;
            /* background: center / contain url($imgUrl + 'down.png') no-repeat; */
          }

          @keyframes down {
            0% {
              height: 16px;
            }

            100% {
              height: 0;
            }
          }
        }
      }

      &.rise {
        > span {
          color: #fc4f55;
          font-size: 18px;
          font-weight: bold;
        }

        > div {
          display: inline-block;
          overflow: hidden;
          height: 16px;

          animation: riseup 1s infinite;

          > span {
            display: inline-block;
            width: 19px;
            height: 16px;
            margin-left: 6px;
            vertical-align: baseline;
            /* background: center / contain url($imgUrl + 'rise.png') no-repeat; */
          }

          @keyframes riseup {
            0% {
              height: 0px;
            }

            100% {
              height: 16px;
            }
          }
        }
      }
    }

    .title {
      margin-top: 44px;
      font-size: 21px;
      font-weight: bold;
    }
  }
}
</style>
