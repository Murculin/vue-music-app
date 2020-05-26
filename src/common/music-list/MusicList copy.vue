<template>
  <div class="music-list">
    <div class="header">
      <div class="back">
        <i class="iconfont icon-back" @click="goBack">&#xe624;</i>
      </div>
      <h1 class="header-title">{{ this.title }}</h1>
    </div>
    <div class="bg-wrapper" ref="bgImageWrap">
      <div class="bg-image" :style="setBackGround" ref="bgImage">
        <div class="filter" ref="filter"></div>
      </div>
    </div>
    <div class="layer" ref="layer">
      <scroll
      class="list"
      ref="list"
      :data="songs"
      :listenScroll="listenScroll"
      :probeType="probeType"
      @scroll="scroll"
      >
        <div class="list-wrap" ref="listWrap">
          <song-list :songs="songs" @select="selectItem" @playAll="playAll"></song-list>
        </div>
        <div v-show="!songs.length" class="loading-container">
          <loading></loading>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import SongList from 'common/song-list/song-list'
import Scroll from 'common/scroll'
import Loading from 'common/loading/loading'
import { mapActions } from 'vuex'
import { playlistMixin } from '@/assets/js/mixin'
export default {
  name: 'MusicList',
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 监听滚动
      listenScroll: true,
      probeType: 3,
      scrollY: -1,
      imageHeight: 0,
      minHeight: 0,
      flag: false
    }
  },
  computed: {
    setBackGround () {
      return `background-image: url(${this.bgImage})`
    }
  },
  mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.minHeight = (this.imageHeight - 44) * 2 / 37.5
    this.$refs.list.$el.style.top = `${this.minHeight}rem`
  },
  methods: {
    scroll (pos) {
      this.scrollY = pos.y * 2 / 37.5
    },
    goBack () {
      this.$router.go(-1)
    },
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    playAll () {
      this.selectPlay({
        list: this.songs,
        index: 0
      })
    },
    handlePlaylist () {
      const bottom = this.playlist && this.playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  watch: {
    scrollY (newVal) {
      let scalePrecent = 1.1
      let blur = 0
      let zIndex = 0
      const precent = Math.abs(newVal / (this.imageHeight / 37.5))
      if (newVal > 0) {
        scalePrecent = Math.min((1.1 + precent), 1.4)
        zIndex = 20
      } else {
        blur = Math.min((precent * 20), 20)
      }
      this.$refs.bgImage.style.filter = `blur(${blur}px)`
      this.$refs.bgImageWrap.style.zIndex = zIndex
      if (scalePrecent !== 1.15) {
        this.$refs.bgImageWrap.style['transform'] = `scale(${scalePrecent})`
        this.$refs.bgImage.style['transform'] = `scale(${scalePrecent})`
      }
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
@import "~styles/variable.styl"
  .music-list
    position fixed
    top 0
    right 0
    left 0
    bottom 0
    z-index 100
    background $bgColor2
    .header
      position absolute
      top 0
      right 0
      left 0
      z-index 110
      height 88px
      line-height 88px
      text-align center
      background rgba(0,0,0,0)
      display flex
      padding 0 40px
      color $activeColor
      .back
        .icon-back
          font-size 40px
          font-weight bold
      .header-title
        margin 0 auto
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
        font-size $font-size-l
    .bg-wrapper
      position relative
      overflow hidden
      .bg-image
          position relative
          width 100%
          height 0
          padding-bottom 70%
          background-repeat norepeat
          background-size cover
          transform scale(1.15)
          .filter
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            background rgba(7,17,27,.2)
    .layer
      position absolute
      width 100%
      height 100%
      top 88px
      background rgba(0,0,0,0)
      overflow hidden
      .list
        position absolute
        width 100%
        bottom 0
        .list-wrap
          position relative
          z-index 51
          width 100%
          padding 40px 0 124px 0
          background $bgColor2
          box-sizing border-box
        .loading-container
          position absolute
          width 100%
          top 50%
          transform translateY(-50%)
</style>
