/*
 * @Author: feng
 * @Date: 2021-01-21 09:32:17
 * @LastEditTime: 2021-01-21 10:44:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \flow-chart\src\components\Graph\index.js
 */
// graph 插件对应组件的名字
import graph from "./graph";
const flowChart = {
  install: (Vue) => {
    Vue.component(graph.name, graph);
  }
};
if (typeof window !== "undefined" && window.Vue) {
  //   window.flowChart = flowChart;
  window.Vue.use(flowChart);
}

export default flowChart;
