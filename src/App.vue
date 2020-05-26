<template>
  <div id="app" class="app">
    <home-header @selectHeader="openCenter"></home-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <tab-bar
      class="tab"
      activeColor="#31c27c"
      backgroundColor="#fff"
      textColor="black"
      :list="tabList"
    ></tab-bar>
    <player></player>
  </div>
</template>
<script>
import HomeHeader from './components/HomeHeader'
import TabBar from './common/tab-bar/TabBar'
import Player from './components/player/player'
export default {
  data () {
    return {
      tabList: [
        {
          path: '/recommends',
          iconClass: 'iconriqi',
          text: '推荐'
        },
        {
          path: '/singer',
          iconClass: 'icongeshou',
          text: '歌手'
        },
        {
          path: '/rank',
          iconClass: 'iconbangdan',
          text: '榜单'
        },
        {
          path: '/center',
          iconClass: 'icongeren',
          text: '个人'
        }
      ]
    }
  },
  methods: {
    openCenter () {
      this.$refs.center.show()
    }
  },
  components: {
    HomeHeader,
    TabBar,
    Player
  }
}
</script>
<style lang="stylus">
@import "~styles/variable.styl"
  .app
    overflow hidden
    .tab
      height 88px
</style>
