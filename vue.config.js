/*
 * @Author: your name
 * @Date: 2020-12-03 10:39:23
 * @LastEditTime: 2021-01-20 17:55:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \newProject\vue.config.js
 */
const isProduction = process.env.NODE_ENV === "production" ? true : false; // 判断是否为生产环境
const PUBLIC_PATH = isProduction ? "./" : "/";

module.exports = {
  // lintOnSave: true,
  publicPath: PUBLIC_PATH,
  // ----------- 添加打包方式 ------------
  productionSourceMap: !isProduction, // 不生成map
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         require("postcss-pxtorem")({
  //           // 把px单位换算成rem单位
  //           rootValue: 192, // 换算的基数(设计图750的根字体为75)
  //           // selectorBlackList: ['weui', 'mu'], // 忽略转换正则匹配项
  //           propList: ["*"],
  //         }),
  //       ],
  //     },
  //   },
  // },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "";
      return args;
    });
  },
  // -------------- 打包方式 end -----------
  devServer: {}
};
