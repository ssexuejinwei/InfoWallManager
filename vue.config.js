module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://47.101.181.233:8000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
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
