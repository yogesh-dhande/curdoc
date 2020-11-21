module.exports = {
    chainWebpack: config => {
      config.module
        .rule('node')
        .test(/\.node$/)
        .use('node-loader')
        .loader('node-loader')
        .end();
    },
  }