<template>
  <scroll
    :data="list"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollEnd="searchMore"
    @beforeScroll="listScroll"
    class="suggest"
  >
    <div class="suggest-content">
      <h3 class="suggest-title" v-show="showInfo">为您推荐</h3>
      <div class="info" v-show="showInfo" @click="selectInfo">
        <div class="info-img">
          <img :src=info.img>
        </div>
        <div class="info-center">
          <div class="info-title">{{info.title}}</div>
          <div class="info-desc">{{info.desc}}</div>
        </div>
        <div class="info-right">
          <i class="iconfont forward">&#xe62d;</i>
        </div>
      </div>
      <div class="list">
        <song-list :songs="list" :showPlayAll="showPlayAll" @select="selectSong" @playAll="playAll"></song-list>
        <loading v-show="hasMore" title=""></loading>
      </div>
      <div v-show="!hasMore && !list.length" class="no-result-wrapper">
        很抱歉，暂时没有找到与“<span style="color:#31c27c">{{query}}</span>”相关的结果
      </div>
    </div>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { ERR_OK } from 'api/config.js'
import { creatSong, isValidMusic, processSongsUrl } from '@/assets/js/song'
import { Toast } from 'mint-ui'
import SongList from 'common/song-list/SongList'
import Scroll from 'common/scroll'
import Loading from 'common/loading/loading'
import Singer from '@/assets/js/singer'
import { mapMutations, mapActions } from 'vuex'

const perpage = 20
export default {
  name: 'Suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    showPlayAll: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      info: {
        img: '',
        title: '',
        desc: ''
      },
      infoSinger: {},
      showInfo: false,
      list: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  methods: {
    _search () {
      this.page = 1
      this.hasMore = true
      search(this.query, this.page, this.showSinger, 20).then((res) => {
        if (res.code === ERR_OK) {
          this.setInfo(res)
          this._genResult(res.data).then((result) => {
            this.list = result
            this.checkMore(res.data)
          })
        }
      })
    },
    setInfo (res) {
      if (res.data.zhida && res.data.zhida.singerid) {
        this.showInfo = true
        this.infoSinger = res.data.zhida
        this.info.img = `http://y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.zhida.singermid}.jpg?max_age=2592000`
        this.info.title = `歌手:${res.data.zhida.singername}`
        this.info.desc = `歌曲:${res.data.zhida.songnum} 专辑:${res.data.zhida.albumnum}`
      } else {
        this.showInfo = false
      }
    },
    _genResult (data) {
      let ret = []
      return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(creatSong(musicData))
        }
      })
      return ret
    },
    listScroll () {
      this.$emit('listScroll')
    },
    searchMore () { // 列表滚动到底时执行
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.list = this.list.concat(result)
          })
          this.checkMore(res.data)
        }
      })
    },
    checkMore (data) { // 判断是否翻到最后一页
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
        this.hasMore = false
      }
    },
    selectInfo () {
      const singer = new Singer({
        id: this.infoSinger.singermid,
        name: this.infoSinger.name
      })
      this.$router.push({
        path: `/search/${singer.id}`
      })
      // 同步vuex中的singer
      this.setSinger(singer)
      // 派发存入搜索历史事件
      this.$emit('setHistory')
    },
    selectSong (song, index) {
      if (this.showPlayAll) {
        this.insertSong(song)
      } else {
        this.pushSong(song)
      }
      // 派发存入搜索历史事件
      this.$emit('setHistory')
      Toast({
        message: '1首歌曲已插入播放列表',
        duration: 1000
      })
    },
    playAll () {
      this.selectPlay({
        list: this.list,
        index: 0
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
    query () {
      this._search()
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
@import '~styles/variable.styl'
  .suggest
    width 100%
    height 100%
    overflow hidden
    .suggest-title
      font-size $font-size-s
      color $greyColor
      padding 10px 40px
    .info
      padding 0 40px
      height 120px
      display flex
      align-items center
      margin-bottom 30px
      .info-img
        border-radius 50%
        width 100px
        margin-right 30px
        img
          border-radius 50%
          width 100px
      .info-center
        flex 1
        .info-title
          font-size $font-size-m
          line-height 30px
        .info-desc
          font-size $font-size-s
          color $greyColor
          line-height 36px
      .info-right
        .forward
          font-size 36px
          color $greyColor
    .no-result-wrapper
      text-align center
      padding-top 100px
      font-size $font-size-m
</style>
