import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex/index'
import fastClick from 'fastclick'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueLazyload from 'vue-lazyload'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './assets/styles/mint-color.styl'
import './assets/styles/index.styl'
import './assets/styles/border.css'
import './util/rem.js'
import 'swiper/dist/css/swiper.css'
import './assets/styles/iconfont/iconfont.css'
import "./assets/styles/variable.styl"

Vue.config.productionTip = false
fastClick.attach(document.body)
Vue.use(VueAwesomeSwiper)
Vue.use(VueLazyload, {
  loading: require('./assets/images/default.png')
})

// 格式化播放次数的过滤器
Vue.filter('formatCount', (count) => {
  count = (count + '').split('')
  if (count.length > 8) {
    const i = count.length - 8
    return count.slice(0, i).join('') + '亿'
  } else if(count.length > 4) {
    const i = count.length - 4
    return count.slice(0, i).join('') + '万'
  } else {
    return count.join('')
  }
})

Vue.use(MintUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
