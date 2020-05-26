<template>
  <div v-if="list.length" class="search-history">
    <h2 class="search-title">
      <span>搜索历史</span>
      <span class="iconfont iconlajitong" @click="clearHistory"></span>
    </h2>
    <div class="history-content">
      <ul>
        <li
          v-for="(item,index) in list"
          :key="index"
          class="item"
          @click="selectHistory(item)"
        >
          {{ item }}
        </li>
      </ul> 
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectHistory (item) {
      this.$emit('selectHistory', item)
    },
    clearHistory () {
      this.$emit('clearHistory')
    }
  }
}
</script>

<style lang="stylus" scoped>
.search-history
  padding 0 30px
  margin 20px 0
  .search-title
    font-size 28px
    font-weight bold
    margin-bottom 20px
    .iconlajitong
      font-size 40px
      font-weight normal
      float right
      color $greyColor
  .history-content
    .item
      display inline-block
      font-size $font-size-m
      text-align center
      margin: 0 20px 20px 0
      padding 0 20px
      height 50px
      line-height 50px
      background $activeColor
      border-radius 40px
</style>
