<template>
  <div style="height: 100%">
    <el-form :inline="true" class="demo-form-inline" style="float: left">
      <el-form-item label="年级" size="mini">
        <el-select v-model="search.grade" placeholder="年级" @change="changeGrade()" clearable>
          <el-option v-for="item in gradeList" :label="item.grade" :value="item.grade" :key="item.grade"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" size="mini">
        <el-select v-model="search.className" placeholder="班级" clearable>
          <el-option v-for="item in classList" :label="item.class_name" :value="item.class_name" :key="item.class_name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" size="mini">
        <el-input v-model="search.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item size="mini">
        <el-button type="primary" @click="handleSearch()">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%" height="619" :header-cell-style="{
      background: '#eee',
      color: '#606266',
      fontSize: '12px',
    }" stripe highlight-current-row>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column v-for="item in tableHeader" :key="item.value" :label="item.label" :prop="item.value">
        <template slot-scope="scope">
          <el-tag v-if="item.value === 'class_teacher_name'">{{
              scope.row[item.value]
          }}</el-tag>
          <el-tag type="danger" v-else-if="item.value === 'class_teacher_tell'">{{ scope.row[item.value] }}</el-tag>
          <span v-else>{{ scope.row[item.value] }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row)" type="text" size="small">
            编辑
          </el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="el-icon-info" icon-color="red"
            title="你确定删除该行吗?" @confirm="handleDelete(scope.row)">
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
    <el-dialog title="编辑" :visible.sync="showEdit" width="40%">
      <el-form :model="studentInfo">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.name" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="年龄" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.age" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select v-model="studentInfo.sex" placeholder="请选择性别" style="float: left">
            <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家庭住址" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.address" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.tell" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="年级" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.grade" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.class_name" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="班主任" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.class_teacher_name" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="班主任电话" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.class_teacher_tell" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="父亲" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.fa_name" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="父亲电话" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.fa_tell" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="母亲" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.mo_name" style="width: 90%; float: left"></el-input>
        </el-form-item>
        <el-form-item label="母亲电话" :label-width="formLabelWidth">
          <el-input v-model="studentInfo.mo_tell" style="width: 90%; float: left"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      search: {
        grade: '',
        className: '',
        name: ''
      },
      studentInfo: {
        id: '',
        name: '',
        age: '',
        sex: '',
        address: '',
        tell: '',
        grade: '',
        class_name: '',
        class_teacher_name: '',
        class_teacher_tell: '',
        fa_name: '',
        fa_tell: '',
        mo_name: '',
        mo_tell: ''
      },
      formLabelWidth: '120px',
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
      showEdit: false,
      tableHeader: [
        { label: '姓名', value: 'name' },
        { label: '年龄', value: 'age' },
        { label: '性别', value: 'sex' },
        { label: '地址', value: 'address' },
        { label: '电话', value: 'tell' },
        { label: '年级', value: 'grade' },
        { label: '班级', value: 'class_name' },
        { label: '班主任', value: 'class_teacher_name' },
        { label: '班主任电话', value: 'class_teacher_tell' },
        { label: '父亲', value: 'fa_name' },
        { label: '父亲电话', value: 'fa_tell' },
        { label: '母亲', value: 'mo_name' },
        { label: '母亲电话', value: 'mo_tell' }
      ],
      sexList: [
        { label: '男', value: 1 },
        { label: '女', value: 0 },
        { label: '其他', value: 2 }
      ],
      gradeList: [],
      classList: [],
      tableData: []
    }
  },
  mounted () {
    this.getGradeList()
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      const params = {
        name: this.search.name,
        grade: this.search.grade,
        class_name: this.search.className,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.$http.post(`${this.$config.API.API}student/query`, params).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.tableData = data.list
          this.totalSize = data.totalRows
        }
      })
    },
    // 获取年级列表
    getGradeList () {
      this.$http.post(`${this.$config.API.API}student/getGradeList`).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.gradeList = data
        }
      })
    },
    // 获取班级列表
    getClassList () {
      this.$http.post(`${this.$config.API.API}student/getClassList`, { grade: this.search.grade }).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.classList = data
        }
      })
    },
    // 打开编辑框
    openDialog (row) {
      this.showEdit = true
      this.studentInfo.id = row.id
      this.studentInfo.name = row.name
      this.studentInfo.age = row.age
      this.studentInfo.sex = row.sex
      this.studentInfo.address = row.address
      this.studentInfo.tell = row.tell
      this.studentInfo.grade = row.grade
      this.studentInfo.class_name = row.class_name
      this.studentInfo.class_teacher_name = row.class_teacher_name
      this.studentInfo.class_teacher_tell = row.class_teacher_tell
      this.studentInfo.fa_name = row.fa_name
      this.studentInfo.fa_tell = row.fa_tell
      this.studentInfo.mo_name = row.mo_name
      this.studentInfo.mo_tell = row.mo_tell
    },
    // 编辑
    handleUpdate () {
      this.$http.post(`${this.$config.API.API}student/update`, this.studentInfo).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.$message({
            message: data.message,
            type: data.status === true ? 'success' : 'warning'
          })
          this.showEdit = false
          this.getDataList()
        }
      })
    },
    // 删除
    handleDelete (row) {
      this.$http.post(`${this.$config.API.API}student/delete`, row).then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.$message({
            message: data.message,
            type: data.status === true ? 'success' : 'warning'
          })
          this.getDataList()
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
    // 选择年级
    changeGrade () {
      this.search.className = ''
      this.classList = []
      this.getClassList()
    },
    // 查询
    handleSearch () {
      this.getDataList()
    }
  }
}
</script>
<style scoped>
</style>
