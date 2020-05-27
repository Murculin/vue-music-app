<template>
  <fade>
    <div class="playlist" v-show="isShow" @click="hide">
      <slide-bottom>
        <div
          class="playlist-wrap"
          :class="{mini:!fullScreen}"
          v-show="isShow"
          @click.stop
        >
          <div class="list-header border-bottom">
            <i class="iconfont icon-mode" v-html="iconMode" @click="toggleMode"></i>
            <span class="text">{{ modeText }}({{ sequenceList.length }}首)</span>
            <i class="iconfont icon-clear" @click="clearAll">&#xe66d;</i>
          </div>
          <scroll
            class="list-content"
            :data="sequenceList"
            ref="listContent"
            :refreshDelay="refreshDelay"
          >
            <transition-group name="list" tag="ul">
              <li
                v-for="(item,index) in sequenceList"
                :key="item.id"
                ref="listItem"
                class="list-item border-bottom"
              >
                <span class="title" :class="isActive(item.id)" @click="selectItem(item,index)">
                  <span class="songname">{{item.name}}</span>
                  <span class="singer"> - {{item.singer}}</span>
                </span>
                <i class="iconfont icon-like" :class="{active:isFavorite(item)}" @click="toggleFavorite(item)">&#xe661;</i>
                <i class="iconfont icon-del" @click="deleteItem(item,index)">&#xe668;</i>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add" @click="selectAddList">
            <div class="add-button">
              添加歌曲到队列
            </div>
          </div>
          <div class="list-close border-top" @click="hide">
            关闭
          </div>
        </div>
      </slide-bottom>
      <add-list ref="addList"></add-list>
    </div>
  </fade>
</template>

<script>
import Scroll from 'common/scroll'
import Fade from 'common/animation/fade'
import SlideBottom from 'common/animation/slide-bottom'
import AddList from './add-list/AddList'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import { favoriteMixin } from '@/assets/js/mixin'
export default {
  mixins: [favoriteMixin],
  name: 'Playlist',
  data () {
    return {
      isShow: false,
      refreshDelay: 100
    }
  },
  computed: {
    modeText () {
      if (this.mode === 0) {
        return '顺序播放'
      } else if (this.mode === 1) {
        return '单曲循环'
      } else {
        return '随机播放'
      }
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
    ...mapGetters({
      sequenceList: 'getSequenceList',
      currentSong: 'getCurrentSong',
      mode: 'getMode',
      fullScreen: 'getFullScreen',
      playlist: 'getPlaylist'
    })
  },
  methods: {
    isActive (id) {
      if (id === this.currentSong.id) {
        return 'active'
      } else {
        return ''
      }
    },
    show () {
      this.isShow = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide () {
      this.isShow = false
      this.$emit('hidePlaylist')
    },
    selectItem (item, index) {
      if (this.mode === 2) {
        // 找到playlist中对应歌曲的index
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    deleteItem (item, index) {
      this.deleteSong(item)
    },
    clearAll () {
      MessageBox.confirm('确定执行此操作?').then(() => {
        this.clearSongList()
        this.hide()
      })
    },
    toggleMode () {
      this.$emit('toggleMode')
    },
    selectAddList () {
      this.$refs.addList.show()
    },
    scrollToCurrent (current) { // 打开列表时滚动到播放的歌曲
      let index = this.sequenceList.findIndex((song) => {
        return song.id === current.id
      })
      index = index < 3 ? 0 : index - 3
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    ...mapActions({
      deleteSong: 'deleteSong',
      clearSongList: 'clearSongList'
    })
  },
  components: {
    Scroll,
    Fade,
    SlideBottom,
    AddList
  }
}
</script>

<style lang="stylus" scoped>
@import '~styles/variable.styl'
  .playlist
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    z-index 200
    background rgba(0,0,0,0.3)
    .playlist-wrap
      position absolute
      width 100%
      top 250px
      bottom 0
      background rgba(0,0,0,.8)
      color $activeColor
      .list-header
        padding 40px 40px 20px 40px
        display flex
        align-items center
        font-size $font-size-mx
        .icon-mode
          color $greyColor
          font-size 44px
          margin-right 20px
        .text
          flex 1
        .icon-clear
          color $greyColor
          font-size 44px
      .list-content
        height 770px
        padding 0 0 0 40px
        overflow hidden
        ul
          width 100%
        .list-item
          display flex
          align-items center
          height 80px
          padding 0 40px 0 0
          overflow hidden
          &.list-enter-active, &.list-leave-active
            transition all 0.4s
          &.list-enter, &.list-leave-to
            height 0
          .title
            flex 1
            text-overflow ellipsis
            overflow hidden
            white-space nowrap
            .songname
              font-size $font-size-m
            .singer
              color $greyColor
              font-size $font-size-s
            &.active
              .singer
                color rgba(49,194,124,.7)
              .songname
                color $themeColor
          .icon-like
            color $greyColor
            font-size $font-size-l
            margin-right 20px
            &.active
              color $themeColor
          .icon-del
            color $greyColor
            font-size $font-size-l
      .list-add
        margin 20px auto
        width 280px
        .add-button
          font-size $font-size-m
          padding 16px 32px
          border 1px solid
          border-radius 100px
      .list-close
        position absolute
        bottom 0
        width 100%
        height 100px
        line-height 100px
        text-align center

</style>
