<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="float: left">
      <el-form-item label="角色" size="mini">
        <el-select v-model="userInfo.role_id" clearable>
          <el-option v-for="item in roleList" :key="item.role_id" :value="item.role_id" :label="item.role_name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名" size="mini">
        <el-input v-model="userInfo.username" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" @click="handleSearch()">查询</el-button>
        <el-button type="primary" @click="openDialog()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" height="619" :header-cell-style="{
      background: '#eee',
      color: '#606266',
      fontSize: '12px',
    }" stripe highlight-current-row>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column v-for="item in tableHearder" :key="item.value" :label="item.label" :prop="item.value"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="item.value === 'role_id'">
            {{ roleMap[scope.row[item.value]] }}
          </span>
          <span v-else>{{ scope.row[item.value] }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="openDialogUpdate(scope.row)" type="text" size="small">
            编辑
          </el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="你确定删除该用户吗?" @confirm="deleteUser(scope.row)">
            <el-button slot="reference" style="color: red" type="text" size="small">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize">
    </el-pagination>
    <el-dialog title="用户" :visible.sync="showDialog" width="30%" :close-on-click-modal="false">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <span>用户名:</span>
          <el-input v-model="user.username" style="width: 150px" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <span>密&nbsp;&nbsp;&nbsp;&nbsp;码:</span>
          <el-input v-model="user.password" type="password" style="width: 150px" clearable></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item>
          <span>电&nbsp;&nbsp;&nbsp;&nbsp;话:</span>
          <el-input v-model="user.tell" style="width: 150px" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <span>角&nbsp;&nbsp;&nbsp;&nbsp;色:</span>
          <el-select v-model="user.role_id" style="width: 150px" clearable>
            <el-option v-for="item in roleList" :key="item.role_id" :label="item.role_name" :value="item.role_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="operation === 1" type="primary" @click="insertUser()">
          新 增
        </el-button>
        <el-button v-if="operation === 2" type="primary" @click="updateUser()">
          更 新
        </el-button>
        <el-button @click="showDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      userInfo: {
        username: '',
        role_id: ''
      },
      user: {
        id: '',
        username: '',
        password: '',
        tell: '',
        role_id: ''
      },
      roleList: [],
      roleMap: {},
      tableHearder: [
        { label: '用户名', value: 'username' },
        { label: '角色', value: 'role_id' },
        { label: '电话', value: 'tell' },
        { label: '创建时间', value: 'create_time' }
      ],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      tableData: [],
      showDialog: false,
      operation: 1
    }
  },
  created () {
    this.getRoleList()
  },
  mounted () {
    this.handleSearch()
  },
  methods: {
    handleSearch () {
      this.getUserInfoList()
    },
    // 获取用户列表
    getUserInfoList () {
      this.$http.post('/api/user/getUserInfoList', {
        username: this.userInfo.username,
        role_id: this.userInfo.role_id,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          data.list.forEach((item) => {
            item.create_time = moment(item.create_time).format(
              'yyyy-MM-DD HH:mm:ss'
            )
          })
          this.tableData = data.list
          this.totalSize = data.totalRows
        }
      })
    },
    // 获取角色列表
    getRoleList () {
      this.$http.post('/api/role/getRoleList', {}).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          const roleMap = {}
          data.forEach((item) => {
            roleMap[item.role_id] = item.role_name
          })
          this.roleList = data
          this.roleMap = roleMap
        }
      })
    },
    // 新增
    insertUser () {
      this.$http.post('/api/user/insert', {
        username: this.user.username,
        password: this.user.password,
        tell: this.user.tell,
        role_id: this.user.role_id
      }).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.$message({
            message: data.msg,
            type: data.status === true ? 'success' : 'warning'
          })
          if (data.status === true) {
            this.showDialog = false
            this.handleSearch()
          }
        }
      })
    },
    // 修改
    updateUser () {
      this.$http.post('/api/user/update', {
        id: this.user.id,
        username: this.user.username,
        password: this.user.password,
        tell: this.user.tell,
        role_id: this.user.role_id
      }).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.$message({
            message: data.message,
            type: data.status === true ? 'success' : 'warning'
          })
          this.showDialog = false
          this.handleSearch()
        }
      })
    },
    deleteUser (row) {
      this.$http.post('/api/user/delete', {
        id: row.id
      }).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.$message({
            message: data.message,
            type: data.status === true ? 'success' : 'warning'
          })
          this.showDialog = false
          this.handleSearch()
        }
      })
    },
    // 打开编辑dialog
    openDialogUpdate (row) {
      this.showDialog = true
      this.operation = 2
      this.user.id = row.id
      this.user.username = row.username
      this.user.password = row.password
      this.user.tell = row.tell
      this.user.role_id = row.role_id
    },
    // 打开dialog
    openDialog () {
      this.showDialog = true
      this.operation = 1
      this.user.id = ''
      this.user.username = ''
      this.user.password = ''
      this.user.tell = ''
      this.user.role_id = ''
    },
    // 选择每页记录数
    handleSizeChange (val) {
      this.pageSize = val
      this.handleSearch()
    },
    // 选择页码
    handleCurrentChange (val) {
      this.pageNum = val
      this.handleSearch()
    }
  }
}
</script>
<style scoped>
</style>
