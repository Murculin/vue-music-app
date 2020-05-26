<template>
  <div class="player-icon">
    <i
      class="iconfont iconzhengzaibofang"
      :style="{color: defaultColor}"
      v-show="!playingList.length"
    />
    <div
      class="active-wrapper"
      :class="{active: flag}"
      v-show="playingList.length"
    >
      <i
        class="iconfont iconzhengzaibofang"
        @click="handleClickIcon"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
// 切换图标间隔
const DELAY = 500
export default {
  props: {
    defaultColor: {
      type: String,
      default: '#fff'
    }
  },
  data () {
    return {
      flag: true,
      timer: null
    }
  },
  computed: {
    ...mapGetters({
      playing: 'getPlaying',
      playingList: 'getPlaylist'
    })
  },
  created () {
    if(this.playing) {
      this.timer = setInterval(() => {
        this.flag = !this.flag
      }, DELAY)
    }
  },
  methods: {
    handleClickIcon () {
      this.setFullScreen(true)
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
  },
  watch: {
    playing (val, oldval) {
      if(val === oldval) {
        return
      }
      clearInterval(this.timer)
      this.timer = null
      if(val) {
        this.timer = setInterval(() => {
          this.flag = !this.flag
        }, DELAY)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.player-icon
  height 100%
  width 100%
  line-height 88px
  text-align center
  .iconfont
    font-size 50px
  .active-wrapper
    .iconfont
      color $themeColor
  .active
    transform scaleX(-1)
</style>
