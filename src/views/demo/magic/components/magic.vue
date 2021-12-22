<template>
  <div class="nh-cube">
    <div class="nh-cube-inner">
      <div class="nh-cube-face nh-cube-up" />
      <div class="nh-cube-face nh-cube-down" />
      <div class="nh-cube-face nh-cube-left" />
      <div class="nh-cube-face nh-cube-right" />
      <div class="nh-cube-face nh-cube-before" />
      <div class="nh-cube-face nh-cube-after" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  name: 'magicl'
})
export default class magic extends Vue {}
</script>
<style scoped lang="scss">
@mixin cover {
  content: '';
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 100%;
}
.nh-cube {
  width: 80px;
  height: 80px;
  position: absolute;
  z-index: 0;
  /* margin: -194px 0 0 -10px; */
  transform-origin: 50% 50% -10px;
  transform-style: preserve-3d;
  transform: scale(0.6);
  /* animation: xd 10s linear infinite; */
  &-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: 0.3s;
    transform-origin: 50% 50% -10px;
    -webkit-perspective: 100000px;
    perspective: 100000px;
    transform: rotateX(20deg) rotateZ(45deg);
  }
  $color:#02FFF6;
  $color1:#98fdf0;
  $lightColor:#B6FFF5;
  &-face {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1px solid $lightColor;
    background: linear-gradient(0deg, rgba($color,0.7),rgba($color1,0.8));
    /* background: $color; */
    background-blend-mode: screen;
    box-shadow: inset 0 0 2px rgba($lightColor, 1), 0 0 2px rgba($lightColor, 1);
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      width: 10px;
      height: 10px;
      border-color: $lightColor;
      border-style: solid;
      border-top-width: 2px;
      border-bottom-width: 0;
      box-shadow: inset 0 0 8px rgba($lightColor, 1), 0 0 8px rgba($lightColor, 1);
    }
    &::before {
      left: -2px;
      border-left-width: 2px;
      border-right-width: 0;
    }
    &::after {
      right: -2px;
      border-left-width: 0;
      border-right-width: 2px;
    }
  }
  &-up {
    left: 0;
    top: -80px;
    transform: rotateX(90deg);
    transform-origin: bottom;
  }
  &-down {
    left: 0;
    top: 80px;
    transform-origin: top;
    transform: rotateX(-90deg);
  }
  &-left {
    left: -80px;
    top: 0;
    transform-origin: right;
    transform: rotateY(-90deg);
  }
  &-right {
    right: -80px;
    top: 0;
    transform-origin: left;
    transform: rotateY(90deg);
  }
  &-before {
    left: 0;
    top: 0;
    transform-origin: center;
    /* -webkit-transform: rotateX(-90deg); */
  }
  &-after {
    left: 0;
    top: 0;
    transform: translateZ(-80px) rotateX(180deg);
  }
  @keyframes xd {
    0% {
      transform: rotateX(0deg) rotateY(0deg);
    }
    100% {
      transform: rotateX(360deg) rotateY(360deg);
    }
  }
}
</style>
