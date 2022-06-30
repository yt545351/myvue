<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="float: left">
      <el-form-item label="日期" size="mini">
        <el-date-picker v-model="search.date" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="标题" size="mini">
        <el-input v-model="search.title" placeholder="模糊搜索" clearable></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" @click="handleSearch()">查询</el-button>
        <el-button type="primary" @click="openDialog()"> 新增 </el-button>
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
          <el-button @click="openDialogShow(scope.row)" type="text" size="small">
            查看
          </el-button>
          <el-button @click="openDialogUpdate(scope.row)" type="text" size="small">
            编辑
          </el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="你确定删除该公告吗?" @confirm="deleteInfo(scope.row)">
            <el-button slot="reference" style="color: red" type="text" size="small">
              &nbsp;&nbsp;删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize">
    </el-pagination>
    <el-dialog title="公告" :visible.sync="showDialog" :close-on-click-modal="false">
      <el-form label-width="40px">
        <el-form-item label="标题">
          <el-input v-model="info.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="info.content" :autosize="{ minRows: 10, maxRows: 20 }" maxlength="10000"
            show-word-limit>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false"> 取 消 </el-button>
        <el-button type="primary" @click="powerInfo()">
          {{ power === "insert" ? "新 增" : "更 新" }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="showDialogShow">
      <el-input v-model="content" type="textarea" :autosize="{ minRows: 20, maxRows: 20 }" readonly></el-input>
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
        title: ''
      },
      info: {
        id: '',
        title: '',
        content: '',
        username: ''
      },
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      showDialog: false,
      showDialogShow: false,
      tableHearder: [
        { label: '标题', value: 'title' },
        { label: '内容', value: 'content' },
        { label: '创建人', value: 'username' },
        { label: '创建时间', value: 'create_time' }
      ],
      tableData: [],
      content: '',
      title: '',
      power: 'insert'
    }
  },
  mounted () {
    this.handleSearch()
  },
  methods: {
    handleSearch () {
      this.getDataList()
    },
    getDataList () {
      let startTime = null
      let endTime = null
      if (this.search.date !== null) {
        startTime = moment(this.search.date[0]).format('yyyy-MM-DD 00:00:00')
        endTime = moment(this.search.date[1]).format('yyyy-MM-DD 23:59:59')
      }
      this.$http.post('/api/proclamation/getList', {
        startTime: startTime,
        endTime: endTime,
        title: this.search.title
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
    insertInfo () {
      this.$http.post('/api/proclamation/insert', {
        title: this.info.title,
        content: this.info.content,
        username: sessionStorage.getItem('username')
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
    updataInfo () {
      this.$http.post('/api/proclamation/update', {
        id: this.info.id,
        title: this.info.title,
        content: this.info.content,
        username: this.info.username
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
    deleteInfo (row) {
      this.$http.post('/api/proclamation/delete', {
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
    // 选择每页记录数
    handleSizeChange (val) {
      this.pageSize = val
      this.getDataList()
    },
    // 选择页码
    handleCurrentChange (val) {
      this.pageNum = val
      this.getDataList()
    },
    openDialogShow (row) {
      this.showDialogShow = true
      this.content = row.content
      this.title = row.title
    },

    openDialog () {
      this.showDialog = true
      this.power = 'insert'
      this.info.id = ''
      this.info.title = ''
      this.info.content = ''
      this.info.username = ''
    },
    openDialogUpdate (row) {
      this.showDialog = true
      this.power = 'update'
      this.info.id = row.id
      this.info.title = row.title
      this.info.content = row.content
      this.info.username = row.username
    },
    powerInfo () {
      if (this.power === 'insert') {
        this.insertInfo()
      }
      if (this.power === 'update') {
        this.updataInfo()
      }
    }
  }
}
</script>
<style scoped>
</style>
<style lang="css">
.el-tooltip__popper {
  max-width: 50%;
}
</style>
