<template>
  <div class="app-container">
    <p>文字动画</p>
    <div class="typing">Pure CSS Typing animation.</div>
    <AnimateText class="img-text" :repeat="true" text="核心理念——全脑智能大脑：连接一切" />
    <AnimateText class="img-text" :repeat="true" text="核心理念——全脑智能大脑：连接一切" :type="2" />
    <AnimateText class="img-text" :repeat="true" text="核心理念——全脑智能大脑：连接一切" :type="3" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import AnimateText from '@/components/AnimateText/index.vue'

@Component({
  components: {
    AnimateText
  }
})
export default class extends Vue {
  private number = (Math.random() * 1000).toFixed(0)

  private changeNumber() {
    this.number = (Math.random() * 1000).toFixed(0)
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/element-variables.scss';

.app-container {
  font-size: 26px;
  .typing {
    font-size: 12px;
    font: bold 200% Consolas, Monaco, monospace;
    border-right: 0.1em solid;
    width: 16.5em;
    width: 26ch;
    margin: 2em 1em;
    white-space: nowrap;
    overflow: hidden;
    animation: typing 3s steps(26, end), cursor-blink 0.3s step-end infinite alternate;

    @keyframes typing {
      from {
        width: 0;
      }
    }

    @keyframes cursor-blink {
      50% {
        border-color: transparent;
      }
    }
  }

  .animate-text{
    padding: 10px;
  }
}
</style>
