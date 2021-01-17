const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  configureWebpack: {
    devtool: "source-map",
    plugins: [new BundleAnalyzerPlugin(), new MonacoWebpackPlugin()],
  },
};
