<template>
  <div class="music-list">
    <!-- 头部 -->
    <music-list-header
      :title="title"
      :bgImage="bgImage"
      :opacity="headerOpacity"
      ref="header"
    />
    <!-- 图片部分 -->
    <music-list-img
      :bgImage="bgImage"
      ref="bgImage"
    />
    <!-- 歌曲列表部分 -->
    <scroll
      class="scroll-wrapper"
      :data="songs"
      :listenScroll="scrollOptions.listenScroll"
      :probeType="scrollOptions.probeType"
      @scroll="scroll"
    >
      <div class="scroll-content">
        <song-list :songs="songs" @select="selectItem"/>
      </div>
      <!-- loading -->
      <div v-show="!songs.length" class="loading-container">
        <loading/>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from 'common/song-list/SongList'
import MusicListHeader from './MusicListHeader'
import MusicListImg from './MusicListImg'
import Scroll from 'common/scroll'
import Loading from 'common/loading/loading'
import { mapActions } from 'vuex'
export default {
  name: 'MusicList',
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
      // 监听滚动设置
      scrollOptions: {
        listenScroll: true,
        probeType: 3,
      },
      headerOpacity: 0
    }
  },
  mounted () {
    // 计算各尺寸
    this.headerHeight = this.$refs.header.$el.clientHeight
    this.bgImageHeight = this.$refs.bgImage.$el.clientHeight
    this.dis = this.bgImageHeight - this.headerHeight
  },
  methods: {
    // 监听滚动
    scroll (pos) {
      const y = pos.y
      const h = this.bgImageHeight
      let opacity = this.headerOpacity
      if(y < 0) { // 上滑
        // 图片一同向上位移
        this.$refs.bgImage.$el.style.transform = `translate3d(0,${y}px,0)`
      } else { // 下滑
        const scalePrecent = (h + 2 * y) / h
        // 图片缩放
        this.$refs.bgImage.$el.style.transform = `scale(${scalePrecent})`
      }
      // 改变header的透明度
      opacity = -y  / this.dis
      opacity = opacity > 1 ? 1 : opacity
      opacity = opacity < 0 ? 0 : opacity
      this.headerOpacity = opacity
    },
    // 点击歌曲,改变vuex管理的各状态
    selectItem (item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // 点击playAll从第一首开始播放
    playAll () {
      this.selectPlay({
        list: this.songs,
        index: 0
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  components: {
    MusicListHeader,
    MusicListImg,
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
    .scroll-wrapper
      position absolute
      top 530px
      bottom 0
      width 100%
      .scroll-content
        background #fff
        padding-top 40px
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
