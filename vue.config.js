const path = require('path');
const axios = require('axios')
const bodyParser = require('body-parser')
function resolve (dir) {
  return path.join(__dirname,  dir)
}
module.exports = {
  lintOnSave: true,
  publicPath: './',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
            require('postcss-px2rem-exclude')({remUnit: 37.5, exclude: /node_modules/}), // 换算的基数
        ]
      },
      stylus: {
        import: resolve('src/assets/styles/variable.styl')
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@',resolve('src'))
      .set('styles',resolve('src/assets/styles'))
      .set('common',resolve('src/common'))
      .set('api',resolve('src/api'))
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://101.200.50.231:3000/',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
