<template>
  <div>
    <el-input v-model="content" style="width:100%" placeholder="" type="textarea" rows="20" @change="editIt" />
    <el-button type="primary" @click.native="editIt">转换JSON</el-button>
    <el-input v-model="result" style="width:100%" placeholder="" type="textarea" rows="20" />

  </div>
</template>

<script>
export default {
  data() {
    return {
      content: '',
      result: ''
    }
  },
  methods: {
    editIt() {
      this.result = JSON.stringify(
        // eslint-disable-next-line no-tabs
        this.content.split('	 ').map(item => {
          // eslint-disable-next-line no-tabs
          const data = item.split(' ')
          console.log(data)

          return data
        })
      )
      console.log(this.content.split('\n'), 111)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
