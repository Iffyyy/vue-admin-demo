<template>
  <div class="g-number-container vision preserve">
    <div class="g-number-rotate preserve">
      <div v-for="(item,index) in computeNumber" :key="index" :data-digit="item" :class="{['g-number[data-digit='+item+']']: true,'g-number': !isNaN(item),'g-comma': isNaN(item)}">
        <div v-for="(item1,key) in new Array(7)" :key="key" class="g-line preserve translate" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'CountNum'
})
export default class extends Vue {
  @Prop({ default: 0 }) private num!: number
  @Prop({ default: 20 }) private size!: number

  private computeNumber: any = [0]
  private newNumber = 0
  private timer = {}

  @Watch('num', { immediate: true })
  private updateNum(newV:number) {
    this.numG()
  }

  // 分割数字数组
  private numG() {
    let str = ''
    if (this.num === 0) {
      this.computeNumber = [0]
    } else {
      str = typeof this.num === 'string' ? this.num : Number(this.num).toString()

      try {
        this.computeNumber = str.split('')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
$width: 3vw;
$commaWidth: .5vw;
$gap: 0.2vw;
$dis: -0.2vw;
$secTop: $width + $gap;
$thirdTop: $width * 2 + $gap * 2;
$secLineTop: $width + $gap * 2;
$screenTop: $width * 3;
$numberMargin: 3vw;
$transformDistance: 50px;
$bgColor: rgba(255, 255, 255, 1);
$scale: .9;
$normalColor: #ddd;
$lightColor: #34eabc;
$drakColor: #ddd;
$lightShadow: 0 0 1vw #0BFDFD, inset 0 0 0.125vmin #0BFDFD;
$drakShadow: 0 0 1vw #ddd;
$animTime: 10s;

.g-number-container {
    position: relative;
    text-align: center;
    /* animation: rotateReverse $animTime infinite linear; */
    z-index: 999;
}

.g-number-rotate {
    transform: rotateX(6deg) rotateZ(0);
    /* animation: rotate $animTime infinite linear; */
}

.vision {
    // transform: translate(-50%, -50%);
    // transform-origin: 50% 50%;
}

.preserve {
    transform-style: preserve-3d;
    perspective: 1000px;
}

.g-number {
    position: relative;
    width: $width;
    height: $screenTop;
    display: inline-block;
    margin: $numberMargin $numberMargin 0 0;

    .g-line {
        position: absolute;
        top: 0;
        left: 0;
        width: $width;
        height: 4px;
        background: $normalColor;

        &:nth-child(1) {
            transform: translateY($dis);
        }

        &:nth-child(2) {
            top: $secTop;
        }

        &:nth-child(3) {
            transform: rotate(180deg) translateY($dis);
            top: $thirdTop;
        }

        &:nth-child(4) {
            transform: rotate(90deg) translateY(-$dis);
            transform-origin: 0 center;
        }

        &:nth-child(5) {
            transform: rotate(-90deg) translateY(-$dis);
            transform-origin: 100% center;
        }

        &:nth-child(6) {
            top: $secLineTop;
            transform: rotate(90deg) translateY(-$dis);
            transform-origin: 0 center;
        }

        &:nth-child(7) {
            top: $secLineTop;
            transform: rotate(-90deg) translateY(-$dis);
            transform-origin: 100% center;
        }
    }

    .g-line::before,
    .g-line::after{
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        background-color: $lightColor;
        box-shadow: $lightShadow;
    }

    .g-line::before {
        left: 0;
        right: 50%;
        transition: all .5s ease-in;
    }

    .g-line::after {
        left: 50%;
        right: 0;
        transition: all .5s ease-out;
    }

    .translate {
        &::before,
        &::after{
            transform: translateZ($transformDistance);
        }
    }
}

.g-comma {
    position: relative;
    top: -$thirdTop + 1vw;
    display: inline-block;
    width: 1vw;
    height: 1vw;
    background: $normalColor;
    margin: $numberMargin $numberMargin 0 -.8vw;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: $lightColor;
        transform: translateZ($transformDistance);
    }

    &::after {
        content: "";
        position: absolute;
        bottom: -.8vw;
        right: .3vw;
        border: .2vw solid transparent;
        border-top: .9vw solid $lightColor;
        transform: translateZ($transformDistance) rotate(40deg);
    }
}

.g-number[data-digit="1"] .g-line:nth-child(1),
.g-number[data-digit="1"] .g-line:nth-child(2),
.g-number[data-digit="1"] .g-line:nth-child(3),
.g-number[data-digit="1"] .g-line:nth-child(4),
.g-number[data-digit="1"] .g-line:nth-child(6),
.g-number[data-digit="2"] .g-line:nth-child(4),
.g-number[data-digit="2"] .g-line:nth-child(7),
.g-number[data-digit="3"] .g-line:nth-child(4),
.g-number[data-digit="3"] .g-line:nth-child(6),
.g-number[data-digit="4"] .g-line:nth-child(1),
.g-number[data-digit="4"] .g-line:nth-child(3),
.g-number[data-digit="4"] .g-line:nth-child(6),
.g-number[data-digit="5"] .g-line:nth-child(5),
.g-number[data-digit="5"] .g-line:nth-child(6),
.g-number[data-digit="6"] .g-line:nth-child(5),
.g-number[data-digit="7"] .g-line:nth-child(2),
.g-number[data-digit="7"] .g-line:nth-child(3),
.g-number[data-digit="7"] .g-line:nth-child(4),
.g-number[data-digit="7"] .g-line:nth-child(6),
.g-number[data-digit="9"] .g-line:nth-child(6),
.g-number[data-digit="0"] .g-line:nth-child(2){
    &::before,
    &::after {
        transform: translateZ(25px);
        background: $drakColor;
        box-shadow: $drakShadow;
    }
}

@keyframes rotate {
    0% {
        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
    }
    50% {
        transform: rotateX(20deg) rotateY(40deg) rotateZ(180deg);
    }
    100% {
        transform: rotateX(0deg) rotateY(0deg) rotateZ(360deg);
    }
}

@keyframes rotateReverse {
    0% {
        transform: rotateZ(0deg);
    }100% {
        transform: rotateZ(-360deg);
    }
}
</style>
