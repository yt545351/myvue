<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" style="float: left">
      <el-form-item label="类型" size="mini">
        <el-select placeholder="请选择类型" v-model="applicationType" clearable>
          <el-option v-for="item in applicationTypeList" :key="item.value" :value="item.value" :label="item.label">
          </el-option>
        </el-select>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      applicationType: '',
      applicationTypeList: [
        { value: 'Leave', label: '请假' },
        { value: 'Evection', label: '出差' },
        { value: 'Claim', label: '报销' }
      ]
    }
  }
}
</script>
<style scoped>
</style>
