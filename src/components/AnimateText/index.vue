<template>
  <div class="animate-text animate" :class="['animate-text--'+type,{'animate-text--repeat': repeat}]" :data-count="computedText.length">
    <span v-for="(item,index) in computedText" :key="index" class="animate-text-item">{{ item }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { parseTime } from '@/utils/index'
@Component({
  name: 'AnimateText'
})
export default class extends Vue {
  @Prop({ default: '测试的动画文字' }) private text!: string
  @Prop({ default: false }) private repeat!: boolean
  @Prop({ default: false }) private hover!: boolean
  @Prop({ default: 1 }) private type!: number
  @Prop({ default: 5 }) private time!: number

  get computedText() {
    return this.text.split('')
  }

  mounted() {
    if (this.repeat) {
      const timer = setInterval(() => {
        this.repeatAnimate()
      }, this.time * 1000)

      this.$once('hook:beforeDestroy', () => {
        clearInterval(timer)
      })
    }
  }

  private repeatAnimate() {
    const element = document.getElementsByClassName('animate')[0]
    element.classList.remove('animate')
    setTimeout(() => {
      element.classList.add('animate')
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
.animate-text {

  &-item {
    display: inline-block;
    /* $count:attr(data-count); */
    @for $i from 2 to 20 {
      &:nth-child(#{$i}) {
        animation-delay: #{0.05s * ($i - 1)}!important;
      }
    }
  }

  &--1.animate .animate-text-item {
    opacity: 0;
    transform: translate(-150px, 0) scale(0.3);
    animation: leftRight 0.5s forwards;

    @keyframes leftRight {
      40% {
        transform: translate(50px, 0) scale(0.7);
        opacity: 1;
      }

      80% {
        transform: translate(0) scale(2);
        opacity: 0;
      }

      100% {
        transform: translate(0) scale(1);
        opacity: 1;
      }
    }
  }

  &--2.animate .animate-text-item {
    opacity: 0;
    transform: translate(-300px, 0) scale(0);
    animation: sideSlide 0.5s forwards;

    @keyframes sideSlide {
      60% {
        transform: translate(20px, 0) scale(1);
      }

      80% {
        transform: translate(20px, 0) scale(1);
      }

      99% {
        transform: translate(0) scale(1.2);
        color: #00f0ff;
      }

      100% {
        transform: translate(0) scale(1);
        opacity: 1;
      }
    }
  }

  &--3.animate .animate-text-item {
    opacity: 0;
    transform: translate(0, -100px) rotate(360deg) scale(0);
    animation: revolveDrop 0.3s forwards;
    @keyframes revolveDrop {
      30% {
        transform: translate(0, -50px) rotate(180deg) scale(1);
      }

      60% {
        transform: translate(0, 20px) scale(0.8) rotate(0deg);
      }

      100% {
        transform: translate(0) scale(1) rotate(0deg);
        opacity: 1;
      }
    }
  }

}
</style>
