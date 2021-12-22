<template>
  <div class="cube">
    <div class="cube-inner">
      <div class="cube-face cube-up">up</div>
      <div class="cube-face cube-down">down</div>
      <div class="cube-face cube-left">left</div>
      <div class="cube-face cube-right">right</div>
      <div class="cube-face cube-before">before</div>
      <div class="cube-face cube-after">after</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  name: 'magic'
})
export default class magic extends Vue { }
</script>
<style scoped lang="scss">
$width: 80px;
.cube {
  width: $width;
  height: $width;
  position: absolute;
  z-index: 0;
  top: 200px;
  left: 400px;
  transform: scale(0.6);
  &-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(20deg) rotateZ(45deg);
    background: white;
  }
  $color: #02fff6;
  $color1: #98fdf0;
  $lightColor: #b6fff5;
  &-face {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba($color, 0.7), rgba($color1, 0.8));
    background-blend-mode: screen;
    border: 1px solid $lightColor;
    box-shadow: inset 0 0 2px rgba($lightColor, 1), 0 0 2px rgba($lightColor, 1);
    text-align: center;
    line-height: $width;
    color: transparent;
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
    top: -$width;
    transform: rotateX(90deg);
    transform-origin: bottom;
  }
  &-down {
    left: 0;
    top: $width;
    transform-origin: top;
    transform: rotateX(-90deg);
  }
  &-left {
    left: -$width;
    top: 0;
    transform-origin: right;
    transform: rotateY(-90deg);
  }
  &-right {
    right: -$width;
    top: 0;
    transform-origin: left;
    transform: rotateY(90deg);
  }
  &-before {
    left: 0;
    top: 0;
  }
  &-after {
    left: 0;
    top: 0;
    transform: translateZ(-$width) rotateX(180deg);
  }
}
</style>
