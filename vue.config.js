const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: true,
  // publicPath: 'http://101.200.50.231/music',
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
      .set('@', resolve('src'))
      .set('styles', resolve('src/assets/styles'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
  },
  devServer: {
    host: '192.168.1.2'
    // proxy: {
    //   '/api': {
    //     target: 'http://101.200.50.231:3000/',
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  }
}
