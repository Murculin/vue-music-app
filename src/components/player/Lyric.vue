<template>
  <div
    class="lyric"
    @touchstart="lyricTouchStart"
    @touchmove="lyricTouchMove"
    @touchend="lyricTouchEnd"
  >
    <scroll
      class="scroll-wrap"
      ref="lyricScroll"
      :data="lyrics"
      :listenScroll="true"
      :probeType="probeType"
      @scroll="scroll"
    >
      <div class="lyric-wrap" ref="lyricContent">
        <p
          class="lyric-line"
          :class="lyricClass(index)"
          v-for="(item,index) in lyrics"
          :key="index"
          ref="lyricGroup"
        >
          {{ item.clause }}
        </p>
        <p class="lyric-line" v-show="lyrics.length===0">纯音乐，暂无歌词，请欣赏</p>
      </div>
    </scroll>
    <transition>
      <div class="time-line" v-show="showTimeLine&&lyrics.length>0">
        <div class="tiem-line-play" @click="setCurrentTime">
          <i class="iconfont icon-play">&#xe625;</i>
        </div>
        <div class="time-line-linenar"></div>
        <span class="time-line-time" @click="setCurrentTime">
          {{ nextLyricTime | formatTime }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import Scroll from 'common/scroll'

const ITEM_HEIGHT = 30
export default {
  name: 'Lyric',
  props: {
    lyrics: {
      type: Array,
      default: () => []
    },
    currentTime: {
      type: Number,
      default: 0
    },
    lyricLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      probeType: 3,
      scrollY: -1,
      onIndex: 0,
      nextIndex: 0,
      currentLyric: {},
      autoplay: true,
      showTimeLine: false,
      touch: {}
    }
  },
  components: {
    Scroll
  },
  computed: {
    nextLyricTime () {
      if (this.lyricLoading || !this.lyrics[this.nextIndex]) {
        return 0
      }
      let time = this.lyrics[this.nextIndex].time
      return time
    }
  },
  created () {
    this.timer = 0
  },
  mounted () {
    this.defaultPadding = this.$refs.lyricScroll.$el.clientHeight / 2
    this.$refs.lyricContent.style.paddingBottom = this.$refs.lyricContent.style.paddingTop = this.defaultPadding + 'px'
  },
  methods: {
    lyricTouchStart (e) {
      const firstTouch = e.touches[0]
      this.touch.x1 = firstTouch.pageX
      this.touch.y1 = firstTouch.pageY
      this.autoplay = false
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    lyricTouchMove (e) {
      const firstTouch = e.touches[0]
      this.touch.x2 = firstTouch.pageX
      this.touch.y2 = firstTouch.pageY
      const disX = this.touch.x2 - this.touch.x1
      const disY = this.touch.y2 - this.touch.y1
      if (Math.abs(disY) > Math.abs(disX) && Math.abs(disY) > 15) {
        this.showTimeLine = true
      }
    },
    lyricTouchEnd () {
      this.timer = setTimeout(() => {
        this.autoplay = true
        this.showTimeLine = false
      }, 2000)
    },
    lyricClass (index) {
      let ret = {}
      ret.active = index === this.onIndex
      ret.next = index === this.nextIndex && this.showTimeLine
      return ret
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    setCurrentLyric () {
      const lyrics = this.lyrics
      for (let i = 0; i < lyrics.length; i++) {
        const item = lyrics[i]
        if (this.currentTime >= lyrics[lyrics.length - 1].time) {
          this.currentLyric = item
          this.onIndex = lyrics.length - 1
          return
        }
        if (this.currentTime >= item.time && this.currentTime < lyrics[i + 1].time) {
          this.currentLyric = item
          this.onIndex = i
          return
        }
      }
    },
    startAutoplay () {
      let offsetY = this.defaultPadding - this.$refs.lyricGroup[this.onIndex].offsetTop - ITEM_HEIGHT / 2
      this.$refs.lyricScroll.scrollTo(0, offsetY, 700)
    },
    setCurrentTime () {
      this.$emit('setCurrentTime', this.lyrics[this.nextIndex].time)
    }
  },
  watch: {
    currentTime () {
      this.setCurrentLyric()
    },
    currentLyric (newVal, oldVal) {
      if (oldVal && oldVal.clause === newVal.clause) {
        return
      }
      if (this.autoplay) {
        this.startAutoplay()
      }
    },
    scrollY (val) {
      if (val > 0) {
        return
      }
      this.nextIndex = Math.floor(-val / ITEM_HEIGHT)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
  .lyric
    width 100%
    height 100%
    position relative
    .scroll-wrap
      height 100%
      .lyric-wrap
        width 80%
        margin 0 auto
        text-align center
        .lyric-line
          white-space nowrap
          overflow hidden
          font-size $font-size-m
          color rgba(255,255,255,0.7)
          line-height 30PX
          height 30PX
          &.next
            color $activeColor
          &.active
            color $themeColor
    .time-line
      position absolute
      top 50%
      transform translateY(-50%)
      height 3px
      width 100%
      padding 0 20px
      box-sizing border-box
      display flex
      align-items center
      color $bgColor
      .tiem-line-play
        width 40px
        text-align center
        margin-right 20px
        .icon-play
          font-size 40px
      .time-line-linenar
        flex 1
        height 3px
        background rgba(255,255,255,0.1)
      .time-line-time
        font-size 22px
        margin-left 20px
  .v-enter, .v-leave-to
    opacity 0
  .v-enter-active, .v-leave-active
    transition opacity 0.5s
</style>
