<template>
  <div class="container">
    <div class="item">
      <!-- <div class="line" /> -->
      <div class="cicle" />
      <div class="cicle cicle1" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container{
  filter: contrast(120%);
  .item{
    margin: 10px;
    position: relative;
    width: 40px;
    height: 100px;
    background: linear-gradient(90deg,#6e0009,#e64743,#6e0009);

    &::before,&::after{
      content: '';
      position: absolute;
      display: inline-block;
      width: 38px;
      height: 20px;
      border-radius: 50%;
    }

    &::before{
      width: 40px;
      top: -10px;
      background: linear-gradient(90deg,#6e0009,#e64743,#6e0009);
    }

    &::after{
      left: 1px;
      bottom: -9px;
      background: #9f6f2d;
      border: 1px solid #58301b;
      outline: 1px solid #9f6f2d;
    }
  }

  .line{
    position: absolute;
    width: 1px;
    height: 30px;
    background: black;
    top: -20px;
    z-index: -1;
    left: 50%;
  }

  .cicle{
    position: absolute;
    top: -6px;
    width: 100%;
    height: 20px;
    background: linear-gradient(90deg,#9f6f2d,#dfa351,#9f6f2d);
    border-radius: 50%;

    &::before{
      content: '';
      position: absolute;
      display: inline-block;
      top: 3px;
      width: 100%;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(90deg,#6e0009,#e64743,#6e0009);
    }

    &.cicle1{
      top: 82px;
    }
  }
}
</style>
