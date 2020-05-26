<template>
  <div class="search">
    <div class="header">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <scroll :data="content" class="content" v-show="!query" ref="scroll">
      <div class="scroll-wrap">
        <div class="search-history" v-show="searchHistory.length">
          <h2 class="search-title">
            <span>搜索历史</span>
            <span class="iconfont icon-clear" @click="clearHistory">&#xe66d;</span>
          </h2>
          <div class="history-content">
            <ul>
              <li
                v-for="(item,index) in searchHistory"
                :key="index"
                class="item"
                @click="addQuery(item)"
              >
                {{ item }}
              </li>
            </ul> 
          </div>
        </div>
        <div class="hotkey">
          <h2 class="title">热门搜索</h2>
          <ul>
            <li class="item" v-for="(item,index) in hotkey" :key="index" @click="addQuery(item.k)">
              <div class="rank" :class="{top:index<3}">{{ index + 1 }}</div>
              <span class="name">{{ item.k }}</span>
              <span class="num">{{ item.n }}</span>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <Suggest :query="query" @listScroll="blurInput" @setHistory="setHistory"></Suggest>
    </div>
    <slide>
      <router-view></router-view>
    </slide>
  </div>
</template>

<script>
import SearchBox from 'common/search-box/SearchBox'
import Suggest from '../suggest/suggest'
import Slide from 'common/animation/slide'
import Scroll from 'common/scroll'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config.js'
import {mapGetters,mapActions} from 'vuex'
import { MessageBox } from 'mint-ui'
import { playlistMixin } from '@/assets/js/mixin'
export default {
  name: 'Search',
  mixins: [playlistMixin],
  data () {
    return {
      hotkey: [],
      query: ''
    }
  },
  created () {
    this._getHotKey()
  },
  computed: {
    content () { //整个可滚动内容区的数据，传入swiper组件使其正确计算滚动内容高度
      return this.hotkey.concat(this.setHistory)
    },
    ...mapGetters({
      searchHistory: 'getSearchHistory'
    })
  },
  methods : {
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.hotkey = res.data.hotkey.slice(0,20)
        }
      })
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (newVal) {
      this.query = newVal
    },
    blurInput () { //列表滚动时失去input焦点
      this.$refs.searchBox.blur()
    },
    setHistory () {
      this.saveSearchHistory(this.query)
    },
    clearHistory () {
      MessageBox.confirm('确定执行此操作?').then(() => {
        this.clearSearchHistory()
      })
    },
    handlePlaylist () {
      const bottom = this.playlist && this.playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapActions({
      saveSearchHistory: 'saveSearchHistory',
      clearSearchHistory: 'clearSearchHistory'
    })
  },
  components: {
    SearchBox,
    Suggest,
    Slide,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
  .search
    position absolute
    width 100%
    top 176px
    bottom 0
    background $bgColor2
    overflow hidden
    .title
      margin 20px 0
      font-size $font-size-mx
    .header
      position relative
      padding 20px 30px
    .content
      position absolute
      top 100px
      bottom 0
      width 100%
      overflow hidden
      .scroll-wrap
        padding-bottom 80px
      .search-history
        padding 0 30px
        .search-title
          font-size $font-size-mx
          margin 20px 0
          .icon-clear
            font-size 40px
            float right
            color $greyColor
        .history-content
          
          .item
            display inline-block
            font-size $font-size-m
            text-align center
            margin: 0 20px 20px 0
            padding 0 20px
            height 50px
            line-height 50px
            background $activeColor
            border-radius 40px
      .hotkey
        padding 0 30px
        .item
          display flex
          align-items center
          height 80px
          font-size $font-size-m
          .rank
            margin-right 30px
            color $greyColor
            &.top
              color red
          .name
            flex 1
            text-overflow ellipsis
            overflow hidden
            white-space nowrap
            line-height 30px
          .num
            color $greyColor
    .search-result
      position absolute
      top 100px
      bottom 0
      width 100%
</style>
