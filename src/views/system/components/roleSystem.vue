<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="float: left">
      <el-form-item label="创建时间" size="mini">
        <el-date-picker v-model="search.date" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="角色名" size="mini">
        <el-input v-model="search.roleName" placeholder="角色名" clearable></el-input>
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
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="openDialogUpdate(scope.row)" type="text" size="small">
            编辑
          </el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="你确定删除该用户吗?" @confirm="deleteRole(scope.row)">
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
    <el-dialog title="角色" :visible.sync="showDialog" width="20%" :close-on-click-modal="false">
      <el-form ref="form" label-width="80px">
        <el-form-item label="角色名" size="mini">
          <el-input v-model="roleInfo.role_name"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="roleInfo.remark" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-scrollbar style="height: 150px" wrap-style="overflow-x:hidden;">
            <el-tree :data="menuList" default-expand-all show-checkbox highlight-current node-key="id" ref="menuTree">
            </el-tree>
          </el-scrollbar>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="powerInfo()">
          {{ power === "insert" ? "新 增" : "更 新" }}
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
      search: {
        date: null,
        roleName: ''
      },
      roleInfo: {
        id: '',
        role_id: '',
        role_name: '',
        remark: ''
      },
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      tableData: [],
      tableHearder: [
        { label: '角色名', value: 'role_name' },
        { label: '权限描述', value: 'remark' },
        { label: '创建时间', value: 'create_time' }
      ],
      showDialog: false,
      menuList: [],
      power: ''
    }
  },
  mounted () {
    this.getRoleList()
    this.getRoute()
  },
  methods: {
    handleSearch () {
      this.getRoleList()
    },
    // 获取角色列表
    getRoleList () {
      let startTime = ''
      let endTime = ''
      if (this.search.date !== null) {
        startTime = moment(this.search.date[0]).format('yyyy-MM-DD 00:00:00')
        endTime = moment(this.search.date[1]).format('yyyy-MM-DD 23:59:59')
      }
      this.$http.post('/api/role/getRoleList', {
        start_time: startTime,
        end_time: endTime,
        role_name: this.search.roleName,
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
    // 获取路由
    getRoute () {
      const route = this.$router.options.routes
      const children = route[2].children
      const menuList = []
      let id = 1
      children.forEach((menu) => {
        menuList.push({
          id: id,
          label: menu.nameCN,
          path: menu.path,
          show: false
        })
        id++
      })
      this.menuList = menuList
    },
    // 新增角色
    insertRole () {
      // 判断是否输入角色名
      if (this.roleInfo.role_name === null || this.roleInfo.role_name === '') {
        this.$message({
          message: '请输入角色名',
          type: 'warning'
        })
        return
      }

      this.$http.post('/api/role/insert', {
        role_name: this.roleInfo.role_name,
        menu_json: this.getMenuJson(),
        remark: this.roleInfo.remark
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
    // 更新角色
    updateRole () {
      this.$http.post('/api/role/update', {
        id: this.roleInfo.id,
        role_id: this.roleInfo.role_id,
        role_name: this.roleInfo.role_name,
        menu_json: this.getMenuJson(),
        remark: this.roleInfo.remark
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
    // 删除角色
    deleteRole (row) {
      this.$http.post('/api/role/delete', {
        id: row.id
      }).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.$message({
            message: data.message,
            type: data.status === true ? 'success' : 'warning'
          })
          this.handleSearch()
        }
      })
    },
    // 新增/编辑功能选择
    powerInfo () {
      if (this.power === 'insert') {
        this.insertRole()
      } else if (this.power === 'update') {
        this.updateRole()
      }
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
    },
    // 打开新增dialog
    openDialog () {
      this.power = 'insert'
      this.showDialog = true
      this.roleInfo = {
        id: '',
        role_id: '',
        role_name: '',
        remark: ''
      }
      this.$nextTick(() => {
        this.$refs.menuTree.setCheckedKeys([])
      })
    },
    // 点开编辑dialog
    openDialogUpdate (row) {
      const menuList = JSON.parse(row.menu_json)
      const checkMenu = []
      for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].show === true) {
          checkMenu.push(i + 1)
        }
      }

      this.power = 'update'
      this.showDialog = true
      console.log(checkMenu)
      this.$nextTick(() => {
        this.$refs.menuTree.setCheckedKeys(checkMenu)
      })
      this.roleInfo = {
        id: row.id,
        role_id: row.role_id,
        role_name: row.role_name,
        remark: row.remark
      }
    },
    // 获取menu_json
    getMenuJson () {
      // 获取选中菜单tree 节点
      const checkedKeys = this.$refs.menuTree.getCheckedKeys()
      let menuList = []

      this.menuList.forEach((menu) => {
        if (checkedKeys.indexOf(menu.id) !== -1) {
          menuList.push({
            route: menu.path,
            name: menu.label,
            show: true
          })
        } else {
          menuList.push({
            route: menu.path,
            name: menu.label,
            show: false
          })
        }
      })

      menuList = JSON.stringify(menuList)
      return menuList
    }
  }
}
</script>
<style scoped>
</style>
