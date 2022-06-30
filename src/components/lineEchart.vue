<template>
  <div id="myChart" ref="myChart" style="width: 100%; height: 500px"></div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  props: {
    series: {},
    xDate: {},
    yMin: {}
  },
  data () {
    return {}
  },
  mounted () {
    this.drawChart()
  },
  methods: {
    drawChart () {
      // 多次调用Echart,document.getElementById("myChart")会覆盖chart
      // let myChart = echarts.init(document.getElementById("myChart"));
      const myChart = echarts.init(this.$refs.myChart)
      const option = {
        title: {
          text: '测试'
        },
        tooltip: {
          trigger: 'axis'
        },
        // 保存图片
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        // 图例
        legend: {
          show: true
        },
        // X轴
        xAxis: {
          data: this.xDate,
          boundaryGap: false
        },
        // Y轴
        yAxis: {
          min: this.yMin
        },
        // 数据
        series: this.series
      }
      myChart.setOption(option)
    }
  }
}
</script>
<style scoped>
</style>
