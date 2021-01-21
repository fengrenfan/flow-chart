/*
 * @Author: feng
 * @Date: 2021-01-15 14:07:43
 * @LastEditTime: 2021-01-21 10:17:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vue-flow-chart\src\main.js
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import flowChart from "./components/Graph/index";
Vue.use(flowChart);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount("#app");
