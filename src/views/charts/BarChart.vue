<template>
  <div class="chart">
    <p>
      柱状图（或称条形图）是一种通过柱形的高度（横向的情况下则是宽度）来表现数据大小的一种常用图表类型。
    </p>
    <div>3D柱状图</div>
    <div class="flex">
      <cube-bar />
      <cube-bar1 />
    </div>
    <div>其他柱状图</div>
    <div class="flex">
      <round-bar />
      <warning-bar />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { requestAllFile } from '@/utils/index'

const modulesFiles = require.context('@/components/Charts/bar', true, /.vue$/)
@Component({
  name: 'BarChart',
  components: requestAllFile(modulesFiles)
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped>

</style>
