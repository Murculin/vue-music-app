<template>
  <div class="song-list">
    <ul>
      <h2 class="list-title" v-show="songs.length&&showPlayAll" @click="selectPlayAll">
        <i class="iconfont icon-play">&#xe61c;</i>
        <span class="title">全部播放</span>
      </h2>
      <li
        v-for="(item,index) in songs"
        :key="item.id + Math.random()"
        class="item"
        :class="{active:isActive(item)}"
        @click="selectItem(item,index)"
      >
        <div class="content">
          <h2 class="content-title" :class="{active:isActive(item)}">{{ item.name }}</h2>
          <p class="desc" :class="{active:isActive(item)}">{{ item.singer }}·{{ item.album.name }}</p>
        </div>
        <div class="operate">
          <i class="iconfont icon-del" v-show="showOperate" @click.stop="deleteItem(item)">&#xe668;</i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'SongList',
  data () {
    return {
      songList: null
    }
  },
  props: {
    songs: {
      type: Array,
      default: []
    },
    showPlayAll: {
      type:Boolean,
      default: true
    },
    showOperate: {
      type:Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      currentSong: 'getCurrentSong'
    })
  },
  methods: {
    selectItem (item,index) {
      this.$emit('select',item,index)
    },
    selectPlayAll () {
      this.$emit('playAll')
    },
    deleteItem (song) {
      this.$emit('deleteItem',song)
    },
    isActive (item) {
      return (this.showPlayAll && item.id === this.currentSong.id) ? true : false
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~styles/variable.styl"
  .song-list
    .list-title
      font-size $font-size-m
      padding 0 20px 0 20px
      display flex
      align-items center
      height 60px
      line-height 60px
      .icon-play
        font-size 60px
        color $themeColor
        margin-right 10px
    .item
      display flex
      align-items center
      height 128px
      font-size $font-size-m
      padding 0 20px
      &.active
        border-left 5px solid $themeColor
      .content
        line-height 30px
        width 100%
        .content-title
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          &.active
            color $themeColor
        .desc
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          margin-top 8px
          font-size $font-size-s
          color $greyColor
          &.active
            color $themeColor
      .operate
        .icon-del
          font-size $font-size-l
</style>
