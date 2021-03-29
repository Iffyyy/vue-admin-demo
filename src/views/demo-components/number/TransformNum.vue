<template>
  <ul class="number flex-center-start">
    <li v-for="(item,index) in computeNumber" :key="index" :class="{'number-item': !isNaN(item)}" :style="{height: size+'px',lineHeight: size+'px',width: (!isNaN(item)?( size*0.7).toFixed():6)+'px'}">
      <span v-if="!isNaN(item)" class="number-item-wrap">
        <i ref="numberItem" class="number-item-wrap-i">0123456789</i>
      </span>
      <span v-else>{{ item }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'TransformNum'
})
export default class extends Vue {
  @Prop({ default: 0 }) private num!: number
  @Prop({ default: 20 }) private size!: number

  private computeNumber: any = [0]
  private newNumber = 0
  private timer = {}

  @Watch('num', { immediate: true })
  private updateNum(newV:number) {
    this.increaseNumber()
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

  // 定时增长数字
  private increaseNumber() {
    const self = this
    self.numG()
    setTimeout(() => {
      self.setNumberTransform()
    }, 2000)
  }

  // 设置每一位数字的偏移
  private setNumberTransform() {
    const numberItems: any = this.$refs.numberItem
    const numberArr = this.computeNumber.filter((item: any) => !isNaN(item))
    if (!numberItems) return
    for (let index = 0; index < numberItems.length; index++) {
      const elem = numberItems[index]
      elem.style.transform = `translate(-50%, -${numberArr[index] * 10}%)`
    }
  }
}
</script>

<style scoped lang="scss">
.number {
  list-style: none;
  margin: 0;
  padding: 0;
  &-item {
    &-wrap {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      width: 100%;
      height: 100%;
      writing-mode: vertical-lr;
      text-orientation: upright;
      overflow: hidden;

      &-i {
        position: absolute;
        top: 4px;
        left: 50%;
        /* font-family: 'LiquidCrystal'; */
        font-weight: 400;
        transform: translate(-50%, 0);
        transition: transform 0.5s ease-in-out;
        letter-spacing: 10px;
        font-style: normal !important;
      }
    }
  }
}
</style>
