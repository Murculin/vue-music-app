<template>
  <div class="recommend-disc">
    <h1 class="list-tittle">热门歌单推荐</h1>
    <ul>
      <li
        class="item"
        v-for="item in list"
        :key="item.id"
        @click="selectDisc(item)"
      >
        <div class="item-content">
          <div class="icon">
            <img v-lazy="item.coverImgUrl">
          </div>
          <div class="text">
            <h2 class="name">{{ item.name }}</h2>
            <p class="desc">{{ item.creator.nickname }}</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="loading-container" v-show="!list.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Loading from 'common/loading/loading.vue'

export default {
  components: {
    Loading
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectDisc (item) {
      this.$emit('selectDisc', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.recommend-disc
  .list-tittle
    height 130px
    line-height 130px
    text-align center
    font-size $font-size-m
    color $themeColor
  .item
    box-sizing: border-box
    align-items: center
    padding 0 20px 40px 20px
    .item-content
      display: flex
      box-sizing: border-box
      color $fontColor
      .icon
        flex: 0 0 200px
        width: 200px
        padding-right: 40px
        img
          width 200px
          height 200px
          border-radius 6PX
          box-shadow 5px 0px 5px 5px $greyColor
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 40px
        overflow: hidden
        font-size: $font-size-m
        .name
          margin-bottom: 20px
          color: $fontColor
        .desc
          color $greyColor
.loading-container
  position absolute
  width 100%
  top 50%
  transform translateY(-50%)
</style>
