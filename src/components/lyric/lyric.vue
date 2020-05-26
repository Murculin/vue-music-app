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
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
    >
      <div class="lyric-wrap">
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
          {{ nextLyricTime }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import Scroll from 'common/scroll'

const PADDING_TOP = 200
export default {
  name: 'Lyric',
  props: {
    lyrics: {
      type: Array,
      default: []
    },
    currentTime: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      listenScroll: true,
      probeType: 3,
      scrollY: -1,
      onIndex: 0,
      nextIndex: 0,
      currentLyric: {},
      padding: 200,
      autoplay: true,
      showTimeLine: false,
      positionList: [],
      touch: {}
    }
  },
  components: {
    Scroll
  },
  computed: {
    nextLyricTime () {
      if (!this.lyrics||!this.nextIndex) {
        return '00:00'
      }
      let time = this.lyrics[this.nextIndex].time
      let min = Math.floor(time/60)
      let sec = Math.floor(time%60)
      min = min < 10 ? '0' + min : min
      sec = sec < 10 ? '0' + sec : sec
      return `${min}:${sec}`
    }
  },
  created() {
    this.timer = 0
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
      if (Math.abs(disY)>Math.abs(disX)&&Math.abs(disY)>15) {
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
      this.lyrics.forEach((item,index) => {
        if (this.currentTime > item.time) {
          this.currentLyric = item
          this.onIndex = index
          return
        }
      })
    },
    startAutoplay () {
      let offsetY = this.padding - this.$refs.lyricGroup[this.onIndex].offsetTop
      this.$refs.lyricScroll.scrollTo(0,offsetY,700)
    },
    setCurrentTime () {
      this.$emit('setCurrentTime',this.lyrics[this.nextIndex].time)
    }
  },
  watch: {
    lyrics (lyrics) {
      if (lyrics.length===0) {
        return
      }
      this.$nextTick(() => {
        let ret = []
        this.padding = this.$refs.lyricGroup[0].offsetTop
        this.$refs.lyricGroup.forEach((item,index) => {
          ret.push(item.offsetTop - item.clientHeight/2)
        })
        this.positionList = ret
      })
    },
    currentTime () {
      this.setCurrentLyric()
    },
    currentLyric (newVal,oldVal) {
      if (oldVal && oldVal.clause === newVal.clause) {
        return
      }
      if (this.autoplay) {
        this.startAutoplay()
      }
    },
    scrollY (val) {
      this.positionList.forEach((item,index) => {
        let position = item - this.padding
        if (val + position < 0) {
          this.nextIndex = index
          return
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
  .lyric
    width 100%
    height 100%
    .scroll-wrap
      height 100%
      .lyric-wrap
        padding 400px 0
        width 80%
        margin 0 auto
        text-align center
        .lyric-line
          white-space nowrap
          overflow hidden
          font-size $font-size-m
          color rgba(255,255,255,0.7)
          line-height 60px
          height 60px
          &.next
            color $activeColor
          &.active
            color $themeColor
    .time-line
      position absolute
      top 425px
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
