<template>
  <div class="app-container">
    <p>Material Design 的input</p>
    <div class="white-item">
      <material-input
        id="material-input-demo"
        v-model="title"
        icon="el-icon-search"
        name="title"
        placeholder="输入标题"
        type="tel"
      >
        标题
      </material-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import MaterialInput from '@/components/MaterialInput/index.vue'

@Component({
  components: { MaterialInput }
})
export default class extends Vue {
  private title=''
}
</script>

<style lang="scss" scoped>
@import '~@/styles/element-variables.scss';

.el-row {
  margin-bottom: 10px;
}

.white-item{
  background: white;
  width: 400px;
  height: 200px;
  padding: 20px;
}
</style>
