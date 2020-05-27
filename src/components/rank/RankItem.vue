<template>
  <div class="rank-item">
    <div class="item-left">
      <h2 class="rank-item-title">{{rankInfo.name}}</h2>
      <ul class="song-list">
        <li
          class="song"
          v-for="(song,index) in rankInfo.hotList"
          :key="index"
        >
          <span>{{ index+1 }}. </span>
          <span class="song-name">{{ song.name }}</span>
          <span class="singer"> - {{ song.ar[0].name }}</span>
        </li>
      </ul>
    </div>
    <div class="item-right">
      <img :src="rankInfo.imgUrl">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rankInfo: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="stylus" scoped>
.rank-item
  margin-bottom 20px
  background $activeColor
  display flex
  border-radius 16px
  height 200px
  .item-left
    flex 1
    padding 20px
    box-sizing border-box
    overflow hidden
    .rank-item-title
      font-size $font-size-mx
      margin-bottom 10px
      font-weight bold
    .song
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
      font-size $font-size-s
      height 40px
      line-height 40px
      .singer
        color $greyColor
  .item-right
    width 200px
    height 200px
    img
      width 100%
      height 100%
      border-radius 0 16px 16px 0
</style>
