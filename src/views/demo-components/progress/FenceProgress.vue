<template>
  <div class="fence-progress">
    <div class="outside">
      <div class="inside" :style="'width:'+ 80 + '%'" />
    </div>
    <span>{{ 80 }}%</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'FenceProgress'
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped>
.fence-progress {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22px;
  font-weight: bold;
  padding: 0 10px;
  margin: 20px;
  width: 400px;

  .outside {
    $height: 23px;
    $split: 13px;
    width: 82%;
    height: $height;
    background: rgba($yellow, 0.2);
    mask: linear-gradient(to right, #000 10px, transparent 10px) repeat-x;
    mask-size: $split $height, $height $split, $split $height, $height $split;

    .inside {
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(250, 204, 34, 0) 0%,
        rgba(250, 204, 34, 1) 40%,
        $yellow
      );
      mask: linear-gradient(to right, #000 10px, transparent 10px) repeat-x;
      mask-size: $split $height, $height $split, $split $height, $height $split;

      /* animation: rateMove 2s; */
    }
  }
}
</style>
