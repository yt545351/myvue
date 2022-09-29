<template>
  <div ref="chinaMap" id="chinaMap" style="width:100%;height:700px" @contextmenu.prevent.stop="revertMap()"></div>
</template>
<script>
import * as echarts from 'echarts'
import chinaJson from '@/assets/map/china.json'
import axios from 'axios'
import { getMapInfo } from '@/utils/maputil'
export default {
  data () {
    return {
      provinceName: '',
      cityName: '',
      chart: '',
      mapInfo: {},
      mapLevel: '1',
      option: {
        title: {
          text: '中国'
        },
        geo: {
          type: 'map', // 类型
          map: 'china',
          itemStyle: {
            areaColor: '#DCDFE6', // 地图整体区域的颜色
            borderColor: '#000'// 地图边界线的颜色
          },
          label: {
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
            min: 1, // 最小的缩放值
            max: 5 // 最大的缩放值
          }
        },
        // 自定义提示框的内容
        tooltip: {
          formatter (params) {
            return '<span>' + params.seriesName + ':' + params.value + '</span>'
          }
        },
        visualMap: {
          min: 100,
          max: 1000,
          zoom: 0.8,
          text: ['优', '差'],
          realtime: false,
          calculable: true,
          left: '80%',
          itemWidth: 15, // 图形的宽度，即长条的宽度。
          itemHeight: 60, // 图形的高度，即长条的高度。
          inRange: {
            color: ['#DCDCDC', '#0000ff']
          }
        },
        legend: {
          show: false
        },
        series: [
          {
            name: '一本人数',
            type: 'map',
            geoIndex: 0,
            data: [
              { name: '北京市', value: 200 }, { name: '天津市', value: 600 },
              { name: '上海市', value: 300 }, { name: '重庆市', value: 500 },
              { name: '河北省', value: 200 }, { name: '河南省', value: 400 },
              { name: '云南省', value: 300 }, { name: '辽宁省', value: 300 },
              { name: '黑龙江省', value: 200 }, { name: '湖南省', value: 200 },
              { name: '安徽省', value: 500 }, { name: '山东省', value: 100 },
              { name: '新疆维吾尔自治区', value: 600 }, { name: '江苏省', value: 900 },
              { name: '浙江省', value: 700 }, { name: '江西省', value: 800 },
              { name: '湖北省', value: 800 }, { name: '广西壮族自治区', value: 700 },
              { name: '甘肃省', value: 900 }, { name: '山西省', value: 600 },
              { name: '内蒙古自治区', value: 100 }, { name: '陕西省', value: 500 },
              { name: '吉林省', value: 200 }, { name: '福建省', value: 400 },
              { name: '贵州省', value: 300 }, { name: '广东省', value: 300 },
              { name: '青海省', value: 400 }, { name: '西藏自治区', value: 200 },
              { name: '四川省', value: 500 }, { name: '宁夏回族自治区', value: 100 },
              { name: '海南省', value: 600 }, { name: '台湾省', value: 900 },
              { name: '香港特别行政区', value: 700 }, { name: '澳门特别行政区', value: 800 },
              { name: '南海诸岛', value: 800 }]
          }

        ]

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
      this.chart = echarts.init(this.$refs.chinaMap)
      echarts.registerMap('china', chinaJson)
      this.chart.setOption(this.option, true)
      this.chart.on('click', async arg => {
        const mapInfo = getMapInfo(arg.name)
        // 如果存在key执行下面内容
        if (mapInfo.key !== undefined) {
          // 获取static下面的json数据
          const res = await axios.get(mapInfo.path)
          if (mapInfo.key.length === 2) {
            this.mapInfo = mapInfo
            this.mapLevel = 2
            this.provinceName = arg.name
          } else {
            this.mapLevel = 3
            this.cityName = arg.name
          }

          echarts.registerMap(mapInfo.key, res.data)
          const changeOption = this.option
          changeOption.geo.map = mapInfo.key
          if (mapInfo.key === '46') {
            changeOption.geo.center = [109.844902, 19.0392]// 中心位置
            changeOption.geo.layoutCenter = ['50%', '40%']// 地图相对容器偏移
            changeOption.geo.layoutSize = '380%'// 地图放大比例
          } else { // 非显示海南时，将设置的参数恢复默认值
            changeOption.geo.center = undefined
            changeOption.geo.layoutCenter = undefined
            changeOption.geo.layoutSize = undefined
          }

          if (mapInfo.key.length === 2) {
            changeOption.title.text = '中国' + '>' + this.provinceName
          } else {
            changeOption.title.text = '中国' + '>' + this.provinceName + '>' + this.cityName
          }

          this.chart.setOption(changeOption, true)
        }
      })
    },
    revertMap () {
      if (this.mapLevel === 2) { // 地图等级为province,回退到全国地图
        const revertOption = this.option
        revertOption.geo.map = 'china'
        this.mapInfo = {}
        this.mapLevel = 1
        revertOption.title.text = '中国'
        if (this.mapInfo.key === '46') {
          revertOption.geo.center = [109.844902, 19.0392]// 中心位置
          revertOption.geo.layoutCenter = ['50%', '40%']// 地图相对容器偏移
          revertOption.geo.layoutSize = '380%'// 地图放大比例
        } else { // 非显示海南时，将设置的参数恢复默认值
          revertOption.geo.center = undefined
          revertOption.geo.layoutCenter = undefined
          revertOption.geo.layoutSize = undefined
        }
        this.chart.setOption(revertOption, true)
      } else if (this.mapLevel === 3) { // 地图等级为city,回退到省份
        axios.get(this.mapInfo.path).then(res => {
          echarts.registerMap(this.mapInfo.key, res.data)
          const revertOption = this.option
          revertOption.geo.map = this.mapInfo.key
          this.mapLevel = 2
          revertOption.title.text = '中国' + '>' + this.provinceName
          if (this.mapInfo.key === '46') {
            revertOption.geo.center = [109.844902, 19.0392]// 中心位置
            revertOption.geo.layoutCenter = ['50%', '40%']// 地图相对容器偏移
            revertOption.geo.layoutSize = '380%'// 地图放大比例
          } else { // 非显示海南时，将设置的参数恢复默认值
            revertOption.geo.center = undefined
            revertOption.geo.layoutCenter = undefined
            revertOption.geo.layoutSize = undefined
          }
          this.chart.setOption(revertOption, true)
        })
      } else if (this.mapLevel === 1) { // 地图等级为country,默认回退到全国
        const revertOption = this.option
        revertOption.geo.map = 'china'
        revertOption.title.text = '中国'
        this.chart.setOption(revertOption, true)
      }
    },
    // 当浏览器的大小发生变化的时候，会调用此方法来完成适配
    screenAdapter () {
      // 获取自适应大小
      const titleFontSize = this.$refs.chinaMap.offsetWidth / 100 * 3.6
      // 自适应配置
      const adapterOption = {
        title: {
          // textStyle: {
          //   fontSize: titleFontSize // 自适应字体大小
          // }
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
    }
  }
}
</script>
<style scoped>
</style>
