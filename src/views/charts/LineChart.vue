<template>
  <div class="chart chart__pie">
    <p>折线图</p>
    <trend-line />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { requestAllFile } from '@/utils/index'
const modulesFiles = require.context('@/components/Charts/line', true, /.vue$/)
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

}
</script>

<style scoped>

</style>
