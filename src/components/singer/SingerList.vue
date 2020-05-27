<template>
  <div class="singer-list">
    <h2 class="list-title">{{ listTitle }}</h2>
    <li
      v-for="item in list"
      :key="item.id"
      class="list-item"
      @click="selectItem(item)"
    >
      <img v-lazy="item.picUrl" class="avatar">
      <span class="name">{{ item.name }}</span>
    </li>
    <div v-show="!list.length" class="loading-container">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import Loading from 'common/loading/loading'
export default {
  components: {
    Loading
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    listTitle: {
      type: String,
      default: '华语男歌手'
    }
  },
  methods: {
    selectItem (item) {
      this.$emit('selectItem', item)
    }
  }
}
</script>

<style lang="stylus" scoped>
.singer-list
  padding-bottom 30px
  position relative
  min-height 300px
  .list-title
    height 60px
    line-height 60px
    padding-left 20px
    font-size $font-size-s
    color $greyColor
    background $bgColor2
  .list-item
    padding 40px 0 0 20px
    display flex
    .avatar
      width 100px
      height 100px
      border-radius 50%
    .name
      height 100px
      line-height 100px
      margin-left 30px
      font-size $font-size-m
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
