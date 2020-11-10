let webpack = require('webpack');
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
  publicPath: './',
  configureWebpack: {
    externals: {
      echarts: 'echarts'
    },
    plugins: [
      new webpack.ProvidePlugin({
        "window.Quill": "quill/dist/quill.js",
        Quill: "quill/dist/quill.js"
      })
    ]
  },
  lintOnSave: 'error'
}
