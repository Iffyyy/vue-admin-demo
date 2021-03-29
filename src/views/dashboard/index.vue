<template>
  <div class="dashboard-container flex-start-start-column">
    <a href="http://101.132.162.18/villageStandard/#/login" target="_blank" rel="noopener">智慧社区综合管理平台（账号：手机号18800204167，密码：123456）</a>
    <a href="http://101.132.162.18/property/#/login" target="_blank" rel="noopener">红色物业智慧房管平台（账号：admin，密码：123456）</a>
    <a href="http://139.196.240.47/refuse/#/login" target="_blank" rel="noopener">智能垃圾分类监管服务系统（账号：admin，密码：123456）</a>
    <a href="http://192.168.0.81/throw/?#/login" target="_blank" rel="noopener">社区高空抛物监管服务平台（账号：15021245602，密码：123456）</a>
    <a href="http://101.132.162.18/carAdmin/#/login" target="_blank" rel="noopener">智慧车管综合管理平台（账号：admin/手机号，密码：123456）</a>
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
