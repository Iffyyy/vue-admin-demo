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
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Tree as ElTree } from 'element-ui'
import { TreeData } from 'element-ui/types/tree'

@Component({
  name: 'Magic'
})
export default class extends Vue {}
</script>
<style lang="scss" scoped>
.nh-cube {
  width: 240px;
  height: 240px;
  position: absolute;
  z-index: 0;
  left: 50%;
  top: 50%;
  margin: -194px 0 0 -120px;
  transform-origin: 50% 50% -120px;
  transform-style: preserve-3d;
  transform: scale(0.6);
  animation: xd 10s linear infinite;

  &-inner {
    width: 240px;
    height: 240px;
    position: relative;
    -webkit-transform-style: preserve-3d;
    transition: 0.3s;
    transform-origin: 50% 50% -120px;
    -webkit-perspective: 100000px;
    perspective: 100000px;
    transform: rotateX(20deg) rotateZ(45deg);
  }

  &-face {
    position: absolute;
    width: 240px;
    height: 240px;
    border: 1px dashed #00ccff;
    background: rgba(0, 173, 255, 0.1);
    background-blend-mode: screen;
    box-shadow: inset 0 0 30px rgba(57, 117, 206, 0.59), 0 0 30px rgba(0, 103, 255, 0.84);

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      width: 10px;
      height: 10px;
      border-color: #00ccff;
      border-style: solid;
      border-top-width: 2px;
      border-bottom-width: 0;
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
    top: -240px;
    transform: rotateX(90deg);
    transform-origin: bottom;
  }

  &-down {
    left: 0;
    top: 240px;
    transform-origin: top;
    -webkit-transform: rotateX(-90deg);
  }
  &-left {
    left: -240px;
    top: 0;
    transform-origin: right;
    -webkit-transform: rotateY(-90deg);
  }
  &-right {
    right: -240px;
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
    -webkit-transform: translateZ(-240px) rotateX(180deg);
  }

  @keyframes xd {
    0%{
      transform: rotateX(0deg) rotateY(0deg);
    }
    100%{
      transform: rotateX(360deg) rotateY(360deg);
    }
  }
}
</style>
