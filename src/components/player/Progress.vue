<template>
  <div class="progress-wrap">
    <span class="time currentTime" :class="{ active: btnMove }">{{
      currentTime | formatTime
    }}</span>
    <div class="progress-bar-wrap">
      <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div :style="{width: offsetX + 'px'}" class="progress-current" ref="progressCurrent"></div>
        <div
          class="progress-btn"
          ref="progressBtn"
          :style="{transform: `translate3d(${offsetX}px,0,0)`}"
          @touchstart="btnTouchStart"
          @touchmove="btnTouchMove"
          @touchend="btnTouchEnd"
        ></div>
      </div>
    </div>
    <span class="time totalTime">{{ duration | formatTime }}</span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  props: {
    currentTime: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    playing: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      btnMove: false,
      offsetX: 0,
      afterTime: 0
    }
  },
  created () {
    this.btnTouch = {}
  },
  mounted () {
    // 进度条所要走过的总长度
    this.progressWidth = this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth
  },
  methods: {
    btnTouchStart (e) {
      this.btnMove = true
      let firstTouch = e.touches[0]
      this.btnTouch.x1 = firstTouch.pageX
      // 当前进度条的长度
      this.btnTouch.left = this.$refs.progressCurrent.clientWidth
    },
    btnTouchMove (e) {
      if (!this.btnMove) {
        return
      }
      let firstTouch = e.touches[0]
      this.btnTouch.x2 = firstTouch.pageX
      let disX = this.btnTouch.x2 - this.btnTouch.x1
      let offsetX = this.btnTouch.left + disX
      if (offsetX < 0) {
        offsetX = 0
      } else if (offsetX > this.progressWidth) {
        offsetX = this.progressWidth
      }
      this.setProgress(offsetX)
      let percent = this.$refs.progressCurrent.clientWidth / this.progressWidth
      this.afterTime = percent * this.duration
    },
    btnTouchEnd (e) {
      this.btnMove = false
      this.setPercent()
      if (!this.playing) {
        this.setPlaying(true)
      }
    },
    progressClick (e) {
      let offsetX = e.pageX - this.$refs.progressBar.offsetLeft
      console.log(offsetX)
      if (offsetX < 0) {
        offsetX = 0
      } else if (offsetX > this.progressWidth) {
        offsetX = this.progressWidth
      }
      this.setProgress(offsetX)
      this.$nextTick(() => {
        this.setPercent()
      })
      if (!this.playing) {
        this.setPlaying(true)
      }
    },
    setProgress (offsetX) {
      this.offsetX = offsetX
    },
    setProgressByPercent (percent) {
      this.offsetX = percent * this.progressWidth
    },
    setPercent () {
      // 根据进度条设置播放时间
      let percent = this.$refs.progressCurrent.clientWidth / this.progressWidth
      this.$emit('progressSetCurrent', percent)
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING_STATE'
    })
  },
  watch: {
    btnMove (val) {
      this.$emit('btnMoveChange', val)
    }
  }
}
</script>

<style lang="stylus" scoped>
.progress-wrap
  width 90%
  margin 0 auto
  padding 20px 0
  display flex
  align-items center
  height 60px
  .time
    flex 0,0,60px
    width 60px
    color $activeColor
    font-size $font-size-s
    line-height 30px
    &.active
      font-size $font-size-m
  .progress-bar-wrap
    flex 1
    height 60px
    padding 0 20px
    .progress-bar
      position relative
      width 100%
      height 6px
      top 26px
      background $greyColor
      .progress-current
        position relative
        width 0
        height 100%
        background $themeColor
      .progress-btn
        position absolute
        width 30px
        height 30px
        border-radius 50%
        background $activeColor
        top -12px
</style>
