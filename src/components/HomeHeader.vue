<template>
  <div class="home-header">
    <nav-bar
      color="#eee"
      background="#fff"
    >
      <template v-slot:left>
        <h2 class="home-title">{{ homeTitle }}</h2>
      </template>
      <template v-slot:center>
        <div class="center">
          <search-box
            class="input"
          />
          <div
            class="click-wrap"
            @click.stop.prevent="handleClickInput"
            v-show="showClickWrap"
          ></div>
        </div>
      </template>
      <template v-slot:right>
        <player-icon defaultColor="black"/>
      </template>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from 'common/nav-bar/NavBar'
import SearchBox from 'common/search-box/SearchBox'
import PlayerIcon from 'common/player-icon/PlayerIcon'
export default {
  components: {
    NavBar,
    SearchBox,
    PlayerIcon
  },
  computed: {
    homeTitle () {
      return this.$route.name
    },
    showClickWrap () {
      return true
    }
  },
  methods: {
    handleClickInput () {
      this.$router.push('/search')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~styles/variable.styl"
.center
  position relative
  .click-wrap
    position absolute
    top 0
    bottom 0
    width 100%
    z-index 100
  .input
    margin-top 44px
    transform translateY(-50%)
.home-title
  color black
  font-weight bold
</style>
