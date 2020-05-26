<template>
  <div class="player" v-show="playlist.length>0">
    <div class="normal-player" :style="{transform:normalTransform}">
      <div class="background">
        <img :src="currentSong.image">
      </div>
      <div class="top">
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ currentSong.singer }}</h2>
        <div class="back">
          <i class="iconfont icon-back" @click="exitFullScreen">&#xe62e;</i>
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
          <div class="playing-lyric">
            <div class="playing-lyric-content" ref="playingLyric">{{ currentLyric }}</div>
          </div>
        </div>
        <div class="middle-r" ref="middleR">
          <lyric :lyrics="lyrics" :currentTime="currentTime" @setCurrentTime="setCurrentTime">
          </lyric>
        </div>
      </div>
      <div class="bottom" :style="{opacity:showPlaylist?0:1}">
        <div class="pagination">
          <span class="pagination-item" :class="{active:!isFlip}"></span>
          <span class="pagination-item" :class="{active:isFlip}"></span>
        </div>
        <div class="progress-wrap">
          <span class="time currentTime" :class="{active:btnMove}">{{ nowTime }}</span>
          <div class="progress-bar-wrap">
            <div class="progress-bar" ref="progressBar" @click="progressClick">
              <div class="progress-current" ref="progressCurrent"></div>
              <div
                class="progress-btn"
                ref="progressBtn"
                @touchstart="btnTouchStart"
                @touchmove="btnTouchMove"
                @touchend="btnTouchEnd"
              ></div>
            </div>
          </div>
          <span class="time totalTime">{{ format(duration) }}</span>
        </div>
        <div class="operator">
          <div class="icon icon-left">
            <i
              class="iconfont icon-mode"
              v-html="iconMode"
              @click="nextMode"
            ></i>
          </div>
          <div class="icon icon-right">
            <i class="iconfont icon-prev" :class="{'stop-click':!canClick}" @click="prevSong">&#xe607;</i>
          </div>
          <div class="icon icon-center">
            <i class="iconfont icon-play" v-html="setPlayIcon" @click="togglePlaying"></i>
          </div>
          <div class="icon icon-left">
            <i class="iconfont icon-next" :class="{'stop-click':!canClick}" @click="nextSong">&#xe606;</i>
          </div>
          <div class="icon icon-right" @click="openPlaylist">
            <i class="iconfont">&#xe640;</i>
          </div>
        </div>
      </div>
    </div>
    <playlist ref="playlist" @toggleMode='nextMode' @hidePlaylist="hidePlaylist"></playlist>
    <audio ref="audio" @timeupdate="timeUpdate" @ended="end" @canplay="canPlay" :src="currentSong.url"></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Slidey from 'common/animation/slidey'
import SlideTop from 'common/animation/slide-top'
import FadeIn from 'common/animation/fadeIn'
import Fade from 'common/animation/fade'
import CirclePro from 'common/circle/circle'
import Lyric from '../lyric/lyric'
import Playlist from '../playlist/playlist'
import { shuffle } from '@/assets/js/util.js'
import { getLyric } from 'api/song.js'
import { Base64 } from 'js-base64'
import { ERR_OK } from 'api/config.js'
import { Transform } from 'stream'
import { Toast } from 'mint-ui'

const BTN_WIDTH = 15
let calculated = false

export default {
  name: 'Player',
  data () {
    return {
      showCD: false,
      showMini: false,
      showPlaylist: false,
      prevImg: '',
      canClick: true,
      progressWidth: 0,
      currentTime: 0,
      btnMove: false,
      btnTouch: {},
      afterTime: 0,
      miniWidth: 0,
      lyrics: [],
      currentLyric: {},
      nextLyric: '',
      lyricWidth: 0,
      middleTouch: {
        x1: 0,
        x2: 0,
        disX: 0,
        translateX: 0
      },
      isFlip: false,
      duration: '00:00'
    }
  },
  computed: {
    normalTransform () {
      let transform = this.fullScreen ? 0 : 120
      return `translate3d(0,${transform}%,0)`
    },
    setPlayIcon () {
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
    nowTime () {
      if (this.btnMove) {
        return this.format(this.afterTime)
      } else {
        return this.format(this.currentTime)
      }
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
  created() {
    this.width = 0
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
        this.setCurrentIndex(this.playlist.length-1)
      } else {     
        this.setCurrentIndex(this.currentIndex - 1)
      }
    },
    nextSong () {
      if (!this.canClick) {
        return
      }
      this.setCanClick()
      if (this.currentIndex === this.playlist.length-1) {
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
    canPlay (e) { // audio准备好时定的回调函数
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
    format (time) { // 格式化时间
      let ret = Math.floor(time)
      let min = Math.floor(ret/60)
      let sec = ret%60
      min = min<10 ? '0'+min : min
      sec = sec<10 ? '0'+sec : sec
      return `${min}:${sec}`
    },
    //进度条相关
    btnTouchStart (e) {
      this.btnMove = true
      let firstTouch = e.touches[0]
      this.btnTouch.x1 = firstTouch.pageX
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
      if (offsetX<0) {
        offsetX = 0
      } else if (offsetX > this.progressWidth) {
        offsetX = this.progressWidth
      }
      this.setProgress(offsetX)
      let percent =  this.$refs.progressCurrent.clientWidth/this.progressWidth
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
      if (offsetX<0) {
        offsetX = 0
      } else if (offsetX > this.progressWidth) {
        offsetX = this.progressWidth
      }
      this.setProgress(offsetX)
      this.setPercent()
      if (!this.playing) {
        this.setPlaying(true)
      }
    },
    setProgress (offsetX) {
      this.$refs.progressCurrent.style.width = offsetX + 'px'
      this.$refs.progressBtn.style.transform = `translate3d(${offsetX}px,0,0)`
    },
    setPercent () {
      let percent =  this.$refs.progressCurrent.clientWidth/this.progressWidth
      this.$refs.audio.currentTime = percent * this.duration
    },
    setCurrentTime (time) {
      this.$refs.audio.currentTime = time
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
    setLyric () {
      getLyric(this.currentSong.id).then((res) => {
        if (res.data.code === 200) {
          let lyrics = res.data.lrc.lyric
          this.lyrics = this.formatLyrics(lyrics)
        }
      })
    },
    formatLyrics (lyrics) {
      lyrics = lyrics.split('\n')
      let lyricsArr = []
      lyrics.forEach((item,index) => {
        const reg = /\[.+\]/g
        const timeReg = /\[(\d+:\d+\.\d+)\]/
        if (item.match(timeReg)){
          let time = item.match(timeReg)[1]
          let clause = item.replace(item.match(timeReg)[0],'')
          let min = parseInt(time.split(':')[0])
          let sec = parseFloat(time.split(':')[1])
          time = min*60 + sec
          let eachLyric = {
            time,
            clause
          }
          lyricsArr.push(eachLyric)
        }
      })
      for (let i = 0 , len = lyricsArr.length; i < len; i++) {
        if (lyricsArr[i].clause === '') {
          lyricsArr.splice(i,1)
          i--
          len--
          continue
        }
        let duration = 0
        if (i < len - 1) {
          duration = lyricsArr[i + 1].time - lyricsArr[i].time
        }
        lyricsArr[i].duration = duration
        return lyricsArr
      }
    },
    setCurrentLyric () {
      let currentTime = this.currentTime
      if (this.lyrics.length === 0) {
        this.currentLyric = '纯音乐，暂无歌词，请欣赏'
        return
      }
      this.lyrics.some((item,index) => {
        if (currentTime > item.time) {
          this.currentLyric = item.clause
          return true
        }
      })
    },
    // 滑动部分
    middleTouchStart (e) {
      this.width = this.$refs.middleR.clientWidth
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
      let offsetX = this.middleTouch.translateX + this.middleTouch.disX
      offsetX = offsetX > 0 ? 0 : offsetX
      offsetX = offsetX + this.width > 0 ? offsetX : -this.width
      this.$refs.middleL.style.opacity = 1 - Math.abs(offsetX/this.width)
      this.$refs.middleR.style.transform = `translate3d(${offsetX}px,0,0)`
    },
    middleTouchEnd (e) {
      this.$refs.middleL.style.transitionDuration = this.$refs.middleR.style.transitionDuration = 0.5 + 's'
      let offsetX = 0
      let disX = this.middleTouch.disX
      if (disX < -this.width/4 || (disX > 0 && disX < this.width / 4)) {
        this.$refs.middleR.style.transform = `translate3d(${-this.width}px,0,0)`
        this.middleTouch.translateX = -this.width
        this.isFlip = true
        this.$refs.middleL.style.opacity = 0
      } else {
        if (this.middleTouch.translateX + disX < -this.width) {
          return
        }
        this.$refs.middleR.style.transform = `translate3d(0,0,0)`
        this.middleTouch.translateX = 0
        this.isFlip = false
        this.$refs.middleL.style.opacity = 1
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
    currentSong (newVal,oldVal) {
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
    percent (newVal) {
      this.progressWidth = this.$refs.progressBar.clientWidth - BTN_WIDTH
      let offsetX = this.progressWidth * newVal
      if (!this.btnMove) {
        this.setProgress(offsetX)
      }
      this.setCurrentLyric()
    }
  },
  components: {
    FadeIn,
    Fade,
    Slidey,
    SlideTop,
    CirclePro,
    Lyric,
    Playlist
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
        margin-bottom 50px
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
        position absolute
        top 170px
        bottom 340px
        left 0
        right 0
        .middle-l
          position relative
          width 100%
          padding-bottom 80%
          display flex
          align-content center
          transition opacity 0s
          .cd-wrap
            position absolute
            left 10%
            width 80%
            height 100%
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
          .playing-lyric
            position absolute
            bottom -100px
            width 100%
            box-sizing border-box
            text-align center
            padding-left 10%
            padding-right 10%
            .playing-lyric-content
              overflow hidden
              white-space nowrap
              text-overflow ellipsis
              height 40px
              line-height 40px
              font-size $font-size-m
              color rgba(255,255,255,0.5)
        .middle-r
          position absolute
          top 0
          left 100%
          width 100%
          height 100%
          overflow hidden
          transition transform 0s
      .bottom
        position absolute
        bottom 50px
        width 100%
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
        .operator
          display flex
          align-items center
          height 100%
          width 80%
          margin 0 auto
          .icon
            flex 1
            text-align center
            color $activeColor
            .icon-play
              font-size 88px
            i
              font-size 60px
            .stop-click
              color $greyColor
          .icon-left
            text-align left
          .icon-right
            text-align right
          .icon-center
            padding 0 60px
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
