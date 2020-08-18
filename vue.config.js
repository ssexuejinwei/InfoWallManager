module.exports = {
  devServer: {
    // proxy: {
    //   '/api': {
    //     target: 'http://112.126.66.14:5000/api',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // },
    overlay: {
      warnings: false,
      errors: false
    },
  },
  configureWebpack: {
    externals: {
      echarts: 'echarts'
    }
  },
  lintOnSave: 'error'
}
