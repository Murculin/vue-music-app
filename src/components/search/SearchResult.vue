<template>
  <div class="search-result">
    <scroll
      :data="songs"
      :pullup="true"
      :beforeScroll="true"
      @scrollEnd="searchMore"
      @beforeScroll="listScroll"
      class="scroll-wrapper"
    >
      <div class="scroll-content">
        <!-- 歌手搜索结果 -->
        <div class="singer-result" v-show="isShowSinger && singers.length">
          <h3 class="result-title">歌手</h3>
          <div
            class="singer-item"
            v-for="singer in singers"
            :key="singer.id"
            @click="selectSinger(singer)"
          >
            <img v-lazy="singer.picUrl" class="avatar">
            <span class="name">{{ singer.name }}</span>
          </div>
        </div>
        <!-- 歌曲搜索结果 -->
        <div class="song-result-list">
          <h3 class="result-title" v-show="songs.length">单曲</h3>
          <song-list
            :songs="songs"
            :showPlayAll="true"
            @select="selectSong"
            @playAll="playAll"
          />
          <loading v-show="hasMore && hasResult" title="正在加载..."></loading>
        </div>
        <!-- 没有匹配结果 -->
        <div v-show="!hasResult" class="no-result-wrapper">
          很抱歉，暂时没有找到与“<span style="color:#31c27c">{{query}}</span>”相关的结果
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getSingers, getResult, getSongImg } from 'api/search'
import { createSearchSong } from '@/assets/js/song'
import { processSongsUrl } from 'api/music'
import { Toast } from 'mint-ui'
import SongList from 'common/song-list/SongList'
import Loading from 'common/loading/loading'
import Scroll from 'common/scroll'
import { mapMutations, mapActions } from 'vuex'

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    isShowSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      singers: [],
      songs: [],
      hasMore: true,
      hasResult: true
    }
  },
  methods: {
    async _getResult () {
      // 输入值改变时初始化
      this.page = 1
      this.singers = []
      this.songs = []
      this.hasMore = true
      this.hasResult = true
      try {
        // 获取歌手列表
        const singers = await getSingers(this.query)
        this.singers = singers
        // 获取歌曲列表
        this._getSongs()
      } catch(e) {
        // 请求失败，显示对应的ui
        console.log(e)
        this.hasResult = false
      }
    },
    async _getSongs () {
      let res = await getResult(this.query, 1, this.page)
      if(!res.result.songs || res.result.songs.length < 30) {
        this.hasMore = false
      }
      let songs = res.result.songs.map(music => createSearchSong(music))
      getSongImg(songs)
      songs = await processSongsUrl(songs)
      this.songs = this.songs.concat(songs)
    },
    // 点击插入歌曲
    selectSong (song, index) {
      this.insertSong(song)
      // 派发存入搜索历史事件
      this.$emit('setHistory')
      Toast({
        message: '1首歌曲已插入播放列表',
        duration: 1000
      })
    },
    playAll () {
      this.selectPlay({
        list: this.songs,
        index: 0
      })
    },
    listScroll () {
      // 派发滚动事件 让输入框失去焦点
      this.$emit('listScroll')
    },
    searchMore () { // 下拉加载更多
      if(!this.hasMore) {
        return
      }
      this.page += 1
      this._getSongs()
    },
    selectSinger (singer) {
      this.setSinger(singer)
      this.$router.push({
        path: `/search/singer/${singer.id}`
      })
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions({
      selectPlay: 'selectPlay',
      insertSong: 'insertSong',
      pushSong: 'pushSong'
    })
  },
  watch: {
    query (query) {
      if(!query) {
        return
      }
      this._getResult()
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
.search-result
  position absolute
  top 88px
  bottom 0
  width 100%
  .scroll-wrapper
    position absolute
    top 0
    bottom 0
    width 100%
    overflow hidden
    .scroll-content
      padding-top 30px
    .result-title
      font-size $font-size-m
      font-weight bold
      padding 0 20px
    .singer-item
      padding 40px 0 0 20px
      display flex
      .avatar
        width 100px
        height 100px
        border-radius 50%
      .name
        height 100px
        line-height 100px
        margin-left 30px
        font-size $font-size-m
    .song-result-list
      .result-title
        margin 30px 0
</style>
