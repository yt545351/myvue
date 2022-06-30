<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="用户管理" name="user">
      <UserSystem v-if="activeName === 'user'"></UserSystem>
    </el-tab-pane>
    <el-tab-pane label="角色管理" name="role">
      <RoleSystem v-if="activeName === 'role'"></RoleSystem>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import UserSystem from '@/views/system/components/userSystem'
import RoleSystem from '@/views/system/components/roleSystem'
export default {
  components: {
    UserSystem,
    RoleSystem
  },
  data () {
    return {
      activeName: 'user'
    }
  },
  mounted () { },
  methods: {}
}
</script>
<style scoped>
</style>
