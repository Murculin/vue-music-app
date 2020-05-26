<template>
  <slide>
    <div class="user-center" v-show="isShow">
      <div class="switch-wrap">
        <switches
          :switches="switches"
          :currentIndex="currentIndex"
          @switch="switchItem"
        ></switches>
      </div>
      <div class="back" @click="hide">
        <i class="iconfont icon-back">&#xe624;</i>
      </div>
      <div class="list-wrap">
        <scroll
          v-if="currentIndex===0"
          :data="favoriteList"
          class="list-scroll"
        >
          <div class="list-inner">
            <song-list
              :showOperate="true"
              :songs="favoriteList"
              @select="selectItem"
              @playAll='playAll'
              @deleteItem='seletctDelete'
            ></song-list>
          </div>
        </scroll>
        <scroll
          v-if="currentIndex===1"
          :data="playHistory"
          class="list-scroll"
        >
          <div class="list-inner">
            <div class="clear" @click="clearHistory" v-show="this.playHistory.length">
              <i class="iconfont icon-clear">&#xe66d;</i>
            </div>
            <song-list
              :songs="playHistory"
              @select="selectItem"
              @playAll='playAll'
            ></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-warp" v-show="noResult">{{noResultDesc}}</div>
    </div>
  </slide>
</template>

<script>
import Switches from 'common/switches/switches'
import Slide from 'common/animation/slide'
import SongList from 'common/song-list/SongList'
import Scroll from 'common/scroll'
import {mapGetters,mapActions} from 'vuex'
import {Toast, MessageBox} from 'mint-ui'

export default {
  name: 'UserCenter',
  data () {
    return {
      isShow: false,
      currentIndex: 0,
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ]
    }
  },
  computed: {
    noResult () {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc () {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    },
    ...mapGetters({
      playHistory: 'getPlayHistory',
      favoriteList: 'getFavoriteList'
    })
  },
  methods: {
    show () {
      this.isShow = true
    },
    hide () {
      this.isShow = false
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectItem (song) {
      console.log(song)
      this.insertSong(song)
    },
    seletctDelete (song) {
      this.deleteFavoriteList(song)
      Toast({
        message: '已移出喜爱歌曲的列表',
        duration: 1000
      })
    },
    playAll () {
      this.selectPlay({
        list: this.playHistory,
        index: 0
      })
    },
    clearHistory () {
      MessageBox.confirm('确定清除历史记录?').then(() => {
        this.clearPlayHistory()
      })
    },
    ...mapActions({
      selectPlay: 'selectPlay',
      insertSong: 'insertSong',
      pushSong: 'pushSong',
      deleteFavoriteList: 'deleteFavoriteList',
      clearPlayHistory: 'clearPlayHistory'
    })
  },
  components: {
    Switches,
    Slide,
    SongList,
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
  .user-center
    position absolute
    top 0
    bottom 0
    z-index 100
    width 100%
    background $bgColor2
    .switch-wrap
      padding 20px 0 40px 0
    .back
      position absolute
      top 30px
      left 40px
      .icon-back
        font-size 40px
        font-weight bold
    .list-wrap
      position absolute
      top 120px
      bottom 0
      width 100%
      .list-scroll
        height 100%
        overflow hidden
        .list-inner
          .clear
            position absolute
            right 40px
            .icon-clear
              font-size 40px
    .no-result-warp
      text-align center
      margin-top 200px
</style>
