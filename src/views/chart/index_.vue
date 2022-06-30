<template>
  <div>
    <LineEchart v-if="show1" :series="teacherSeries" :xDate="dateList" :yMin="yMin1"></LineEchart>
    <LineEchart v-if="show2" :series="studentSeries" :xDate="dateList" :yMin="yMin2"></LineEchart>
  </div>
</template>
<script>
import LineEchart from '@/components/lineEchart'
export default {
  components: { LineEchart },
  data () {
    return {
      teacherSeries: [],
      studentSeries: [],
      dateList: [],
      show1: false,
      show2: false,
      yMin1: 0,
      yMin2: 0
    }
  },
  mounted () {
    this.querySchoolList()
  },
  methods: {
    querySchoolList () {
      this.$http.post('/api/schoolInfo/getList').then((res) => {
        if (res.data.code === 200) {
          const data = res.data.data
          const teacherSeries = []
          const studentSeries = []
          let yMin1 = 0
          let yMin2 = 0
          data.data.forEach((item) => {
            teacherSeries.push({
              name: item.name,
              type: 'line',
              smooth: true,
              data: item.teacherList
            })
            studentSeries.push({
              name: item.name,
              type: 'line',
              smooth: true,
              data: item.studentList
            })
          })
          for (let i = 0; i < teacherSeries.length; i++) {
            for (let j = 0; j < teacherSeries[i].data.length; j++) {
              if (i === 0 && j === 0) {
                yMin1 = teacherSeries[i].data[j]
              } else {
                if (yMin1 > teacherSeries[i].data[j]) {
                  yMin1 = teacherSeries[i].data[j]
                }
              }
            }
          }
          for (let i = 0; i < studentSeries.length; i++) {
            for (let j = 0; j < studentSeries[i].data.length; j++) {
              if (i === 0 && j === 0) {
                yMin2 = studentSeries[i].data[j]
              } else {
                if (yMin2 > studentSeries[i].data[j]) {
                  yMin2 = studentSeries[i].data[j]
                }
              }
            }
          }
          if (yMin1.toString().length > 1) {
            yMin1 = this.getYmin(yMin1)
          }
          if (yMin2.toString().length > 1) {
            yMin2 = this.getYmin(yMin2)
          }
          this.teacherSeries = teacherSeries
          this.studentSeries = studentSeries
          this.yMin1 = yMin1
          this.yMin2 = yMin2
          this.dateList = data.date
          // 先把数据获取到之后再进行子组件的渲染
          this.show1 = true
          this.show2 = true
        }
      })
    },
    // 获取y轴起始值
    getYmin (min) {
      const length = min.toString().slice(1).toString().length
      let num = ''
      for (let i = 0; i < length; i++) {
        num = num + '0'
      }
      const str = min.toString().slice(0, 1) + num
      return str
    }
  }
}
</script>
<style scoped>
</style>
