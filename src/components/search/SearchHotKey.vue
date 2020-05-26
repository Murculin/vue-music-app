<template>
  <div class="search-hotkey">
    <h2 class="title">热门搜索</h2>
    <ul>
      <li
        class="item" v-for="(item,index) in hotkey"
        :key="index"
        @click="selectHotkey(item.first)"
      >
        <div class="rank" :class="{top: index<3}">{{ index + 1 }}</div>
        <span class="name">{{ item.first }}</span>
      </li>
    </ul>
    <div class="loading-container">
      <loading v-show="!hotkey.length"/>
    </div>
  </div>
</template>

<script>
import Loading from 'common/loading/loading'

export default {
  props: {
    hotkey: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectHotkey (query) {
      this.$emit('selectHotkey', query)
    }
  },
  components: {
    Loading
  }
}
</script>

<style lang="stylus" scoped>
.search-hotkey
  position relative
  padding 0 30px
  margin-top 20px
  min-height 400px
  .title
    font-size 28px
    font-weight bold
  .item
    display flex
    align-items center
    height 80px
    font-size $font-size-m
    .rank
      margin-right 30px
      color $greyColor
      &.top
        color red
    .name
      flex 1
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
      line-height 30px
    .num
      color $greyColor
  .loading-container
    position absolute
    width 100%
    top 50%
    transform translateY(-50%)
</style>
