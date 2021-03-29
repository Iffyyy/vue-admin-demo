<template>
  <div class="app-container">
    <fence-progress />
    <gradient-progress />
    <self-progress :percentage="80" :stroke-width="18" />
    <self-progress type="dashboard" :stroke-width="14" stroke-linecap="round" :percentage="80" :width="100" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { requestAllFile } from '@/utils/index'

const modulesFiles = require.context('./', true, /.vue$/)

@Component({
  name: 'Progress',
  components: requestAllFile(modulesFiles)
})
export default class extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
