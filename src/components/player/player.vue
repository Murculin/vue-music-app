<template>
  <div class="player">
    <div class="normal-player" :style="{transform:normalTransform}">
      <div class="background">
        <img :src="currentSong.image">
      </div>
      <div class="top">
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
        <div class="back">
          <i class="iconfont icon-back iconjiantouxia" @click="exitFullScreen"></i>
        </div>
      </div>
      <div class="middle"
        @touchstart="middleTouchStart"
        @touchmove="middleTouchMove"
        @touchend="middleTouchEnd">
        <div class="middle-l" ref="middleL">
          <div class="cd-wrap">
            <div class="cd-border">
              <fadeIn>
                <div class="cd" v-show="showCD">
                  <img class="cd-image" :src="currentSong.image">
                </div>
              </fadeIn>
              <slide-top>
                <div class="cd cd-slide" v-show="!showCD" >
                  <img class="cd-slide-img" :style="{'animation-play-state':cdStyle}" :src="prevImg">
                </div>
              </slide-top>
            </div>
          </div>
        </div>
        <div class="middle-r" ref="middleR">
          <lyric :lyricLoading="lyricLoading" :lyrics="lyrics" :currentTime="currentTime" @setCurrentTime="setCurrentTime">
          </lyric>
        </div>
      </div>
      <div class="bottom" :style="{opacity:showPlaylist?0:1}">
        <div class="pagination">
          <span class="pagination-item" :class="{active:!isFlip}"></span>
          <span class="pagination-item" :class="{active:isFlip}"></span>
        </div>
        <Progress
          ref="progress"
          :currentTime="currentTime"
          :duration="duration"
          :playing="playing"
          @progressSetCurrent="progressSetCurrent"
          @btnMoveChange="getBtnMove"
        ></Progress>
        <operator
          :playIcon="playIcon"
          :canClick="canClick"
          :iconMode="iconMode"
          @nextMode="nextMode"
          @prevSong="prevSong"
          @togglePlaying="togglePlaying"
          @nextSong="nextSong"
          @openPlaylist="openPlaylist"
        ></operator>
      </div>
    </div>
    <playlist ref="playlist" @toggleMode='nextMode' @hidePlaylist="hidePlaylist"></playlist>
    <audio ref="audio" @timeupdate="timeUpdate" @ended="end" @canplay="canPlay" :src="currentSong.url"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import SlideTop from 'common/animation/slide-top'
import FadeIn from 'common/animation/fadeIn'
import Playlist from './Playlist'
import Operator from './Operator'
import Progress from './Progress'
import Lyric from './Lyric'
import { shuffle } from '@/assets/js/util.js'
import { getLyric } from 'api/music.js'
import { formatLyrics } from '../../assets/js/util'
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      showCD: false,
      showPlaylist: false,
      prevImg: '',
      canClick: true,
      currentTime: 0,
      btnMove: false,
      lyrics: [],
      lyricLoading: false,
      isFlip: false,
      duration: 0
    }
  },
  computed: {
    normalTransform () {
      let transform = this.fullScreen ? 0 : 120
      return `translate3d(0,${transform}%,0)`
    },
    playIcon () {
      return this.playing ? '&#xe629;' : '&#xe625;'
    },
    cdStyle () {
      return this.playing ? 'running' : 'paused'
    },
    iconMode () {
      if (this.mode === 0) {
        return '&#xe66c;'
      } else if (this.mode === 1) {
        return '&#xe608;'
      } else {
        return '&#xe66b;'
      }
    },
    percent () {
      return this.currentTime / this.duration
    },
    ...mapGetters(
      {
        fullScreen: 'getFullScreen',
        playlist: 'getPlaylist',
        sequenceList: 'getSequenceList',
        currentSong: 'getCurrentSong',
        playing: 'getPlaying',
        currentIndex: 'getCurrentIndex',
        mode: 'getMode'
      }
    )
  },
  created () {
    this.middleTouch = {
      x1: 0,
      x2: 0,
      disX: 0,
      translateX: 0
    }
  },
  mounted () {
    this.width = this.$refs.middleR.clientWidth
  },
  methods: {
    exitFullScreen () {
      this.setFullScreen(false)
    },
    openFullScreen () {
      this.setFullScreen(true)
    },
    togglePlaying () {
      this.setPlaying(!this.playing)
    },
    prevSong () {
      if (!this.canClick) {
        return
      }
      this.setCanClick()
      if (this.currentIndex === 0) {
        this.setCurrentIndex(this.playlist.length - 1)
      } else {
        this.setCurrentIndex(this.currentIndex - 1)
      }
    },
    nextSong () {
      if (!this.canClick) {
        return
      }
      this.setCanClick()
      if (this.currentIndex === this.playlist.length - 1) {
        this.setCurrentIndex(0)
      } else {
        this.setCurrentIndex(this.currentIndex + 1)
      }
    },
    openPlaylist () {
      this.$refs.playlist.show()
      this.showPlaylist = true
    },
    hidePlaylist () {
      this.showPlaylist = false
    },
    setCanClick () {
      this.canClick = false
      setTimeout(() => {
        this.canClick = true
      }, 1000)
      this.setPlaying(true)
    },
    canPlay (e) { // audio准备好时的回调函数
      this.duration = e.target.duration
    },
    timeUpdate (e) { // audio播放时的回调函数
      this.currentTime = e.target.currentTime
    },
    end () { // audio结束时的回调
      if (this.mode === 1) {
        this.currentTime = 0
        this.$refs.audio.play()
      } else {
        this.nextSong()
      }
    },
    setCurrentTime (time) {
      this.$refs.audio.currentTime = time
      if (!this.playing) {
        this.setPlaying(true)
      }
    },
    // 进度条
    getBtnMove (val) {
      this.btnMove = val
    },
    // 由进度条控制播放进度
    progressSetCurrent (percent) {
      this.$refs.audio.currentTime = percent * this.duration
    },
    // 切换模式
    nextMode () {
      let mode = (this.mode + 1) % 3
      this.setMode(mode)
      let newList = null
      let message = ''
      if (mode === 2) {
        newList = shuffle(this.sequenceList)
        message = '已切换至随机播放'
      } else if (mode === 1) {
        newList = this.playlist
        message = '已切换至单曲循环'
      } else {
        newList = this.playlist
        message = '已切换至顺序播放'
      }
      this.resetCurrent(newList)
      this.setPlayList(newList)
      Toast({
        message: message,
        duration: 1000
      })
    },
    resetCurrent (list) { // 重置currentIndex
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    // 发送请求获取歌词
    setLyric () {
      this.lyricLoading = true
      getLyric(this.currentSong.id).then((res) => {
        if (res.data.code === 200) {
          if (res.data.nolyric) { // 没歌词
            this.lyric = [{
              clause: '纯音乐,请欣赏',
              time: 0
            }]
            this.lyricLoading = false
            return
          }
          let lyrics = res.data.lrc.lyric
          this.lyrics = formatLyrics(lyrics)
          this.lyricLoading = false
        }
      }).catch((err) => {
        this.lyricLoading = false
        console.log(err)
      })
    },
    // 滑动部分
    middleTouchStart (e) {
      let firstTouch = e.touches[0]
      this.middleTouch.x1 = firstTouch.pageX
      this.middleTouch.y1 = firstTouch.pageY
      this.$refs.middleL.style.transitionDuration = this.$refs.middleR.style.transitionDuration = 0 + 's'
    },
    middleTouchMove (e) {
      let firstTouch = e.touches[0]
      this.middleTouch.x2 = firstTouch.pageX
      this.middleTouch.y2 = firstTouch.pageY
      const disX = this.middleTouch.x2 - this.middleTouch.x1
      const disY = this.middleTouch.y2 - this.middleTouch.y1
      if (Math.abs(disX) < Math.abs(disY)) {
        return
      }
      this.middleTouch.disX = disX
      this.middleTouch.disY = disY
      let offsetX = this.middleTouch.translateX + this.middleTouch.disX
      offsetX = offsetX > 0 ? 0 : offsetX
      offsetX = offsetX + this.width > 0 ? offsetX : -this.width
      this.middleTouch.offsetX = offsetX
      this.$refs.middleL.style.opacity = 1 - Math.abs(offsetX / this.width)
      this.$refs.middleR.style.transform = `translate3d(${offsetX}px,0,0)`
    },
    middleTouchEnd (e) {
      this.$refs.middleL.style.transitionDuration = this.$refs.middleR.style.transitionDuration = 0.5 + 's'
      let { offsetX, disX } = this.middleTouch
      offsetX = Math.abs(offsetX)
      if ((disX > 0 && offsetX < 3 * this.width / 4) || (disX < 0 && offsetX < this.width / 4) ) {
        this.$refs.middleR.style.transform = `translate3d(0,0,0)`
        this.middleTouch.translateX = 0
        this.isFlip = false
        this.$refs.middleL.style.opacity = 1
      } else {
        this.$refs.middleR.style.transform = `translate3d(${-this.width}px,0,0)`
        this.middleTouch.translateX = -this.width
        this.isFlip = true
        this.$refs.middleL.style.opacity = 0
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions({
      savePlayHistory: 'savePlayHistory'
    })
  },
  watch: {
    currentSong (newVal, oldVal) {
      if (newVal.id === oldVal.id) {
        return
      }
      this.savePlayHistory(newVal)
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.setLyric()
      })
      this.showCD = true
      setTimeout(() => {
        this.prevImg = this.currentSong.image
        this.showCD = false
      }, 1000)
    },
    playing (newVal) {
      this.$nextTick(() => {
        newVal ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    },
    percent (val) {
      if (!this.btnMove) {
        // 按钮未被拖动才触发
        this.$refs.progress.setProgressByPercent(val)
      }
    }
  },
  components: {
    FadeIn,
    SlideTop,
    Lyric,
    Playlist,
    Operator,
    Progress
  }

}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
  .player
    .normal-player
      position fixed
      top 0
      left 0
      bottom 0
      right 0
      z-index 151
      background #222
      transition all 0.5s
      display flex
      flex-direction column
      justify-content space-between
      .background
        position absolute
        top 0
        width 100%
        height 100%
        z-index -1
        opacity 0.6
        overflow hidden
        filter blur(20PX)
        img
          width 100%
          height 100%
      .top
        position relative
        color $activeColor
        .back
          position absolute
          top 12px
          left 24px
          .icon-back
            font-size 40px
        .title
          margin 0 auto
          width 80%
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          text-align center
          height 80px
          line-height 80px
          font-size $font-size-l
        .subtitle
          margin: 0 auto
          width 80%
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          text-align center
          height 40px
          line-height 40px
          font-size $font-size-m
      .middle
        position relative
        flex 1
        display flex
        align-items center
        .middle-l
          position relative
          width 100%
          height 100%
          display flex
          align-item center
          justify-content center
          transition opacity 0s
          .cd-wrap
            position absolute
            top 50%
            left 50%
            width 600px
            height 600px
            transform translate(-50%, -50%)
            .cd-border
              position relative
              width 100%
              height 100%
              border-radius 50%
              border 20px solid rgba(255,255,255,0.1)
              box-sizing border-box
              .cd
                position relative
                width 100%
                height 100%
                border-radius 50%
                overflow hidden
                img
                  position absolute
                  top 0
                  left 0
                  width 100%
                  height 100%
                  box-sizing border-box
                  border-radius 50%
              .cd-slide
                position absolute
                top 0
                .cd-slide-img
                  animation rotate 20s linear infinite
        .middle-r
          position absolute
          top 0
          left 100%
          width 100%
          height 100%
          overflow hidden
          transition transform 0s
      .bottom
        padding-bottom 20px
        .pagination
          height 50px
          text-align center
          .pagination-item
            display inline-block
            width 16px
            height 16px
            border-radius 50%
            background rgba(255,255,255,0.5)
            &:not(:first-child)
              margin-left 16px
            &.active
              background rgba(255,255,255,0.8)
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
