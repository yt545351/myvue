<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="float: left">
      <el-form-item label="类型" size="mini">
        <el-select placeholder="请选择类型" v-model="applicationType" clearable @change="queryTaskList()">
          <el-option v-for="item in applicationTypeList" :key="item.value" :value="item.value" :label="item.label">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" height="619" :header-cell-style="{
      background: '#eee',
      color: '#606266',
      fontSize: '12px',
    }" stripe highlight-current-row>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column v-for="item in tableHeader" :key="item.value" :label="item.label" :prop="item.value"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="item.value === 'processName'">
            {{ scope.row[item.value] === 'Leave' ? "请假" :
                scope.row[item.value] === 'Travel' ? "出差" : "其他"
            }}
          </span>
          <span v-else>{{ scope.row[item.value] }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button @click="openDialogShow(scope.row)" type="text" size="small">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
      :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize">
    </el-pagination>
    <el-dialog title="流程任务状态" :visible.sync="processListDialog" width="70%">
      <el-form :inline="true" class="demo-form-inline" style="float:left">
        <el-form-item label="申请类型">
          <el-select v-model="applicationInfo.processKey" placeholder="请选择申请类型" clearable style="float:left" disabled>
            <el-option v-for="item in applicationTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline" style="float:left" v-if="applicationInfo.processKey === 'Leave'">
        <el-form-item label="请假日期">
          <el-date-picker v-model="applicationInfo.variables.checkTime" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" style="float:left" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请假天数">
          <el-input v-model="applicationInfo.variables.leaveDays" disabled></el-input>
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input v-model="applicationInfo.variables.leaveReason" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline" style="float:left"
        v-if="applicationInfo.processKey === 'Travel'">
        <el-form-item label="出差日期">
          <el-date-picker v-model="applicationInfo.checkTime" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" style="float:left" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出差天数">
          <el-input v-model="applicationInfo.variables.travelDays" disabled></el-input>
        </el-form-item>
        <el-form-item label="出差原因">
          <el-input v-model="applicationInfo.variables.travelReason" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="demo-form-inline" style="float:left">
        <el-form-item label="意见批注">
          <el-input v-model="comment"></el-input>
        </el-form-item>
        <el-button type="primary" @click="completeTask('1')">
          提交
        </el-button>
        <el-button type="info" @click="completeTask('0')">
          驳回
        </el-button>
      </el-form>

      <el-table :data="processData" style="width: 100%">
        <el-table-column v-for="item in processHeader" :key="item.value" :prop="item.value" :label="item.label">
          <template slot-scope="scope">
            <span v-if="item.value === 'activityType'">
              {{
                  scope.row[item.value] === 'startEvent' ? "任务开始" :
                    scope.row[item.value] === 'endEvent' ? "任务结束" :
                      scope.row[item.value] === 'userTask' ? "责任人" :
                        scope.row[item.value] === 'exclusiveGateway' ? "排他" : "其他"
              }}
            </span>
            <span v-else-if="item.value === 'durationInMillis'">
              {{ dateTransition(scope.row[item.value]) }}
            </span>
            <span v-else-if="item.value === 'activityName'">
              <el-tag v-if="scope.row[item.value] === '完成'" type="success"> {{ scope.row[item.value] }}</el-tag>
              <el-tag v-else-if="scope.row[item.value] === '失败'" type="danger"> {{ scope.row[item.value] }}</el-tag>
              <el-tag v-else> {{ scope.row[item.value] }}</el-tag>
            </span>
            <span v-else>{{ scope.row[item.value] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      applicationType: '',
      applicationTypeList: [
        { value: 'Leave', label: '请假' },
        { value: 'Travel', label: '出差' },
        { value: 'Claim', label: '报销' }
      ],
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      tableData: [],
      tableHeader: [
        { label: '申请人', value: 'assignee' },
        { label: '任务名称', value: 'name' },
        { label: '申请类型', value: 'processName' },
        { label: '申请时间', value: 'createTime' }
      ],
      processListDialog: false,
      applicationInfo: {
        processKey: '',
        variables: {
          checkTime: null,
          leaveDays: 0,
          leaveReason: '',
          travelDays: 0,
          travelReason: ''
        }
      },
      processData: [],
      processHeader: [
        { label: '任务类型', value: 'activityType' },
        { label: '责任人', value: 'assignee' },
        { label: '任务名称', value: 'activityName' },
        { label: '备注', value: 'comment' },
        { label: '开始时间', value: 'startTime' },
        { label: '结束时间', value: 'endTime' },
        { label: '任务耗时', value: 'durationInMillis' }
      ],
      comment: '',
      rowInfo: {}
    }
  },
  mounted () {
    this.queryTaskList()
  },
  methods: {
    // 获取待处理任务列表
    queryTaskList () {
      const username = sessionStorage.getItem('username')
      this.$http.post('/activiti/leave/queryTaskList', {
        processKey: this.applicationType,
        assignee: username,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          data.list.forEach(item => {
            item.createTime = moment(item.createTime).format('yyyy-MM-DD hh:mm:ss')
          })
          this.tableData = data.list
          this.totalSize = data.totalRows
        }
      })
    },
    // 获取流程任务列表
    getProcessTaskList (id) {
      this.$http.post('/activiti/leave/queryProcessTaskList', { instanceId: id }).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          data.forEach(item => {
            item.startTime = moment(item.startTime).format('yyyy-MM-DD hh:mm:ss')
            item.endTime = item.endTime !== undefined ? moment(item.endTime).format('yyyy-MM-DD hh:mm:ss') : ''
          })
          this.processData = data
        }
      })
    },
    // 提交任务
    completeTask (isSucceed) {
      const username = sessionStorage.getItem('username')
      this.$http.post('/activiti/leave/completeTask', {
        taskId: this.rowInfo.id,
        comment: this.comment,
        assignee: username,
        isSucceed: isSucceed
      }).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.$message({
            message: data.message,
            type: data.status === true ? 'success' : 'warning'
          })
          if (data.status === true) {
            this.processListDialog = false
            this.queryTaskList()
          }
        }
      })
    },
    openDialogShow (row) {
      this.processListDialog = true
      this.applicationInfo.processKey = row.processName
      this.applicationInfo.variables.leaveDays = row.leaveDays
      this.applicationInfo.variables.leaveReason = row.leaveReason
      this.applicationInfo.variables.travelDays = row.travelDays
      this.applicationInfo.variables.travelReason = row.travelReason
      this.applicationInfo.variables.checkTime = [row.beginTime, row.overTime]
      this.rowInfo = row
      this.getProcessTaskList(row.processInstanceId)
    },
    // 选择每页记录数
    handleSizeChange (val) {
      this.pageSize = val
    },
    // 选择页码
    handleCurrentChange (val) {
      this.pageNum = val
    },
    // 毫秒转换
    dateTransition (millisecond) {
      if (millisecond === undefined || millisecond === null || millisecond === '') {
        return
      }
      const days = parseFloat(millisecond / (1000 * 60 * 60 * 24)).toFixed(0).toString()
      const hours = parseFloat((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toFixed(0).toString()
      const minutes = parseFloat((millisecond % (1000 * 60 * 60)) / (1000 * 60)).toFixed(0).toString()
      const seconds = ((millisecond % (1000 * 60)) / 1000).toString().split('.')[0]
      if (days !== '0') {
        return days + ' 天 ' + hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 '
      }
      if (days === '0' && hours !== '0') {
        return hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 '
      }
      if (days === '0' && hours === '0' && minutes !== '0') {
        return minutes + ' 分钟 ' + seconds + ' 秒 '
      }
      if (days === '0' && hours === '0' && minutes === '0') {
        return seconds + ' 秒 '
      }
    }
  }

}
</script>
<style scoped>
</style>
