<template>
  <div class="app-container">
    <div class="flex-center-start">
      <p>数字动画</p>
      <el-button style="margin-left:20px" type="primary" @click="changeNumber">改变</el-button>
    </div>
    <div class="flex-center-start">
      <TransformNum class="num" :num="number" :size="38" />
      <CountNum class="marginleft4" :num="number" :size="38" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { requestAllFile } from '@/utils/index'

const modulesFiles = require.context('./', true, /.vue$/)

@Component({
  components: requestAllFile(modulesFiles)
})
export default class extends Vue {
  private number=(Math.random() * 1000).toFixed(0)

  private changeNumber() {
    this.number = (Math.random() * 1000).toFixed(0)
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/element-variables.scss';

.app-container{
  .num{
    font-size: 30px;
  }

}
</style>
