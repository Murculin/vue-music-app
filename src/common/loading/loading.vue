<template>
  <div class="loading" :style="{marginTop: top}">
    <img class="img" src="./loading.gif">
    <p class="desc">{{ title }}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      },
      top: {
        type: String,
        default: '0'
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .loading
    width 100%
    text-align center
    .img
      width 48px
      height 48px
    .desc
      line-height 40px
      font-size $font-size-s
      color $themeColor
</style>

