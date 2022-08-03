<template>
  <!-- 具备一个宽高的dom -->
  <div ref="main" style="height: 700px ;width: 100%;margin: 0;padding: 0;overflow: hidden" @dblclick="revertMap"></div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
// 中国地图
import chinaJson from '@/assets/map/china.json'
// axios
import axios from 'axios'
// 各省份对应的矢量数据地址
import { getMapInfo } from '@/utils/maputil'
// 导入echarts主题
// require('@/theme/chalk')
export default {
  name: 'china-map',
  data () {
    return {
      chart: '',
      mapInfo: {},
      mapLevel: '1',
      option: {
        title: {
          text: '中国地图',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map', // 类型
          map: 'china',
          top: '5%', // 距离顶部
          bottom: '5%', // 距离底部
          itemStyle: { // 地图区域的样式。
            areaColor: '#ffffff', // 地图整体区域的颜色
            borderColor: '#333' // 地图边界线的颜色
          },
          label: {
            show: true,
            normal: {
              show: true,
              textStyle: {
                color: '#000',
                fontSize: 12
              }
            },
            emphasis: {
              show: true
            }
          },
          // 是否开启鼠标缩放和平移漫游。默认不开启。
          // 如果只想要开启缩放或者平移，
          // 可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          roam: true,
          scaleLimit: {
            min: 1,
            max: 5
          }

        },
        // 自定义提示框的内容
        tooltip: {
          trigger: 'item',
          // 自定义提示框的内容
          formatter (params) {
            return (
              '<div>' +
              params.data.name +
              ' <br> ' +
              params.seriesName +
              '</div>'
            )
          }
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initChart()
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    })
  },
  methods: {
    initChart () {
      // init第一个参数 ref定义的的，第二个参数主题
      this.chart = echarts.init(this.$refs.main)
      echarts.registerMap('china', chinaJson)
      this.chart.setOption(this.option)
      this.chart.on('click', async arg => {
        const mapInfo = getMapInfo(arg.name)
        // 如果存在key执行下面内容
        if (mapInfo.key !== undefined) {
          // 获取static下面的json数据
          const res = await axios.get('http://localhost:8080' + mapInfo.path)
          if (mapInfo.key.length === 2) {
            this.mapInfo = mapInfo
            this.mapLevel = 2
          } else {
            this.mapLevel = 3
          }

          echarts.registerMap(mapInfo.key, res.data)
          const changeOption = this.option
          changeOption.geo.map = mapInfo.key
          this.chart.setOption(changeOption, true)
        }
      })
    },
    // 当浏览器的大小发生变化的时候，会调用此方法来完成适配
    screenAdapter () {
      // 获取自适应大小
      const titleFontSize = this.$refs.main.offsetWidth / 100 * 3.6
      console.log('titleFontSize', titleFontSize)
      // 自适应配置
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize // 自适应字体大小
          }
        },
        legend: { // 图例组件
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2 // 自适应字体大小
          }
        }
      }
      this.chart.setOption(adapterOption)
      // 自适应
      this.chart.resize()
    },
    // 回退
    revertMap () {
      if (this.mapLevel === 2) { // 地图等级为province,回退到全国地图
        const revertOption = this.option
        revertOption.geo.map = 'china'
        this.mapInfo = {}
        this.mapLevel = 1
        this.chart.setOption(revertOption, true)
      } else if (this.mapLevel === 3) { // 地图等级为city,回退到省份
        axios.get('http://localhost:8080' + this.mapInfo.path).then(res => {
          echarts.registerMap(this.mapInfo.key, res.data)
          const revertOption = this.option
          revertOption.geo.map = this.mapInfo.key
          this.mapLevel = 2
          this.chart.setOption(revertOption, true)
        })
      } else if (this.mapLevel === 1) { // 地图等级为country,默认回退到全国
        const revertOption = this.option
        revertOption.geo.map = 'china'
        this.chart.setOption(revertOption, true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  height: 100%;
  width: 100%;
}
</style>
