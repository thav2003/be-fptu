/* eslint-disable global-require */
/* eslint-disable arrow-body-style */
const path = require("path");
const nodeExternals = require("webpack-node-externals");
module.exports = () => {
  return require("../common/webpack.core")({
    environment: "production",
    entry: { server: "./server.js" },
    output: {
      path: path.resolve(__dirname, "../../", "build"),
      filename: `[name].js`,
    },
    mode: "production",
    target: "node",
    externals:[nodeExternals()]
  });
};
