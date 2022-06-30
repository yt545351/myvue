<!-- <template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column
      v-for="column in tableHead"
      :key="column.value"
      :label="column.label"
      :prop="column.value"
    >
      <template slot-scope="scope">
        <template v-if="column.value === 'desc'">
          <el-tooltip class="item" effect="dark" placement="top">
            <div v-html="ToBreak(scope.row.desc)" slot="content"></div>
            <div class="oneLine">{{ scope.row.desc }}</div>
          </el-tooltip>
        </template>
        <template v-else>{{ scope.row[column.value] }}</template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  data() {
    return {
      tableHead: [
        {
          value: "date",
          label: "日期",
        },
        {
          value: "name",
          label: "姓名",
        },
        {
          value: "address",
          label: "地址",
        },
        {
          value: "desc",
          label: "tooltip换行描述",
        },
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          desc: "1:1234567;2:2234567;3:3234567;4:4234567",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
          desc: "1:1234567;2:2234567;3:3234567;4:4234567",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          desc: "1:1234567;2:2234567;3:3234567;4:4234567",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
          desc: "1:1234567;2:2234567;3:3234567;4:4234567",
        },
      ],
      sum: [1, 2, 3, 4, 5, 6],
      count1: 1,
      count2: 2,
    };
  },
  methods: {
    // 将;换为 <br/>标签
    ToBreak(val) {
      return val.split(";").join("<br />");
    },
  },
};
</script>
<style>
.oneLine {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style> -->
