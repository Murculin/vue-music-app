<template>
  <div class="song-list">
    <ul>
      <!-- <li class="player-all">全部播放</li> -->
      <li v-for="(item,index) in songs" :key="index" class="item">
        <div class="content">
          <h2 class="content-title">{{ item.name }}</h2>
          <p class="desc">{{ item.singer }}·{{ item.album }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SongList',
  props: {
    songs: {
      type: Array,
      default: []
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~styles/variable.styl"
  .song-list
    .item
      display flex
      align-items center
      height 128px
      font-size $font-size-m
      .content
        line-height 30px
        .content-title
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
        .desc
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          margin-top 8px
          font-size $font-size-s
          color $greyColor
</style>
