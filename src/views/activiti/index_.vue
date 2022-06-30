<template>
    <el-container class="workflow-container" grid-list-xl fluid>
        <div class="super-flow-demo">
            <div class="node-container">
                <div class="node-item" v-for="(item, index) in nodeItemList" :key="index"
                    @mousedown="evt => nodeItemMouseDown(evt, item.value)">
                    {{ item.label }}
                </div>
            </div>
            <div class="flow-container" ref="flowContainer">
                <super-flow ref="superFlow" :graph-menu="graphMenu" :node-menu="nodeMenu" :link-menu="linkMenu"
                    :link-desc="linkDesc" :node-list="nodeList" :link-list="linkList">
                    <template v-slot:node="{ meta }">
                        <div :class="meta.type ? `flow-node-${meta.type}` : ''" class="flow-node ellipsis">
                            <div class="node-content" :title="meta.name">{{ meta.name }}</div>
                        </div>
                    </template>
                </super-flow>
                <el-button @click="saveFlow" color="primary" class="saveIcon">SAVE
                </el-button>
            </div>

        </div>

        <el-dialog :title="drawerConf.title" :visible.sync="drawerConf.visible" :close-on-click-modal="false"
            width="500px">
            <el-form @keyup.native.enter="settingSubmit" @submit.native.prevent
                v-show="drawerConf.type === drawerType.node" ref="nodeSetting" :model="nodeSetting">
                <el-form-item label="node name" prop="name">
                    <el-input v-model="nodeSetting.name" placeholder="Please enter the node name" maxlength="30">
                    </el-input>
                </el-form-item>
                <el-form-item label="node description" prop="desc">
                    <el-input v-model="nodeSetting.desc" placeholder="Please enter a node description" maxlength="30">
                    </el-input>
                </el-form-item>
            </el-form>
            <el-form @keyup.native.enter="settingSubmit" @submit.native.prevent
                v-show="drawerConf.type === drawerType.link" ref="linkSetting" :model="linkSetting">
                <el-form-item label="link description" prop="desc">
                    <el-input v-model="linkSetting.desc" placeholder="Please enter a link description">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="drawerConf.cancel">
                    CANCEL
                </el-button>
                <el-button type="primary" @click="settingSubmit">
                    OK
                </el-button>
            </span>
        </el-dialog>
    </el-container>
</template>

<script>
import SuperFlow from 'vue-super-flow'
import 'vue-super-flow/lib/index.css'

const drawerType = {
  node: 0,
  link: 1
}

export default {
  components: {
    SuperFlow
  },
  data () {
    return {
      drawerType,
      nodeList: [
        {
          id: 'N1',
          coordinate: [771, 32],
          width: 120,
          height: 40,
          meta: {
            label: 'start',
            name: 'start',
            type: 'start'
          }
        },
        {
          id: 'N2',
          coordinate: [731, 137],
          width: 200,
          height: 40,
          meta: {
            desc: '1',
            label: 'process',
            name: 'process11111',
            type: 'process'
          }
        },
        {
          id: 'N3',
          coordinate: [747, 237],
          width: 168,
          height: 168,
          meta: {
            desc: '?',
            label: 'if',
            name: 'if?????',
            type: 'if'
          }
        },
        {
          id: 'N4',
          coordinate: [731, 505],
          width: 200,
          height: 40,
          meta: {
            desc: '2',
            label: 'process',
            name: 'process22222',
            type: 'process'
          }
        },
        {
          id: 'N5',
          coordinate: [1088, 300],
          width: 200,
          height: 40,
          meta: {
            desc: '3',
            label: 'process',
            name: 'process33333',
            type: 'process'
          }
        },
        {
          id: 'N6',
          coordinate: [771, 597],
          width: 120,
          height: 40,
          meta: {
            label: 'end',
            name: 'end',
            type: 'end'
          }
        }
      ],
      linkList: [
        {
          id: 'L1',
          startAt: [60, 40],
          startId: 'N1',
          endAt: [100, 0],
          endId: 'N2',
          meta: null
        },
        {
          id: 'L2',
          startAt: [100, 40],
          startId: 'N2',
          endAt: [84, 0],
          endId: 'N3',
          meta: null
        },
        {
          id: 'L3',
          startAt: [100, 40],
          startId: 'N4',
          endAt: [60, 0],
          endId: 'N6',
          meta: null
        },
        {
          id: 'L4',
          startAt: [84, 168],
          startId: 'N3',
          endAt: [100, 0],
          endId: 'N4',
          meta: {
            desc: 'YES'
          }
        },
        {
          id: 'L5',
          startAt: [168, 84],
          startId: 'N3',
          endAt: [0, 20],
          endId: 'N5',
          meta: {
            desc: 'NO'
          }
        },
        {
          id: 'L6',
          startAt: [100, 0],
          startId: 'N5',
          endAt: [200, 20],
          endId: 'N2',
          meta: null
        }
      ],
      drawerConf: {
        title: '',
        visible: false,
        type: null,
        info: null,
        open: (type, info) => {
          const conf = this.drawerConf
          conf.visible = true
          conf.type = type
          conf.info = info
          if (conf.type === drawerType.node) {
            conf.title = 'NODE'
            if (this.$refs.nodeSetting) this.$refs.nodeSetting.resetFields()
            this.$set(this.nodeSetting, 'name', info.meta.name)
            this.$set(this.nodeSetting, 'desc', info.meta.desc)
          } else {
            conf.title = 'LINK'
            if (this.$refs.linkSetting) this.$refs.linkSetting.resetFields()
            this.$set(this.linkSetting, 'desc', info.meta ? info.meta.desc : '')
          }
        },
        cancel: () => {
          this.drawerConf.visible = false
          if (this.drawerConf.type === drawerType.node) {
            this.$refs.nodeSetting.clearValidate()
          } else {
            this.$refs.linkSetting.clearValidate()
          }
        }
      },
      linkSetting: {
        desc: ''
      },
      nodeSetting: {
        name: '',
        desc: ''
      },
      nodeItemList: [
        {
          label: 'start',
          value: () => ({
            width: 120,
            height: 40,
            meta: {
              label: 'start',
              name: 'start',
              type: 'start'
            }
          })
        },
        {
          label: 'process',
          value: () => ({
            width: 200,
            height: 40,
            meta: {
              label: 'process',
              name: 'process',
              type: 'process'
            }
          })
        },
        {
          label: 'if',
          value: () => ({
            width: 168,
            height: 168,
            meta: {
              label: 'if',
              name: 'if',
              type: 'if'
            }
          })
        },
        {
          label: 'end',
          value: () => ({
            width: 120,
            height: 40,
            meta: {
              label: 'end',
              name: 'end',
              type: 'end'
            }
          })
        }
      ],
      graphMenu: [
        [
          {
            // 选项 label
            label: 'start',
            // 选项是否禁用
            disable (graph) {
              return !!graph.nodeList.find(node => node.meta.label === 'start')
            },
            // 选项选中后回调函数
            selected (graph, coordinate) {
              graph.addNode({
                width: 120,
                height: 40,
                coordinate,
                meta: {
                  label: 'start',
                  name: 'start',
                  type: 'start'
                }
              })
            }
          },
          {
            label: 'process',
            selected (graph, coordinate) {
              graph.addNode({
                width: 200,
                height: 40,
                coordinate,
                meta: {
                  label: 'process',
                  name: 'process',
                  type: 'process'
                }
              })
            }
          },
          {
            label: 'if',
            selected (graph, coordinate) {
              graph.addNode({
                width: 168,
                height: 168,
                coordinate,
                meta: {
                  label: 'if',
                  name: 'if',
                  type: 'if'
                }
              })
            }
          }
        ],
        [
          {
            label: 'end',
            selected (graph, coordinate) {
              graph.addNode({
                width: 120,
                height: 40,
                coordinate,
                meta: {
                  label: 'end',
                  name: 'end',
                  type: 'end'
                }
              })
            }
          }
        ],
        [
          {
            label: 'select all',
            selected: graph => {
              graph.selectAll()
            }
          }
        ]
      ],
      nodeMenu: [
        [
          {
            label: 'delete',
            selected: node => {
              node.remove()
            }
          },
          {
            label: 'edit',
            selected: node => {
              this.drawerConf.open(drawerType.node, node)
            }
          }
        ]
      ],
      linkMenu: [
        [
          {
            label: 'delete',
            selected: link => {
              link.remove()
            }
          },
          {
            label: 'edit',
            selected: link => {
              this.drawerConf.open(drawerType.link, link)
            }
          }
        ]
      ],
      dragConf: {
        isDown: false,
        isMove: false,
        offsetTop: 0,
        offsetLeft: 0,
        clientX: 0,
        clientY: 0,
        ele: null,
        info: null
      }
    }
  },
  mounted () {
    document.addEventListener('mousemove', this.docMousemove)
    document.addEventListener('mouseup', this.docMouseup)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('mousemove', this.docMousemove)
      document.removeEventListener('mouseup', this.docMouseup)
    })
  },
  methods: {
    saveFlow () {
      this.nodeList = this.$refs.superFlow.toJSON().nodeList
      this.linkList = this.$refs.superFlow.toJSON().linkList
      console.log(this.nodeList)
      console.log(this.linkList)
    },
    linkDesc (link) {
      return link.meta ? link.meta.desc : ''
    },
    settingSubmit () {
      const conf = this.drawerConf
      if (this.drawerConf.type === drawerType.node) {
        if (!conf.info.meta) conf.info.meta = {}
        Object.keys(this.nodeSetting).forEach(key => {
          this.$set(conf.info.meta, key, this.nodeSetting[key])
        })
        this.$refs.nodeSetting.resetFields()
      } else {
        if (!conf.info.meta) conf.info.meta = {}
        Object.keys(this.linkSetting).forEach(key => {
          this.$set(conf.info.meta, key, this.linkSetting[key])
        })
        this.$refs.linkSetting.resetFields()
      }
      conf.visible = false
    },
    docMousemove ({ clientX, clientY }) {
      const conf = this.dragConf
      if (conf.isMove) {
        conf.ele.style.top = clientY - conf.offsetTop + 'px'
        conf.ele.style.left = clientX - conf.offsetLeft + 'px'
      } else if (conf.isDown) {
        // 鼠标移动量大于 5 时 移动状态生效
        conf.isMove = Math.abs(clientX - conf.clientX) > 5 || Math.abs(clientY - conf.clientY) > 5
      }
    },
    docMouseup ({ clientX, clientY }) {
      const conf = this.dragConf
      conf.isDown = false

      if (conf.isMove) {
        const {
          top,
          right,
          bottom,
          left
        } = this.$refs.flowContainer.getBoundingClientRect()

        // 判断鼠标是否进入 flow container
        if (
          clientX > left && clientX < right && clientY > top && clientY < bottom
        ) {
          // 获取拖动元素左上角相对 super flow 区域原点坐标
          const coordinate = this.$refs.superFlow.getMouseCoordinate(
            clientX - conf.offsetLeft,
            clientY - conf.offsetTop
          )
          // 添加节点
          this.$refs.superFlow.addNode({
            coordinate,
            ...conf.info
          })
        }
        conf.isMove = false
      }
      if (conf.ele) {
        conf.ele.remove()
        conf.ele = null
      }
    },
    nodeItemMouseDown (evt, infoFun) {
      const {
        clientX,
        clientY,
        currentTarget
      } = evt

      const {
        top,
        left
      } = evt.currentTarget.getBoundingClientRect()

      const conf = this.dragConf
      const ele = currentTarget.cloneNode(true)

      Object.assign(this.dragConf, {
        offsetLeft: clientX - left,
        offsetTop: clientY - top,
        clientX: clientX,
        clientY: clientY,
        info: infoFun(),
        ele,
        isDown: true
      })

      ele.style.position = 'fixed'
      ele.style.margin = '0'
      ele.style.top = clientY - conf.offsetTop + 'px'
      ele.style.left = clientX - conf.offsetLeft + 'px'

      this.$el.appendChild(this.dragConf.ele)
    }
  }
}
</script>

<style lang="scss" scoped>
.workflow-container {
    width: calc(100vw - 80px);
    height: calc(100vh - 128px);
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
    margin: 32px;
    padding: 0;
    background: #fff;
    overflow: hidden;
}

.ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
}

.super-flow-demo {
    position: relative;
    margin: 20px;
    background: #f5f5f5;
    height: calc(100vh - 168px);
    width: 100%;

    .node-container {
        width: 100%;
        height: 50px;
        background-color: #FFFFFF;

        .node-item {
            display: inline-block;
            font-size: 14px;
            height: 30px;
            width: 120px;
            margin: 0 20px 0 0;
            background: #FFFFFF;
            line-height: 30px;
            box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            user-select: none; // 防止鼠标左键拖动选中页面的文字
            text-align: center;

            &:hover {
                box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.4);
            }
        }
    }

    .flow-container {
        width: 100%;
        height: calc(100% - 50px);

        .super-flow {
            overflow: auto;
        }
    }

    .saveIcon {
        position: absolute;
        right: 0px;
        top: 0px;
    }

    .super-flow__node {
        .flow-node {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            line-height: 40px;
            padding: 0 6px;
            font-size: 16px;
            color: #fff;
            font-weight: bold;

            .node-content {
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    /*开始节点样式*/
    .ellipsis.flow-node-start {
        background: #55ABFC;
        border-radius: 10px;
        border: 1px solid #b4b4b4;
    }

    /*流程节点样式*/
    .ellipsis.flow-node-process {
        position: relative;
        background: #30B95C;
        border: 1px solid #b4b4b4;
    }

    /*条件节点样式*/
    .ellipsis.flow-node-if {
        width: 120px;
        height: 120px;
        position: relative;
        top: 24px;
        left: 24px;
        background: #BC1D16;
        border: 1px solid #b4b4b4;
        transform: rotateZ(45deg); //倾斜

        .node-content {
            position: absolute;
            top: 50%;
            left: 20px;
            width: 100%;
            transform: rotateZ(-45deg) translateY(-75%);
        }
    }

    /*结束节点样式*/
    .ellipsis.flow-node-end {
        background: #000;
        border-radius: 10px;
        border: 1px solid #b4b4b4;
    }
}
</style>
<style>
.super-flow-demo .super-flow__node {
    border: none;
    background: none;
    box-shadow: none;
}
</style>
