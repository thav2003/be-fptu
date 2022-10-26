const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const commonPath = path.resolve(__dirname, "../../");

module.exports.babelLoader = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: {
    loader: "babel-loader",
    options: {
      presets: ["@babel/preset-env"],
      plugins: ["@babel/plugin-transform-runtime"],
    },
  },
};

module.exports.nodeLoader = {
  test: /\.node$/,
  loader: "node-loader",
};

module.exports.resolve = {
  extensions: [".js", "jsx", "ts", "'.mjs'"],
};

module.exports.optimization = {
  splitChunks: {
    chunks: "async",
    minSize: 30000,
    maxSize: 0,
    cacheGroups: {
      commons: {
        test: /[\\/]node_modules[\\/]/,
        name: "vendors",
        chunks: "all",
      },
    },
  },
  minimizer: [
    new TerserPlugin({
      parallel: true,
    }),
  ],
};

module.exports.commonPath = commonPath;
