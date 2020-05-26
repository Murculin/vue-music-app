<template>
  <div class="search">
    <nav-bar
      color="black"
      background="#fff"
    >
      <template v-slot:left>
        <i
          class="iconfont iconfanhui"
          @click="handleClickBack"
        />
      </template>
      <template v-slot:center>
        <search-box
          class="input"
          ref="searchBox"
          @query="onQueryChange"
        />
      </template>
      <template v-slot:right>
        <player-icon defaultColor="black"/>
      </template>
    </nav-bar>
    <scroll class="scroll-wrapper">
      <div class="scroll-content">
        <search-history
          v-show="!query" 
          :list="searchHistory"
          @selectHistory="addQuery"
          @clearHistory="clearHistory"
        />
        <search-hot-key v-show="!query" :hotkey="hotkey" @selectHotkey="addQuery"/>
      </div>
    </scroll>
    <search-result
      v-show="query"
      :query="query"
      @listScroll="listScroll"
      @setHistory="setHistory"
    />
    <slide>
      <router-view></router-view>
    </slide>
  </div>
</template>

<script>
import NavBar from 'common/nav-bar/NavBar'
import PlayerIcon from 'common/player-icon/PlayerIcon'
import SearchBox from 'common/search-box/SearchBox'
import SearchHistory from './SearchHistory'
import SearchHotKey from './SearchHotKey'
import SearchResult from './SearchResult'
import Slide from 'common/animation/slide'
import Scroll from 'common/scroll'
import {getHotKey} from 'api/search'
import {mapGetters,mapActions} from 'vuex'
import { MessageBox } from 'mint-ui'
export default {
  data () {
    return {
      hotkey: [],
      query: ''
    }
  },
  created () {
    this._getHotKey()
  },
  mounted () {
    this.$refs.searchBox.focus()
  },
  computed: {
    content () { //整个可滚动内容区的数据，传入scroll组件使其正确计算滚动内容高度
      return this.hotkey.concat(this.setHistory)
    },
    ...mapGetters({
      searchHistory: 'getSearchHistory'
    })
  },
  methods : {
    async _getHotKey () {
      const res = await getHotKey()
      this.hotkey = res.result.hots
    },
    handleClickBack () {
      if(this.query) {
        this.query = ''
        this.addQuery('')
        return
      }
      this.$router.back()
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange(query) {
      this.query = query
    },
    setHistory () {
      this.saveSearchHistory(this.query)
    },
    clearHistory () {
      MessageBox.confirm('确定执行此操作?').then(() => {
        this.clearSearchHistory()
      })
    },
    listScroll () {
      this.$refs.searchBox.blur()
    },
    ...mapActions({
      saveSearchHistory: 'saveSearchHistory',
      clearSearchHistory: 'clearSearchHistory'
    })
  },
  components: {
    SearchBox,
    Slide,
    Scroll,
    NavBar,
    SearchHistory,
    SearchHotKey,
    SearchResult,
    PlayerIcon
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
.search
  position absolute
  width 100%
  top 0
  bottom 0
  z-index 101
  background $bgColor2
  overflow hidden
  .input
    margin-top 44px
    transform translateY(-50%)
  .iconfanhui
    font-size 32px
    font-weight bold
  .scroll-wrapper
    position absolute
    top 88px
    bottom 0
    left 0
    right 0
</style>
