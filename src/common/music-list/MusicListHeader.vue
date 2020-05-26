<template>
  <div
    class="music-list-header"
  >
    <div 
      class="bg"
      :style="backgroudImg"
      ref="bg"
    ></div>
    <nav-bar
      background="rgba(0,0,0,0)"
      color="#fff"
      class="nav-bar"
    >
      <template v-slot:left>
        <i
          class="iconfont iconfanhui"
          @click="handleClickBack"
        ></i>
      </template>
      <template v-slot:center>
        <h2 class="title">{{ title }}</h2>
      </template>
      <template v-slot:right>
        <player-icon/>
      </template>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'common/nav-bar/NavBar'
import PlayerIcon from 'common/player-icon/PlayerIcon'
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    opacity: {
      type: Number,
      default: 0
    }
  },
  computed: {
    backgroudImg () {
      return `background-image: url(${this.bgImage})`
    }
  },
  methods: {
    handleClickBack () {
      this.$router.back()
    }
  },
  watch: {
    opacity (val) {
      this.$refs.bg.style.opacity = val
    }
  },
  components: {
    NavBar,
    PlayerIcon
  }
}
</script>

<style lang="stylus" scoped>
.music-list-header
  position absolute
  z-index 500
  top 0
  left 0
  right 0
  overflow hidden
  .bg
    position absolute
    z-index 499
    top 0
    left 0
    right 0
    background-repeat norepeat
    background-size cover
    transform scale(8)
    filter blur(20px) brightness(80%)
    opacity 0
    height 88px
  .nav-bar
    position relative
    z-index 501
    .iconfont
      font-size 34px
      font-weight bold
    .title
      text-align center
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
      font-size $font-size-l
</style>
