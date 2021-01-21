/*
 * @Author: feng
 * @Date: 2021-01-21 09:23:53
 * @LastEditTime: 2021-01-21 09:34:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \flow-chart\webpack.config.js
 */
const path = require("path");
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  // 根据不同的执行环境配置不同的入口
  entry:
    NODE_ENV == "development"
      ? "./src/main.js"
      : "./src/components/Graph/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    publicPath: "/dist/",
    filename: "graph.js",
    library: "flow-chart", // 指定的就是你使用require时的模块名
    libraryTarget: "umd", // 指定输出格式
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  }
};
