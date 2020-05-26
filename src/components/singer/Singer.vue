<template>
  <div class="singer">
    <scroll
      class="scroll-wrapper"
      :data="singerList"
      :pullup="true"
      @scrollEnd="scrollEnd"
    >
      <div class="scroll-content">
        <singer-category @selectCate="selectCate"/>
        <singer-list
          @selectItem="selectItem"
          :list="singerList"
          :listTitle="listTitle"
        />
        <loading v-show="isShowLoadMore" title="正在加载"/>
      </div>
    </scroll>
    <slide>
      <router-view></router-view>
    </slide>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer.js'
import Singer from 'common/js/singer.js'
import Scroll from 'common/scroll'
import Slide from 'common/animation/slide'
import Loading from 'common/loading/loading'
import SingerList from './SingerList'
import SingerCategory from './SingerCategory'
import { mapMutations } from 'vuex'

export default {
  components: {
    SingerList,
    SingerCategory,
    Scroll,
    Loading,
    Slide
  },
  data () {
    return {
      singerList: [],
      listTitle: '华语男歌手',
      page: 1, // 加载数据的页码
      onCode: 1001, // 当前标签对应的歌手类型码
      isShowLoadMore: false
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    async _getSingerList () {
      const res = await getSingerList(this.onCode, this.page)
      if(!res.more) {
        this.isShowLoadMore = false
        return
      }
      this.singerList = res.artists
      this.isShowLoadMore = true
    },
    selectItem (singer) {
      this.setSinger(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    selectCate (code, title) {
      if(this.onCode === code) {
        return
      }
      // 歌手列表的标题
      this.listTitle = title
      // 记录点击的按钮对应的code
      this.onCode = code
      // 清空列表触发载入动画
      this.singerList = []
      this.page = 1
      this.isShowLoadMore = true
      this._getSingerList()
    },
    scrollEnd() {
      this.page += 1
      this._getSingerList()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import "~styles/variable.styl"
  .singer
    position absolute
    overflow hidden
    width 100%
    top 88px
    bottom 0
    background $bgColor2
    .scroll-wrapper
      position absolute
      top 0
      bottom 88px
      width 100%
</style>
