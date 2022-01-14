<template>
  <div class="bianpao">
    <div class="main">
      <One v-for="item in 40" :key="item" />
      <One class="last-one" />
      <div class="fire" />
      <div class="spot-wrap">
        <div v-for="item in 50" :key="item" class="spot" />
      </div>
      <div class="suipian-wrap">
        <div v-for="item in 50" :key="item" class="suipian" />
      </div>
    </div>
  </div>
</template>

<script>
import One from './one.vue'
export default {
  components: {
    One
  }
}
</script>

<style lang="scss">
.bianpao {
  position: relative;
  width: 400px;
  height: 500px;
  margin: 0 auto;
  transform-origin: top;
  padding: 20px;
  overflow: hidden;
}
.main {
  width: 2px;
  height: 52.6%;
  background: black;
  margin: 40px auto;
  position: relative;
  box-shadow: 0 0 1px black;
  animation: ranshao 2s forwards;

  @keyframes ranshao {
    90%{
      opacity: 1;
      height: 80px;
    }
    100%{
      opacity: 0;
      height: 80px;
    }
  }

  .container {
    position: absolute;
    transform-origin: top;
    animation: drop 1s forwards;
  }

  @keyframes drop{
    80%,100%{
      transform: scale(0.3) rotate(0deg) translateY(2000px);
      opacity: 0;
    }
  }

  .container:nth-child(2n) {
    left: -28px;
  }
  .container:nth-child(2n + 1) {
    right: -28px;
  }

  .last-one {
    transform: scale(0.4) rotate(10deg);
    bottom: -126px;
  }

  @for $i from 1 through 20 {
    $angle: #{random(70) + 20}deg;
    @if ($i % 2 == 0) {
      $angle: -#{random(70) + 20}deg;
    }

    .container:nth-child(#{$i}) {
      top: 14px + $i * 8px;
      transform: scale(0.4) rotate($angle);
      animation-delay: #{(20 - $i)*0.08}s;
    }
  }

  @for $i from 20 through 40 {
    $angle: #{random(70) + 7}deg;
    @if ($i % 2 == 0) {
      $angle: -#{random(70) + 7}deg;
    }

    .container:nth-child(#{$i}) {
      top: 14px + ($i - 20) * 8px;
      transform: scale(0.4) rotate($angle);
      animation-delay: #{(40 - $i)*0.1}s;
    }
  }
}

.fire{
  width: 4px;
  height: 4px;
  bottom: 0;
  background: red;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 4px red,0 0 10px red,0 0 20px red;
  border-radius: 50%;
}

$yellow: #fdf410;
.spot-wrap {
  position: absolute;
  bottom: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  .spot {
    position: absolute;
    background: radial-gradient(rgba($yellow, 0.6), rgba($yellow, 0.1));
    box-shadow: 0 0 20px rgba($yellow, 0.6);
    border-radius: 50%;
    animation: twikle 1.2s infinite alternate;
  }

  @for $i from 1 through 50 {
    .spot:nth-child(#{$i}) {
      width: #{random($limit: 20) + 20}px;
      height: #{random($limit: 20) + 16}px;
      top: #{random($limit: 150) + 10}px;
      left: #{random($limit: 160) + 10}px;
      animation-delay: -#{random($limit: 4)}s;
    }
  }

  @keyframes twikle {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }
}

.suipian-wrap {
  position: absolute;
  bottom: -160px;
  left: 50%;
  transform: translateX(-50%);
  width: 160px;
  height: 160px;

  .suipian {
    position: absolute;
  }

  @for $i from 1 through 50 {
    .suipian:nth-child(#{$i}) {
      width: #{random($limit: 6) + 8}px;
      height: #{random($limit: 6) + 8}px;
      top: #{random($limit: 120) + 6}px;
      left: #{random($limit: 120) + 6}px;
      background: rgba(random(100) + 155, random(100), random(100), 1);

      @if ($i % 3 == 0) {
        clip-path: polygon(#{random($limit: 100)}% 0%, #{random($limit: 100)}% 10%, #{random($limit: 100)}% 80%, 0% 60%);
      } @else if($i % 4 == 0) {
        clip-path: polygon(#{random($limit: 100)}% 0%, #{random($limit: 100)}% 10%, #{random($limit: 100)}% 40%, 0% 20%);
      } @else if($i % 10 == 0) {
        clip-path: circle(24%);
      } @else {
        clip-path: polygon(#{random($limit: 40)}% 0%, #{random($limit: 100)}% 10%, #{random($limit: 100)}% 80%, #{random($limit: 80)}% 60%, 0% 20%);
      }

      animation: move#{$i} .8s infinite;
      animation-delay: -#{random($limit: 4)}s;

      $der: #{random($limit: 100)}px;
      @if ($i % 2 == 0) {
        $der: -#{random($limit: 100)}px;
      }
      @keyframes move#{$i} {
        30%{
          transform: translate($der,-#{random($limit: 100)}px);
          opacity: 0.8;
        }
        100%{
          transform: translate($der,#{random($limit: 200) + 10}px);
          opacity: 0;
        }
      }
    }
  }
}
</style>
