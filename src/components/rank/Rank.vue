<template>
  <div class="ranks">
    <scroll class="scroll-wrapper" :data="rankList">
      <div class="scroll-content">
        <rank-item
          v-for="item in rankList"
          :key="item.id"
          :rankInfo="item"
          @click.native="handleClickRank(item)"
        />
        <div class="loading-container" v-show="!rankList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <slide>
      <router-view></router-view>
    </slide>
  </div>
</template>

<script>
import {getRankList, getRankListAll} from 'api/rank'
import {mapMutations} from 'vuex'
import Scroll from 'common/scroll'
import Slide from 'common/animation/slide'
import RankItem from './RankItem'
import Loading from 'common/loading/loading'
export default {
  data() {
    return {
      rankList: []
    }
  },
  created() {
    this._getRankList()
  },
  methods: {
    async _getRankList () {
      const res = await getRankListAll()
      console.log(res)
      this.rankList = res
    },
    handleClickRank (item) {
      this.setRank(item)
      this.$router.push({
        path:`/rank/${item.id}`
      })
    },
    handlePlaylist () {
      const bottom = this.playlist && this.playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    ...mapMutations ({
      setRank: 'SET_RANK'
    })
  },
  components: {
    Scroll,
    Slide,
    RankItem,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
  .ranks
    position absolute
    top 88px
    right 0
    bottom 88px
    left 0
    background $bgColor2
    overflow hidden
    .scroll-wrapper
      position absolute
      top 0
      bottom 0
      width 100%
      .scroll-content
        padding 20px 20px
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
