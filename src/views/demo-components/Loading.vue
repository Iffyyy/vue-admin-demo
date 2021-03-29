<template>
  <div class="app-container">
    <p>加载动画</p>
    <div class="flex-start-start">
      <div class="animate-item">
        <div class="loading1" />
      </div>

      <div class="animate-item loading3-out">
        <div class="loading3" />
      </div>
      <div class="animate-item">
        <svg class="loading4" with="200" height="200" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="25" fill="transparent" stroke-width="4" stroke-dasharray="50 157 " stroke="#0079f5" />
        </svg>
      </div>
    </div>

    <!-- <div class="animate-item loading2">
      <div class="g-container">
        <div class="g-first" />
        <div class="g-ball" />
        <div class="g-ball" />
        <div class="g-ball" />
        <div class="g-ball" />
        <div class="g-ball" />
        <div class="g-ball" />
        <div class="g-ball" />
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({})
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
  .loading1 {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 100px auto;
    transform: rotate(360deg);
    animation: rotate 45s infinite linear;

    &::before {
      position: absolute;
      content: '';
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      box-sizing: border-box;
      border-radius: 50%;
      border-top: 3px solid #000;
      border-left: 3px solid #000;
      border-bottom: 3px solid transparent;
      border-right: 3px solid transparent;
      transform: rotate(720deg);
      animation: rotate 3s infinite ease-out;
    }

    &::after {
      position: absolute;
      content: '';
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      box-sizing: border-box;
      border-radius: 50%;
      border-bottom: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 7px solid #eee;
      border-left: 7px solid #eee;
      transform: rotate(720deg);
      animation: rotate 3s infinite ease-in-out;
    }

    @keyframes rotate {
      100% {
        transform: rotate(0deg);
      }
    }
  }

  .loading2 {
    $count: 7;
    width: 400px;
    filter: blur(4px) contrast(8);
    background: rgba(#000, 0.5);
    display: flex;

    .g-container {
      margin: auto;
      position: relative;
      width: 4vmin;
      height: 4vmin;
    }

    .g-ball,
    .g-first {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      /* width: 40px;
      height: 40px; */
      background: #fff;
      border-radius: 50%;
      transform: translate(-700%, 0);
      opacity: 0;
      // animation: move 3s infinite linear;
    }

    @for $i from 0 through $count {
      .g-ball:nth-child(#{$i}) {
        animation: move 3.5s infinite #{$i * 0.2 + 0.1}s linear;
      }
    }

    .g-first {
      animation: scaleMove 3.5s infinite linear;
    }

    @keyframes move {
      25% {
        opacity: 1;
        transform: translate(-1vw, 0);
      }
      50% {
        opacity: 1;
        transform: translate(1vw, 0);
      }
      75%,
      100% {
        opacity: 0;
        transform: translate(700%, 0);
      }
    }

    @keyframes scaleMove {
      25% {
        opacity: 1;
        transform: translate(-1vw, 0);
      }
      35% {
        opacity: 1;
        transform: scale(1);
      }
      70% {
        opacity: 1;
        transform: translate(1vw, 0) scale(2);
      }
      90%,
      100% {
        opacity: 0;
        transform: translate(1vw, 0) scale(1);
      }
    }
  }

  .loading3-out {
    border-radius: 50%;
    border: 6px solid #ddd;
  }

  .loading3 {
    position: absolute;
    top: -6px;
    left: -6px;
    bottom: -6px;
    right: -6px;
    border-radius: 50%;
    background: conic-gradient(#fc0 0%, transparent 40%, transparent);
    animation: rotate 2s ease-in-out infinite;
    //transition-origin: 50% 50%;

    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 6px;
      bottom: 6px;
      right: 6px;
      background: #eee;
      border-radius: 50%;
      // z-index: 1;
    }

    &::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      top: 0;
      left: 50%;
      transform: translate(-50%, -3px);
      border-radius: 50%;
      background: #fc0;
      box-shadow: 0 0 4px 2px #fc0;
      filter: contrast(1.2);
    }
    @keyframes rotate {
      100% {
        transform: rotate(-360deg);
      }
    }
  }

  .loading4 {
    animation: loading 1.2s 0s ease-out infinite;

    @keyframes loading {
      0% {
        stroke-dashoffset: 0;
      }
      100% {
        stroke-dashoffset: -157; /* 线条顺时针偏移 */
      }
    }
  }
}
</style>
