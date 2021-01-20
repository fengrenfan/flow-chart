<template>
  <div class="root">
    <!-- 左侧按钮 -->
    <div class="toolbar">
      <div>
        <button @click="saveAll">保存已创建流程</button>
      </div>
      <item-panel :graph="graph" @canvas-add-node="addNode" />
    </div>
    <!-- 挂载节点 -->
    <div id="canvasPanel" @dragover.prevent />
    <!-- node配置面板 -->
    <div id="configPanel" v-show="configVisible">
      <i class="gb-toggle-btn" @click="configVisible = !configVisible" />
      <h2 class="panel-title">
        <span>>{{ label }}</span>
      </h2>
      <div class="form_box">
        <div>
          <label for="color">节点颜色：</label>
          <input type="color" v-model="node.fill" />
        </div>
        <div>
          <label for="color">节点名称：</label>
          <input type="text" v-model="label" />
        </div>
        <div>
          <button @click="configVisible = false">取消</button>
          <button class="save" @click="nodeSave()">保存</button>
        </div>
      </div>
    </div>
    <!-- edge配置面板 -->
    <div id="configPanel" v-show="edgeconfigVisible">
      <i
        class="gb-toggle-btn"
        @click="edgeconfigVisible = !edgeconfigVisible"
      />
      <h2 class="panel-title">数据配置</h2>
      <div class="form_box">
        <div>
          <label for="color">关联文字：</label>
          <input type="text" v-model="edgeLabel" />
        </div>
        <div class="btn">
          <button @click="edgeconfigVisible = false">取消</button>
          <button class="save" @click="edgeSave()">保存</button>
        </div>
      </div>
    </div>
    <div
      v-if="tooltip"
      class="g6-tooltip"
      :style="`top: ${top}px; left: ${left}px;`"
    >
      name: {{ tooltip }}
    </div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import registerFactory from "../Graph/js/graph";
import ItemPanel from "./ItemPanel";
import { mapGetters } from "vuex";
export default {
  components: {
    ItemPanel
  },
  data() {
    return {
      graph: {},
      highLight: {
        undo: false,
        redo: false
      },
      showTool: true,
      // 保存线条样式
      lineStyle: {
        type: "line",
        width: 2
      },
      label: "",
      edgeLabel: "",
      labelCfg: {
        fontSize: 16,
        fill: "#fff"
      },
      node: {
        fill: "#1c64d9",
        lineDash: "none",
        borderColor: ""
      },
      edge: {},
      configVisible: false,
      edgeconfigVisible: false,
      config: {},
      edgeconfig: {},
      tooltip: "",
      top: 0,
      left: 0,
      canvasOffset: {
        x: 0,
        y: 0
      }
    };
  },
  computed: {
    ...mapGetters("app", {
      data: "data"
    })
  },
  mounted() {
    // 创建画布
    this.$nextTick(() => {
      this.createGraphic();
      this.initGraphEvent();
    });
  },
  beforeDestroy() {
    this.graph.destroy();
  },

  methods: {
    createGraphic() {
      const vm = this;
      const menu = new G6.Menu({
        offsetX: -20,
        offsetY: -50,
        itemTypes: ["node"],
        getContent() {
          const outDiv = document.createElement("div");
          outDiv.style.width = "80px";
          outDiv.style.cursor = "pointer";
          outDiv.innerHTML = '<p id="deleteNode">删除节点</p>';
          return outDiv;
        },
        handleMenuClick(target, item) {
          const { id } = target;
          if (id) {
            vm[id](item);
          }
        }
      });
      const edgeItem = new G6.Menu({
        offsetX: -20,
        offsetY: -50,
        itemTypes: ["edge"],
        getContent() {
          const outDiv = document.createElement("div");
          outDiv.style.width = "80px";
          outDiv.style.cursor = "pointer";
          outDiv.innerHTML = '<p id="deleteEdge">删除链接</p>';
          return outDiv;
        },
        handleMenuClick(target, item) {
          const { id } = target;
          if (id) {
            vm[id](item);
          }
        }
      });
      const minimap = new G6.Minimap({
        size: [200, 100]
      });
      const canvasPanelDom = document.getElementById("canvasPanel");
      const cfg = registerFactory(G6, {
        width: canvasPanelDom.getBoundingClientRect().width - 40,
        height: canvasPanelDom.getBoundingClientRect().height - 40,
        // renderer: 'svg',
        fitView: true,
        layout: {
          type: "xxx" // 位置将固定
        },
        // 覆盖全局样式
        nodeStateStyles: {
          "nodeState:default": {
            opacity: 1
          },
          "nodeState:hover": {
            opacity: 0.8
          },
          "nodeState:selected": {
            opacity: 0.9
          }
        },
        // 默认边不同状态下的样式集合
        edgeStateStyles: {
          "edgeState:default": {
            stroke: "#aab7c3"
          },
          "edgeState:selected": {
            stroke: "#1890FF"
          },
          "edgeState:hover": {
            animate: true,
            animationType: "dash",
            stroke: "#000"
          }
        },
        plugins: [menu, edgeItem, minimap]
        // ... 其他G6原生入参
      });

      this.graph = new G6.Graph(cfg);
      setTimeout(() => {
        let datas = JSON.parse(JSON.stringify(this.data));
        this.graph.read(datas); // 读取数据
      }, 500);
      // this.graph.paint(); // 渲染到页面
      // this.graph.get('canvas').set('localRefresh', false); // 关闭局部渲染
      // this.graph.fitView();
    },
    // 复制节点
    // copyNode() {
    //   console.log("复制节点");
    // },
    // 粘贴节点
    // paste() {
    //   console.log("粘贴节点");
    // },
    deleteEdge(item) {
      let model = item.get("model");
      let datas = JSON.parse(JSON.stringify(this.data));
      if (datas.edges && datas.edges.length) {
        datas.edges.forEach(el => {
          if (el.id === model.id) {
            this.$confirm("此操作将永久该链接, 是否继续?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.graph.removeItem(item);
                this.$store.dispatch("app/_edgesDEL", model.id);
                let datas = JSON.parse(JSON.stringify(this.data));
                this.graph(datas);
                // this.$message({
                //   type: "success",
                //   message: "删除成功!",
                // });
                let data = JSON.parse(JSON.stringify(this.data));
                this.graph.read(data);
              })
              .catch(() => {
                return;
              });
          } else {
            let datas = JSON.parse(JSON.stringify(this.data));
            this.graph.read(datas);
          }
        });
      } else {
        this.graph.removeItem(item);
      }
    },
    deleteNode(item) {
      let model = item.get("model");
      let datas = JSON.parse(JSON.stringify(this.data));
      if (datas.nodes && datas.nodes.length) {
        datas.nodes.forEach(el => {
          if (el.id === model.id) {
            let data = JSON.parse(JSON.stringify(this.data));
            if (data.edges && data.edges.length) {
              data.edges.forEach(e => {
                if (e.source === model.id) {
                  this.$store.dispatch("app/_edgesDEL", e.source);
                }
                if (e.target === model.id) {
                  this.$store.dispatch("app/_edgesDEL", e.target);
                }
              });
            }
            this.$store.dispatch("app/_nodesDEL", model.id);
            // this.$message({
            //   type: "success",
            //   message: "删除成功!",
            // });
            let datas = JSON.parse(JSON.stringify(this.data));
            this.graph.read(datas);
          } else {
            let datas = JSON.parse(JSON.stringify(this.data));
            this.graph.read(datas);
            // this.graph.removeItem(item);
          }
        });
      } else {
        this.graph.removeItem(item);
      }
    },
    // 添加节点
    addNode(e) {
      const model = {
        text: "node",
        label: "",
        id: String(new Date().getTime()),
        // 形状
        type: e.target.dataset.shape,
        // 坐标
        x: e.clientX - this.canvasOffset.x - 40,
        y: e.clientY - this.canvasOffset.y - 40
      };
      this.graph.addItem("node", model);
    },
    // 初始化图事件
    initGraphEvent() {
      this.graph.on("on-canvas-dragend", e => {
        this.canvasOffset.x = e.dx;
        this.canvasOffset.y = e.dy;
      });
      this.graph.on("on-node-mouseenter", e => {
        if (e && e.item) {
          // console.log(e.item.get("model"));
          // const model = e.item.get('model');
          // model.style.fill = 'rgba(24, 144, 255, .3)';
        }
      });

      this.graph.on("after-node-selected", e => {
        this.configVisible = !!e;
        this.edgeconfigVisible = false;
        if (e && e.item) {
          const model = e.item.get("model");
          this.config = model;
          this.label = model.label;
          this.labelCfg = {
            fill: model.labelCfg ? model.labelCfg.fill : "#fff",
            fontSize: model.labelCfg ? model.labelCfg.fontSize : 16
          };
          this.node = {
            fill: model.style.fill,
            borderColor: model.style.stroke,
            lineDash: model.style.lineDash || "none",
            width: model.style.width,
            height: model.style.height,
            shape: model.type
          };
          this.$emit("node-check", this.node);
        }
      });

      this.graph.on("after-edge-selected", e => {
        this.edgeconfigVisible = !!e;
        this.configVisible = false;
        if (e && e.item) {
          this.edgeLabel = this.edge.label ? this.edge.label : "";
          this.configVisible = false;
          this.graph.updateItem(e.item, {
            // shape: 'line-edge',
            style: {
              radius: 10,
              lineWidth: 2
            }
          });
          this.$emit("edge-check", this.edge);
        }
      });

      this.graph.on("on-edge-mousemove", e => {
        if (e && e.item) {
          this.tooltip = e.item.get("model").label;
          this.left = e.clientX + 40;
          this.top = e.clientY - 20;
        }
      });

      this.graph.on("click", () => {
        // console.log(ev);
        // let id = this.graph;
      });

      this.graph.on("on-node-mousemove", e => {
        if (e && e.item) {
          this.tooltip = e.item.get("model").label;
          this.left = e.clientX + 40;
          this.top = e.clientY - 20;
        }
      });

      this.graph.on("on-node-mouseleave", e => {
        if (e && e.item) {
          this.tooltip = "";
        }
      });

      this.graph.on("on-edge-mouseleave", e => {
        if (e && e.item) {
          this.tooltip = "";
        }
      });

      this.graph.on("before-node-removed", ({ callback }) => {
        // console.log(target);
        setTimeout(() => {
          // 确认提示
          callback(true);
        }, 1000);
      });

      // this.graph.on("after-node-dblclick", e => {
      //   if (e && e.item) {
      //     console.log(e.item);
      //   }
      // });

      this.graph.on(
        "before-edge-add",
        ({ source, target, sourceAnchor, targetAnchor }) => {
          setTimeout(() => {
            let obj = {
              id: String(new Date().getTime()),
              source: source.get("id"),
              target: target.get("id"),
              sourceAnchor,
              targetAnchor,
              label: ""
            };
            this.edge = JSON.parse(JSON.stringify(obj));
            this.graph.addItem("edge", obj);
          }, 100);
        }
      );
    },
    nodeSave() {
      let obj = {
        id: this.config.id,
        x: this.config.x,
        y: this.config.y,
        label: this.label,
        type: this.node.shape,
        labelCfg: {
          fontSize: Number(this.labelCfg.fontSize) || 16,
          fill: this.labelCfg.fill || "#fff"
        },
        style: {
          fill: this.node.fill,
          shadowOffsetX: 0,
          shadowOffsetY: 2,
          shadowColor: "#666",
          shadowBlur: 10,
          borderColor: this.node.borderColor || "node",
          lineDash: this.node.lineDash || "none"
        }
      };
      // if (obj.label !== "") {
      let arr = JSON.parse(JSON.stringify(this.data));
      if (arr.nodes && arr.nodes.length) {
        arr.nodes.forEach(e => {
          if (e.id === this.config.id) {
            this.$store.dispatch("app/_nodesDEL", this.config.id);
          }
        });
      }
      obj.label = this.label;
      this.$store.dispatch("app/_nodesADD", Object.assign({}, obj));
      let graphData = JSON.parse(JSON.stringify(this.data));
      console.log(graphData, "graphData");
      this.graph.read(graphData);
      this.configVisible = false;
      // } else {
      // }
    },
    edgeSave() {
      let arr = JSON.parse(JSON.stringify(this.data));
      if (arr.edges && arr.edges.length) {
        arr.edges.forEach(e => {
          if (e.id === this.edge.id) {
            this.$store.dispatch("app/_edgesDEL", this.edge.id);
          }
        });
      }
      this.edge.label = this.edgeLabel;
      this.$store.dispatch("app/_edgesADD", Object.assign({}, this.edge));
      let graphData = JSON.parse(JSON.stringify(this.data));
      this.graph.read(graphData);
      this.edgeconfigVisible = false;
      this.configVisible = false;
    },
    saveAll() {}
  }
};
</script>

<style lang="scss">
/* 提示框的样式 */
.g6-tooltip {
  position: fixed;
  top: 0;
  left: 0;
  font-size: 16px;
  color: #545454;
  border-radius: 4px;
  border: 1px solid #e2e2e2;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: rgb(174, 174, 174) 0 0 10px;
  padding: 10px 8px;
}
.g6-minimap {
  position: absolute;
  right: 0;
  bottom: 0;
  background: #fff;
}
.panel-title {
  font-size: 20px !important;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  .btn {
    width: 120px !important;
    height: 35px;
    border: none;
    color: #fff;
    font-size: 16px;
    background-color: #46a0fc;
    border: 1px solid #46a0fc;
    &:hover {
      opacity: 0.8;
    }
  }
}

.form_box {
  font-size: 16px;
  padding: 20px;
  > div {
    margin: 10px auto;
    > input {
      font-size: 16px;
      width: 200px;
      height: 30px;
    }
  }
}
</style>
