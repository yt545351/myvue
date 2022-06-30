<template>
  <div class="mobile-marquee">
    <div class="mobile-marquee-wrapper" ref="wrapper">
      <div class="mobile-marquee-text" ref="text" :style="{ left: textLeft, transition: textTransition }">
        <a @click="showProclamation = true" @mouseenter="stop()" @mouseleave="start()" style="cursor: pointer">
          {{ text }}</a>
      </div>
    </div>
    <el-dialog :title="data.title" :visible.sync="showProclamation">
      <el-input v-model="data.content" type="textarea" :autosize="{ minRows: 20, maxRows: 20 }" readonly>
      </el-input>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    proclamation: Object
  },
  data () {
    return {
      data: {},
      showProclamation: false,
      text: '',
      textLeft: '',
      textTransition: ''
    }
  },
  created () { },
  watch: {
    proclamation: {
      handler (newVal, oldVal) {
        this.data = this.proclamation
        this.text = newVal.title
        this.marquee()
      }
    }
  },
  methods: {
    // 跑马灯运作
    marquee () {
      // 异步方法，获取textWidth
      this.$nextTick(() => {
        const _this = this
        const wrapperWidth = this.$refs.wrapper.clientWidth // 容器的总宽度
        const textWidth = this.$refs.text.clientWidth // 文本的总宽度
        const transTime = textWidth / 10 // 根据文本宽度设置过渡时间
        const againTime = transTime * 1000 + 1000 // 重新开始滚动时间计算(动态)
        this.textLeft = wrapperWidth + 'px' // 开始滚动前设定文本在容器最右侧以外
        setTimeout(() => {
          textRoll()
        }, 0)
        function textRoll () {
          _this.textTransition = 'left ' + transTime + 's linear' // 滚动前绑定过渡属性
          _this.textLeft = -textWidth + 'px' // 向容器最左移动
          setTimeout(() => {
            // 还原文本位置
            _this.textTransition = 'none' // 还原前需清除过渡
            _this.textLeft = wrapperWidth + 'px'
            setTimeout(() => {
              textRoll()
            }, 0)
          }, againTime)
        }
      })
    },
    start () { },
    stop () { }
  },
  mounted () { }
}
</script>

<style>
.mobile-marquee {
  display: flex;
  align-items: center;
  margin: 0 16px;
  margin-right: 5%;
}

.mobile-marquee-wrapper {
  flex: 1;
  height: 15px;
  overflow: hidden;
  position: relative;
}

/* .mobile-marquee img {
  width: 14px;
  height: 12px;
  margin-right: 7px;
} */

.mobile-marquee-text {
  color: rgb(244, 47, 47);
  white-space: nowrap;
  /* line-height: 40px; */
  position: absolute;
  font-size: 14px;
}
</style>
