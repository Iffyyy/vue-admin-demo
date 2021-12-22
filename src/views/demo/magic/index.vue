<template>
  <div class="magic-wrap">
    <div class="cube-magic">
      <div class="cir cir1" />
      <div class=" cir cir2" />
      <div class="magic-container">
        <Magic class="magic0" />
        <Magic class="magic1" />
        <Magic class="magic2" />
        <Magic class="magic3" />
        <Magic class="magic4" />
        <Magic class="magic5" />
        <Magic class="magic6" />
        <Magic class="magic7" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Magic from './components/magic.vue'
@Component({
  name: 'CubeMagic',
  components: { Magic }
})
export default class detail extends Vue {}
</script>
<style scoped lang="scss">
@mixin cover {
  content: '';
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
}
.magic-wrap{
  width: 100vw;
  height: 100vh;
  background: #212b69;
}
.cube-magic {
  position: absolute;
  top: 200px;
  left: 50%;
  width: 200px;
  height: 200px;
  transform: translateX(-50%);
  transform-style: preserve-3d;
  > div {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .title {
    color: white;
    top: 126%;
    font-size: 32px;
    width: 160px;
    text-align: center;
  }
  .magic-container {
    width: 100px;
    height: 100px;
    animation: xuanzhan 30s linear infinite;
    transform-style: preserve-3d;
    top: 40%;
    left: 26%;
    cursor: pointer;
    z-index: 99;
    @keyframes xuanzhan {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    /* 扩大点击区域 */
    &:before {
      @include cover;
      width: 140%;
      height: 140%;
      top: -15px;
      left: -15px;
      transform: rotate(45deg);
    }
    &:hover {
      animation-play-state: paused;
      $distance: 14px;
      $offset: 6px;
      $scale: 0.68;
      .nh-cube {
        transition: transform 1s;
        animation-duration: 0s;
      }
      .magic0{
        transform: translateY(-$distance) scale($scale);
      }
      .magic4 {
        transform: translateX($offset) translateY(-$distance) scale($scale);
      }
      .magic1{
        transform: translateX(-$distance) scale($scale);
      }
      .magic5 {
        transform: translateX(-$distance + $offset) scale($scale);
      }
      .magic2{
        transform: translateX($distance) scale($scale);
      }
      .magic6 {
        transform: translateX($distance + $offset) scale($scale);
      }
      .magic3 {
        transform: translateY($distance) scale($scale);
      }
      .magic7 {
        transform: translateX($offset) translateY($distance) scale($scale);
      }
    }
  }
  $angleX: 64deg;
  $angleY: 20deg;
  $bg: #02fff6;
  $lightBg: #b6fff5;
  .cir {
    top: 20%;
    left: -8%;
    width: 230px;
    height: 230px;
    transform: rotateX($angleX) rotateY($angleY);
    border: 4px solid $lightBg;
    border-radius: 50%;
    box-shadow: 0 0 16px rgba($bg, 0.6), 0 0 16px rgba($bg, 0.6) inset, 0 0 10px $lightBg, 0 0 10px $lightBg inset;
    mask-image: linear-gradient(0deg, rgba(white, 0.9) 0%, rgba($lightBg, 0.7) 30%, rgba($bg, 0));
  }
  .cir1 {
    animation: rotate 16s -3s infinite linear alternate;
  }
  .cir2 {
    transform: rotateX($angleX) rotateY(-$angleY);
    animation: rotate1 16s infinite linear;
  }
  .cir3 {
    transform: rotateX($angleX);
  }
  @keyframes rotate {
    0%,
    100% {
      transform: rotateX($angleX) rotateY($angleY) rotate(0deg);
    }
    50% {
      transform: rotateX($angleX) rotateY($angleY) rotate(360deg);
    }
  }
  @keyframes rotate1 {
    0%,
    100% {
      transform: rotateX($angleX) rotateY(-$angleY) rotate(0deg);
    }
    50% {
      transform: rotateX($angleX) rotateY(-$angleY) rotate(360deg);
    }
  }
  .magic0 {
    top: -40%;
    left: 10%;
    z-index: 4;
  }
  .magic1 {
    top: -4%;
    left: -28%;
    z-index: 10;
  }
  .magic2 {
    top: -4%;
    left: 48%;
    z-index: 10;
    animation: translateMove1 10s infinite;
    @keyframes translateMove1 {
      0%,
      60%,
      100% {
        transform: translateX(0) scale(0.6);
      }
      6%,
      40% {
        transform: translateX(24%) scale(0.7);
      }
    }
  }
  .magic3 {
    top: 30%;
    left: 10%;
    z-index: 10;
    animation: translateMove 10s infinite -4s;
    @keyframes translateMove {
      0%,
      60%,
      100% {
        transform: translateY(0) scale(0.6);
      }
      8%,
      50% {
        transform: translateY(24%) scale(0.7);
      }
    }
  }
  .magic4 {
    top: -20%;
    left: 10%;
    z-index: 2;
  }
  .magic5 {
    top: 16%;
    left: -28%;
    z-index: 4;
  }
  .magic6 {
    top: 16%;
    left: 48%;
    z-index: 4;
  }
  .magic7 {
    top: 50%;
    left: 10%;
    z-index: 4;
  }
}
</style>
