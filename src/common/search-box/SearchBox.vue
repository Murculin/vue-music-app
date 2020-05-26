<template>
  <div class="search-box">
    <i class="iconfont icon-search">&#xe632;</i>
    <input
      ref="query"
      v-model="query"
      class="box"
      :placeholder="placeholder"
    />
    <i v-show="query" class="iconfont icon-dismiss" @click="clear">&#xe668;</i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from '@/assets/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  created () {
    this.$watch('query', debounce((newVal) => {
      this.$emit('query', newVal)
    }, 200))
  },
  methods: {
    setQuery (query) {
      this.query = query
    },
    clear () {
      this.query = ''
    },
    blur () {
      this.$refs.query.blur()
    },
    focus () {
      this.$refs.query.focus()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~styles/variable.styl"
  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    padding 0 20px
    height 60px
    background $bgColor2
    border-radius 40px
    .icon-search
      font-size $font-size-m
      color $greyColor
    .box
      font-size $font-size-m
      flex 1
      margin 0 10px
      outline none
      border none
      background $bgColor2
      caret-color $themeColor
    .icon-dismiss
      font-size $font-size-m
      color $greyColor
</style>
