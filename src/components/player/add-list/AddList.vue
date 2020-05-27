<template>
  <slide>
    <div class="addlist" v-show="isShow" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">关闭</div>
      </div>
      <div class="search-box-wrap">
        <search-box @query="queryChange" placeholder="搜索歌曲" ref="searchBox"></search-box>
      </div>
      <div v-show="!query" class="shortcut">
        <switches
          :switches="switches"
          :currentIndex="currentIndex"
          @switch="switchItem"
        ></switches>
        <div class="list-wrap">
          <scroll
            v-if="currentIndex===0"
            :data="playHistory"
            class="list-scroll"
          >
            <div class="list-inner">
              <song-list
                :showPlayAll="false"
                :songs="playHistory"
                @select="selectPlayHistory"
              ></song-list>
            </div>
          </scroll>
          <scroll
            v-if="currentIndex===1"
            :data="searchHistory"
            class="list-scroll"
          >
            <div class="list-inner">
              <transition-group name="list" tag="ul" class="history-list">
                <li
                  v-for="(item,index) in searchHistory"
                  :key="index"
                  class="history-item"
                >
                  <span class="title" @click="addQuery(item)">{{item}}</span>
                  <i class="iconfont delete-icon" @click="deleteSearchHistory(item)">&#xe668;</i>
                </li>
              </transition-group>
            </div>
          </scroll>
        </div>
      </div>
      <div v-show="query" class="result">
        <search-result
          v-show="query"
          :query="query"
          @listScroll="listScroll"
          @setHistory="setHistory"
          :showPlayAll="false"
          :isShowSinger="false"
        />
      </div>
    </div>
  </slide>
</template>

<script>
import Slide from 'common/animation/slide'
import SearchBox from 'common/search-box/SearchBox'
import SongList from 'common/song-list/SongList'
import Switches from 'common/switches/switches'
import Scroll from 'common/scroll'
import SearchResult from 'common/search-result/SearchResult'
import { Toast } from 'mint-ui'
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      isShow: false,
      query: '',
      currentIndex: 0,
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      searchHistory: 'getSearchHistory',
      playHistory: 'getPlayHistory'
    })
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    },
    queryChange (query) {
      this.query = query
    },
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    blurInput () { // 列表滚动时失去input焦点
      this.$refs.searchBox.blur()
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectPlayHistory (item, index) {
      console.log(item)
      this.pushSong(item)
      Toast({
        message: '1首歌曲已插入播放列表',
        duration: 1000
      })
    },
    listScroll () {
      this.$refs.searchBox.blur()
    },
    setHistory () {
      this.saveSearchHistory(this.query)
    },
    ...mapActions({
      saveSearchHistory: 'saveSearchHistory',
      clearSearchHistory: 'clearSearchHistory',
      deleteSearchHistory: 'deleteSearchHistory',
      savePlayHistory: 'savePlayHistory',
      insertSong: 'insertSong',
      pushSong: 'pushSong'
    })
  },
  components: {
    Slide,
    SearchBox,
    SongList,
    Switches,
    Scroll,
    SearchResult
  }
}
</script>

<style lang="stylus" scoped>
.addlist
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  background #fff
  .header
    position relative
    height 88px
    text-align center
    .title
      line-height 88px
      font-size $font-size-l
    .close
      position absolute
      top 0
      right 32px
      height 88px
      line-height 88px
      font-size $font-size-m
  .search-box-wrap
    margin 30px 40px
  .shortcut
      .list-wrap
        position absolute
        top 300px
        bottom 0
        width 100%
        .list-scroll
          height 100%
          overflow hidden
          .history-list
            .history-item
              font-size $font-size-m
              padding 0 50px
              height 80px
              display flex
              align-items center
              &.list-enter-active, &.list-leave-active
                transition all 0.1s
              &.list-enter, &.list-leave-to
                height 0
              .title
                text-overflow ellipsis
                overflow hidden
                white-space nowrap
                flex 1
                line-height 80px
              .delete-icon
                font-size 24px
  .result
    position absolute
    top 208px
    bottom 0
    width 100%
</style>
