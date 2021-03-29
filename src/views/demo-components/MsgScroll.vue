<template>
  <div class="scroll">
    <p>纵向滚动</p>
    <div v-scroll class="scroll-list">
      <div v-for="(item,index) in scrollList" :key="index" class="scroll-item" :class="{active: current===index}" @click="viewDetail(index)">
        {{ index }}
      </div>
      <div v-for="(item,index) in scrollList" :key="index+100" class="scroll-item" :class="{active: current===index}" @click="viewDetail(index)">
        {{ index }}
      </div>
    </div>
    <p>横向滚动</p>
    <div v-scroll="'horizontal'" class="scroll-list-horizontal">
      <div v-for="(item,index) in scrollList" :key="index" class="scroll-item" :class="{active: current===index}" @click="viewDetail(index)">
        {{ index }}
      </div>
      <div v-for="(item,index) in scrollList" :key="index+10" class="scroll-item" :class="{active: current===index}" @click="viewDetail(index)">
        {{ index }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'

@Component({
  name: 'MsgScroll'
})
export default class extends Vue {
  private current=0
  private scrollList = new Array(6).fill({
    name: '可疑人员预警',
    time: '2020/06/30  12:00',
    location: '一号楼三单元二号点位',
    status: 1
  })

  private viewDetail(index:number) {
    console.log(index)
    this.current = index
  }
}
</script>

<style lang="scss" scoped>
.scroll {

  .scroll-item {
    width: 409px;
    height: 144px;
    margin-top: 12px;
    background: pink;
    color: white;
    font-size: 30px;
    text-align: center;

    &.active {
      background: orange;
    }
  }

  .scroll-list {
    width: 420px;
    height: 400px;
    letter-spacing: 1px;

    & ::v-deep {
      .el-scrollbar__wrap,
      .el-scrollbar__view {
        overflow-x: hidden;
      }
    }

    /* overflow-y: scroll; */

    &-horizontal{
      height: 184px;

      .scroll-item{
        margin-right: 12px;
      }
      /* display: flex; */
    }
  }
}

</style>
