<template>
  <div class="app-container">
    <p>基础按钮</p>
    <el-row>
      <el-button>默认按钮</el-button>
      <el-button type="primary">主要按钮</el-button>
      <el-button type="success">成功按钮</el-button>
      <el-button type="info">信息按钮</el-button>
      <el-button type="warning">警告按钮</el-button>
      <el-button type="danger">危险按钮</el-button>
    </el-row>

    <el-row>
      <el-button plain>朴素按钮</el-button>
      <el-button type="primary" plain>主要按钮</el-button>
      <el-button type="success" plain>成功按钮</el-button>
      <el-button type="info" plain>信息按钮</el-button>
      <el-button type="warning" plain>警告按钮</el-button>
      <el-button type="danger" plain>危险按钮</el-button>
    </el-row>

    <el-row>
      <el-button round>圆角按钮</el-button>
      <el-button type="primary" round>主要按钮</el-button>
      <el-button type="success" round>成功按钮</el-button>
      <el-button type="info" round>信息按钮</el-button>
      <el-button type="warning" round>警告按钮</el-button>
      <el-button type="danger" round>危险按钮</el-button>
    </el-row>

    <el-row>
      <el-button icon="el-icon-search" circle />
      <el-button type="primary" icon="el-icon-edit" circle />
      <el-button type="success" icon="el-icon-check" circle />
      <el-button type="info" icon="el-icon-message" circle />
      <el-button type="warning" icon="el-icon-star-off" circle />
      <el-button type="danger" icon="el-icon-delete" circle />
    </el-row>
    <p>点击效果</p>
    <el-row>
      <el-button v-waves type="primary">主要按钮</el-button>
      <el-button v-bubbly class="bubbly-button">Click me!</el-button>
      <button class="btn-cube" data-text="3D条纹描边">3D条纹描边</button>
    </el-row>
    <p>鼠标移入效果</p>
    <el-row class="flex-center-start">
      <el-button v-waves type="primary" class="btn-hover">主要按钮</el-button>
      <div v-waves class="btn-hover1" data-name="Hover Me" />
      <el-button class="btn-hover2">Rectangle</el-button>
      <el-button class="btn-hover3"> Both </el-button>
    </el-row>
    <p>环绕效果</p>
    <el-row>
      <el-button type="primary" class="btn-around">主要按钮</el-button>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
@import '~@/styles/element-variables.scss';

.el-row {
  margin-bottom: 10px;
}

.btn-cube {
  $height: 50px;
  $border-color: #5f1717;
  $text-shadow-color: $border-color;
  $text-shadow-size: 7px;
  $border-size: 3px;
  $border-bg-color: #f6566d;

  height: $height;
  line-height: $height;
  padding: 0 $height / 2;
  border-radius: $height / 2;
  border: none;
  outline: none;
  box-shadow: 0 0 0 $border-size $border-color, 0 0 0 $border-size * 3 #fff, 0 0 0 $border-size * 4 $border-color;
  font-size: 28px;
  -webkit-text-stroke: $text-shadow-size $text-shadow-color;
  background-color: #fee64d;
  position: relative;
  cursor: pointer;
  user-select: none;
  margin-left: 20px;

  &::before {
    content: attr(data-text);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    -webkit-text-stroke: 0px #fff;
    color: #fff;
    z-index: 1;
    position: absolute;
  }

  &::after {
    content: '';
    top: 0;
    left: 0;
    width: calc(100% + 16px);
    height: calc(100% + 20px);
    border-radius: $height / 2 + $border-size * 2;
    border: $border-size solid $border-color;
    background-image: repeating-linear-gradient(45deg, $border-color 0 $border-size, $border-bg-color 0 1em);
    z-index: -1;
    position: absolute;
  }

  &:active {
    transform: translate($border-size * 2, $border-size * 2);
    &::after {
      opacity: 0;
    }
  }
}

.btn-hover {
  position: relative;
  transition: 600ms ease all;
  border: none;

  &:hover {
    background: none;
    color: $--color-primary;

    &:before,
    &:after {
      width: 100%;
      transition: 600ms ease all;
      background: $--color-primary;
      // background: $btnColor;
    }
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    height: 2px;
    width: 0;
    transition: 400ms ease all;
  }

  &::after {
    right: inherit;
    top: inherit;
    left: 0;
    bottom: 0;
  }
}

.btn-hover1 {
  position: relative;
  overflow: hidden;
  padding: 0;
  width: 106px;
  height: 46px;
  line-height: 100px;
  text-align: center;

  &::after {
    content: attr(data-name);
    position: absolute;
    top: 2px;
    bottom: 2px;
    right: 2px;
    left: 2px;
    line-height: 38px;
    font-size: 20px;
    background: #fff;
    border: 2px solid #eee;
    cursor: pointer;
    color: yellowgreen;
    border-radius: 4px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: -20px;
    left: 0px;
    background: #fff;
    transform: rotateZ(-90deg) translate(-100%, -100%);
    transform-origin: top left;
    transition: transform 0.3s;
    transition-timing-function: linear;
  }
  &:hover::before {
    transform: rotateZ(0deg) translate(0%, -0%);
  }
}

.btn-hover2 {
  $width: 2px;
  display: inline-block;
  position: relative;
  border: none;
  box-shadow: inset 0 0 0 $width #fff;
  cursor: pointer;
  transition: color 1s;
  background: transparent;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
    box-sizing: border-box;
    // transition: width .5s, height .5s;
    // transition-delay: .5s, 0s;
    border: $width solid transparent;
  }

  &::after {
    top: unset;
    left: unset;
    right: 0;
    bottom: 0;
  }

  &:hover {
    color: #00e2ff;

    &::before {
      transition: width 0.25s, height 0.25s, border-bottom-color 0s;
      transition-delay: 0.25s, 0s, 0.25s;
      width: 100%;
      height: 100%;
      border-left: $width solid #00e2ff;
      border-bottom: $width solid #00e2ff;
    }

    &::after {
      transition: width 0.25s, height 0.25s, border-top-color 0.25s;
      transition-delay: 0.75s, 0.5s, 0.75s;
      width: 100%;
      height: 100%;
      border-top: $width solid #00e2ff;
      border-right: $width solid #00e2ff;
    }
  }
}

.btn-hover3 {
  $width: 2px;
  display: inline-block;
  position: relative;
  border: none;
  box-shadow: inset 0 0 0 $width #fff;
  cursor: pointer;
  transition: color 1s;
  background: transparent;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
    box-sizing: border-box;
    // transition: width .5s, height .5s;
    // transition-delay: .5s, 0s;
    border: $width solid transparent;
  }

  &:hover {
    color: #00e2ff;

    &::before {
      transition: width 0.5s, height 0.5s, border-bottom-color 0s;
      transition-delay: 0.5s, 0s, 0.5s;
      width: 100%;
      height: 100%;
      border-left: $width solid #00e2ff;
      border-bottom: $width solid #00e2ff;
    }

    &::after {
      transition: width 0.5s, height 0.5s, border-right-color 0.5s;
      transition-delay: 0s, 0.5s, 0.5s;
      width: 100%;
      height: 100%;
      border-top: $width solid #00e2ff;
      border-right: $width solid #00e2ff;
    }
  }
}

.btn-around {
  position: relative;
  box-shadow: inset 0 0 0 1px rgba(105, 202, 98, 0.5);
  margin: 10px;

  $width: 104px;
  $height: 46px;
  $color: #69ca62;
  $gap: 4px;
  $line: 2px;
  @keyframes clipMe {
    0%,
    100% {
      clip: rect(0px, $width + $gap, $line, 0px);
    }
    25% {
      clip: rect(0px, $line, $height, 0px);
    }
    50% {
      clip: rect($height - $line, $width + $gap, $height + $gap, 0);
    }
    75% {
      clip: rect(0px, $width + $gap, $height, $width - $line);
    }
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 11;
    margin: -$gap;
    box-shadow: inset 0 0 0 $line $color;
    animation: clipMe 8s linear infinite;
    background: none !important;
    /* background-color: rgba(255, 0, 0, 0.3)!important; */
  }
  &::before {
    animation-delay: -4s;
  }
  &:hover::after,
  &:hover::before {
    background-color: rgba(255, 0, 0, 0.3);
  }
}
</style>
