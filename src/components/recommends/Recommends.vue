<template>
  <div class="recommend">
    <scroll
      class="scroll-wrapper"
      ref="scroll"
      :data="totalList"
      :pullup="true"
      @scrollEnd="scrollEnd"
    >
      <div class="scroll-content">
        <recommend-swiper
          :swiperList="swiperList"
          @imgLoaded = "imgLoaded"
        />
        <scroll-row-list
          :list="personalizedList"
          title="为您推荐"
          @selectItem="selectDisc"
        />
        <recommend-disc
          :list="discList"
          @selectDisc="selectDisc"
        />
        <loading v-show="isShowLoadMore"/>
      </div>
    </scroll>
    <slide>
      <router-view></router-view>
    </slide>
  </div>
</template>

<script>
import Loading from 'common/loading/loading.vue'
import RecommendSwiper from './RecommendSwiper'
import RecommendDisc from './RecommendDisc'
import ScrollRowList from 'common/scroll-row-list/ScrollRowList'
import { getDiscList, getSwiperList, getPersonalized } from 'api/recommend.js'
import Scroll from 'common/scroll'
import { mapMutations } from 'vuex'
import Slide from 'common/animation/slide'

export default {
  name: 'Recommends',
  components: {
    Scroll,
    Loading,
    Slide,
    RecommendSwiper,
    RecommendDisc,
    ScrollRowList
  },
  data () {
    return {
      swiperList: [],
      discList: [],
      personalizedList: [],
      loaded: false, // 轮播图片是否加载完成
      lasttime: 0,
      isShowLoadMore: false,
      loading: false // 是否正在加载
    }
  },
  computed: {
    totalList () {
      return [...this.swiperList, ...this.discList, ...this.personalizedList]
    }
  },
  created () {
    // 获取轮播图数据
    this._getSwiperList()
    // 获取热门歌单数据
    this._getDiscList()
    // 获取个人推荐歌单
    this._getPersonalized()
  },
  methods: {
    async _getSwiperList () {
      const res = await getSwiperList()
      if(res.code === 200) {
        this.swiperList = res.banners
      }
    },
    async _getDiscList() {
      const res = await getDiscList(this.lasttime)
      this.loading = false
      console.log(res)
      if(res.code === 200) {
        this.lasttime = res.lasttime
        this.discList = this.discList.concat(res.playlists)
        this.isShowLoadMore = true
      }
    },
    async _getPersonalized () {
      const res = await getPersonalized()
      if(res.code === 200) {
        this.personalizedList = res.result.slice(0, 6)
      }
    },
    imgLoaded () { // 图片加载完后刷新滚动
      if(!this.loaded) {
        this.loaded =true
        this.$refs.scroll.refresh()
      }
    },
    scrollEnd () { // 监听滚动到底部
      if(this.loading) {
        return
      }
      if(this.discList.length >= 100) {
        this.isShowLoadMore = false
        return
      }
      this.loading = true
      this._getDiscList()
    },
    selectDisc (item) { // 点击歌单跳转页面
      this.setDisc(item)
      this.$router.push({
        path: `/recommends/${item.id}`
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .recommend
    position absolute
    width 100%
    top 88px
    bottom 0
    background $bgColor2
    overflow hidden
    .scroll-wrapper
      position absolute
      top 0
      bottom 88px
      width 100%
</style>
