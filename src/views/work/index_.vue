<template>
  <el-tabs v-model="activeName" @tab-click="checkTab()">
    <el-tab-pane label="我的申请" name="myWork">
      <MyWork ref="myWork"></MyWork>
    </el-tab-pane>
    <el-tab-pane label="候选申请" name="candidateWork">
      <CandidateWork ref="candidateWork"></CandidateWork>
    </el-tab-pane>
    <el-tab-pane label="申请列表" name="workList">
      <WorkList ref="workList"></WorkList>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import MyWork from '@/views/work/components/myWork'
import CandidateWork from '@/views/work/components/candidateWork'
import WorkList from '@/views/work/components/workList'
export default {
  components: {
    MyWork,
    CandidateWork,
    WorkList
  },
  data () {
    return {
      activeName: 'myWork'
    }
  },
  mounted () { },
  methods: {
    checkTab () {
      if (this.activeName === 'myWork') {
        this.$refs.myWork.getAllProcess()
      } else if (this.activeName === 'candidateWork') {
        this.$refs.candidateWork.getCandidateTaskList()
      } else if (this.activeName === 'workList') {
        this.$refs.workList.queryTaskList()
      }
    }
  }
}
</script>
<style scoped>
</style>
