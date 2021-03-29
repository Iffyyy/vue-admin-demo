<template>
  <!-- <div class="gradient-progress">
    <div class="bar overflow" />
  </div> -->
  <div class="progress-outer">  <!--更好的扩展-->
    <div class="progress-enter">
      <div class="progress-bg" />
    </div>
    <!-- <span>60%</span> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'GradientProgress'
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.gradient-progress {
  display: flex;

  .bar {
    position: relative;
    width: 400px;
    height: 20px;
    margin: 10px 0;
    border-radius: 20px;
    // border: 1px solid #000;
    background: #ffba01;

    &::before {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      width: 400px;
      height: 85px;
      background: repeating-linear-gradient(45deg, #f06a0e, #f06a0e 10px, transparent 11px, transparent 19px, #f06a0e 20px);
      background-position: 0 0;
      background-repeat: no-repeat;
      animation: move 1.6s linear infinite;
    }
  }

  .overflow {
    overflow: hidden;
  }

  @keyframes move {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 0 -56px;
    }
  }
}
  .progress-outer {
    width: 60%; height: 12px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }
  .progress-enter {
    height: inherit;
    background: rgba(180, 160, 120, .2);
  }
  .progress-bg {
    width: 60%; height: inherit;
    border-radius: 6px;
    background: repeating-linear-gradient(-45deg, #D9CFBB  25%, #C3B393 0, #C3B393 50%,
                    #D9CFBB 0, #D9CFBB 75%, #C3B393 0);
    background-size: 16px 16px;
    animation: panoramic 20s linear infinite;
  }
  @keyframes panoramic{
    to {
      background-position: 200% 0;
    }
  }
</style>
