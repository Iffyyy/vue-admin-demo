<template>
  <div class="chart chart__pie">
    <p>
      饼图主要用于表现不同类目的数据在总和中的占比。每个的弧度表示数据数量的比例。
    </p>
    <div>3D饼图</div>
    <cube-pie :data="chartData" />
    <div>其他饼图</div>
    <div class="flex">
      <status-pie :data="chartData" />
      <!-- <gap-pie /> -->
      <rose-pie :data="chartData" />
    </div>
    <div>栅栏饼图</div>
    <div class="flex">
      <fence-pie :data="chartData" />
      <fence-pie :data="chartData" cid="fence2" class="fence2" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

const modulesFiles = require.context('@/components/Charts/pie', true, /.vue$/)
const modules: { [key: string]: any} = modulesFiles
  .keys()
  .reduce((modules, modulePath) => {
    const moduleName: string = modulePath.replace(/^.\/(.*)\.vue/, '$1')
    const value = modulesFiles(modulePath)
    modules[moduleName] = value.default
    return modules
  }, {} as { [key: string]: any})
@Component({
  name: 'PieChart',
  components: modules
})
export default class extends Vue {
  private chartData=[{
    name: '系列1',
    value: 30
  }, {
    name: '系列2',
    value: 65
  }, {
    name: '系列3',
    value: 13
  }]
}
</script>

<style lang="scss" scoped>

.chart__pie{

  .fence2{
    transform: perspective(400px) rotateX(70deg);
  }
}

</style>
