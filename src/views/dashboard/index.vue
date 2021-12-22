<template>
  <div class="dashboard-container flex-start-start-column">
    暂无
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'Dashboard'
})
export default class extends Vue {
  get name() {
    return UserModule.name
  }

  get roles() {
    return UserModule.roles
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    a{
      font-size: 18px;
      line-height: 30px;
      color: rgb(6, 6, 141);

      &:hover{
        color: rgb(46, 46, 207);
      }
    }
  }
}
</style>
