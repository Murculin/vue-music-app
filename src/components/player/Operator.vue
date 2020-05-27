<template>
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
    <i class="iconfont icon-play" v-html="playIcon" @click="togglePlaying"></i>
  </div>
  <div class="icon icon-left">
    <i class="iconfont icon-next" :class="{'stop-click':!canClick}" @click="nextSong">&#xe606;</i>
  </div>
  <div class="icon icon-right" @click="openPlaylist">
    <i class="iconfont">&#xe640;</i>
  </div>
</div>
</template>

<script>
export default {
  props: {
    iconMode: {
      type: String
    },
    canClick: {
      type: Boolean,
      default: true
    },
    playIcon: {
      type: String
    }
  },
  methods: {
    nextMode () {
      this.$emit('nextMode')
    },
    prevSong () {
      this.$emit('prevSong')
    },
    togglePlaying () {
      this.$emit('togglePlaying')
    },
    nextSong () {
      this.$emit('nextSong')
    },
    openPlaylist () {
      this.$emit('openPlaylist')
    }
  }
}
</script>

<style lang="stylus" scoped>
.operator
  display flex
  align-items center
  justify-content space-between
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
</style>
