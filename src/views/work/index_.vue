<template>
    <el-tabs v-model="activeName">
        <el-tab-pane label="我的申请" name="myWork">
            <MyWork></MyWork>
        </el-tab-pane>
        <el-tab-pane label="测试" name="test">

        </el-tab-pane>
    </el-tabs>
</template>
<script>
import MyWork from '@/views/work/components/myWork'
export default {
  components: {
    MyWork
  },
  data () {
    return {
      activeName: 'myWork'
    }
  },
  mounted () { },
  methods: {}
}
</script>
<style scoped>
</style>
